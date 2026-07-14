import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ServicioTecnologicoAttributes {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen: string | null;
  pdf: string | null;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface ServicioTecnologicoCreationAttributes 
  extends Optional<ServicioTecnologicoAttributes, 'id' | 'descripcion' | 'imagen' | 'pdf' | 'orden' | 'activo'> {}

class ServicioTecnologico extends Model<ServicioTecnologicoAttributes, ServicioTecnologicoCreationAttributes> 
  implements ServicioTecnologicoAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string | null;
  public imagen!: string | null;
  public pdf!: string | null;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

ServicioTecnologico.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    pdf: {
      type: DataTypes.STRING(500),
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
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion',
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion',
    },
  },
  {
    sequelize,
    tableName: 'servicios_tecnologicos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default ServicioTecnologico;
