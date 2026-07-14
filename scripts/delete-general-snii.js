const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Cargar configuración
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
  path.join(process.cwd(), '.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`📋 Configuración cargada desde: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('⚠️  Archivo .env no encontrado, usando variables de entorno del sistema');
}

// Configuración de base de datos
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uttecam_db',
  logging: false
});

async function deleteGeneral() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente.');

    // Definir modelo simplificado
    const MiembroSniiTipo = sequelize.define('MiembroSniiTipo', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    }, {
      tableName: 'miembros_snii_tipos',
      timestamps: false
    });

    // Definir modelo de documentos
    const MiembroSNII = sequelize.define('MiembroSNII', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tipo: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    }, {
      tableName: 'miembros_snii',
      timestamps: false
    });

    // Listar todas las categorías
    const categorias = await MiembroSniiTipo.findAll();
    console.log('Categorías existentes:', categorias.map(c => c.Nombre));

    // Contar documentos con tipo General
    const docsGeneral = await MiembroSNII.count({ where: { tipo: 'General' } });
    console.log(`📄 Documentos con tipo 'General': ${docsGeneral}`);

    if (docsGeneral > 0) {
        console.log('⚠️  Hay documentos asignados a "General". Estos causan que la categoría aparezca en el frontend.');
        
        if (categorias.length > 0) {
            const targetCategory = categorias[0].Nombre;
            console.log(`🔄 Moviendo ${docsGeneral} documentos a la categoría '${targetCategory}'...`);
            
            await MiembroSNII.update(
                { tipo: targetCategory },
                { where: { tipo: 'General' } }
            );
            console.log('✅ Documentos reasignados correctamente.');
        } else {
            console.log('❌ No hay otras categorías para mover los documentos. Cree una categoría primero.');
        }
    }

    // Buscar y eliminar
    const general = await MiembroSniiTipo.findOne({ where: { Nombre: 'General' } });
    
    if (general) {
      console.log(`🗑️  Encontrada categoría 'General' con ID: ${general.ID}. Eliminando...`);
      await general.destroy();
      console.log('✅ Categoría General eliminada correctamente.');
    } else {
      console.log('ℹ️  No se encontró la categoría General.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

deleteGeneral();
