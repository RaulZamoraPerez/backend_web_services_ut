const fs = require('fs');
const path = require('path');

// Crear package.json optimizado para deployment de producción
const createDeploymentPackage = () => {
  console.log('🔧 Creando package.json optimizado para producción...');
  
  // Leer el package.production.json ya optimizado
  const productionPackagePath = path.join(__dirname, '..', 'package.production.json');
  
  if (!fs.existsSync(productionPackagePath)) {
    console.error('❌ Error: package.production.json no encontrado');
    console.log('💡 Ejecuta primero: npm run build para generar los archivos necesarios');
    process.exit(1);
  }

  // Leer y parsear el package.production.json
  const productionPackage = JSON.parse(fs.readFileSync(productionPackagePath, 'utf8'));
  
  // Verificar que dist/ existe
  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: Directorio dist/ no encontrado');
    console.log('💡 Ejecuta primero: npm run build para compilar TypeScript');
    process.exit(1);
  }

  // Crear package.json final para deployment (copia del production)
  const deploymentPackage = {
    ...productionPackage,
    // Asegurar que sea la versión final
    "devDependencies": undefined, // Remover devDependencies completamente
    "scripts": {
      ...productionPackage.scripts,
      // Scripts optimizados para producción
      "start": "node dist/server.js",
      "health": "curl -f http://localhost:3002/health || exit 1",
      "logs:view": "tail -f logs/*.log",
      "logs:error": "tail -f logs/*error*.log",
      "logs:security": "tail -f logs/security*.log",
      "status": "pm2 status uttecam-api 2>/dev/null || echo 'Direct node process running'",
      "restart": "pm2 restart uttecam-api 2>/dev/null || echo 'Use process manager to restart'",
      "stop": "pm2 stop uttecam-api 2>/dev/null || echo 'Use process manager to stop'"
    }
  };

  // Escribir archivo final para deployment
  const outputPath = path.join(__dirname, '..', 'package.deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(deploymentPackage, null, 2));
  
  console.log('✅ package.deployment.json creado exitosamente');
  console.log('📁 Ubicación:', outputPath);
  console.log('🚀 Optimizado para deployment en producción');
  
  // Mostrar estadísticas del paquete
  const originalPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const originalDeps = Object.keys(originalPackage.dependencies || {}).length + Object.keys(originalPackage.devDependencies || {}).length;
  const prodDeps = Object.keys(deploymentPackage.dependencies).length;
  
  console.log(`📊 Dependencias optimizadas: ${originalDeps} → ${prodDeps} (${Math.round((1 - prodDeps/originalDeps) * 100)}% menos)`);
  console.log('🔒 Configuración de seguridad OWASP incluida');
  console.log('📋 Módulos incluidos: Authentication, Textos, Directorios, Nosotros, Solicitudes');
  console.log('');
  console.log('📦 ARCHIVOS PARA DEPLOYMENT:');
  console.log('   • dist/ (código compilado)');
  console.log('   • package.deployment.json → renombrar a package.json');
  console.log('   • .env (configurar variables)');
  console.log('   • sql/ (scripts de base de datos)');
  console.log('   • scripts/create-admin.js');
  console.log('   • docs/ (documentación)');
  console.log('');
  console.log('🚀 PASOS SIGUIENTES:');
  console.log('   1. Renombrar package.deployment.json → package.json');
  console.log('   2. Configurar variables de entorno (.env)');
  console.log('   3. Ejecutar scripts SQL en base de datos');
  console.log('   4. npm install --production');
  console.log('   5. npm start');
  
  // Verificar archivos críticos
  const criticalFiles = [
    'dist/server.js',
    'scripts/create-admin.js',
    'sql/database_setup.sql',
    'sql/solicitudes_constancias_kardex.sql',
    '.env.example'
  ];
  
  console.log('');
  console.log('🔍 VERIFICACIÓN DE ARCHIVOS CRÍTICOS:');
  criticalFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
  
  return deploymentPackage;
};

createDeploymentPackage();