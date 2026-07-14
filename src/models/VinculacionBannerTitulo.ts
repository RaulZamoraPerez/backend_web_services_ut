import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface VinculacionBannerTituloAttributes {
  id: number;
  titulo: string;
}

type VinculacionBannerTituloCreationAttributes = Optional<
  VinculacionBannerTituloAttributes,
  'id'
>;

class VinculacionBannerTitulo extends Model<
  VinculacionBannerTituloAttributes,
  VinculacionBannerTituloCreationAttributes
> implements VinculacionBannerTituloAttributes {
  public id!: number;
  public titulo!: string;
}

VinculacionBannerTitulo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Galería de Vinculación',
    },
  },
  {
    sequelize,
    tableName: 'vinculacion_banner_titulo',
    timestamps: false,
  },
);

export default VinculacionBannerTitulo;