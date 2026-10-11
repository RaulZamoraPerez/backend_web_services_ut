import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class QuejasConfig extends Model {
  public id!: number;
  public destination_email!: string;
  public titulo!: string;
  public indicaciones!: string;
  public objetivo!: string;
  public telefono!: string;
  public ubicacion!: string;
  public aviso_privacidad!: string;
  public aviso_privacidad_pdf!: string | null;
  public aviso_privacidad_pdf_original_name!: string | null;
  public card1_titulo!: string;
  public card1_descripcion!: string;
  public card2_titulo!: string;
  public card2_descripcion!: string;
  public banner_titulo!: string;
  public banner_descripcion!: string;
  public portal_tag!: string;
  public boton_superior_texto!: string;
  public formulario_tag!: string;
  public formulario_titulo!: string;
  public formulario_descripcion!: string;
  public directorio_titulo!: string;
  public directorio_descripcion!: string;
  public directorio_link_texto!: string;
  public consideraciones_titulo!: string;
  public consideraciones_item1!: string;
  public consideraciones_item2!: string;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuejasConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    destination_email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'quejas@uttecam.edu.mx',
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Buzón de Quejas y Sugerencias',
    },
    indicaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Atención directa y confidencial para la comunidad universitaria de la UTTECAM.',
    },
    objetivo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Garantizar un entorno universitario seguro a través de su atención oportuna, el logro de acuerdos entre partes y/o su canalización a las diversas Unidades Administrativas u Órganos Colegiados Institucionales para que estos emitan las determinaciones correspondientes, lo anterior, con la finalidad de incrementar la satisfacción de estudiantes, docentes, personal administrativo y partes interesadas;',
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '249 42 2 33 10',
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Edificio H, planta alta',
    },
    aviso_privacidad: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: `La Universidad Tecnológica de Tecamachalco (UTTECAM), con domicilio en Carretera Estatal Tecamachalco-Cañada de Morelos Km. 1, Tecamachalco, Puebla, es la responsable del tratamiento de los datos personales que proporcione a través del Buzón Institucional de Quejas y Sugerencias.\n\n1. Finalidad del tratamiento de datos\nLos datos personales recabados (nombre, correo electrónico, teléfono, carrera o área administrativa y hechos descritos) serán utilizados única y exclusivamente para:\n• Registrar y dar seguimiento formal a la queja, sugerencia o petición ciudadana.\n• Comunicar el estado, avances y respuesta oficial en los plazos reglamentarios establecidos (3 a 5 días hábiles).\n• Generar estadísticas institucionales anonimizadas para la mejora continua del servicio educativo.\n\n2. Confidencialidad y Seguridad\nSus datos personales serán tratados bajo estrictas medidas de seguridad administrativas, técnicas y físicas que garanticen su confidencialidad e impidan su pérdida, alteración o acceso no autorizado. No serán compartidos con terceros ajenos a la resolución del caso.\n\n3. Derechos ARCO\nUsted puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) ante la Unidad de Transparencia de la UTTECAM o a través de nuestros canales oficiales.`,
    },
    aviso_privacidad_pdf: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    aviso_privacidad_pdf_original_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    card1_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Confidencialidad',
    },
    card1_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Tu información está protegida. Todas las solicitudes recibidas en este buzón se manejan con absoluta reserva y estricta confidencialidad.',
    },
    card2_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Compromiso UTTECAM',
    },
    card2_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Cada petición es analizada con seriedad, dando respuesta formal en un término de 3 a 5 días hábiles conforme a las normativas institucionales.',
    },
    banner_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Tu voz construye una mejor universidad',
    },
    banner_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Juntos creamos un entorno educativo digno, transparente y de calidad para toda la comunidad tecnológica.',
    },
    portal_tag: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Portal Institucional',
    },
    boton_superior_texto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Enviar Queja o Sugerencia',
    },
    formulario_tag: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Registro Institucional',
    },
    formulario_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Formulario de Atención',
    },
    formulario_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Ingresa los datos solicitados para dar inicio y seguimiento formal a tu solicitud.',
    },
    directorio_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Directorio Institucional',
    },
    directorio_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '¿Deseas comunicarte directamente con alguna dirección o departamento universitario?',
    },
    directorio_link_texto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Consultar Directorio',
    },
    consideraciones_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Considera lo siguiente',
    },
    consideraciones_item1: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Los datos solicitados son necesarios para dar seguimiento y serán tratados con estricta confidencialidad.',
    },
    consideraciones_item2: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Al área responsable se le otorga un término de 3 a 5 días hábiles para emitir respuesta formal.',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'quejas_config',
    timestamps: true,
  }
);

export default QuejasConfig;
