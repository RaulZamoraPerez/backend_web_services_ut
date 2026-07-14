import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MovilidadInternacionalAttributes {
  id: number;
  titulo: string;
  archivo: string;
  tipo: 'pdf' | 'image';
  fecha_publicacion?: Date;
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MovilidadInternacionalCreationAttributes 
  extends Optional<MovilidadInternacionalAttributes, 'id' | 'fecha_publicacion' | 'orden' | 'activo' | 'createdAt' | 'updatedAt'> {}

class MovilidadInternacional extends Model<MovilidadInternacionalAttributes, MovilidadInternacionalCreationAttributes> 
  implements MovilidadInternacionalAttributes {
  public id!: number;
  public titulo!: string;
  public archivo!: string;
  public tipo!: 'pdf' | 'image';
  public fecha_publicacion?: Date;
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MovilidadInternacional.init(
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
    archivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('pdf', 'image'),
      allowNull: false,
      defaultValue: 'pdf'
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
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
  },
  {
    sequelize,
    tableName: 'movilidad_internacional',
    timestamps: true,
  }
);

export default MovilidadInternacional;
