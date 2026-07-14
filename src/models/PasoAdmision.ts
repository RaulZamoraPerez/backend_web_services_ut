import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';
import { ProcesoAdmision } from './ProcesoAdmision';

export class PasoAdmision extends Model {
  public id!: string;
  public procesoAdmisionId!: string;
  public nombre!: string;
  public descripcion!: string;
  public tipo!: 'link' | 'file';
  public url!: string;
  public orden!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasoAdmision.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    procesoAdmisionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ProcesoAdmision,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nombre: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('link', 'file'),
      allowNull: false,
      defaultValue: 'link',
    },
    url: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'pasos_admision',
    sequelize,
  }
);
