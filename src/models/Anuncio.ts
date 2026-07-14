import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface AnuncioAttributes {
  id?: number;
  titulo: string;
  imagen: string;
  activo: boolean;
  fecha_inicio: Date;
  fecha_fin: Date;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class Anuncio extends Model<AnuncioAttributes> implements AnuncioAttributes {
  public id!: number;
  public titulo!: string;
  public imagen!: string;
  public activo!: boolean;
  public fecha_inicio!: Date;
  public fecha_fin!: Date;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

Anuncio.init(
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
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: 'anuncios',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default Anuncio;
