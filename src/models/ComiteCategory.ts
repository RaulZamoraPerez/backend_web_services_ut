import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Comite from './Comite';

interface ComiteCategoryAttributes {
  id: number;
  comiteId: number;
  titulo: string;
  orden?: number;
}

export interface ComiteCategoryCreationAttributes extends Optional<ComiteCategoryAttributes, 'id' | 'orden'> {}

class ComiteCategory extends Model<ComiteCategoryAttributes, ComiteCategoryCreationAttributes>
  implements ComiteCategoryAttributes {
  public id!: number;
  public comiteId!: number;
  public titulo!: string;
  public orden!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ComiteCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comite,
        key: 'id'
      },
      field: 'comite_id'
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'comite_categorias',
  }
);

export default ComiteCategory;
