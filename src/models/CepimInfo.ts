import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CepimInfo extends Model {
    public id!: number;
    public titulo_principal!: string;
    public descripcion!: string;
    public imagen!: string;
    public header_badge!: string;
    public header_titulo!: string;
    public footer_titulo!: string;
    public footer_descripcion!: string;
    public footer_ubicacion!: string;
    public footer_horario!: string;
}

CepimInfo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo_principal: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    header_badge: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    header_titulo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    footer_titulo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    footer_descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    footer_ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    footer_horario: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'cepim_info',
    timestamps: true,
});

export default CepimInfo;
