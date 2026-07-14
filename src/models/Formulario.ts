import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface FormularioAttributes {
  id: number;
  contenido: {
    titulo: string;
    descripcion?: string;
    campos?: any[];
    archivo?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para creación
interface FormularioCreationAttributes extends Optional<FormularioAttributes, 'id'> {}

// Definir el modelo
class Formulario extends Model<FormularioAttributes, FormularioCreationAttributes> implements FormularioAttributes {
  public id!: number;
  public contenido!: {
    titulo: string;
    descripcion?: string;
    campos?: any[];
    archivo?: string;
  };
  
  // Timestamps automáticos
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Formulario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contenido: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El contenido no puede estar vacío'
        },
        isValidFormulario(value: any) {
          if (!value || typeof value !== 'object') {
            throw new Error('El contenido debe ser un objeto válido');
          }
          if (!value.titulo || typeof value.titulo !== 'string' || value.titulo.trim().length === 0) {
            throw new Error('El título es requerido y debe ser una cadena no vacía');
          }
          if (value.titulo.length > 200) {
            throw new Error('El título no puede tener más de 200 caracteres');
          }
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'Formulario',
    tableName: 'formularios',
    timestamps: true,
    underscored: true, // usa snake_case para campos de DB
    indexes: [
      {
        fields: ['created_at']
      }
    ]
  }
);

export default Formulario;
export { FormularioAttributes, FormularioCreationAttributes };