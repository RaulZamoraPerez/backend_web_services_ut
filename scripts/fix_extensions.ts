import fs from 'fs';
import path from 'path';
import sequelize from '../src/config/database';
import { Archivos } from '../src/models/associations';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const files = await Archivos.findAll();
    console.log(`Found ${files.length} total files in database.`);

    let fixedCount = 0;

    for (const file of files) {
      const ext = path.extname(file.Ruta_Documento);
      if (!ext) {
        console.log(`File ID ${file.ID} ("${file.Nombre}") is missing an extension in Ruta_Documento: "${file.Ruta_Documento}"`);
        
        const oldRelativePath = file.Ruta_Documento;
        const newRelativePath = `${oldRelativePath}.pdf`;
        
        const oldFullPath = path.join(__dirname, '../', oldRelativePath);
        const newFullPath = path.join(__dirname, '../', newRelativePath);

        // Rename physical file if it exists
        if (fs.existsSync(oldFullPath)) {
          fs.renameSync(oldFullPath, newFullPath);
          console.log(`  Physical file renamed: ${oldFullPath} -> ${newFullPath}`);
        } else {
          console.warn(`  Warning: Physical file not found at ${oldFullPath}`);
        }

        // Update database record
        await file.update({ Ruta_Documento: newRelativePath });
        console.log(`  Database record updated to: "${newRelativePath}"`);
        fixedCount++;
      }
    }

    console.log(`Done. Fixed ${fixedCount} files.`);
    process.exit(0);
  } catch (err) {
    console.error('Error running fix script:', err);
    process.exit(1);
  }
})();
