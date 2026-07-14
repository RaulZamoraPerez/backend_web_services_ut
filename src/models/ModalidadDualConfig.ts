import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ModalidadDualConfig extends Model {
  public id!: number;
  public titulo!: string | null;
  public descripcion!: string | null;
  public periodo!: string;
  public videoUrl!: string | null;
  public convocatoriaImg!: string | null;
  public carreras!: any;
  public requisitos!: any;
  public faqs!: any;
}

ModalidadDualConfig.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Modalidad Dual'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Un modelo educativo de vanguardia que combina formación académica con experiencia real en empresas líderes del sector productivo.'
  },
  periodo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Sep - Dic 2026 – 6.º cuatrimestre'
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  convocatoriaImg: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  carreras: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  requisitos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  faqs: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  sequelize,
  tableName: 'modalidad_dual_configs',
  timestamps: true,
});

export default ModalidadDualConfig;
