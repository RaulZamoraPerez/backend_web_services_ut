import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PatrocinadorAttributes {
  id: number;
  nombre: string;
  logo: string;
  website: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatrocinadorCreationAttributes extends Optional<PatrocinadorAttributes, 'id'> {}

class Patrocinador extends Model<PatrocinadorAttributes, PatrocinadorCreationAttributes> implements PatrocinadorAttributes {
  public id!: number;
  public nombre!: string;
  public logo!: string;
  public website!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patrocinador.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Patrocinador',
    tableName: 'patrocinadores',
    timestamps: true,
    underscored: true,
  }
);

export default Patrocinador;
