import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface ArchivosAttributes {
  ID: number;
  Nombre: string;
  Fecha_Subida: Date;
  Descripcion?: string | null;
  Ruta_Documento: string;
  ID_Categorias: number;
}

// Atributos opcionales para creación
interface ArchivosCreationAttributes extends Optional<ArchivosAttributes, 'ID' | 'Fecha_Subida' | 'Descripcion'> {}

// Definir el modelo
class Archivos extends Model<ArchivosAttributes, ArchivosCreationAttributes> implements ArchivosAttributes {
  public ID!: number;
  public Nombre!: string;
  public Fecha_Subida!: Date;
  public Descripcion?: string | null;
  public Ruta_Documento!: string;
  public ID_Categorias!: number;

  // Timestamps (aunque no se usan en esta tabla)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Archivos.init(
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
        notEmpty: {
          msg: 'El nombre del archivo no puede estar vacío'
        },
        len: {
          args: [1, 255],
          msg: 'El nombre debe tener entre 1 y 255 caracteres'
        }
      }
    },
    Fecha_Subida: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'La descripción no puede tener más de 1000 caracteres'
        }
      }
    },
    Ruta_Documento: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La ruta del documento no puede estar vacía'
        },
        len: {
          args: [1, 500],
          msg: 'La ruta debe tener entre 1 y 500 caracteres'
        }
      }
    },
    ID_Categorias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'ID_Categorias'
      },
      validate: {
        isInt: {
          msg: 'ID_Categorias debe ser un número entero'
        },
        min: {
          args: [1],
          msg: 'ID_Categorias debe ser mayor a 0'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Archivos',
    tableName: 'archivos',
    timestamps: false, // No hay campos createdAt/updatedAt en la tabla
    underscored: false,
    indexes: [
      {
        name: 'FK_Categoria',
        fields: ['ID_Categorias']
      }
    ]
  }
);

export default Archivos;
export { 
  ArchivosAttributes, 
  ArchivosCreationAttributes 
};