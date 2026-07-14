import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface FooterConfigAttributes {
  id: number;
  direccion: string;
  telefono: string;
  horario: string;
  email_rectoria: string;
  email_extension: string;
  mapa_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FooterConfigCreationAttributes extends Optional<FooterConfigAttributes, 'id' | 'direccion' | 'telefono' | 'horario' | 'email_rectoria' | 'email_extension' | 'mapa_url'> {}

class FooterConfig extends Model<FooterConfigAttributes, FooterConfigCreationAttributes> implements FooterConfigAttributes {
  public id!: number;
  public direccion!: string;
  public telefono!: string;
  public horario!: string;
  public email_rectoria!: string;
  public email_extension!: string;
  public mapa_url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FooterConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: 'Avenida, Universidad Tecnológica 1, Barrio la Villita, 75483 Tecamachalco, Pue.',
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '+52-249-422-3303',
    },
    horario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'de 9:00 a 17:00',
    },
    email_rectoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'rectoria@uttecam.edu.mx',
    },
    email_extension: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'extensionuniversitaria@uttecam.edu.mx',
    },
    mapa_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.651011064499!2d-97.72351492533981!3d18.863898058597947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c5631524041a17%3A0x43073fb16f64edc2!2sUTTcam!5e1!3m2!1sen!2smx!4v1749089731375!5m2!1sen!2smx',
    },
  },
  {
    sequelize,
    modelName: 'FooterConfig',
    tableName: 'footer_configs',
    timestamps: true,
    underscored: true,
  }
);

export default FooterConfig;
