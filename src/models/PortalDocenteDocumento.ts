import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import PortalDocenteCategoria from './PortalDocenteCategoria';

export interface PortalDocenteDocumentoAttributes {
  id: number;
  titulo: string;
  archivo: string;
  categoria_id: number;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface PortalDocenteDocumentoCreationAttributes extends Optional<PortalDocenteDocumentoAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class PortalDocenteDocumento extends Model<PortalDocenteDocumentoAttributes, PortalDocenteDocumentoCreationAttributes> implements PortalDocenteDocumentoAttributes {
  public id!: number;
  public titulo!: string;
  public archivo!: string;
  public categoria_id!: number;
  public orden!: number;
  public activo!: boolean;

  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PortalDocenteDocumento.init({
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
      model: 'portal_docente_categorias',
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
  tableName: 'portal_docente_documentos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default PortalDocenteDocumento;
