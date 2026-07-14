import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ConvocatoriaTituloBanner from "../../models/ConvocatoriaTituloBanner";

export class ConvocatoriaTituloBannerController {

  public create = async (req: Request, res: Response) => {
    try {
      const { titulo } = req.body;
      const files = req.files as any;
      const file = files?.imagen;

      if (!titulo) {
        return res.status(400).json({ error: "El título es requerido" });
      }

      if (!file) {
        return res.status(400).json({ error: "La imagen es requerida" });
      }

      const uploadedFile = Array.isArray(file) ? file[0] : file;

      const uploadPath = path.join(__dirname, "../../../uploads/convocatoria-titulo/banners");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const fileName = `${Date.now()}-${uploadedFile.name}`;
      const filePath = path.join(uploadPath, fileName);

      await uploadedFile.mv(filePath);

      const maxOrdenBanner = await ConvocatoriaTituloBanner.findOne({
        order: [['orden', 'DESC']],
      });
      const orden = maxOrdenBanner ? maxOrdenBanner.orden + 1 : 1;

      const newBanner = await ConvocatoriaTituloBanner.create({
        titulo,
        imagen: fileName,
        orden,
        activo: true,
      });

      return res.status(201).json({
        message: "Banner creado correctamente",
        data: newBanner
      });
    } catch (error: any) {
      console.error("Error al crear banner:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const { activo } = req.query;
      const whereClause = activo !== undefined ? { activo: activo === 'true' } : {};

      const banners = await ConvocatoriaTituloBanner.findAll({
        where: whereClause,
        order: [['orden', 'ASC']],
      });
      return res.status(200).json({ data: banners });
    } catch (error: any) {
      return res.status(500).json({ error: "Error al obtener banners" });
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo } = req.body;
      const files = req.files as any;
      const file = files?.imagen;

      const banner = await ConvocatoriaTituloBanner.findByPk(id);
      if (!banner) {
        return res.status(404).json({ error: "Banner no encontrado" });
      }

      if (titulo) {
        banner.titulo = titulo;
      }

      if (file) {
        const uploadedFile = Array.isArray(file) ? file[0] : file;

        const uploadPath = path.join(__dirname, "../../../uploads/convocatoria-titulo/banners");
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        const fileName = `${Date.now()}-${uploadedFile.name}`;
        const filePath = path.join(uploadPath, fileName);
        await uploadedFile.mv(filePath);

        // Delete old image
        const oldFilePath = path.join(uploadPath, banner.imagen);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }

        banner.imagen = fileName;
      }

      await banner.save();

      return res.status(200).json({
        message: "Banner actualizado correctamente",
        data: banner
      });
    } catch (error: any) {
      console.error("Error al actualizar banner:", error);
      return res.status(500).json({ error: "Error al actualizar banner" });
    }
  }

  public updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      const banner = await ConvocatoriaTituloBanner.findByPk(id);
      if (!banner) {
        return res.status(404).json({ error: "Banner no encontrado" });
      }

      banner.activo = activo;
      await banner.save();

      return res.status(200).json({ message: "Estado actualizado", data: banner });
    } catch (error: any) {
      return res.status(500).json({ error: "Error al actualizar banner" });
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const banner = await ConvocatoriaTituloBanner.findByPk(id);

      if (!banner) {
        return res.status(404).json({ error: "Banner no encontrado" });
      }

      const filePath = path.join(__dirname, "../../../uploads/convocatoria-titulo/banners", banner.imagen);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await banner.destroy();
      return res.status(200).json({ message: "Banner eliminado correctamente" });
    } catch (error: any) {
      return res.status(500).json({ error: "Error al eliminar banner" });
    }
  }

  public getImage = (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../../uploads/convocatoria-titulo/banners", filename);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
  }
}
