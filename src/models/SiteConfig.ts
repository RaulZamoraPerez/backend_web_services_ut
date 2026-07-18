import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface SiteConfigAttributes {
  id?: number;
  modo_electoral: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SiteConfig extends Model<SiteConfigAttributes> implements SiteConfigAttributes {
  public id!: number;
  public modo_electoral!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SiteConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modo_electoral: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'SiteConfig',
    tableName: 'site_config',
    timestamps: true,
  }
);

export default SiteConfig;
