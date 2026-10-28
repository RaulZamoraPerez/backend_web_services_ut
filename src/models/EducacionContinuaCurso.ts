import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EducacionContinuaCursoAttributes {
  id: number;
  titulo: string;
  imagen?: string | null;
  tipo?: 'imagen' | 'video';
  youtubeId?: string | null;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface EducacionContinuaCursoCreationAttributes extends Optional<EducacionContinuaCursoAttributes, 'id' | 'imagen' | 'tipo' | 'youtubeId' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class EducacionContinuaCurso extends Model<EducacionContinuaCursoAttributes, EducacionContinuaCursoCreationAttributes> implements EducacionContinuaCursoAttributes {
  public id!: number;
  public titulo!: string;
  public imagen!: string | null;
  public tipo!: 'imagen' | 'video';
  public youtubeId!: string | null;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

EducacionContinuaCurso.init({
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
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('imagen', 'video'),
    defaultValue: 'imagen',
    allowNull: false,
  },
  youtubeId: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  tableName: 'educacion_continua_cursos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default EducacionContinuaCurso;
