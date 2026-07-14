import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface BecaSectionAttributes {
    id?: number;
    module: 'becas' | 'estadia';
    type: 'header' | 'requirements' | 'documents' | 'links' | 'platform' | 'results' | 'banner' | 'avisos' | 'convocatoria' | 'footer' | 'repository' | 'infographics';
    title: string;
    data: any; // JSON data specific to each section type
    order: number;
    active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

class BecaSection extends Model<BecaSectionAttributes> implements BecaSectionAttributes {
    public id!: number;
    public module!: 'becas' | 'estadia';
    public type!: 'header' | 'requirements' | 'documents' | 'links' | 'platform' | 'results' | 'banner' | 'avisos' | 'convocatoria' | 'footer' | 'repository' | 'infographics';
    public title!: string;
    public data!: any;
    public order!: number;
    public active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

BecaSection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        module: {
            type: DataTypes.ENUM('becas', 'estadia'),
            allowNull: false,
            defaultValue: 'becas',
        },
        type: {
            type: DataTypes.ENUM('header', 'requirements', 'documents', 'links', 'platform', 'results', 'banner', 'avisos', 'convocatoria', 'footer', 'repository', 'infographics'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            get() {
                const rawValue = this.getDataValue('data');
                if (typeof rawValue === 'string') {
                    try {
                        return JSON.parse(rawValue);
                    } catch (e) {
                        console.error('Error parsing JSON in BecaSection.data getter:', e);
                        return {};
                    }
                }
                return rawValue || {};
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
        tableName: 'beca_sections',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_order',
                fields: ['order'],
            },
            {
                name: 'idx_type',
                fields: ['type'],
            },
        ],
    }
);

export default BecaSection;
