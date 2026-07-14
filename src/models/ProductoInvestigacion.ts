import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductoInvestigacionAttributes {
  id: number;
  titulo: string;
  pdf: string;
  carpeta: string; // folderName
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface ProductoInvestigacionCreationAttributes 
  extends Optional<ProductoInvestigacionAttributes, 'id' | 'orden' | 'activo'> {}

class ProductoInvestigacion extends Model<ProductoInvestigacionAttributes, ProductoInvestigacionCreationAttributes> 
  implements ProductoInvestigacionAttributes {
  public id!: number;
  public titulo!: string;
  public pdf!: string;
  public carpeta!: string;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

ProductoInvestigacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pdf: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    carpeta: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion',
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion',
    },
  },
  {
    sequelize,
    tableName: 'productos_investigacion',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default ProductoInvestigacion;
