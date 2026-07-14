import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir tipos para los enums
type EstadoType = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

// Definir atributos del modelo
interface SolicitudesImssAttributes {
  id: number;
  nombre: string;
  matricula: string;
  correo: string;
  telefono: string;
  Num_seguro: string;
  carrera: string;
  archivo_constancia_imss: string;
  estado: EstadoType;
  observaciones?: string | null;
  fecha_solicitud: Date;
  fecha_actualizacion: Date;
  fecha_entrega?: Date | null;
}

// Atributos opcionales para creación
interface SolicitudesImssCreationAttributes extends Optional<SolicitudesImssAttributes, 'id' | 'estado' | 'observaciones' | 'fecha_solicitud' | 'fecha_actualizacion' | 'fecha_entrega'> {}

// Definir el modelo
class SolicitudesImss extends Model<SolicitudesImssAttributes, SolicitudesImssCreationAttributes> implements SolicitudesImssAttributes {
  public id!: number;
  public nombre!: string;
  public matricula!: string;
  public correo!: string;
  public telefono!: string;
  public Num_seguro!: string;
  public carrera!: string;
  public archivo_constancia_imss!: string;
  public estado!: EstadoType;
  public observaciones?: string | null;
  public fecha_solicitud!: Date;
  public fecha_actualizacion!: Date;
  public fecha_entrega?: Date | null;
}

// Inicializar el modelo
SolicitudesImss.init(
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
      unique: true,
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
    Num_seguro: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El número de seguro social no puede estar vacío'
        },
        len: {
          args: [11, 11],
          msg: 'El número de seguro social debe tener exactamente 11 dígitos'
        },
        isNumeric: {
          msg: 'El número de seguro social solo puede contener números'
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
    archivo_constancia_imss: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La ruta del archivo de constancia IMSS no puede estar vacía'
        },
        len: {
          args: [1, 500],
          msg: 'La ruta del archivo no puede exceder 500 caracteres'
        },
        isValidPath(value: string) {
          if (!value.startsWith('uploads/constancias_imss/')) {
            throw new Error('El archivo debe estar en la carpeta uploads/constancias_imss/');
          }
          if (!value.toLowerCase().endsWith('.pdf')) {
            throw new Error('El archivo debe ser un PDF');
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
          if (value && (this as any).fecha_solicitud && new Date(value) < (this as any).fecha_solicitud) {
            throw new Error('La fecha de entrega no puede ser anterior a la fecha de solicitud');
          }
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'SolicitudesImss',
    tableName: 'solicitudes_imss',
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
      }
    ],
    hooks: {
      beforeUpdate: (instance: SolicitudesImss) => {
        instance.fecha_actualizacion = new Date();
      },
      beforeCreate: (instance: SolicitudesImss) => {
        // Generar nombre único para el archivo si no se proporciona
        if (!instance.archivo_constancia_imss.includes('/')) {
          const timestamp = Date.now();
          const fileName = `constancia_${instance.matricula}_${timestamp}.pdf`;
          instance.archivo_constancia_imss = `uploads/constancias_imss/${fileName}`;
        }
      }
    }
  }
);

export default SolicitudesImss;
export { 
  SolicitudesImssAttributes, 
  SolicitudesImssCreationAttributes,
  EstadoType
};