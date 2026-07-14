import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BibliotecaConfigAttributes {
  id: number;
  titulo: string;
  descripcion: string;
  catalog_title?: string;
  catalog_description?: string;
  catalog_url?: string;
  catalog_pdf_path?: string;
  catalog_qr_path?: string;
  catalog_active?: boolean;
}

interface BibliotecaConfigCreationAttributes extends Optional<BibliotecaConfigAttributes, 'id'> {}

class BibliotecaConfig extends Model<BibliotecaConfigAttributes, BibliotecaConfigCreationAttributes> implements BibliotecaConfigAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public catalog_title?: string;
  public catalog_description?: string;
  public catalog_url?: string;
  public catalog_pdf_path?: string;
  public catalog_qr_path?: string;
  public catalog_active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BibliotecaConfig.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Biblioteca Digital'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Acceso directo a las mejores fuentes de información académica, científica y cultural para fortalecer tu investigación.'
    },
    catalog_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    catalog_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    catalog_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    catalog_pdf_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    catalog_qr_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    catalog_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize,
    tableName: 'biblioteca_configs',
    timestamps: true,
  }
);

export default BibliotecaConfig;
