import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo
interface OrganigramaAttributes {
  id: number;
  key?: string;
  parent_id?: number | null;
  expanded: boolean;
  type: string;
  image: string;
  name: string;
  title: string;
  text?: string;
  order_position: number;
}

// Atributos opcionales para creación
interface OrganigramaCreationAttributes extends Optional<OrganigramaAttributes, 'id'> {}

// Definir el modelo
class Organigrama extends Model<OrganigramaAttributes, OrganigramaCreationAttributes> implements OrganigramaAttributes {
  public id!: number;
  public key?: string;
  public parent_id?: number | null;
  public expanded!: boolean;
  public type!: string;
  public image!: string;
  public name!: string;
  public title!: string;
  public text?: string;
  public order_position!: number;
}

// Inicializar el modelo
Organigrama.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'organigrama',
        key: 'id'
      }
    },
    expanded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'person',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La imagen es requerida'
        }
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        }
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título/cargo no puede estar vacío'
        }
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Organigrama',
    tableName: 'organigrama',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['parent_id']
      },
      {
        fields: ['order_position']
      }
    ]
  }
);

export default Organigrama;
export { OrganigramaAttributes, OrganigramaCreationAttributes };
