import ModalidadDualConfig from './ModalidadDualConfig';
import Area from './Area';
import Categorias from './Categorias';
import Archivos from './Archivos';
import PortalEstudiantes from './PortalEstudiantes';
import ExtensionSection from './ExtensionSection';
import ExtensionItem from './ExtensionItem';
import Comite from './Comite';
import ComiteCategory from './ComiteCategory';
import DocumentoComite from './DocumentoComite';
import { ProcesoAdmision } from './ProcesoAdmision';
import { PasoAdmision } from './PasoAdmision';


// ProcesoAdmision relations
ProcesoAdmision.hasMany(PasoAdmision, {
  foreignKey: 'procesoAdmisionId',
  as: 'pasos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PasoAdmision.belongsTo(ProcesoAdmision, {
  foreignKey: 'procesoAdmisionId',
  as: 'proceso',
  onUpdate: 'CASCADE',
});

// Definir las relaciones entre modelos

// AREA ──→ CATEGORIAS (One-to-Many)
// Un área puede tener muchas categorías
Area.hasMany(Categorias, {
  foreignKey: 'ID_Area',
  as: 'categorias',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // No permitir eliminar áreas que tengan categorías
});

// Una categoría pertenece a un área
Categorias.belongsTo(Area, {
  foreignKey: 'ID_Area',
  as: 'area',
  onUpdate: 'CASCADE'
});

// CATEGORIAS ──→ ARCHIVOS (One-to-Many)
// Una categoría puede tener muchos archivos
Categorias.hasMany(Archivos, {
  foreignKey: 'ID_Categorias',
  as: 'archivos',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // No permitir eliminar categorías que tengan archivos
});

// Un archivo pertenece a una categoría
Archivos.belongsTo(Categorias, {
  foreignKey: 'ID_Categorias',
  as: 'categoria',
  onUpdate: 'CASCADE'
});

// ExtensionSection ──→ ExtensionItem (One-to-Many)
ExtensionSection.hasMany(ExtensionItem, {
  foreignKey: 'section_id',
  as: 'items',
  onDelete: 'CASCADE'
});

ExtensionItem.belongsTo(ExtensionSection, {
  foreignKey: 'section_id',
  as: 'section'
});

import NormatividadCategory from './NormatividadCategory';
import NormatividadDocument from './NormatividadDocument';
import ProgramaDesarrolloCategory from './ProgramaDesarrolloCategory';
import ProgramaDesarrollo from './ProgramaDesarrollo';
import EducacionContinuaCategoria from './EducacionContinuaCategoria';
import EducacionContinuaDocumento from './EducacionContinuaDocumento';
import EducacionContinuaBanner from './EducacionContinuaBanner';
import FeriasProfesiograficasCategoria from './FeriasProfesiograficasCategoria';
import FeriasProfesiograficasDocumento from './FeriasProfesiograficasDocumento';
import FeriasProfesiograficasBanner from './FeriasProfesiograficasBanner';
import PromocionInstitucionalCategoria from './PromocionInstitucionalCategoria';
import PromocionInstitucionalDocumento from './PromocionInstitucionalDocumento';
import PromocionInstitucionalBanner from './PromocionInstitucionalBanner';
import VisitasGuiadasCategoria from './VisitasGuiadasCategoria';
import VisitasGuiadasDocumento from './VisitasGuiadasDocumento';
import VisitasGuiadasBanner from './VisitasGuiadasBanner';
import PortalDocenteCategoria from './PortalDocenteCategoria';
import PortalDocenteDocumento from './PortalDocenteDocumento';

// Normatividad relations
NormatividadCategory.hasMany(NormatividadDocument, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

NormatividadDocument.belongsTo(NormatividadCategory, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// ProgramaDesarrollo relations
ProgramaDesarrolloCategory.hasMany(ProgramaDesarrollo, {
  foreignKey: 'categoria_id',
  as: 'programas',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ProgramaDesarrollo.belongsTo(ProgramaDesarrolloCategory, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// COMITES relations
Comite.hasMany(ComiteCategory, {
  foreignKey: 'comiteId',
  as: 'categorias',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ComiteCategory.belongsTo(Comite, {
  foreignKey: 'comiteId',
  as: 'comite'
});

ComiteCategory.hasMany(DocumentoComite, {
  foreignKey: 'categoriaId',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

DocumentoComite.belongsTo(ComiteCategory, {
  foreignKey: 'categoriaId',
  as: 'categoria'
});

// EducacionContinua relations
EducacionContinuaCategoria.hasMany(EducacionContinuaDocumento, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

EducacionContinuaDocumento.belongsTo(EducacionContinuaCategoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// FeriasProfesiograficas relations
FeriasProfesiograficasCategoria.hasMany(FeriasProfesiograficasDocumento, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

FeriasProfesiograficasDocumento.belongsTo(FeriasProfesiograficasCategoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// PromocionInstitucional relations
PromocionInstitucionalCategoria.hasMany(PromocionInstitucionalDocumento, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PromocionInstitucionalDocumento.belongsTo(PromocionInstitucionalCategoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// VisitasGuiadas relations
VisitasGuiadasCategoria.hasMany(VisitasGuiadasDocumento, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

VisitasGuiadasDocumento.belongsTo(VisitasGuiadasCategoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// Portal Docente relations
PortalDocenteCategoria.hasMany(PortalDocenteDocumento, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PortalDocenteDocumento.belongsTo(PortalDocenteCategoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// Exportar todos los modelos con sus relaciones configuradas
export {
  Area,
  Categorias,
  Archivos,
  PortalEstudiantes,
  ExtensionSection,
  ExtensionItem,
  NormatividadCategory,
  NormatividadDocument,
  ProgramaDesarrolloCategory,
  ProgramaDesarrollo,
  Comite,
  ComiteCategory,
  DocumentoComite,
  ProcesoAdmision,
  PasoAdmision,
  EducacionContinuaCategoria,
  EducacionContinuaDocumento,
  EducacionContinuaBanner,
  FeriasProfesiograficasCategoria,
  FeriasProfesiograficasDocumento,
  FeriasProfesiograficasBanner,
  PromocionInstitucionalCategoria,
  PromocionInstitucionalDocumento,
  PromocionInstitucionalBanner,
  VisitasGuiadasCategoria,
  VisitasGuiadasDocumento,
  VisitasGuiadasBanner,
  PortalDocenteCategoria,
  PortalDocenteDocumento
};

// También exportar individualmente para facilitar importaciones
export default {
  Area,
  Categorias,
  Archivos,
  PortalEstudiantes,
  ExtensionSection,
  ExtensionItem,
  NormatividadCategory,
  NormatividadDocument,
  ProgramaDesarrolloCategory,
  ProgramaDesarrollo,
  Comite,
  ComiteCategory,
  DocumentoComite,
  ProcesoAdmision,
  PasoAdmision,
  EducacionContinuaCategoria,
  EducacionContinuaDocumento,
  EducacionContinuaBanner,
  FeriasProfesiograficasCategoria,
  FeriasProfesiograficasDocumento,
  FeriasProfesiograficasBanner,
  PromocionInstitucionalCategoria,
  PromocionInstitucionalDocumento,
  PromocionInstitucionalBanner,
  VisitasGuiadasCategoria,
  VisitasGuiadasDocumento,
  VisitasGuiadasBanner,
  PortalDocenteCategoria,
  PortalDocenteDocumento
};


// Fin de associations.ts
export { default as VisitasGuiadasVideo } from './VisitasGuiadasVideo';