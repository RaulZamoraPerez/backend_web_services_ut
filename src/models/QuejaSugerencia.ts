import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class QuejaSugerencia extends Model {
  public id!: number;
  public folio!: string;
  public tipo!: string;
  public tipo_otro_texto!: string | null;
  public nombre_completo!: string;
  public correo!: string;
  public telefono!: string;
  public carrera_area!: string;
  public fecha!: string;
  public descripcion!: string;
  public evidencia_path!: string | null;
  public evidencia_original_name!: string | null;
  public estado!: 'Pendiente' | 'En Revisión' | 'Atendida' | 'Descartada';
  public respuesta!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuejaSugerencia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    folio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Queja',
    },
    tipo_otro_texto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carrera_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    evidencia_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    evidencia_original_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'En Revisión', 'Atendida', 'Descartada'),
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'quejas_sugerencias',
    timestamps: true,
  }
);

export default QuejaSugerencia;
