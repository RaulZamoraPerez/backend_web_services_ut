import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface NoticiaAttributes {
  id?: number;
  titulo: string;
  imagen: string;
  enlace?: string;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class Noticia extends Model<NoticiaAttributes> implements NoticiaAttributes {
  public id!: number;
  public titulo!: string;
  public imagen!: string;
  public enlace!: string;
  public orden!: number;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

Noticia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    enlace: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: null,
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
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'noticias',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default Noticia;
