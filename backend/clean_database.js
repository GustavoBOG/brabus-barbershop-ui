import { supabase } from './src/config/supabase.js';

// ─────────────────────────────────────────────────────────────────────────────
//  SERVICIOS POR DEFECTO (para restaurar si se usa --reset-services)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SERVICES = [
  { name: 'Corte caballero',  price: 12.00, category: 'cut'   },
  { name: 'Corte niño',       price:  8.00, category: 'cut'   },
  { name: 'Arreglo barba',    price:  8.00, category: 'beard' },
  { name: 'Diseño de cejas',  price:  5.00, category: 'other' },
  { name: 'Limpieza facial',  price: 15.00, category: 'other' },
  { name: 'Coloracion/tinte', price: 25.00, category: 'other' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const ALL_ROWS = { neq: ['id', '00000000-0000-0000-0000-000000000000'] };

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    all:           args.includes('--all'),
    dataOnly:      args.includes('--data-only'),
    resetServices: args.includes('--reset-services'),
    help:          args.includes('--help') || args.includes('-h'),
  };
}

function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║          BRABUS BARBERSHOP — Limpieza de BD              ║
╚══════════════════════════════════════════════════════════╝

  Uso: node clean_database.js [opción]

  Opciones:
    --all              Limpia TODO: registros, turnos y servicios
                       (los servicios se restauran a los valores por defecto)

    --data-only        Limpia SOLO datos transaccionales:
                       work_records + shifts  (NO toca servicios ni perfiles)

    --reset-services   Limpia SOLO la tabla de servicios y la restaura
                       con los valores por defecto

    --help, -h         Muestra esta ayuda

  ⚠️  Los perfiles (profiles) NUNCA se eliminan automaticamente,
      ya que están vinculados a las cuentas de autenticación.

  Ejemplos:
    node clean_database.js --data-only
    node clean_database.js --all
    node clean_database.js --reset-services
`);
}

async function deleteAllRows(tableName, label) {
  console.log(`  → Eliminando ${label}...`);
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw new Error(`[${tableName}] ${error.message}`);
  console.log(`    ✓ ${label} eliminados`);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PASOS DE LIMPIEZA
// ─────────────────────────────────────────────────────────────────────────────

async function cleanTransactionalData() {
  console.log('\n📋 Limpiando datos transaccionales...');
  // Orden importante: primero work_records (FK → shifts)
  await deleteAllRows('work_records', 'Registros de trabajo (work_records)');
  await deleteAllRows('shifts',       'Turnos (shifts)');
}

async function cleanAndRestoreServices() {
  console.log('\n💈 Restaurando servicios...');
  await deleteAllRows('services', 'Servicios actuales');

  console.log('  → Insertando servicios por defecto...');
  const { error } = await supabase.from('services').insert(DEFAULT_SERVICES);
  if (error) throw new Error(`[services insert] ${error.message}`);
  console.log(`    ✓ ${DEFAULT_SERVICES.length} servicios insertados`);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function cleanDatabase() {
  const opts = parseArgs();

  if (opts.help || (!opts.all && !opts.dataOnly && !opts.resetServices)) {
    printHelp();
    process.exit(0);
  }

  console.log('\n🧹 Iniciando limpieza de la base de datos — Brabus Barbershop');
  console.log('─'.repeat(56));

  try {
    if (opts.all) {
      // ── Modo completo ──────────────────────────────────────────
      console.log('\n⚡ MODO: Limpieza total (--all)');
      await cleanTransactionalData();
      await cleanAndRestoreServices();

    } else if (opts.dataOnly) {
      // ── Solo datos ─────────────────────────────────────────────
      console.log('\n⚡ MODO: Solo datos transaccionales (--data-only)');
      await cleanTransactionalData();

    } else if (opts.resetServices) {
      // ── Solo servicios ─────────────────────────────────────────
      console.log('\n⚡ MODO: Restaurar servicios (--reset-services)');
      await cleanAndRestoreServices();
    }

    // ── Resumen final ──────────────────────────────────────────
    console.log('\n' + '─'.repeat(56));
    console.log('✨ LIMPIEZA COMPLETADA CON ÉXITO ✨');

    if (opts.all || opts.dataOnly) {
      console.log('  • work_records → vacía');
      console.log('  • shifts       → vacía');
    }
    if (opts.all || opts.resetServices) {
      console.log(`  • services     → ${DEFAULT_SERVICES.length} servicios por defecto`);
    }
    console.log('  • profiles     → sin cambios (protegido)');
    console.log('─'.repeat(56) + '\n');

  } catch (err) {
    console.error('\n❌ ERROR DURANTE LA LIMPIEZA:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

cleanDatabase();
