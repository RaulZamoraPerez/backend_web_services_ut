import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface CarreraSimpleAttributes {
  id?: string;
  nombre: string;
  tipo: 'TSU' | 'INGENIERIA' | 'LICENCIATURA' | 'MAESTRIA' | 'DOCTORADO' | 'OTRO';
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CarreraSimple extends Model<CarreraSimpleAttributes> implements CarreraSimpleAttributes {
  public id!: string;
  public nombre!: string;
  public tipo!: 'TSU' | 'INGENIERIA' | 'LICENCIATURA' | 'MAESTRIA' | 'DOCTORADO' | 'OTRO';
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CarreraSimple.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: {
        name: 'unique_nombre_carrera_simple',
        msg: 'Ya existe una carrera con este nombre.',
      },
    },
    tipo: {
      type: DataTypes.ENUM('TSU', 'INGENIERIA', 'LICENCIATURA', 'MAESTRIA', 'DOCTORADO', 'OTRO'),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'carreras_simples',
    timestamps: true,
  }
);
