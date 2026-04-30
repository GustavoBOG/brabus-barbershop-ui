import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Usamos la DATABASE_URL del archivo .env
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runSeeds() {
  console.log('\n🚀 Iniciando reconstrucción y limpieza de la base de datos...\n');

  try {
    await client.connect();
    console.log('✅ Conexión establecida con PostgreSQL.');

    // ─── 1. MIGRACIÓN DE ESTRUCTURA ──────────────────────────────────────────
    console.log('🏗️  Actualizando estructura de tablas (Migrations)...');
    
    const migrationSQL = `
      -- Añadir nuevas columnas a la tabla profiles
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 0.50;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

      -- Crear tabla de horarios si no existe
      CREATE TABLE IF NOT EXISTS staff_schedules (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          barber_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
          day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
          shift_start time NOT NULL,
          shift_end time NOT NULL,
          created_at timestamp with time zone DEFAULT now(),
          UNIQUE(barber_id, day_of_week)
      );
    `;
    
    await client.query(migrationSQL);
    console.log('   - Columnas commission_rate e is_active verificadas.');
    console.log('   - Tabla staff_schedules verificada.');

    // ─── 2. LIMPIEZA DE DATOS ────────────────────────────────────────────────
    console.log('🧹 Limpiando registros de transacciones antiguas...');
    
    await client.query('DELETE FROM work_records');
    await client.query('DELETE FROM shifts');
    await client.query('DELETE FROM services');
    
    console.log('   - work_records: vaciado.');
    console.log('   - shifts: vaciado.');
    console.log('   - services: vaciado.');

    // ─── 3. SEED DE SERVICIOS ───────────────────────────────────────────────
    console.log('🌱 Insertando servicios base...');
    
    const services = [
      ['Corte caballero', 12.00, 'cut'],
      ['Corte niño', 8.00, 'cut'],
      ['Arreglo barba', 8.00, 'beard'],
      ['Diseño de cejas', 5.00, 'other'],
      ['Limpieza facial', 15.00, 'other'],
      ['Coloracion/tinte', 25.00, 'other'],
    ];

    for (const [name, price, category] of services) {
      await client.query(
        'INSERT INTO services (name, price, category) VALUES ($1, $2, $3)',
        [name, price, category]
      );
    }
    
    console.log(`   - ${services.length} servicios insertados correctamente.`);

    console.log('\n✨ PROCESO COMPLETADO CON ÉXITO ✨');
    console.log('La base de datos está limpia y con la nueva estructura lista para usar.');

  } catch (err) {
    console.error('\n❌ ERROR CRÍTICO DURANTE EL SEED:', err.message);
  } finally {
    await client.end();
    process.exit();
  }
}

runSeeds();
