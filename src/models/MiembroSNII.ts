import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MiembroSNIIAttributes {
  id: number;
  titulo: string;
  pdf: string;
  orden: number;
  activo: boolean;
  tipo?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface MiembroSNIICreationAttributes 
  extends Optional<MiembroSNIIAttributes, 'id' | 'orden' | 'activo' | 'tipo'> {}

class MiembroSNII extends Model<MiembroSNIIAttributes, MiembroSNIICreationAttributes> 
  implements MiembroSNIIAttributes {
  public id!: number;
  public titulo!: string;
  public pdf!: string;
  public orden!: number;
  public activo!: boolean;
  public tipo?: string;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

MiembroSNII.init(
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
    pdf: {
      type: DataTypes.STRING(500),
      allowNull: false,
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
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'General'
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
    tableName: 'miembros_snii',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default MiembroSNII;
