import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MiembroSniiTipoAttributes {
  ID: number;
  Nombre: string;
}

interface MiembroSniiTipoCreationAttributes extends Optional<MiembroSniiTipoAttributes, 'ID'> {}

class MiembroSniiTipo extends Model<MiembroSniiTipoAttributes, MiembroSniiTipoCreationAttributes> implements MiembroSniiTipoAttributes {
  public ID!: number;
  public Nombre!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MiembroSniiTipo.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El nombre del tipo es requerido' }
      }
    }
  },
  {
    sequelize,
    modelName: 'MiembroSniiTipo',
    tableName: 'miembros_snii_tipos',
    timestamps: false,
  }
);

export default MiembroSniiTipo;
