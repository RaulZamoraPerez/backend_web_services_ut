// scripts/sync-directorio-organigrama.js
// Script para sincronizar datos de Directorio y Organigrama desde el cliente UTTECAM
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = process.env.API_URL || 'http://localhost:3002/api';

// Datos de Directorio del cliente
const directorioData = [
  {
    titulo: "Secretaría de Vinculación",
    nombre: "Mtro. Daniel Huerta Conde",
    telefono: "2494223300",
    extension: "120",
    correo: "vinculacion@uttecam.edu.mx",
    imagen: "Organigrama/secretarioVinculacion.png",
  },
  {
    titulo: "Encargado de Secretaría Académica",
    nombre: "Mtro. Carlos Islas Contreras",
    telefono: "2494223300",
    extension: "135",
    correo: "secretariaacademica@uttecam.edu.mx",
    imagen: "Organigrama/secretariaAcademica.png",
  },
  {
    titulo: "Encargado del Área de Abogado General",
    nombre: "Mtro. Eleazar Carrillo Camacho",
    telefono: "2494223300",
    extension: "142",
    correo: "abogadogeneral@uttecam.edu.mx",
    imagen: "Organigrama/AbogadoGeneral.png",
  },
  {
    titulo: "Encargado del Área de Contraloría Interna",
    nombre: "Abg. Alain Eloy Álvarez Sánchez",
    telefono: "2494223300",
    extension: "110",
    correo: "contraloria@uttecam.edu.mx",
    imagen: "Organigrama/contraloriaInterna.png",
  },
  {
    titulo: "Dirección y administración y Finanzas",
    nombre: "Lic. Rodrigo Hernández Aguilar",
    telefono: "2494223300",
    extension: "115",
    correo: "direccionfinanzas@uttecam.edu.mx",
    imagen: "Organigrama/admin_finanzas.png",
  },
  {
    titulo: "Extensión Universitaria",
    nombre: "Mtra. Verónica Elizabeth Centeno Fórtiz",
    telefono: "2494223300",
    extension: "153",
    correo: "extensionuniversitaria@uttecam.edu.mx",
    imagen: "Organigrama/enc_extend_universitaria.png",
  },
];

// Datos de Organigrama del cliente (estructura jerárquica completa)
const organigramaData = [
  {
    expanded: true,
    type: "person",
    data: {
      image: "Organigrama/Rector.png",
      name: "Ing. Enrique Salvador Fernández Lozada",
      title: "Rector",
    },
    children: [
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/AbogadoGeneral.png",
          name: "Mtro. Eleazar Carrillo Camacho",
          title: "ENCARGADO DEL ÁREA DE ABOGADO GENERAL",
          text: "El Mtro. Eleazar Carrillo Camacho es Encargado del Área de Abogado General en la Universidad Tecnológica de Tecamachalco..."
        },
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/enc_extend_universitaria.png",
          name: "Mtra. Verónica Elizabeth Centeno Fórtiz",
          title: "Encargada de la Dirección de Extensión Universitaria",
          text: "La Mtra. Verónica Elizabeth Centeno Fortiz es Encargada de la Dirección de Extensión Universitaria..."
        },
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/ContraloriaInterna.png",
          name: "Abg. Alain Eloy Alvarez Sánchez",
          title: "ENCARGADO DEL ÁREA DE  CONTRALORÍA INTERNA",
          text: "El Abg. Alain Eloy Álvarez Sánchez funge como Encargado del Área de Contraloría Interna..."
        },
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/secretariaAcademica.png",
          name: "Mtro. Carlos Islas Contreras",
          title: "ENCARGADO DE LA SECRETARIA ACADÉMICA",
          text: "El Mtro. Carlos Islas Contreras es actualmente Encargado de la Secretaría Académica..."
        },
        children: [
          {
            type: "person",
            data: {
              image: "Organigrama/directores/Agricultura.png",
              name: "Ing. Laura Rodríguez Peláez",
              title: "DIRECCIÓN  DEL P.E.  AGRICULTURA SUSTENTBLE Y  PROTEGIDA",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/conta.png",
              name: "Mtro. Luis Enrique Manzano Martínez",
              title: "ENC. DE LA  DIRECCIÓN  DEL P.E. CONTADURÍA",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/admin.png",
              name: "Mtra. Miriam Garcilazo Alcántara",
              title: "DIRECTORA  DEL P.E. ADMINISTRACIÓN",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/mercado.png",
              name: "Mtro. Jesús Guadalupe Jiménez de Rosas",
              title: "DIRECCIÓN DEL P.E. INNOVACIÓN DE NEGOCIOS Y MERCADOTECNIA",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/industrial.png",
              name: "Ing. Job Armando Henández Cortés",
              title: "DIRECCIÓN  DEL P.E. INGENIERÍA INDUSTRIAL",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/mant_indus.png",
              name: "Ing. José Mario Cepeda Sorcia",
              title: "DIRECCIÓN  DEL P.E. MANTENIMIENTO  INDUSTRIA",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/meca.png",
              name: "Ing. Sullivan Reyes Negrete",
              title: "ENCARGADO DE LA DIRECCIÓN DEL P.E. MECATRÓNICA",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/alimentos.png",
              name: "Mtro Carlos Roberto Camarillo Rojas",
              title: "Enc. de la   DIRECCIÓN DEL P.E. PROCESOS BIOALIMENTARIOS",
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/ti.png",
              name: "Mtra. Mónica Meneses Gasca",
              title: "DIRECCIÓN DEL P.E. TECNOLOGÍAS DE LA INFORMACIÓN",
            },
          },
        ],
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/secretarioVinculacion.png",
          name: "Lic. Daniel Huerta Conde",
          title: "SECRETARIO  DE VINCULACIÓN",
          text: "El Mtro. Daniel Huerta Conde es actualmente Secretario de Vinculación..."
        },
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/admin_finanzas.png",
          name: "Lic. Rodrigo Hernández Aguilar",
          title: "Dirección de Administración y Finanzas",
          text: "El Lic. Rodrigo Hernández Aguilar es un profesional con sólida trayectoria..."
        },
      },
    ],
  },
];

async function syncDirectorio() {
  console.log('\n📁 Sincronizando Directorio...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of directorioData) {
      try {
        const response = await axios.post(`${API_URL}/directorios/sync`, item);
        console.log(`✅ Creado: ${item.nombre}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error al crear ${item.nombre}:`, error.response?.data || error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Directorio sincronizado: ${successCount} exitosos, ${errorCount} errores`);
    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('❌ Error al sincronizar directorio:', error.message);
    return { success: 0, errors: directorioData.length };
  }
}

async function syncOrganigrama() {
  console.log('\n🏢 Sincronizando Organigrama...');
  
  try {
    const response = await axios.post(`${API_URL}/organigrama/sync`, {
      data: organigramaData
    });
    
    console.log('✅ Organigrama sincronizado correctamente');
    console.log(`📊 Total de nodos: ${response.data.count}`);
    return { success: true, count: response.data.count };
  } catch (error) {
    console.error('❌ Error al sincronizar organigrama:', error.response?.data || error.message);
    return { success: false };
  }
}

async function main() {
  console.log('🚀 Iniciando sincronización de datos del cliente UTTECAM...\n');
  
  // Sincronizar Directorio
  const directorioResult = await syncDirectorio();
  
  // Sincronizar Organigrama
  const organigramaResult = await syncOrganigrama();
  
  console.log('\n✨ Sincronización completada\n');
  console.log('Resumen:');
  console.log(`  Directorio: ${directorioResult.success} registros creados`);
  console.log(`  Organigrama: ${organigramaResult.success ? organigramaResult.count : 0} nodos sincronizados`);
}

main().catch(console.error);
