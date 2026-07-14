import { CustomError } from "../../errors/CustomErrors";
import { FormularioConfig } from "../../models/FormularioConfig";

// ==================== INTERFACES ====================

interface InfoPrincipalData {
  titulo: string;
  subtitulo: string;
  descripcion?: string;
  tiempoEntrega: string;
  costo?: string;
  linkPago?: string;
}

interface InfoPrincipalResponse {
  tipo: string;
  titulo: string;
  subtitulo: string;
  descripcion: string | null;
  tiempoEntrega: string;
  costo: string | null;
  linkPago: string | null;
  activo: boolean;
}

interface ListaResponse {
  tipo: string;
  items: string[];
  total: number;
}

interface ItemResponse {
  tipo: string;
  index: number;
  item: string;
}

// ==================== SERVICE ====================

export class FormularioConfigService {

  private getArrayField(field: any): any[] {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // ==================== INFO PRINCIPAL ====================

  /**
   * POST - Crear información principal de un formulario
   */
  async createInfo(tipo: string, data: InfoPrincipalData): Promise<InfoPrincipalResponse> {
    try {
      const tipoNormalizado = tipo.toLowerCase().trim();

      // Verificar si ya existe
      const existente = await FormularioConfig.findOne({ where: { tipo: tipoNormalizado } });
      if (existente) {
        throw CustomError.badRequest(`Ya existe configuración para el formulario '${tipo}'. Use PUT para actualizar.`);
      }

      // Crear registro con info principal
      const registro = await FormularioConfig.create({
        tipo: tipoNormalizado,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        descripcion: data.descripcion || null,
        tiempoEntrega: data.tiempoEntrega,
        costo: data.costo || null,
        linkPago: data.linkPago || 'https://rl.puebla.gob.mx/',
        requisitos: [],
        pasos: [],
        documentos: [],
        activo: true
      });

      return this.formatInfoResponse(registro);

    } catch (error: any) {
      if (error instanceof CustomError) throw error;

      // Manejar error de duplicado de MySQL
      if (error.code === 'ER_DUP_ENTRY' || error.original?.code === 'ER_DUP_ENTRY') {
        throw CustomError.badRequest(`Ya existe configuración para el formulario '${tipo}'. Use PUT /${tipo}/info para actualizar.`);
      }

      console.error("Error en createInfo:", error);
      throw CustomError.internalServer("Error al crear la información principal.");
    }
  }

  /**
   * GET - Obtener información principal de un formulario
   */
  async getInfo(tipo: string): Promise<InfoPrincipalResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      return this.formatInfoResponse(registro);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en getInfo:", error);
      throw CustomError.internalServer("Error al obtener la información principal.");
    }
  }

  /**
   * PUT - Actualizar información principal de un formulario
   */
  async updateInfo(tipo: string, data: Partial<InfoPrincipalData>): Promise<InfoPrincipalResponse> {
    try {
      const registro = await this.findByTipo(tipo);

      if (data.titulo !== undefined) registro.titulo = data.titulo;
      if (data.subtitulo !== undefined) registro.subtitulo = data.subtitulo;
      if (data.descripcion !== undefined) registro.descripcion = data.descripcion;
      if (data.tiempoEntrega !== undefined) registro.tiempoEntrega = data.tiempoEntrega;
      if (data.costo !== undefined) registro.costo = data.costo;
      if (data.linkPago !== undefined) registro.linkPago = data.linkPago;

      await registro.save();
      return this.formatInfoResponse(registro);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en updateInfo:", error);
      throw CustomError.internalServer("Error al actualizar la información principal.");
    }
  }

  /**
   * DELETE - Eliminar configuración completa de un formulario
   */
  async deleteInfo(tipo: string): Promise<{ message: string }> {
    try {
      const registro = await this.findByTipo(tipo);
      await registro.destroy();
      return { message: `Configuración del formulario '${tipo}' eliminada exitosamente.` };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en deleteInfo:", error);
      throw CustomError.internalServer("Error al eliminar la configuración.");
    }
  }

  // ==================== REQUISITOS ====================

  /**
   * POST - Agregar un requisito
   */
  async addRequisito(tipo: string, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const current = this.getArrayField(registro.requisitos);
      const requisitos = [...current, item];
      registro.requisitos = requisitos;
      await registro.save();

      return {
        tipo: registro.tipo,
        index: requisitos.length - 1,
        item
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en addRequisito:", error);
      throw CustomError.internalServer("Error al agregar el requisito.");
    }
  }

  /**
   * GET - Obtener todos los requisitos
   */
  async getRequisitos(tipo: string): Promise<ListaResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const items = this.getArrayField(registro.requisitos);
      return {
        tipo: registro.tipo,
        items: items,
        total: items.length
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en getRequisitos:", error);
      throw CustomError.internalServer("Error al obtener los requisitos.");
    }
  }

  /**
   * PUT - Actualizar un requisito por índice
   */
  async updateRequisito(tipo: string, index: number, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const requisitos = [...this.getArrayField(registro.requisitos)];

      if (index < 0 || index >= requisitos.length) {
        throw CustomError.notFound(`No existe requisito en el índice ${index}.`);
      }

      requisitos[index] = item;
      registro.requisitos = requisitos;
      registro.changed('requisitos', true);
      await registro.save();

      return { tipo: registro.tipo, index, item };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en updateRequisito:", error);
      throw CustomError.internalServer("Error al actualizar el requisito.");
    }
  }

  /**
   * DELETE - Eliminar un requisito por índice
   */
  async deleteRequisito(tipo: string, index: number): Promise<{ message: string }> {
    try {
      const registro = await this.findByTipo(tipo);
      const requisitos = [...this.getArrayField(registro.requisitos)];

      if (index < 0 || index >= requisitos.length) {
        throw CustomError.notFound(`No existe requisito en el índice ${index}.`);
      }

      requisitos.splice(index, 1);
      registro.requisitos = requisitos;
      registro.changed('requisitos', true);
      await registro.save();

      return { message: "Requisito eliminado exitosamente." };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en deleteRequisito:", error);
      throw CustomError.internalServer("Error al eliminar el requisito.");
    }
  }

  // ==================== PASOS ====================

  /**
   * POST - Agregar un paso
   */
  async addPaso(tipo: string, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const pasos = [...this.getArrayField(registro.pasos), item];
      registro.pasos = pasos;
      await registro.save();

      return {
        tipo: registro.tipo,
        index: pasos.length - 1,
        item
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en addPaso:", error);
      throw CustomError.internalServer("Error al agregar el paso.");
    }
  }

  /**
   * GET - Obtener todos los pasos
   */
  async getPasos(tipo: string): Promise<ListaResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const items = this.getArrayField(registro.pasos);
      return {
        tipo: registro.tipo,
        items: items,
        total: items.length
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en getPasos:", error);
      throw CustomError.internalServer("Error al obtener los pasos.");
    }
  }

  /**
   * PUT - Actualizar un paso por índice
   */
  async updatePaso(tipo: string, index: number, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const pasos = [...this.getArrayField(registro.pasos)];

      if (index < 0 || index >= pasos.length) {
        throw CustomError.notFound(`No existe paso en el índice ${index}.`);
      }

      pasos[index] = item;
      registro.pasos = pasos;
      registro.changed('pasos', true);
      await registro.save();

      return { tipo: registro.tipo, index, item };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en updatePaso:", error);
      throw CustomError.internalServer("Error al actualizar el paso.");
    }
  }

  /**
   * DELETE - Eliminar un paso por índice
   */
  async deletePaso(tipo: string, index: number): Promise<{ message: string }> {
    try {
      const registro = await this.findByTipo(tipo);
      const pasos = [...this.getArrayField(registro.pasos)];

      if (index < 0 || index >= pasos.length) {
        throw CustomError.notFound(`No existe paso en el índice ${index}.`);
      }

      pasos.splice(index, 1);
      registro.pasos = pasos;
      registro.changed('pasos', true);
      await registro.save();

      return { message: "Paso eliminado exitosamente." };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en deletePaso:", error);
      throw CustomError.internalServer("Error al eliminar el paso.");
    }
  }

  // ==================== DOCUMENTOS ====================

  /**
   * POST - Agregar un documento
   */
  async addDocumento(tipo: string, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const documentos = [...this.getArrayField(registro.documentos), item];
      registro.documentos = documentos;
      await registro.save();

      return {
        tipo: registro.tipo,
        index: documentos.length - 1,
        item
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en addDocumento:", error);
      throw CustomError.internalServer("Error al agregar el documento.");
    }
  }

  /**
   * GET - Obtener todos los documentos
   */
  async getDocumentos(tipo: string): Promise<ListaResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const items = this.getArrayField(registro.documentos);
      return {
        tipo: registro.tipo,
        items: items,
        total: items.length
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en getDocumentos:", error);
      throw CustomError.internalServer("Error al obtener los documentos.");
    }
  }

  /**
   * PUT - Actualizar un documento por índice
   */
  async updateDocumento(tipo: string, index: number, item: string): Promise<ItemResponse> {
    try {
      const registro = await this.findByTipo(tipo);
      const documentos = [...this.getArrayField(registro.documentos)];

      if (index < 0 || index >= documentos.length) {
        throw CustomError.notFound(`No existe documento en el índice ${index}.`);
      }

      documentos[index] = item;
      registro.documentos = documentos;
      registro.changed('documentos', true);
      await registro.save();

      return { tipo: registro.tipo, index, item };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en updateDocumento:", error);
      throw CustomError.internalServer("Error al actualizar el documento.");
    }
  }

  /**
   * DELETE - Eliminar un documento por índice
   */
  async deleteDocumento(tipo: string, index: number): Promise<{ message: string }> {
    try {
      const registro = await this.findByTipo(tipo);
      const documentos = [...this.getArrayField(registro.documentos)];

      if (index < 0 || index >= documentos.length) {
        throw CustomError.notFound(`No existe documento en el índice ${index}.`);
      }

      documentos.splice(index, 1);
      registro.documentos = documentos;
      registro.changed('documentos', true);
      await registro.save();

      return { message: "Documento eliminado exitosamente." };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en deleteDocumento:", error);
      throw CustomError.internalServer("Error al eliminar el documento.");
    }
  }

  // ==================== HELPERS ====================

  /**
   * Busca un formulario por tipo
   */
  private async findByTipo(tipo: string): Promise<FormularioConfig> {
    const tipoNormalizado = tipo.toLowerCase().trim();
    const registro = await FormularioConfig.findOne({ where: { tipo: tipoNormalizado } });

    if (!registro) {
      throw CustomError.notFound(`No existe configuración para el formulario '${tipo}'.`);
    }

    return registro;
  }

  /**
   * Formatea la respuesta de información principal
   */
  private formatInfoResponse(registro: FormularioConfig): InfoPrincipalResponse {
    return {
      tipo: registro.tipo,
      titulo: registro.titulo,
      subtitulo: registro.subtitulo,
      descripcion: registro.descripcion,
      tiempoEntrega: registro.tiempoEntrega,
      costo: registro.costo,
      linkPago: registro.linkPago,
      activo: registro.activo
    };
  }
}
