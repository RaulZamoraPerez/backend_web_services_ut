import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PortalDocenteCategoriaAttributes {
  id: number;
  titulo: string;
  orden: number;
  activo: boolean;
}

export interface PortalDocenteCategoriaCreationAttributes extends Optional<PortalDocenteCategoriaAttributes, 'id' | 'orden' | 'activo'> {}

class PortalDocenteCategoria extends Model<PortalDocenteCategoriaAttributes, PortalDocenteCategoriaCreationAttributes> implements PortalDocenteCategoriaAttributes {
  public id!: number;
  public titulo!: string;
  public orden!: number;
  public activo!: boolean;
}

PortalDocenteCategoria.init({
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
  tableName: 'portal_docente_categorias',
  timestamps: false,
});

export default PortalDocenteCategoria;
