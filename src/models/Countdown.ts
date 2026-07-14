import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CountdownAttributes {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fecha_objetivo: Date;
  is_active: boolean;
  efecto: string;
  texto_finalizado?: string;
  tagline_finalizado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CountdownCreationAttributes extends Optional<CountdownAttributes, 'id'> {}

class Countdown extends Model<CountdownAttributes, CountdownCreationAttributes> implements CountdownAttributes {
  public id!: number;
  public titulo!: string;
  public subtitulo!: string;
  public descripcion!: string;
  public fecha_objetivo!: Date;
  public is_active!: boolean;
  public efecto!: string;
  public texto_finalizado?: string;
  public tagline_finalizado?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Countdown.init(
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
    subtitulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_objetivo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    efecto: {
      type: DataTypes.STRING(50),
      defaultValue: 'confetti',
      allowNull: false,
    },
    texto_finalizado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tagline_finalizado: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Countdown',
    tableName: 'countdowns',
    timestamps: true,
    underscored: true,
  }
);

export default Countdown;
export { CountdownAttributes, CountdownCreationAttributes };
