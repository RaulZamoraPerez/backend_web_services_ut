import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NormatividadCategoryAttributes {
    id: number;
    key: string; // short id like 'leyes'
    titulo: string;
}

interface NormatividadCategoryCreationAttributes extends Optional<NormatividadCategoryAttributes, 'id'> { }

class NormatividadCategory extends Model<NormatividadCategoryAttributes, NormatividadCategoryCreationAttributes> implements NormatividadCategoryAttributes {
    public id!: number;
    public key!: string;
    public titulo!: string;
}

NormatividadCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'normatividad_categories',
        modelName: 'NormatividadCategory',
        timestamps: true,
    }
);

export default NormatividadCategory;
