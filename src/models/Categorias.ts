import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface CategoriasAttributes {
  ID_Categorias: number;
  Nombre: string;
  ID_Area: number;
}

// Atributos opcionales para creación
interface CategoriasCreationAttributes extends Optional<CategoriasAttributes, 'ID_Categorias'> {}

// Definir el modelo
class Categorias extends Model<CategoriasAttributes, CategoriasCreationAttributes> implements CategoriasAttributes {
  public ID_Categorias!: number;
  public Nombre!: string;
  public ID_Area!: number;

  // Timestamps (aunque no se usan en esta tabla)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Categorias.init(
  {
    ID_Categorias: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de la categoría no puede estar vacío'
        },
        len: {
          args: [1, 100],
          msg: 'El nombre debe tener entre 1 y 100 caracteres'
        }
      }
    },
    ID_Area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'area',
        key: 'ID_Area'
      },
      validate: {
        isInt: {
          msg: 'ID_Area debe ser un número entero'
        },
        min: {
          args: [1],
          msg: 'ID_Area debe ser mayor a 0'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Categorias',
    tableName: 'categorias',
    timestamps: false, // No hay campos createdAt/updatedAt en la tabla
    underscored: false,
    indexes: [
      // Se removió el índice único sobre `Nombre` para permitir nombres duplicados de categorías.
      {
        name: 'FK_Area',
        fields: ['ID_Area']
      }
    ]
  }
);

export default Categorias;
export { 
  CategoriasAttributes, 
  CategoriasCreationAttributes 
};