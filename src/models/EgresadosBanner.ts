import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EgresadosBanner extends Model {
    public id!: number;
    public titulo!: string;
    public imagen!: string;
    public estado!: boolean;
}

EgresadosBanner.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'egresados_banners',
    timestamps: true,
});

export default EgresadosBanner;
