import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PublicacionUttecamAttributes {
  id: number;
  titulo: string;
  edicion?: string;
  autor: string;
  descripcion?: string;
  categoria: string;
  portada?: string;
  pdf: string;
  paginas?: number;
  isbn?: string;
  print_isbn?: string;
  e_isbn?: string;
  editorial?: string;
  idioma?: string;
  materia?: string;
  volumen?: string;
  paginas_impresion?: number;
  paginas_copia?: number;
  audio_disponible?: boolean;
  tipo_acceso?: string;
  limite_descargas_dia?: string;
  limite_descargas_mes?: string;
  tabla_contenidos?: string;
  fecha_publicacion?: string;
  permitir_descarga: boolean;
  vistas: number;
  descargas: number;
  calificacion: number;
  total_votos: number;
  orden: number;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface PublicacionUttecamCreationAttributes
  extends Optional<
    PublicacionUttecamAttributes,
    | 'id'
    | 'edicion'
    | 'descripcion'
    | 'portada'
    | 'paginas'
    | 'isbn'
    | 'print_isbn'
    | 'e_isbn'
    | 'editorial'
    | 'idioma'
    | 'materia'
    | 'volumen'
    | 'paginas_impresion'
    | 'paginas_copia'
    | 'audio_disponible'
    | 'tipo_acceso'
    | 'limite_descargas_dia'
    | 'limite_descargas_mes'
    | 'tabla_contenidos'
    | 'fecha_publicacion'
    | 'permitir_descarga'
    | 'vistas'
    | 'descargas'
    | 'calificacion'
    | 'total_votos'
    | 'orden'
    | 'activo'
  > {}

class PublicacionUttecam
  extends Model<PublicacionUttecamAttributes, PublicacionUttecamCreationAttributes>
  implements PublicacionUttecamAttributes
{
  public id!: number;
  public titulo!: string;
  public edicion!: string;
  public autor!: string;
  public descripcion!: string;
  public categoria!: string;
  public portada!: string;
  public pdf!: string;
  public paginas!: number;
  public isbn!: string;
  public print_isbn!: string;
  public e_isbn!: string;
  public editorial!: string;
  public idioma!: string;
  public materia!: string;
  public volumen!: string;
  public paginas_impresion!: number;
  public paginas_copia!: number;
  public audio_disponible!: boolean;
  public tipo_acceso!: string;
  public limite_descargas_dia!: string;
  public limite_descargas_mes!: string;
  public tabla_contenidos!: string;
  public fecha_publicacion!: string;
  public permitir_descarga!: boolean;
  public vistas!: number;
  public descargas!: number;
  public calificacion!: number;
  public total_votos!: number;
  public orden!: number;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PublicacionUttecam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    edicion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '1ª Edición',
    },
    autor: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'UTTECAM',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Libro',
    },
    portada: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    pdf: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    paginas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isbn: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    print_isbn: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    e_isbn: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    editorial: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'Sello Editorial UTTECAM',
    },
    idioma: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Español',
    },
    materia: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    volumen: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '1',
    },
    paginas_impresion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    paginas_copia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    audio_disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    tipo_acceso: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'MUPO - Multiusuario',
    },
    limite_descargas_dia: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Ilimitado',
    },
    limite_descargas_mes: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Ilimitado',
    },
    tabla_contenidos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_publicacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    permitir_descarga: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vistas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    descargas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    calificacion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 5.0,
    },
    total_votos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion',
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion',
    },
  },
  {
    sequelize,
    tableName: 'publicaciones_uttecam',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default PublicacionUttecam;
