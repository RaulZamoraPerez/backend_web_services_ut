import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface BecaCategoryAttributes {
    id: number;
    name: string;
    slug: string;
    icon_url?: string;
    color?: string;
    order: number;
    active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface BecaCategoryCreationAttributes extends Optional<BecaCategoryAttributes, 'id' | 'order' | 'active'> { }

class BecaCategory extends Model<BecaCategoryAttributes, BecaCategoryCreationAttributes> implements BecaCategoryAttributes {
    public id!: number;
    public name!: string;
    public slug!: string;
    public icon_url!: string;
    public color!: string;
    public order!: number;
    public active!: boolean;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

BecaCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        icon_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(64),
            allowNull: true,
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
        tableName: 'beca_categories',
        modelName: 'BecaCategory',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_beca_cat_order',
                fields: ['order'],
            },
            {
                name: 'idx_beca_cat_slug',
                fields: ['slug'],
            },
        ],
    }
);

export default BecaCategory;
