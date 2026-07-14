import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface VideoInstitucionalAttributes {
  id?: number;
  titulo: string;
  descripcion?: string;
  urlVideo: string;
  thumbnailUrl?: string;
  duracion?: number; // en segundos
  activo: boolean;
  mostrarControles: boolean;
  autoplay: boolean;
  loop: boolean;
  volumen: number; // 0-100
  createdAt?: Date;
  updatedAt?: Date;
}

export class VideoInstitucional extends Model<VideoInstitucionalAttributes> implements VideoInstitucionalAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public urlVideo!: string;
  public thumbnailUrl!: string;
  public duracion!: number;
  public activo!: boolean;
  public mostrarControles!: boolean;
  public autoplay!: boolean;
  public loop!: boolean;
  public volumen!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VideoInstitucional.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    urlVideo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    mostrarControles: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    autoplay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loop: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    volumen: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    modelName: 'VideoInstitucional',
    tableName: 'videos_institucionales',
    timestamps: true,
  }
);

export default VideoInstitucional;