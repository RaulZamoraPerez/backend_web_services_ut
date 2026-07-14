import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EncuentroEgresadosAttributes {
  id: number;
  titulo: string;
  descripcion: string | null;
  archivo: string;
  tipo: 'pdf' | 'image';
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EncuentroEgresadosCreationAttributes extends Optional<EncuentroEgresadosAttributes, 'id' | 'descripcion' | 'orden' | 'activo' | 'createdAt' | 'updatedAt'> {}

class EncuentroEgresados extends Model<EncuentroEgresadosAttributes, EncuentroEgresadosCreationAttributes> implements EncuentroEgresadosAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string | null;
  public archivo!: string;
  public tipo!: 'pdf' | 'image';
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EncuentroEgresados.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('pdf', 'image'),
    allowNull: false,
    defaultValue: 'image'
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  sequelize,
  tableName: 'EncuentroEgresados',
  timestamps: true,
});

export default EncuentroEgresados;
