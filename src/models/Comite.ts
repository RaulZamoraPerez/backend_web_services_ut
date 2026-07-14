
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ComiteAttributes {
    id: number;
    slug: string;
    titulo: string;
    descripcion?: string;
    activo: boolean;
}

interface ComiteCreationAttributes extends Optional<ComiteAttributes, 'id' | 'activo'> { }

class Comite extends Model<ComiteAttributes, ComiteCreationAttributes> implements ComiteAttributes {
    public id!: number;
    public slug!: string;
    public titulo!: string;
    public descripcion?: string;
    public activo!: boolean;
    
    // Asociaciones
    public readonly documentos?: any[];
}

Comite.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        slug: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        sequelize,
        tableName: 'comites',
        modelName: 'Comite',
        timestamps: true,
    }
);

export default Comite;
