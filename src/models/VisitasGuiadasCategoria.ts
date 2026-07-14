import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface VisitasGuiadasCategoriaAttributes {
  id: number;
  titulo: string;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface VisitasGuiadasCategoriaCreationAttributes extends Optional<VisitasGuiadasCategoriaAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class VisitasGuiadasCategoria extends Model<VisitasGuiadasCategoriaAttributes, VisitasGuiadasCategoriaCreationAttributes> implements VisitasGuiadasCategoriaAttributes {
  public id!: number;
  public titulo!: string;
  public orden!: number;
  public activo!: boolean;

  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

VisitasGuiadasCategoria.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
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
}, {
  sequelize,
  tableName: 'visitas_guiadas_categorias',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default VisitasGuiadasCategoria;
