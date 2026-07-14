import { connectDatabase } from '../src/config/database';
import { Area, Categorias } from '../src/models/associations';

describe('Documentos - Categorías duplicadas', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  test('Permite crear dos categorías con el mismo Nombre en la misma área', async () => {
    const areaName = `TestArea_${Date.now()}`;
    const categoryName = `CategoriaDuplicada_${Date.now()}`;

    // Crear área temporal
    const area = await Area.create({ Nombre: areaName });
    expect(area).toBeDefined();
    expect(area.ID_Area).toBeGreaterThan(0);

    // Crear primera categoría
    const cat1 = await Categorias.create({ Nombre: categoryName, ID_Area: area.ID_Area });
    expect(cat1).toBeDefined();
    expect(cat1.ID_Categorias).toBeGreaterThan(0);

    // Crear segunda categoría con el mismo nombre
    const cat2 = await Categorias.create({ Nombre: categoryName, ID_Area: area.ID_Area });
    expect(cat2).toBeDefined();
    expect(cat2.ID_Categorias).toBeGreaterThan(0);

    // Deben ser registros distintos
    expect(cat1.ID_Categorias).not.toEqual(cat2.ID_Categorias);

    // Cleanup
    await Categorias.destroy({ where: { ID_Area: area.ID_Area, Nombre: categoryName } });
    await Area.destroy({ where: { ID_Area: area.ID_Area } });
  });
});
