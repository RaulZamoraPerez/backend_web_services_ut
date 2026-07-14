import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PortalEstudiantesAttributes {
  id: number;
  titulo: string;
  subtitulo: string;
  badgeTexto: string;
  parrafo1: string;
  parrafo2: string;
  parrafo3: string;
  imagenUrl: string;
  enlaceBoton: string;
  textoBoton: string;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface PortalEstudiantesCreationAttributes 
  extends Optional<PortalEstudiantesAttributes, 'id' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class PortalEstudiantes 
  extends Model<PortalEstudiantesAttributes, PortalEstudiantesCreationAttributes>
  implements PortalEstudiantesAttributes {
  public id!: number;
  public titulo!: string;
  public subtitulo!: string;
  public badgeTexto!: string;
  public parrafo1!: string;
  public parrafo2!: string;
  public parrafo3!: string;
  public imagenUrl!: string;
  public enlaceBoton!: string;
  public textoBoton!: string;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PortalEstudiantes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    subtitulo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    badgeTexto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parrafo1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parrafo2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parrafo3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagenUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    enlaceBoton: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    textoBoton: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'portal_estudiantes',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default PortalEstudiantes;
