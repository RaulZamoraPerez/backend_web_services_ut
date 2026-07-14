import Area from '../models/Area';
import Categorias from '../models/Categorias';

export const ensureExtensionAreas = async () => {
  try {
    const areas = [
      { ID_Area: 7, Nombre: 'PIT' },
      { ID_Area: 9, Nombre: 'Gacetas' },
      { ID_Area: 10, Nombre: 'Promoción Institucional' }
    ];

    for (const a of areas) {
      const [instance, created] = await Area.findOrCreate({ where: { ID_Area: a.ID_Area }, defaults: a });
      if (created) console.log(`✅ Area creada: ${a.Nombre} (ID: ${a.ID_Area})`);
      else {
        // Ensure correct name
        if (instance.Nombre !== a.Nombre) {
          await instance.update({ Nombre: a.Nombre });
          console.log(`🔄 Area actualizada: ${a.Nombre} (ID: ${a.ID_Area})`);
        } else {
          console.log(`ℹ️ Area ya existente: ${a.Nombre} (ID: ${a.ID_Area})`);
        }
      }
    }

    const defaultCategories = [
      { Nombre: 'Gacetas', ID_Area: 9 },
      { Nombre: 'Promoción Institucional', ID_Area: 10 }
    ];

    for (const c of defaultCategories) {
      const [cat, created] = await Categorias.findOrCreate({ where: { Nombre: c.Nombre, ID_Area: c.ID_Area }, defaults: c });
      if (created) console.log(`✅ Categoria creada: ${c.Nombre} (Area ${c.ID_Area})`);
      else console.log(`ℹ️ Categoria ya existente: ${c.Nombre} (Area ${c.ID_Area})`);
    }

    console.log('✅ Verificación de áreas/categorías de Extensión finalizada');
  } catch (error) {
    console.error('❌ Error al verificar/crear areas de Extensión:', error);
  }
};
