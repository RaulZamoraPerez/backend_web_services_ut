import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BannerAttributes { id: number; titulo: string; descripcion: string; imagen: string; activo: boolean; }
interface BannerCreationAttributes extends Optional<BannerAttributes, 'id' | 'activo'> {}

class SeminarioCafeBanner extends Model<BannerAttributes, BannerCreationAttributes> implements BannerAttributes {
  public id!: number; public titulo!: string; public descripcion!: string; public imagen!: string; public activo!: boolean;
}
SeminarioCafeBanner.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  imagen: { type: DataTypes.STRING(255), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, tableName: 'seminario_cafe_banners', timestamps: true });
export default SeminarioCafeBanner;
