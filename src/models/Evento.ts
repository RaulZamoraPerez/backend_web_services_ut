import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface EventoAttributes {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_evento: Date;
  tema?: string;
  color?: string;
  imagen_fondo_url?: string | null;
  texto_boton?: string;
  url_boton?: string;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class Evento extends Model<EventoAttributes> implements EventoAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion?: string;
  public fecha_evento!: Date;
  public tema?: string;
  public color?: string;
  public imagen_fondo_url?: string | null;
  public texto_boton?: string;
  public url_boton?: string;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

Evento.init(
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_evento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tema: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'general',
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#FFD700',
    },
    imagen_fondo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    texto_boton: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    url_boton: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'eventos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default Evento;
