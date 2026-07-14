
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgramaDesarrolloAttributes {
    id: number;
    titulo: string;
    descripcion: string;
    archivo: string;
    activo: boolean;
    categoria_id: number | null;
}

interface ProgramaDesarrolloCreationAttributes extends Optional<ProgramaDesarrolloAttributes, 'id' | 'activo' | 'categoria_id'> { }

class ProgramaDesarrollo extends Model<ProgramaDesarrolloAttributes, ProgramaDesarrolloCreationAttributes>
    implements ProgramaDesarrolloAttributes {
    public id!: number;
    public titulo!: string;
    public descripcion!: string;
    public archivo!: string;
    public activo!: boolean;
    public categoria_id!: number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProgramaDesarrollo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        archivo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'programa_desarrollo_categorias',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'programas_desarrollo',
    }
);

export default ProgramaDesarrollo;
