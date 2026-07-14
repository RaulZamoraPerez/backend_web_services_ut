import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface SitemapItem {
    label: string;
    href: string;
    isExternal?: boolean;
}

export interface SitemapCategoryAttributes {
    id?: number;
    title: string;
    icon: string;
    items: SitemapItem[];
    order: number;
    active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

class SitemapCategory extends Model<SitemapCategoryAttributes> implements SitemapCategoryAttributes {
    public id!: number;
    public title!: string;
    public icon!: string;
    public items!: SitemapItem[];
    public order!: number;
    public active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

SitemapCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Home',
        },
        items: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            get() {
                const rawValue = this.getDataValue('items');
                if (typeof rawValue === 'string') {
                    try {
                        return JSON.parse(rawValue);
                    } catch (e) {
                        console.error('Error parsing JSON in SitemapCategory.items getter:', e);
                        return [];
                    }
                }
                return rawValue || [];
            }
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'sitemap_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_sitemap_order',
                fields: ['order'],
            },
        ],
    }
);

export default SitemapCategory;
