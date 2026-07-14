import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface TextoAttributes {
  id: number;
  contenido: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para creación
interface TextoCreationAttributes extends Optional<TextoAttributes, 'id'> {}

// Definir el modelo
class Texto extends Model<TextoAttributes, TextoCreationAttributes> implements TextoAttributes {
  public id!: number;
  public contenido!: string;
  
  // Timestamps automáticos
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Texto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El contenido no puede estar vacío'
        },
        len: {
          args: [1, 5000],
          msg: 'El contenido debe tener entre 1 y 5000 caracteres'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'Texto',
    tableName: 'textos',
    timestamps: true,
    underscored: true, // usa snake_case para campos de DB
    indexes: [
      {
        fields: ['created_at']
      }
    ]
  }
);

export default Texto;
export { TextoAttributes, TextoCreationAttributes };