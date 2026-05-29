import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DOCENTE_ROL = 'ca0f5ec0-745a-424d-b988-a7ed1e707758';
const ESTUDIANTE_ROL = '7d23f18d-1609-4374-986c-c07c06ce4732';

async function crearUsuario(email: string, password: string, nombre: string, rolId: string) {
  console.log(`Intentando crear usuario: ${email}`);
  
  // 1. Sign up en auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre: nombre,
      }
    }
  });

  if (authError) {
    console.error(`❌ Error al crear usuario ${email} en auth:`, authError.message);
    return;
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error(`❌ No se obtuvo el ID de usuario para ${email}`);
    return;
  }

  console.log(`✅ Usuario auth creado: ${email} (ID: ${userId})`);

  // 2. Esperar 2 segundos para dar tiempo a que el trigger de Supabase cree la fila en public.usuarios (si existe)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Actualizar la tabla public.usuarios con el rol correcto y nombre
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ 
      rol_id: rolId,
      nombre: nombre 
    })
    .eq('id', userId);

  if (updateError) {
    // Si falla el update, tal vez el trigger no existe y tenemos que hacer un insert
    console.log(`⚠️ Falló el update, intentando insert para ${email}...`);
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        email: email,
        nombre: nombre,
        rol_id: rolId,
        es_invitado: false,
        activo: true
      });
      
    if (insertError) {
      console.error(`❌ Error al insertar usuario en public.usuarios:`, insertError.message);
    } else {
      console.log(`✅ Usuario ${email} registrado en public.usuarios correctamente.`);
    }
  } else {
    console.log(`✅ Usuario ${email} actualizado en public.usuarios correctamente.`);
  }
}

async function main() {
  await crearUsuario('docente@anatomia.com', '12345678', 'Profesor Anatomía', DOCENTE_ROL);
  await crearUsuario('estudiante@anatomia.com', '12345678', 'Estudiante Prueba', ESTUDIANTE_ROL);
  console.log('🎉 Proceso de creación terminado.');
}

main();
