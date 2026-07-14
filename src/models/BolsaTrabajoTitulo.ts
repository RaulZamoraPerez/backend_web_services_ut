import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class BolsaTrabajoTitulo extends Model {
    public id!: number;
    public titulo!: string;
    public descripcion!: string;
}

BolsaTrabajoTitulo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Bolsa de Trabajo',
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'Explora las últimas vacantes de empleo y oportunidades profesionales de nuestra bolsa de trabajo.',
    },
}, {
    sequelize,
    tableName: 'bolsa_trabajo_titulo',
    timestamps: true,
});

export default BolsaTrabajoTitulo;
