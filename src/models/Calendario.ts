import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface CalendarioAttributes {
  id: number;
  titulo: string;
  descripcion?: string;
  archivo: string; // path del archivo subido
  fechaSubida: Date;
}

// Atributos opcionales para creación
interface CalendarioCreationAttributes extends Optional<CalendarioAttributes, 'id' | 'fechaSubida'> {}

// Definir el modelo
class Calendario extends Model<CalendarioAttributes, CalendarioCreationAttributes> implements CalendarioAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion?: string;
  public archivo!: string;
  public fechaSubida!: Date;
}

// Inicializar el modelo
Calendario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [1, 255],
          msg: 'El título debe tener entre 1 y 255 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    archivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El archivo es requerido'
        }
      }
    },
    fechaSubida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Calendario',
    tableName: 'calendarios',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['titulo'],
      },
    ],
  }
);

export default Calendario;