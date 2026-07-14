import fs from 'fs';
import path from 'path';

const copyRecursiveSync = (src: string, dest: string) => {
  if (!fs.existsSync(src)) return;
  
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
};

const sourceDir = path.resolve(__dirname, '../../../UTTECAM/public');
const destDir = path.resolve(__dirname, '../../public');
const uploadsDir = path.resolve(__dirname, '../../uploads');

console.log(`📦 Copying assets from ${sourceDir} to ${destDir}`);

try {
    copyRecursiveSync(path.join(sourceDir, 'ExtensionUniversitaria'), path.join(destDir, 'ExtensionUniversitaria'));
    console.log('✅ ExtensionUniversitaria assets copied.');
} catch (e: any) {
    console.log('⚠️ ExtensionUniversitaria copy failed:', e.message);
}

try {
  copyRecursiveSync(path.join(sourceDir, 'Actividades Culturales y Deportivas'), path.join(destDir, 'Actividades Culturales y Deportivas'));
  // also copy these to uploads for backend serving
  copyRecursiveSync(path.join(sourceDir, 'Actividades Culturales y Deportivas'), path.join(uploadsDir, 'Actividades Culturales y Deportivas'));
    console.log('✅ Actividades Culturales y Deportivas assets copied.');
} catch (e: any) {
    console.log('⚠️ Actividades Culturales y Deportivas copy failed:', e.message);
}

try {
  // Also copy ExtensionUniversitaria assets to uploads for backend serving
  copyRecursiveSync(path.join(sourceDir, 'ExtensionUniversitaria'), path.join(uploadsDir, 'ExtensionUniversitaria'));
  console.log('✅ ExtensionUniversitaria assets copied to uploads.');
} catch (e: any) {
  console.log('⚠️ ExtensionUniversitaria copy to uploads failed:', e.message);
}
