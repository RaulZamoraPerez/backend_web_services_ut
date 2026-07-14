import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CepimInfografia extends Model {
    public id!: number;
    public titulo!: string;
    public imagen_url!: string;
}

CepimInfografia.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'cepim_infografias',
    timestamps: true,
});

export default CepimInfografia;
