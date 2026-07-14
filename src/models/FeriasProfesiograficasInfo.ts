import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FeriasProfesiograficasInfoAttributes {
  id: number;
  titulo_principal: string;
  descripcion_final: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface FeriasProfesiograficasInfoCreationAttributes extends Optional<FeriasProfesiograficasInfoAttributes, 'id' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class FeriasProfesiograficasInfo extends Model<FeriasProfesiograficasInfoAttributes, FeriasProfesiograficasInfoCreationAttributes> implements FeriasProfesiograficasInfoAttributes {
  public id!: number;
  public titulo_principal!: string;
  public descripcion_final!: string;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

FeriasProfesiograficasInfo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo_principal: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Cursos de Ferias Profesiográficas'
  },
  descripcion_final: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'ferias_profesiograficas_info',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default FeriasProfesiograficasInfo;
