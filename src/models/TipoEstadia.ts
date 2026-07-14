import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TipoEstadiaAttributes {
  ID: number;
  Nombre: string;
  Descripcion?: string;
  Orden: number;
  Activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TipoEstadiaCreationAttributes extends Optional<TipoEstadiaAttributes, 'ID' | 'Descripcion' | 'Activo' | 'Orden'> {}

class TipoEstadia extends Model<TipoEstadiaAttributes, TipoEstadiaCreationAttributes> implements TipoEstadiaAttributes {
  public ID!: number;
  public Nombre!: string;
  public Descripcion?: string;
  public Orden!: number;
  public Activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TipoEstadia.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      // unique: true, // Comentado para evitar error ER_TOO_MANY_KEYS
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'tipos_estadia',
    timestamps: true,
  }
);

export default TipoEstadia;
