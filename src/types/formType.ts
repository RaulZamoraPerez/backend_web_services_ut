import { UploadedFile } from "express-fileupload";


export type FormType = {
  nombre: string;
  matricula: string;
  email: string;
  telefono: string;
  carrera: string;
  nivel?: string;
  entrega?: string;
  'documentos-solicitados'?: string;
  referencia?: string;
  'numero-seguro'?: string;
  attachment?: UploadedFile | UploadedFile[];
  comentarios: string;

}