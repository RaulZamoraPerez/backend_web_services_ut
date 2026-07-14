
//Crea un modelo para el proceso de admisión que guarde el titulo, subtitulo y el path del archivo subido
import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class ProcesoAdmision extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string;
  public archivoPath!: string;
  public tipo!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProcesoAdmision.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
    subtitulo: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    archivoPath: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: new DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
  },
  {
    tableName: 'proceso_admision',
    sequelize,
  }
);  