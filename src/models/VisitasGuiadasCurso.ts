import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface VisitasGuiadasCursoAttributes {
  id: number;
  titulo: string; // Subtitle in dashboard
  imagen: string;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface VisitasGuiadasCursoCreationAttributes extends Optional<VisitasGuiadasCursoAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class VisitasGuiadasCurso extends Model<VisitasGuiadasCursoAttributes, VisitasGuiadasCursoCreationAttributes> implements VisitasGuiadasCursoAttributes {
  public id!: number;
  public titulo!: string;
  public imagen!: string;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

VisitasGuiadasCurso.init({
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
    allowNull: false,
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
  tableName: 'visitas_guiadas_cursos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default VisitasGuiadasCurso;
