import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class AdmisionBanner extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string;
  public imagenPath!: string;
  public tipo!: string;
  public contactoLabel?: string;
  public contactoDepartamento?: string;
  public contactoTelefono?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

AdmisionBanner.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitulo: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  imagenPath: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'GENERAL',
  },
  contactoLabel: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactoDepartamento: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactoTelefono: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'admision_banner',
  timestamps: true
});
