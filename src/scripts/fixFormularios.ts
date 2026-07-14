import { FormularioConfig } from '../models/FormularioConfig';
import sequelize from '../config/database';

async function fix() {
  try {
    await sequelize.authenticate();
    const forms = await FormularioConfig.findAll();
    for (const f of forms) {
      if (f.tipo === 'inscripcion') {
        console.log("Requisitos originales length:", Array.isArray(f.requisitos) ? f.requisitos.length : 'not array');
        
        // Reset a defaults
        f.requisitos = [
          "Ser estudiante de la Universidad",
          "No contar con ningún adeudo con la Institución",
          "Pagar el costo del cuatrimestre",
          "Pagar el costo del seguro escolar (anual)",
          "Actualizar sus datos personales"
        ];
        f.pasos = [
          "Al inicio del cuatrimestre el Departamento de Servicios Escolares informará al Programa Educativo el Calendario de Reinscripción.",
          "El programa educativo notificará a los estudiantes.",
          "Descargar la orden de pago de la página pagos en línea Puebla; https://rl.puebla.gob.mx/",
          "Realizar el pago en cualquiera de las Instituciones bancarias autorizadas en la orden de pago.",
          "Acudir con la documentación completa a la ventanilla correspondiente, en el día y la hora indicada."
        ];
        f.documentos = [
          "Credencial de estudiante",
          "Original y copia de la orden y comprobante de pago emitido por la institución bancaria donde se realizó",
          "En caso de haber solicitado beca, presentar Acuse de Registro"
        ];
        await f.save();
        console.log("Formulario inscripcion reseteado a valores por defecto");
      }
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fix();
