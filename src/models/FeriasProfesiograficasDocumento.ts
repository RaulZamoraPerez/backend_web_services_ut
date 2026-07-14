import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import FeriasProfesiograficasCategoria from './FeriasProfesiograficasCategoria';

export interface FeriasProfesiograficasDocumentoAttributes {
  id: number;
  titulo: string;
  archivo: string;
  categoria_id: number;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface FeriasProfesiograficasDocumentoCreationAttributes extends Optional<FeriasProfesiograficasDocumentoAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class FeriasProfesiograficasDocumento extends Model<FeriasProfesiograficasDocumentoAttributes, FeriasProfesiograficasDocumentoCreationAttributes> implements FeriasProfesiograficasDocumentoAttributes {
  public id!: number;
  public titulo!: string;
  public archivo!: string;
  public categoria_id!: number;
  public orden!: number;
  public activo!: boolean;

  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

FeriasProfesiograficasDocumento.init({
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
      model: 'ferias_profesiograficas_categorias',
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
  tableName: 'ferias_profesiograficas_documentos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default FeriasProfesiograficasDocumento;
