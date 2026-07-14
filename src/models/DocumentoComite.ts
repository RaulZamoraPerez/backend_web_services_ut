import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Comite from './Comite';

interface DocumentoComiteAttributes {
    id: number;
    comiteId: number;
    categoriaId: number | null;
    titulo: string;
    archivo: string;
    enlaceAdicional?: string;
    activo: boolean;
}

interface DocumentoComiteCreationAttributes extends Optional<DocumentoComiteAttributes, 'id' | 'activo' | 'categoriaId' | 'enlaceAdicional'> { }

class DocumentoComite extends Model<DocumentoComiteAttributes, DocumentoComiteCreationAttributes> implements DocumentoComiteAttributes {
    public id!: number;
    public comiteId!: number;
    public categoriaId!: number | null;
    public titulo!: string;
    public archivo!: string;
    public enlaceAdicional?: string;
    public activo!: boolean;
}

DocumentoComite.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comiteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Comite,
                key: 'id'
            },
            field: 'comite_id'
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'comite_categorias',
                key: 'id'
            },
            field: 'categoria_id'
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        archivo: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        enlaceAdicional: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },

    {
        sequelize,
        tableName: 'documentos_comite',
        modelName: 'DocumentoComite',
        timestamps: true,
    }
);

// Define relations
Comite.hasMany(DocumentoComite, { foreignKey: 'comiteId', as: 'documentos' });
DocumentoComite.belongsTo(Comite, { foreignKey: 'comiteId', as: 'comite' });

export default DocumentoComite;
