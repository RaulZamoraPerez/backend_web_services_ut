import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PromocionInstitucionalBannerAttributes {
  id: number;
  titulo: string;
  imagen: string;
  activo: boolean;
  orden: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface PromocionInstitucionalBannerCreationAttributes extends Optional<PromocionInstitucionalBannerAttributes, 'id' | 'activo' | 'orden' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class PromocionInstitucionalBanner extends Model<PromocionInstitucionalBannerAttributes, PromocionInstitucionalBannerCreationAttributes> implements PromocionInstitucionalBannerAttributes {
  public id!: number;
  public titulo!: string;
  public imagen!: string;
  public activo!: boolean;
  public orden!: number;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PromocionInstitucionalBanner.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'promocion_institucional_banners',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default PromocionInstitucionalBanner;
