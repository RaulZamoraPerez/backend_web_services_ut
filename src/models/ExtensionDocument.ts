import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ExtensionDocumentAttributes {
  id?: number;
  category: string;
  title: string;
  file_url: string;
  cover_url?: string;
  publication_date?: Date;
  created_at?: Date;
  media_type?: string | null; // 'document' | 'image'
  mime_type?: string | null;
}

class ExtensionDocument extends Model<ExtensionDocumentAttributes> implements ExtensionDocumentAttributes {
  public id!: number;
  public category!: string;
  public title!: string;
  public file_url!: string;
  public cover_url!: string;
  public publication_date!: Date;
  public created_at!: Date;
  public media_type!: string; // 'document' | 'image'
  public mime_type!: string;
}

ExtensionDocument.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cover_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    publication_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
      mime_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      media_type: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
  },
  {
    sequelize,
    tableName: 'extension_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default ExtensionDocument;
