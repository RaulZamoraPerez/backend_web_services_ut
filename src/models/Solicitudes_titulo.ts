import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir tipos para los enums
type EstadoType = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

// Definir atributos del modelo
interface SolicitudesTituloAttributes {
  id: number;
  nombre: string;
  matricula: string;
  correo: string;
  telefono: string;
  carrera: string;
  estado: EstadoType;
  observaciones?: string | null;
  fecha_solicitud: Date;
  fecha_actualizacion: Date;
  fecha_entrega?: Date | null;
}

// Atributos opcionales para creación
interface SolicitudesTituloCreationAttributes extends Optional<SolicitudesTituloAttributes, 'id' | 'estado' | 'observaciones' | 'fecha_solicitud' | 'fecha_actualizacion' | 'fecha_entrega'> {}

// Definir el modelo
class SolicitudesTitulo extends Model<SolicitudesTituloAttributes, SolicitudesTituloCreationAttributes> implements SolicitudesTituloAttributes {
  public id!: number;
  public nombre!: string;
  public matricula!: string;
  public correo!: string;
  public telefono!: string;
  public carrera!: string;
  public estado!: EstadoType;
  public observaciones?: string | null;
  public fecha_solicitud!: Date;
  public fecha_actualizacion!: Date;
  public fecha_entrega?: Date | null;
}

// Inicializar el modelo
SolicitudesTitulo.init(
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
    modelName: 'SolicitudesTitulo',
    tableName: 'solicitudes_titulo',
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
      beforeUpdate: (instance: SolicitudesTitulo) => {
        instance.fecha_actualizacion = new Date();
      },
      beforeCreate: (instance: SolicitudesTitulo) => {
        // Validación adicional en la creación si es necesaria
        if (!instance.nombre || instance.nombre.trim() === '') {
          throw new Error('El nombre es requerido');
        }
      }
    }
  }
);

export default SolicitudesTitulo;
export { 
  SolicitudesTituloAttributes, 
  SolicitudesTituloCreationAttributes,
  EstadoType
};
