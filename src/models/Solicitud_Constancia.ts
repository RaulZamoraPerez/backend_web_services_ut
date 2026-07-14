import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir tipos para los enums
type NivelType = 'TSU' | 'LIC';
type TipoEntregaType = 'presencial' | 'electronico';
type EstadoType = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

// Definir atributos del modelo
interface SolicitudesConstanciasKardexAttributes {
  id: number;
  nombre: string;
  matricula: string;
  correo: string;
  telefono: string;
  carrera: string;
  nivel: NivelType;
  tipo_entrega: TipoEntregaType;
  documentos_solicitados: string[]; // JSON array
  estado: EstadoType;
  observaciones?: string | null;
  fecha_solicitud: Date;
  fecha_actualizacion: Date;
  fecha_entrega?: Date | null;
}

// Atributos opcionales para creación
interface SolicitudesConstanciasKardexCreationAttributes extends Optional<SolicitudesConstanciasKardexAttributes, 'id' | 'estado' | 'observaciones' | 'fecha_solicitud' | 'fecha_actualizacion' | 'fecha_entrega'> {}

// Definir el modelo
class SolicitudesConstanciasKardex extends Model<SolicitudesConstanciasKardexAttributes, SolicitudesConstanciasKardexCreationAttributes> implements SolicitudesConstanciasKardexAttributes {
  public id!: number;
  public nombre!: string;
  public matricula!: string;
  public correo!: string;
  public telefono!: string;
  public carrera!: string;
  public nivel!: NivelType;
  public tipo_entrega!: TipoEntregaType;
  public documentos_solicitados!: string[];
  public estado!: EstadoType;
  public observaciones?: string | null;
  public fecha_solicitud!: Date;
  public fecha_actualizacion!: Date;
  public fecha_entrega?: Date | null;
}

// Inicializar el modelo
SolicitudesConstanciasKardex.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        },
        len: {
          args: [2, 255],
          msg: 'El nombre debe tener entre 2 y 255 caracteres'
        }
      }
    },
    matricula: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'La matrícula no puede estar vacía'
        },
        len: {
          args: [8, 8],
          msg: 'La matrícula debe tener exactamente 8 caracteres'
        },
        isAlphanumeric: {
          msg: 'La matrícula solo puede contener letras y números'
        }
      }
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El correo no puede estar vacío'
        },
        isEmail: {
          msg: 'Debe ser un correo electrónico válido'
        }
      }
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El teléfono no puede estar vacío'
        },
        len: {
          args: [10, 10],
          msg: 'El teléfono debe tener exactamente 10 dígitos'
        },
        isNumeric: {
          msg: 'El teléfono solo puede contener números'
        }
      }
    },
    carrera: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La carrera no puede estar vacía'
        }
      }
    },
    nivel: {
      type: DataTypes.ENUM('TSU', 'LIC'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['TSU', 'LIC']],
          msg: 'El nivel debe ser TSU o LIC'
        }
      }
    },
    tipo_entrega: {
      type: DataTypes.ENUM('presencial', 'electronico'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['presencial', 'electronico']],
          msg: 'El tipo de entrega debe ser presencial o electrónico'
        }
      }
    },
    documentos_solicitados: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe seleccionar al menos un documento'
        },
        isValidDocuments(value: any) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Debe seleccionar al menos un documento');
          }
          const validDocs = ['Constancia de Estudios', 'Constancia de trámite de título', 'Kardex'];
          const invalidDocs = value.filter(doc => !validDocs.includes(doc));
          if (invalidDocs.length > 0) {
            throw new Error(`Documentos no válidos: ${invalidDocs.join(', ')}`);
          }
        }
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: {
          args: [['pendiente', 'en_proceso', 'completado', 'cancelado']],
          msg: 'El estado debe ser: pendiente, en_proceso, completado o cancelado'
        }
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Las observaciones no pueden exceder 1000 caracteres'
        }
      }
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isAfterSolicitud(value: any) {
          if (value && this.fecha_solicitud && new Date(value) < this.fecha_solicitud) {
            throw new Error('La fecha de entrega no puede ser anterior a la fecha de solicitud');
          }
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'SolicitudesConstanciasKardex',
    tableName: 'solicitudes_constancias_kardex',
    timestamps: false, // Usamos nuestros propios campos de timestamp
    underscored: false, // Los nombres ya están en snake_case en la DB
    hooks: {
      beforeUpdate: (instance) => {
        instance.fecha_actualizacion = new Date();
      }
    }
  }
);

export default SolicitudesConstanciasKardex;
export { 
  SolicitudesConstanciasKardexAttributes, 
  SolicitudesConstanciasKardexCreationAttributes,
  NivelType,
  TipoEntregaType,
  EstadoType
};