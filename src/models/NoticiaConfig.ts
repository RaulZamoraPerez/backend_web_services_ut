import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class NoticiaConfig extends Model {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NoticiaConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Noticias de la universidad',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Aquí encontrarás las últimas noticias y actualizaciones de la universidad, incluyendo eventos, anuncios importantes y más.',
    },
  },
  {
    sequelize,
    tableName: 'noticia_config',
    timestamps: true,
  }
);
