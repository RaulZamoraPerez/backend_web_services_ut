import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface AreaAttributes {
  ID_Area: number;
  Nombre: string;
}

// Atributos opcionales para creación
interface AreaCreationAttributes extends Optional<AreaAttributes, 'ID_Area'> {}

// Definir el modelo
class Area extends Model<AreaAttributes, AreaCreationAttributes> implements AreaAttributes {
  public ID_Area!: number;
  public Nombre!: string;

  // Timestamps (aunque no se usan en esta tabla)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Area.init(
  {
    ID_Area: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre del área no puede estar vacío'
        },
        len: {
          args: [1, 100],
          msg: 'El nombre debe tener entre 1 y 100 caracteres'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Area',
    tableName: 'area',
    timestamps: false, // No hay campos createdAt/updatedAt en la tabla
    underscored: false,
    indexes: [
      {
        name: 'UC_Nombre',
        unique: true,
        fields: ['Nombre']
      }
    ]
  }
);

export default Area;
export { 
  AreaAttributes, 
  AreaCreationAttributes 
};