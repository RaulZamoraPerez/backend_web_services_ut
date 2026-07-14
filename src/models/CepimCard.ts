import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CepimCard extends Model {
    public id!: number;
    public titulo!: string;
    public descripcion!: string;
    public icono!: string;
}

CepimCard.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    icono: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Star',
    }
}, {
    sequelize,
    tableName: 'cepim_cards',
    timestamps: true,
});

export default CepimCard;
