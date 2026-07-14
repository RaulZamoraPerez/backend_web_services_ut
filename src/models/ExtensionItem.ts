import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import ExtensionSection from './ExtensionSection';

interface ExtensionItemAttributes {
  id?: number;
  section_id: number;
  title?: string;
  content?: string;
  icon?: string;
  image_url?: string;
}

class ExtensionItem extends Model<ExtensionItemAttributes> implements ExtensionItemAttributes {
  public id!: number;
  public section_id!: number;
  public title!: string;
  public content!: string;
  public icon!: string;
  public image_url!: string;
}

ExtensionItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ExtensionSection,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'extension_items',
    timestamps: false,
  }
);

export default ExtensionItem;
