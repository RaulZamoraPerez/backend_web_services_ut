import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class ContactConfig extends Model {
  public id!: number;
  public destination_email!: string;
  public public_phone!: string;
  public public_email!: string;
  public public_address!: string;
  public title!: string;
  public subtitle!: string;
  public seccion_tag!: string;
  public seccion_titulo!: string;
  public seccion_descripcion!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    destination_email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admisiones@uttecam.com',
    },
    public_phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '+52-249-422-3303',
    },
    public_email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'uttecam@uttecam.com',
    },
    public_address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Universidad Tecnológica 1, Tecamachalco, Pue.',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '¿Tienes alguna duda?',
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Contáctanos y nuestro equipo te responderá a la brevedad posible.',
    },
    seccion_tag: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Atención y dudas',
    },
    seccion_titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Contacto UTTECAM',
    },
    seccion_descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '¿Tienes preguntas, comentarios o deseas saber más sobre nuestra oferta educativa? Comunícate con nosotros.',
    },
  },
  {
    sequelize,
    tableName: 'contact_config',
    timestamps: true,
  }
);
