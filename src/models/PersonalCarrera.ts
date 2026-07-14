import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

export class PersonalCarrera extends Model {
  public id!: string;
  public nombre!: string;
  public correo!: string;
  public carreras!: string[]; // Array de IDs o nombres de carreras
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PersonalCarrera.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    carreras: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array de nombres de carreras asignadas',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'personal_carreras',
    sequelize,
  }
);
