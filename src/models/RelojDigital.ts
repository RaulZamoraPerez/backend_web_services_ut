import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface RelojDigitalAttributes {
  id?: number;
  zonaHoraria: string;
  formato24Horas: boolean;
  mostrarFecha: boolean;
  mostrarDiaSemana: boolean;
  activo: boolean;
  estilo: 'digital' | 'analogico';
  tema: 'light' | 'dark' | 'blue' | 'minimal';
  createdAt?: Date;
  updatedAt?: Date;
}

export class RelojDigital extends Model<RelojDigitalAttributes> implements RelojDigitalAttributes {
  public id!: number;
  public zonaHoraria!: string;
  public formato24Horas!: boolean;
  public mostrarFecha!: boolean;
  public mostrarDiaSemana!: boolean;
  public activo!: boolean;
  public estilo!: 'digital' | 'analogico';
  public tema!: 'light' | 'dark' | 'blue' | 'minimal';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RelojDigital.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    zonaHoraria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'America/Mexico_City',
    },
    formato24Horas: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    mostrarFecha: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    mostrarDiaSemana: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    estilo: {
      type: DataTypes.ENUM('digital', 'analogico'),
      defaultValue: 'digital',
    },
    tema: {
      type: DataTypes.ENUM('light', 'dark', 'blue', 'minimal'),
      defaultValue: 'light',
    },
  },
  {
    sequelize,
    modelName: 'RelojDigital',
    tableName: 'relojes_digitales',
    timestamps: true,
  }
);

export default RelojDigital;