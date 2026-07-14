import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class ConvocatoriaDocumento extends Model {
  public id!: string;
  public titulo!: string;
  public archivoPath!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConvocatoriaDocumento.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    archivoPath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'archivo_path',
    },
  },
  {
    tableName: 'convocatoria_documentos',
    sequelize,
  }
);
