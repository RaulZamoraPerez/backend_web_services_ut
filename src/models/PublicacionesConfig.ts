import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class PublicacionesConfig extends Model {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PublicacionesConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Publicaciones y Libros',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Explora el acervo de libros de texto, manuales especializados, revistas y artículos científicos publicados por la Universidad Tecnológica de Tecamachalco.',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'publicaciones_config',
    timestamps: true,
  }
);

export default PublicacionesConfig;
