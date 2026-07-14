import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import VisitasGuiadasCategoria from './VisitasGuiadasCategoria';

export interface VisitasGuiadasDocumentoAttributes {
  id: number;
  titulo: string;
  archivo: string;
  categoria_id: number;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface VisitasGuiadasDocumentoCreationAttributes extends Optional<VisitasGuiadasDocumentoAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class VisitasGuiadasDocumento extends Model<VisitasGuiadasDocumentoAttributes, VisitasGuiadasDocumentoCreationAttributes> implements VisitasGuiadasDocumentoAttributes {
  public id!: number;
  public titulo!: string;
  public archivo!: string;
  public categoria_id!: number;
  public orden!: number;
  public activo!: boolean;

  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

VisitasGuiadasDocumento.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'visitas_guiadas_categorias',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'visitas_guiadas_documentos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default VisitasGuiadasDocumento;
