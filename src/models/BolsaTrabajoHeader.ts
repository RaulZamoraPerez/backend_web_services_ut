import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import BolsaTrabajoItem from './BolsaTrabajoItem';

interface BolsaTrabajoHeaderAttributes {
  id: number;
  titulo: string;
  descripcion: string;
  url_externa: string;
  imagen_banner: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  items?: any[]; // Asociación
}

interface BolsaTrabajoHeaderCreationAttributes extends Optional<BolsaTrabajoHeaderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BolsaTrabajoHeader extends Model<BolsaTrabajoHeaderAttributes, BolsaTrabajoHeaderCreationAttributes> implements BolsaTrabajoHeaderAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public url_externa!: string;
  public imagen_banner!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Asociaciones
  public readonly items?: any[];
}

BolsaTrabajoHeader.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  url_externa: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '',
  },
  imagen_banner: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'BolsaTrabajoHeader',
  timestamps: true,
});

BolsaTrabajoHeader.hasMany(BolsaTrabajoItem, { foreignKey: 'header_id', as: 'items' });
BolsaTrabajoItem.belongsTo(BolsaTrabajoHeader, { foreignKey: 'header_id', as: 'header' });

export default BolsaTrabajoHeader;
