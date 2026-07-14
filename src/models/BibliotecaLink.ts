import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BibliotecaLinkAttributes {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: string;
  order: number;
  subtitle?: string;
  spineColor?: string;
  category?: string;
}

interface BibliotecaLinkCreationAttributes extends Optional<BibliotecaLinkAttributes, 'id'> {}

class BibliotecaLink extends Model<BibliotecaLinkAttributes, BibliotecaLinkCreationAttributes> implements BibliotecaLinkAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public url!: string;
  public icon!: string;
  public order!: number;
  public subtitle?: string;
  public spineColor?: string;
  public category?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BibliotecaLink.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spineColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'biblioteca_links',
    timestamps: true,
  }
);

export default BibliotecaLink;
