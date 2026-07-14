import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface PracticasEstadiasBannerAttributes {
  id?: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class PracticasEstadiasBanner extends Model<PracticasEstadiasBannerAttributes> implements PracticasEstadiasBannerAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public imagen!: string;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

PracticasEstadiasBanner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'practicas_estadias_banners',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default PracticasEstadiasBanner;
