import { supabase } from './src/config/supabase.js';

async function seedServices() {
  console.log('🌱 Iniciando actualización de servicios...');

  try {
    // 1. Eliminar servicios existentes
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) throw deleteError;

    // 2. Insertar nuevos servicios
    const services = [
      { name: 'Corte caballero', price: 12.00, category: 'cut' },
      { name: 'Corte niño', price: 8.00, category: 'cut' },
      { name: 'Arreglo barba', price: 8.00, category: 'beard' },
      { name: 'Diseño de cejas', price: 5.00, category: 'other' },
      { name: 'Limpieza facial', price: 15.00, category: 'other' },
      { name: 'Coloracion/tinte', price: 25.00, category: 'other' },
    ];

    const { error: insertError } = await supabase
      .from('services')
      .insert(services);

    if (insertError) throw insertError;

    console.log('✅ Servicios actualizados correctamente.');
  } catch (error) {
    console.error('❌ Error al actualizar servicios:', error.message);
  } finally {
    process.exit();
  }
}

seedServices();
