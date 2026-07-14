import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntidadCertificacionEvaluacion extends Model {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public archivo!: string;
  public tipo!: 'pdf' | 'image';
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EntidadCertificacionEvaluacion.init(
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    archivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('pdf', 'image'),
      allowNull: false,
      defaultValue: 'image',
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
    tableName: 'entidad_certificacion_evaluacion',
    timestamps: true,
  }
);

export default EntidadCertificacionEvaluacion;
