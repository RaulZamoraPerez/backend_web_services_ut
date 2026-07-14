import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo simplificado
interface NosotrosContentAttributes {
  id: number;
  politicaIntegral: {
    imageSrc: string;
    title: string;
    description: string;
  };
  objetivoIntegral: string;
  vision: {
    imageSrc: string;
    title: string;
    description: string;
  };
  mision: {
    imageSrc: string;
    title: string;
    description: string;
  };
  valores: {
    imageSrc: string;
    title: string;
    description: string[];
  };
  noDiscriminacion: string[][];
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

// Atributos opcionales para creación
interface NosotrosContentCreationAttributes extends Optional<NosotrosContentAttributes, 'id'> { }

// Definir el modelo simplificado
class NosotrosContent extends Model<NosotrosContentAttributes, NosotrosContentCreationAttributes>
  implements NosotrosContentAttributes {
  public id!: number;
  public politicaIntegral!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public objetivoIntegral!: string;
  public vision!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public mision!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public valores!: {
    imageSrc: string;
    title: string;
    description: string[];
  };
  public noDiscriminacion!: string[][];

  // Timestamps automáticos
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

// Inicializar el modelo
NosotrosContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    politicaIntegral: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: null,
        title: 'Política Integral',
        description: ''
      }
    },
    vision: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: null,
        title: 'Visión',
        description: ''
      }
    },
    mision: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: null,
        title: 'Misión',
        description: ''
      }
    },
    valores: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: null,
        title: 'Valores',
        description: []
      }
    },
    objetivoIntegral: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    noDiscriminacion: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  },
  {
    sequelize,
    modelName: 'NosotrosContent',
    tableName: 'nosotros_content',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

// Exportar el modelo
export default NosotrosContent;