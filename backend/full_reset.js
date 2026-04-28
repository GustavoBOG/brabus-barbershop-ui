import { supabase } from './src/config/supabase.js';

async function fullReset() {
  console.log('🧹 Iniciando limpieza total de la base de datos...');

  try {
    // 1. Eliminar registros de trabajo (Work Records)
    console.log('─ Eliminando registros de trabajo...');
    const { error: errorWork } = await supabase
      .from('work_records')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errorWork) throw errorWork;

    // 2. Eliminar turnos (Shifts)
    console.log('─ Eliminando historial de turnos...');
    const { error: errorShifts } = await supabase
      .from('shifts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errorShifts) throw errorShifts;

    // 3. Eliminar servicios actuales
    console.log('─ Limpiando servicios antiguos...');
    const { error: errorServices } = await supabase
      .from('services')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errorServices) throw errorServices;

    // 4. Insertar los nuevos servicios solicitados
    console.log('─ Insertando nuevos servicios actualizados...');
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

    console.log('\n✨ BASE DE DATOS RESETEADA CON ÉXITO ✨');
    console.log('Todos los registros antiguos han sido eliminados y los nuevos servicios están listos.');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE EL RESET:', error.message);
  } finally {
    process.exit();
  }
}

fullReset();
