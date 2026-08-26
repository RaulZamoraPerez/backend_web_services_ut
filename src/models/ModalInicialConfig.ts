import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ModalInicialConfigAttributes {
  id?: number;
  activo: boolean;
  imagen: string;
  enlace_pdf: string | null;
  enlace_url?: string | null;
}

class ModalInicialConfig extends Model<ModalInicialConfigAttributes> implements ModalInicialConfigAttributes {
  public id!: number;
  public activo!: boolean;
  public imagen!: string;
  public enlace_pdf!: string | null;
  public enlace_url?: string | null;
}

ModalInicialConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    imagen: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    enlace_pdf: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    enlace_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'modal_inicial_config',
    timestamps: false,
  }
);

export default ModalInicialConfig;
