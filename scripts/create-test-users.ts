import dotenv from 'dotenv';
import path from 'path';

// Cargar configuración de .env
dotenv.config({ path: path.join(__dirname, '../.env') });

import sequelize from '../src/config/database';
import User from '../src/models/User';
import { hashPassword } from '../src/middleware/auth';

async function main() {
  try {
    console.log('Conectándose a la base de datos...');
    await sequelize.authenticate();
    console.log('Sincronizando modelos...');
    await sequelize.sync();

    // Contraseña por defecto para pruebas
    const defaultPassword = 'Password123!';

    const testUsers = [
      {
        username: 'adminpro',
        email: 'adminpro@uttecam.edu.mx',
        password: defaultPassword,
        role: 'admin_pro',
        isActive: true,
      },
      {
        username: 'adminnormal',
        email: 'adminnormal@uttecam.edu.mx',
        password: defaultPassword,
        role: 'admin',
        isActive: true,
      },
      {
        username: 'escolares',
        email: 'escolares@uttecam.edu.mx',
        password: defaultPassword,
        role: 'servicios_escolares',
        isActive: true,
      },
    ];

    console.log('\nCreando usuarios de prueba...');
    for (const userData of testUsers) {
      // Buscar si ya existe por email o username
      const existingUser = await User.findOne({
        where: {
          email: userData.email,
        },
      });

      if (existingUser) {
        // Actualizar contraseña, rol y resetear bloqueo
        existingUser.password = userData.password;
        existingUser.role = userData.role;
        existingUser.isActive = userData.isActive;
        existingUser.failedLoginAttempts = 0;
        existingUser.lockedUntil = null as any; // Cast to avoid strict ts complaints
        await existingUser.save();
        console.log(`✅ Usuario actualizado y desbloqueado: ${userData.username} (${userData.role})`);
      } else {
        await User.create({
          ...userData,
          failedLoginAttempts: 0,
          lockedUntil: null as any
        });
        console.log(`✅ Usuario creado: ${userData.username} (${userData.role})`);
      }
    }

    console.log('\n🎉 ¡Usuarios creados/actualizados exitosamente!');
    console.log('--------------------------------------------------');
    console.log('Credenciales para probar:');
    console.log('1. Admin Pro (Super Admin - Ve todo):');
    console.log('   - Usuario: adminpro');
    console.log('   - Contraseña: Password123!');
    console.log('2. Admin Normal (Ve todo excepto Servicios Escolares):');
    console.log('   - Usuario: adminnormal');
    console.log('   - Contraseña: Password123!');
    console.log('3. Servicios Escolares (Solo ve Servicios Escolares y Dashboard):');
    console.log('   - Usuario: escolares');
    console.log('   - Contraseña: Password123!');
    console.log('--------------------------------------------------\n');

  } catch (error) {
    console.error('❌ Error al crear los usuarios de prueba:', error);
  } finally {
    await sequelize.close();
  }
}

main();
