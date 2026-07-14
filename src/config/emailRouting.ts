// ==========================================
// TIPOS
// ==========================================
export type Area = 'TSU' | 'LIC' | 'ING';

export interface Career {
  area: Area;
  nombre: string;
}

export interface StaffMember {
  nombre: string;
  email: string;
  carreras: Career[];
}

export interface CareerEmailMapping {
  area: Area;
  carrera: string;
  email: string;
  nombre: string;
}

// ==========================================
// PERSONAL Y SUS CARRERAS (DRY)
// ==========================================
const STAFF_MEMBERS: StaffMember[] = [
  {
    nombre: 'Matilde Alonso Paz',
    email: 'malonsopaz@personal.uttecam.edu.mx',
    carreras: [
      { area: 'TSU', nombre: 'Mercadotecnia' },
      { area: 'TSU', nombre: 'Desarrollo de Negocios área Mercadotecnia' },
      { area: 'TSU', nombre: 'Procesos Alimentarios' },
      { area: 'TSU', nombre: 'Tecnología de Alimentos' },
      { area: 'LIC', nombre: 'Innovación de Negocios y Mercadotecnia' },
      { area: 'ING', nombre: 'Procesos Bioalimentarios' },
    ]
  },
  {
    nombre: 'Carla Patricia Palacios Ramírez',
    email: 'c.p.palacios@personal.uttecam.edu.mx',
    carreras: [
      { area: 'TSU', nombre: 'Procesos Industriales área Manufactura' },
      { area: 'TSU', nombre: 'Procesos Industriales área Automotriz' },
      { area: 'TSU', nombre: 'Procesos Productivos' },
      { area: 'TSU', nombre: 'Automotriz' },
      { area: 'TSU', nombre: 'Desarrollo de software Multiplataforma' },
      { area: 'TSU', nombre: 'Infraestructura de Redes Digitales' },
      { area: 'ING', nombre: 'Ingeniería Industrial' },
    ]
  },
  {
    nombre: 'Gloria Rodríguez Lara',
    email: 'g.rodriguez@personal.uttecam.edu.mx',
    carreras: [
      { area: 'TSU', nombre: 'Admón. Área Formulación y Evaluación de Proyectos' },
      { area: 'TSU', nombre: 'Emprendimiento, Formulación y Evaluación de Proyectos' },
      { area: 'TSU', nombre: 'Admón. área Gestión del Capital Humano' },
      { area: 'TSU', nombre: 'Mantenimiento área Industrial' },
      { area: 'LIC', nombre: 'Gestión del Capital Humano' },
      { area: 'LIC', nombre: 'Gestión de Negocios y proyectos' },
      { area: 'ING', nombre: 'Mantenimiento Industrial' },
    ]
  },
  {
    nombre: 'Elizabeth Cruz Flores',
    email: 'e.cruz@personal.uttecam.edu.mx',
    carreras: [
      { area: 'TSU', nombre: 'Contaduría' },
      { area: 'LIC', nombre: 'Contaduría' },
      { area: 'ING', nombre: 'Desarrollo y Gestión de Software' },
      { area: 'ING', nombre: 'Redes Inteligentes y Ciberseguridad' },
    ]
  },
  {
    nombre: 'Dulce María Sánchez Doroteo',
    email: 'd.m.sanchez.doroteo@personal.uttecam.edu.mx',
    carreras: [
      { area: 'TSU', nombre: 'Agricultura Sustentable y Protegida' },
      { area: 'TSU', nombre: 'Mecatrónica área Automatización' },
      { area: 'ING', nombre: 'Agricultura Sustentable y Protegida' },
      { area: 'ING', nombre: 'Mecatrónica' },
    ]
  },
];

// ==========================================
// MAPEO PLANO (generado automáticamente)
// ==========================================
export const EMAIL_ROUTING: CareerEmailMapping[] = STAFF_MEMBERS.flatMap(staff =>
  staff.carreras.map(career => ({
    area: career.area,
    carrera: career.nombre,
    email: staff.email,
    nombre: staff.nombre
  }))
);

// ==========================================
// CONFIGURACIÓN DE EMAILS
// ==========================================

// Email administrativo que SIEMPRE recibe copia
export const ADMIN_EMAIL = 'serviciosescolares@uttecam.edu.mx';

// Email por defecto si no se encuentra la combinación área+carrera
export const DEFAULT_EMAIL = 'serviciosescolares@uttecam.edu.mx';

// Exportar también el personal para otros usos (reportes, etc.)
export { STAFF_MEMBERS };
