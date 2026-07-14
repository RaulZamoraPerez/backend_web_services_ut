import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PromocionInstitucionalCategoriaAttributes {
  id: number;
  titulo: string;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface PromocionInstitucionalCategoriaCreationAttributes extends Optional<PromocionInstitucionalCategoriaAttributes, 'id' | 'orden' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class PromocionInstitucionalCategoria extends Model<PromocionInstitucionalCategoriaAttributes, PromocionInstitucionalCategoriaCreationAttributes> implements PromocionInstitucionalCategoriaAttributes {
  public id!: number;
  public titulo!: string;
  public orden!: number;
  public activo!: boolean;

  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PromocionInstitucionalCategoria.init({
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
  tableName: 'promocion_institucional_categorias',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default PromocionInstitucionalCategoria;
