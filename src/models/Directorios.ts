import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface DirectoriosAttributes {
  id: number;
  titulo: string;
  nombre: string;
  telefono?: string;
  extension?: string;
  correo?: string;
  imagen?: string;
  activo?: boolean;
  orden?: number;
}

// Atributos opcionales para creación
interface DirectoriosCreationAttributes extends Optional<DirectoriosAttributes, 'id'> {}

// Definir el modelo
class Directorios extends Model<DirectoriosAttributes, DirectoriosCreationAttributes> implements DirectoriosAttributes {
  public id!: number;
  public titulo!: string;
  public nombre!: string;
  public telefono?: string;
  public extension?: string;
  public correo?: string;
  public imagen?: string;
  public activo?: boolean;
  public orden?: number;
}

// Inicializar el modelo
Directorios.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [1, 150],
          msg: 'El título debe tener entre 1 y 150 caracteres'
        }
      }
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        },
        len: {
          args: [1, 150],
          msg: 'El nombre debe tener entre 1 y 150 caracteres'
        }
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [0, 20],
          msg: 'El teléfono no puede tener más de 20 caracteres'
        },
        isNumeric: {
          msg: 'El teléfono debe contener solo números'
        }
      }
    },
    extension: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: {
          args: [0, 10],
          msg: 'La extensión no puede tener más de 10 caracteres'
        },
        isNumeric: {
          msg: 'La extensión debe contener solo números'
        }
      }
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        len: {
          args: [0, 150],
          msg: 'El correo no puede tener más de 150 caracteres'
        },
        isEmail: {
          msg: 'Debe ser un correo electrónico válido'
        }
      }
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'La ruta de imagen no puede tener más de 255 caracteres'
        }
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'Directorios',
    tableName: 'directorios',
    timestamps: false, // La tabla no tiene campos createdAt/updatedAt
    underscored: true, // usa snake_case para campos de DB
    indexes: [
      {
        fields: ['titulo']
      },
      {
        fields: ['nombre']
      }
    ]
  }
);

export default Directorios;
export { DirectoriosAttributes, DirectoriosCreationAttributes };