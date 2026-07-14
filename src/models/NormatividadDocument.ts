import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import NormatividadCategory from './NormatividadCategory';

interface NormatividadDocumentAttributes {
    id: number;
    categoriaId: number;
    titulo: string;
    archivo: string; // path or URL
    archivo_name?: string | null;
}

interface NormatividadDocumentCreationAttributes extends Optional<NormatividadDocumentAttributes, 'id' | 'archivo_name'> { }

class NormatividadDocument extends Model<NormatividadDocumentAttributes, NormatividadDocumentCreationAttributes> implements NormatividadDocumentAttributes {
    public id!: number;
    public categoriaId!: number;
    public titulo!: string;
    public archivo!: string;
    public archivo_name?: string | null;
}

NormatividadDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: NormatividadCategory,
                key: 'id'
            },
            field: 'categoria_id'
        },
        titulo: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        archivo: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        archivo_name: {
            type: DataTypes.STRING(512),
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        tableName: 'normatividad_documents',
        modelName: 'NormatividadDocument',
        timestamps: true,
    }
);

export default NormatividadDocument;
