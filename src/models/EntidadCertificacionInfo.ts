import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntidadCertificacionInfo extends Model {
    public id!: number;
    public titulo_principal!: string;
    public descripcion!: string;
    public imagen!: string;
    public header_badge!: string;
    public header_titulo!: string;
    public header_descripcion!: string;
    public footer_titulo!: string;
    public footer_descripcion!: string;
    public footer_ubicacion!: string;
    public footer_horario!: string;
    public card1_titulo!: string;
    public card1_descripcion!: string;
    public card2_titulo!: string;
    public card2_descripcion!: string;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EntidadCertificacionInfo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        header_descripcion: {
            type: DataTypes.TEXT,
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
        },
        card1_titulo: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: 'Validez Oficial',
        },
        card1_descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Certificados con reconocimiento nacional por la SEP.',
        },
        card2_titulo: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: 'Excelencia Laboral',
        },
        card2_descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Eleva tu competitividad en el mercado actual.',
        },
    },
    {
        sequelize,
        tableName: 'entidad_certificacion_info',
        timestamps: true,
    }
);

export default EntidadCertificacionInfo;
