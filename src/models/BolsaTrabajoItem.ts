import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BolsaTrabajoItemAttributes {
  id: number;
  titulo: string;
  descripcion: string;
  archivo_pdf: string;
  orden: number;
  header_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BolsaTrabajoItemCreationAttributes extends Optional<BolsaTrabajoItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BolsaTrabajoItem extends Model<BolsaTrabajoItemAttributes, BolsaTrabajoItemCreationAttributes> implements BolsaTrabajoItemAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public archivo_pdf!: string;
  public orden!: number;
  public header_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BolsaTrabajoItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  header_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow null for backward compatibility or migration
    references: {
      model: 'BolsaTrabajoHeader',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  archivo_pdf: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: 'BolsaTrabajoItem',
  timestamps: true,
});

export default BolsaTrabajoItem;
