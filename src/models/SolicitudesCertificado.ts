import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir tipos para los enums
type NivelType = 'TSU' | 'LIC';
type TipoEntregaType = 'presencial' | 'electronico';
type EstadoType = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

// Definir atributos del modelo
interface SolicitudesCertificadoAttributes {
  id: number;
  nombre: string;
  matricula: string;
  correo: string;
  telefono: string;
  carrera: string;
  nivel: NivelType;
  tipo_entrega: TipoEntregaType;
  comprobante_pago: string;
  estado: EstadoType;
  observaciones?: string | null;
  fecha_solicitud: Date;
  fecha_actualizacion: Date;
  fecha_entrega?: Date | null;
}

// Atributos opcionales para creación
interface SolicitudesCertificadoCreationAttributes extends Optional<SolicitudesCertificadoAttributes, 'id' | 'estado' | 'observaciones' | 'fecha_solicitud' | 'fecha_actualizacion' | 'fecha_entrega'> {}

// Definir el modelo
class SolicitudesCertificado extends Model<SolicitudesCertificadoAttributes, SolicitudesCertificadoCreationAttributes> implements SolicitudesCertificadoAttributes {
  public id!: number;
  public nombre!: string;
  public matricula!: string;
  public correo!: string;
  public telefono!: string;
  public carrera!: string;
  public nivel!: NivelType;
  public tipo_entrega!: TipoEntregaType;
  public comprobante_pago!: string;
  public estado!: EstadoType;
  public observaciones?: string | null;
  public fecha_solicitud!: Date;
  public fecha_actualizacion!: Date;
  public fecha_entrega?: Date | null;
}

// Inicializar el modelo
SolicitudesCertificado.init(
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
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La matrícula no puede estar vacía'
        },
        len: {
          args: [8, 10],
          msg: 'La matrícula debe tener entre 8 y 10 caracteres'
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
        },
        len: {
          args: [2, 255],
          msg: 'La carrera debe tener entre 2 y 255 caracteres'
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
          msg: 'El tipo de entrega debe ser presencial o electronico'
        }
      }
    },
    comprobante_pago: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El comprobante de pago no puede estar vacío'
        },
        len: {
          args: [1, 500],
          msg: 'El comprobante de pago no puede exceder 500 caracteres'
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
          if (value && (this as any).fecha_solicitud && new Date(value) < (this as any).fecha_solicitud) {
            throw new Error('La fecha de entrega no puede ser anterior a la fecha de solicitud');
          }
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'SolicitudesCertificado',
    tableName: 'solicitudes_certificado',
    timestamps: false, // Usamos nuestros propios campos de timestamp
    underscored: false, // Los nombres ya están en snake_case en la DB
    indexes: [
      {
        fields: ['matricula'],
        name: 'idx_matricula'
      },
      {
        fields: ['correo'],
        name: 'idx_correo'
      },
      {
        fields: ['estado'],
        name: 'idx_estado'
      },
      {
        fields: ['fecha_solicitud'],
        name: 'idx_fecha_solicitud'
      },
      {
        fields: ['comprobante_pago'],
        name: 'idx_numero_referencia'
      }
    ],
    hooks: {
      beforeUpdate: (instance: SolicitudesCertificado) => {
        instance.fecha_actualizacion = new Date();
      },
      beforeCreate: (instance: SolicitudesCertificado) => {
        // Validación adicional en la creación
        if (!instance.nombre || instance.nombre.trim() === '') {
          throw new Error('El nombre es requerido');
        }
        
        // Validar que el comprobante de pago tenga un formato válido si es necesario
        if (instance.comprobante_pago && instance.comprobante_pago.trim() === '') {
          throw new Error('El comprobante de pago no puede estar vacío');
        }
      }
    }
  }
);

export default SolicitudesCertificado;
export { 
  SolicitudesCertificadoAttributes, 
  SolicitudesCertificadoCreationAttributes,
  NivelType,
  TipoEntregaType,
  EstadoType
};