import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class OpcionReinscripcion extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string | null;
  public archivoPath!: string;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OpcionReinscripcion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    subtitulo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    archivoPath: {
      type: DataTypes.STRING(500),
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
    tableName: 'opciones_reinscripcion',
    timestamps: true,
  }
);
