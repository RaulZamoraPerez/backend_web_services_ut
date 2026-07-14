import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface CarreraAttributes {
  id?: number;
  nombre: string;
  siglas: string;
  nivel: 'TSU' | 'Ingenieria' | 'Licenciatura';
  duracion: string;
  objetivo: string;
  perfil_ingreso: string;
  perfil_egreso: string;
  campo_laboral: string;
  imagen: string;
  imagen_portada?: string; // New field for grid image
  video_url?: string;
  plan_estudios_url?: string;
  mapa_curricular?: any; // JSON structure
  competencias?: string; // JSON string or text
  atributos_egreso?: string; // JSON string or text
  objetivos_educacionales?: string; // JSON string or text
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Carrera extends Model<CarreraAttributes> implements CarreraAttributes {
  public id!: number;
  public nombre!: string;
  public siglas!: string;
  public nivel!: 'TSU' | 'Ingenieria' | 'Licenciatura';
  public duracion!: string;
  public objetivo!: string;
  public perfil_ingreso!: string;
  public perfil_egreso!: string;
  public campo_laboral!: string;
  public imagen!: string;
  public imagen_portada?: string;
  public video_url?: string;
  public plan_estudios_url?: string;
  public mapa_curricular?: any;
  public competencias?: string;
  public atributos_egreso?: string;
  public objetivos_educacionales?: string;
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Carrera.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    siglas: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nivel: {
      type: DataTypes.ENUM('TSU', 'Ingenieria', 'Licenciatura'),
      allowNull: false,
    },
    duracion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    objetivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    perfil_ingreso: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    perfil_egreso: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    campo_laboral: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imagen_portada: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    plan_estudios_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mapa_curricular: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    competencias: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    atributos_egreso: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    objetivos_educacionales: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'carreras',
    timestamps: true,
  }
);

export default Carrera;
