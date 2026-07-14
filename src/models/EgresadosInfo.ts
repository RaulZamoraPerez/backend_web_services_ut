import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EgresadosInfo extends Model {
    public id!: number;
    public titulo_principal!: string;
}

EgresadosInfo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo_principal: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Encuentro de Egresados',
    },
}, {
    sequelize,
    tableName: 'egresados_info',
    timestamps: true,
});

export default EgresadosInfo;
