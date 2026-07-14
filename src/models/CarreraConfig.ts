import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class CarreraConfig extends Model {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CarreraConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Programas Educativos',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Únete a nuestra comunidad educativa hoy mismo y descubre todo lo que nuestros programas educativos tienen para ofrecerte.',
    },
  },
  {
    sequelize,
    tableName: 'carrera_config',
    timestamps: true,
  }
);
