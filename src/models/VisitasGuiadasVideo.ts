import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface VisitasGuiadasVideoAttributes {
  id: number;
  titulo: string;
  descripcion: string;
  youtubeId: string;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface VisitasGuiadasVideoCreationAttributes extends Optional<VisitasGuiadasVideoAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class VisitasGuiadasVideo extends Model<VisitasGuiadasVideoAttributes, VisitasGuiadasVideoCreationAttributes> implements VisitasGuiadasVideoAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public youtubeId!: string;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

VisitasGuiadasVideo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Sin título'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  youtubeId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'youtube_id'
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  tableName: 'visitas_guiadas_videos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default VisitasGuiadasVideo;
