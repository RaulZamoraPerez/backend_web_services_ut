import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ExtensionSectionAttributes {
  id?: number;
  slug: string;
  title: string;
  introduction?: string;
  description?: string;
  banner_url?: string;
  is_enabled?: boolean;
  schedule?: string;
  location?: string;
  contact_info?: string;
  requirements?: string;
  registration_info?: string;
  created_at?: Date;
  updated_at?: Date;
}

class ExtensionSection extends Model<ExtensionSectionAttributes> implements ExtensionSectionAttributes {
  public id!: number;
  public slug!: string;
  public title!: string;
  public introduction!: string;
  public description!: string;
  public banner_url!: string;
  public is_enabled!: boolean;
  public schedule!: string;
  public location!: string;
  public contact_info!: string;
  public requirements!: string;
  public registration_info!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

ExtensionSection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banner_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    registration_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'extension_sections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ExtensionSection;
