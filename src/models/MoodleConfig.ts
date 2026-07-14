import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MoodleConfigAttributes {
  id: number;
  url: string;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface MoodleConfigCreationAttributes extends Optional<MoodleConfigAttributes, 'id' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class MoodleConfig extends Model<MoodleConfigAttributes, MoodleConfigCreationAttributes> implements MoodleConfigAttributes {
  public id!: number;
  public url!: string;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

MoodleConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(500),
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
    tableName: 'moodle_config',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default MoodleConfig;
