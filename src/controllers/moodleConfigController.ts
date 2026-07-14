import { NextFunction, Request, Response } from "express";
import MoodleConfig from "../models/MoodleConfig";

export const getMoodleConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let config = await MoodleConfig.findOne({ where: { activo: true } });
    if (!config) {
      return res.json({ url: '' });
    }
    res.json(config);
  } catch (error) {
    next(error);
  }
};

export const updateMoodleConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Datos inválidos", details: "El campo url es requerido" });
    }

    let config = await MoodleConfig.findOne({ where: { activo: true } });

    if (!config) {
      config = await MoodleConfig.create({ url, activo: true });
    } else {
      await config.update({ url });
    }

    res.json({ message: "URL actualizada exitosamente", config });
  } catch (error) {
    next(error);
  }
};
