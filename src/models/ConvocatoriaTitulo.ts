import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class ConvocatoriaTitulo extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string;
  public nombreSeccionDocumentos!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConvocatoriaTitulo.init(
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
    subtitulo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    nombreSeccionDocumentos: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'nombre_seccion_documentos',
    },
  },
  {
    tableName: 'convocatoria_titulo',
    sequelize,
  }
);
