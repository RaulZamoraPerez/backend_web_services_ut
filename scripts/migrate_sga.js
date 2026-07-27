const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths configuration
const sourceDir = 'C:\\Users\\Hewlett Packard\\Downloads\\dist (1)\\intrcccones de trabajo';
const migrationOutputDir = path.join(__dirname, 'sga_migration_files');
const sqlOutputPath = path.join(__dirname, 'migration_sga_export.sql');
const jsonPath = 'C:\\Users\\Hewlett Packard\\.gemini\\antigravity-ide\\brain\\22f68973-dada-4440-97a9-139ada11c847\\sga_documentos_migracion.json';

// Ensure output directories exist
if (!fs.existsSync(migrationOutputDir)) {
  fs.mkdirSync(migrationOutputDir, { recursive: true });
}

// Load migration data mapping
if (!fs.existsSync(jsonPath)) {
  console.error("Migration data JSON file not found at: ", jsonPath);
  process.exit(1);
}
const items = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded ${items.length} document records from JSON.`);

// Helper to clean strings for fuzzy matching (strips accents, spaces, hyphens)
const cleanForFuzzy = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, ''); // keep only alphanumeric
};

// Index files in user's downloads folder
console.log("Scanning source directory for fuzzy indexing...");
const filesList = [];
if (fs.existsSync(sourceDir)) {
  const list = fs.readdirSync(sourceDir);
  list.forEach(file => {
    const fullPath = path.join(sourceDir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      filesList.push({
        originalName: file,
        fullPath: fullPath,
        fuzzyName: cleanForFuzzy(path.basename(file, path.extname(file)))
      });
    }
  });
}
console.log(`Indexed ${filesList.length} files from source folder.`);

// Helper to sanitize filenames
const sanitizeName = (name) => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 50);
};

// Start compiling SQL script
let sqlContent = `-- IDEMPOTENT MIGRATION SCRIPT FOR SGA (Sistema de Gestión Ambiental)
-- Generated on ${new Date().toISOString()}
-- Fixed: Collation mix issues by converting columns to utf8mb4 in comparisons

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Ensure Comite record exists for 'sga'
INSERT INTO comites (titulo, slug, descripcion, activo, createdAt, updatedAt)
SELECT 'Sistema de Gestión Ambiental', 'sga', 'Repositorio de Sistema de Gestión Ambiental', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comites WHERE CONVERT(slug USING utf8mb4) = 'sga');

-- Get the Comite ID
SET @comite_id = (SELECT id FROM comites WHERE CONVERT(slug USING utf8mb4) = 'sga' LIMIT 1);
`;

let copiedCount = 0;
let missingFiles = [];
const uniqueCategories = new Set();
let categoryCounter = 1;
const categoryVarMap = {};

// We first identify all unique categories to pre-insert them and create SQL variables
for (const item of items) {
  uniqueCategories.add(item.categoria);
}

sqlContent += `\n-- 2. Ensure all Category records exist and set variables\n`;
uniqueCategories.forEach(cat => {
  const varName = `cat_id_${categoryCounter++}`;
  categoryVarMap[cat] = varName;

  sqlContent += `
-- Category: ${cat}
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, '${cat.replace(/'/g, "\\'")}', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = '${cat.replace(/'/g, "\\'")}'
);
SET @${varName} = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = '${cat.replace(/'/g, "\\'")}'
  LIMIT 1
);
`;
});

sqlContent += `\n-- 3. Insert Documents\n`;

for (const item of items) {
  const basename = path.basename(item.archivo_estatico);
  const targetFuzzy = cleanForFuzzy(path.basename(basename, path.extname(basename)));

  // Lookup using fuzzy comparison
  let matchedFile = filesList.find(f => f.fuzzyName === targetFuzzy);

  if (!matchedFile) {
    matchedFile = filesList.find(f => f.fuzzyName.includes(targetFuzzy) || targetFuzzy.includes(f.fuzzyName));
  }

  if (!matchedFile) {
    console.warn(`⚠️ Source file NOT FOUND: "${basename}"`);
    missingFiles.push({ title: item.titulo, path: item.archivo_estatico });
    continue;
  }

  const sourcePath = matchedFile.fullPath;

  // Generate target secure file name
  const ext = path.extname(sourcePath).toLowerCase();
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const cleanOriginalName = sanitizeName(path.basename(sourcePath, ext));
  const targetFilename = `${timestamp}_${randomName}_${cleanOriginalName}${ext}`;
  const targetPath = path.join(migrationOutputDir, targetFilename);

  // Copy file to local output folder
  fs.copyFileSync(sourcePath, targetPath);
  copiedCount++;
  console.log(`Copied file: "${path.basename(sourcePath)}" -> "${targetFilename}"`);

  // Append document INSERT statement
  const varName = categoryVarMap[item.categoria];
  const dbRelativePath = `/uploads/documentos/${targetFilename}`;

  sqlContent += `
-- Document: ${item.titulo}
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @${varName}, '${item.titulo.replace(/'/g, "\\'")}', '${dbRelativePath}', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @${varName} AND CONVERT(titulo USING utf8mb4) = '${item.titulo.replace(/'/g, "\\'")}'
);
`;
}

sqlContent += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;

// Write the SQL file
fs.writeFileSync(sqlOutputPath, sqlContent, 'utf8');

console.log(`\n==========================================`);
console.log(`SQL Export Complete!`);
console.log(`- Renamed files copied to: ${migrationOutputDir}`);
console.log(`- SQL script written to: ${sqlOutputPath}`);
console.log(`- Files processed: ${copiedCount}`);
console.log(`- Missing files: ${missingFiles.length}`);
console.log(`==========================================`);
