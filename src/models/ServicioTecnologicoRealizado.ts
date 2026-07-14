import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ServicioTecnologicoRealizadoAttributes {
  id: number;
  titulo: string;
  archivo: string;
  fecha_realizacion?: Date;
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServicioTecnologicoRealizadoCreationAttributes 
  extends Optional<ServicioTecnologicoRealizadoAttributes, 'id' | 'fecha_realizacion' | 'orden' | 'activo' | 'createdAt' | 'updatedAt'> {}

class ServicioTecnologicoRealizado extends Model<ServicioTecnologicoRealizadoAttributes, ServicioTecnologicoRealizadoCreationAttributes> 
  implements ServicioTecnologicoRealizadoAttributes {
  public id!: number;
  public titulo!: string;
  public archivo!: string;
  public fecha_realizacion?: Date;
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServicioTecnologicoRealizado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título es requerido' }
      }
    },
    archivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El archivo PDF es requerido' }
      }
    },
    fecha_realizacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ServicioTecnologicoRealizado',
    tableName: 'servicios_tecnologicos_realizados',
    timestamps: true,
  }
);

export default ServicioTecnologicoRealizado;
