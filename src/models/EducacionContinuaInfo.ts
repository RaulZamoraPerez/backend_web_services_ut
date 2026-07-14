import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EducacionContinuaInfoAttributes {
  id: number;
  titulo_principal: string;
  descripcion_final: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface EducacionContinuaInfoCreationAttributes extends Optional<EducacionContinuaInfoAttributes, 'id' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class EducacionContinuaInfo extends Model<EducacionContinuaInfoAttributes, EducacionContinuaInfoCreationAttributes> implements EducacionContinuaInfoAttributes {
  public id!: number;
  public titulo_principal!: string;
  public descripcion_final!: string;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

EducacionContinuaInfo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo_principal: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Cursos de Educación Continua'
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
  tableName: 'educacion_continua_info',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default EducacionContinuaInfo;
