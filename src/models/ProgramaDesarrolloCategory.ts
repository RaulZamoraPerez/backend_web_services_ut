import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgramaDesarrolloCategoryAttributes {
  id: number;
  titulo: string;
}

export interface ProgramaDesarrolloCategoryCreationAttributes extends Optional<ProgramaDesarrolloCategoryAttributes, 'id'> {}

class ProgramaDesarrolloCategory extends Model<ProgramaDesarrolloCategoryAttributes, ProgramaDesarrolloCategoryCreationAttributes>
  implements ProgramaDesarrolloCategoryAttributes {
  public id!: number;
  public titulo!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProgramaDesarrolloCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'programa_desarrollo_categorias',
  }
);

export default ProgramaDesarrolloCategory;
