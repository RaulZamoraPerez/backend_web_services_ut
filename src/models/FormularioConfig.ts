import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class FormularioConfig extends Model {
  public id!: string;
  public tipo!: string;
  public titulo!: string;
  public subtitulo!: string;
  public descripcion!: string | null;
  public tiempoEntrega!: string;
  public costo!: string | null;
  public linkPago!: string | null;
  public requisitos!: string[];
  public pasos!: string[] | null;
  public documentos!: string[] | null;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FormularioConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // Solo puede haber una configuración por tipo de formulario
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    subtitulo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tiempoEntrega: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    costo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    linkPago: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: 'https://rl.puebla.gob.mx/',
    },
    requisitos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    pasos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    documentos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'formulario_config',
    sequelize,
  }
);
