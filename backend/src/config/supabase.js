import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'PONER_AQUI_TU_SERVICE_ROLE_KEY') {
  console.warn('⚠️ ADVERTENCIA: No se han configurado correctamente las credenciales de Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
