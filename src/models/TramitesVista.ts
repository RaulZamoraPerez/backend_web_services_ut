import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class TramitesVista extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string;
  public correoPorDefecto!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TramitesVista.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subtitulo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    correoPorDefecto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'tramites_vista',
    sequelize,
  }
);
