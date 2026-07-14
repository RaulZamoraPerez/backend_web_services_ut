import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ModeloEducativoAttributes {
  id: number;
  titulo_principal: string;
  descripcion_principal: string;
  titulo_seccion: string;
  descripcion_seccion: string;
  imagen_url: string;
  caracteristicas: any; // JSON array
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ModeloEducativoCreationAttributes extends Optional<ModeloEducativoAttributes, 'id'> {}

class ModeloEducativo extends Model<ModeloEducativoAttributes, ModeloEducativoCreationAttributes> implements ModeloEducativoAttributes {
  public id!: number;
  public titulo_principal!: string;
  public descripcion_principal!: string;
  public titulo_seccion!: string;
  public descripcion_seccion!: string;
  public imagen_url!: string;
  public caracteristicas!: any;
  public activo!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ModeloEducativo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo_principal: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'Modelos educativos'
    },
    descripcion_principal: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Conoce nuestro enfoque educativo diseñado para formar profesionistas competitivos.'
    },
    titulo_seccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'Modelo Educativo'
    },
    descripcion_seccion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'El modelo educativo representa una evolución hacia la educación del futuro...'
    },
    imagen_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '/uploads/PE2025/MODELO EDUCATIVO.jpeg'
    },
    caracteristicas: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        {
          number: 1,
          title: "Educación híbrida y flexible",
          description: "Combinación de modalidades presenciales y virtuales con horarios adaptables.",
        },
        {
          number: 2,
          title: "Tecnologías emergentes",
          description: "Nuevas incorporaciones en pedagogías de enseñanza tecnológica.",
        },
        {
          number: 3,
          title: "Enfoque en sostenibilidad",
          description: "Formación con conciencia ambiental y responsabilidad social.",
        },
        {
          number: 4,
          title: "Internacionalización",
          description: "Programas de intercambio y colaboración con universidades extranjeras.",
        },
      ]
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ModeloEducativo',
    tableName: 'modelos_educativos',
    timestamps: true,
  }
);

export default ModeloEducativo;
