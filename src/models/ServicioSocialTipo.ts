import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ServicioSocialTipoAttributes {
  ID: number;
  Nombre: string;
}

interface ServicioSocialTipoCreationAttributes extends Optional<ServicioSocialTipoAttributes, 'ID'> {}

class ServicioSocialTipo extends Model<ServicioSocialTipoAttributes, ServicioSocialTipoCreationAttributes> implements ServicioSocialTipoAttributes {
  public ID!: number;
  public Nombre!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServicioSocialTipo.init(
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
    modelName: 'ServicioSocialTipo',
    tableName: 'servicio_social_tipos',
    timestamps: false,
  }
);

export default ServicioSocialTipo;
