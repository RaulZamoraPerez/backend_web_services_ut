import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface HeroSlideAttributes {
  id?: number;
  titulo: string;
  tipo: 'imagen' | 'video';
  archivo: string;
  archivo_movil?: string;
  orden: number;
  activo: boolean;
  color_fondo?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class HeroSlide extends Model<HeroSlideAttributes> implements HeroSlideAttributes {
  public id!: number;
  public titulo!: string;
  public tipo!: 'imagen' | 'video';
  public archivo!: string;
  public archivo_movil?: string;
  public orden!: number;
  public activo!: boolean;
  public color_fondo!: string;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

HeroSlide.init(
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
    tipo: {
      type: DataTypes.ENUM('imagen', 'video'),
      allowNull: false,
      defaultValue: 'imagen',
    },
    archivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    archivo_movil: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    color_fondo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '#0f172a',
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
    tableName: 'hero_slides',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default HeroSlide;
