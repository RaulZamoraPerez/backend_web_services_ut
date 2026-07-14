import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EstadiaDocumentoAttributes {
  ID: number;
  Nombre: string;
  Descripcion?: string | null;
  Ruta_Documento: string;
  Fecha_Subida: Date;
  Tipo?: string | null;
}

interface EstadiaDocumentoCreationAttributes extends Optional<EstadiaDocumentoAttributes, 'ID' | 'Fecha_Subida' | 'Descripcion' | 'Tipo'> {}

class EstadiaDocumento extends Model<EstadiaDocumentoAttributes, EstadiaDocumentoCreationAttributes> implements EstadiaDocumentoAttributes {
  public ID!: number;
  public Nombre!: string;
  public Descripcion?: string | null;
  public Ruta_Documento!: string;
  public Fecha_Subida!: Date;
  public Tipo?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EstadiaDocumento.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es requerido' }
      }
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Ruta_Documento: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Fecha_Subida: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'EstadiaDocumento',
    tableName: 'estadia_documentos',
    timestamps: false,
  }
);

export default EstadiaDocumento;
