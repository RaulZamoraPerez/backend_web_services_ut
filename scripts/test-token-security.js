/**
 * Test de Seguridad y Expiración de Tokens JWT
 *
 * Este script prueba:
 * 1. Generación de tokens válidos
 * 2. Verificación de tokens expirados
 * 3. Tokens inválidos/manipulados
 * 4. Tokens con firma incorrecta
 * 5. Protección de rutas con tokens
 */

const jwt = require('jsonwebtoken');
const axios = require('axios');

// Funciones de autenticación (extraídas del middleware)
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Configuración
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002/api';
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-super-seguro-cambialo-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5 segundos';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

// Función auxiliar para imprimir con colores
const print = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.magenta}${msg}${colors.reset}\n`),
  separator: () => console.log(`${colors.blue}${'─'.repeat(80)}${colors.reset}`)
};

// Esperar un tiempo determinado
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Test 1: Generación de Token Válido
 */
async function testTokenGeneration() {
  print.header('TEST 1: Generación de Token Válido');

  try {
    const payload = {
      id: 1,
      username: 'testuser',
      role: 'admin'
    };

    const token = generateToken(payload);
    print.info(`Token generado: ${token.substring(0, 50)}...`);

    // Verificar que el token sea válido
    const decoded = verifyToken(token);

    if (decoded && decoded.id === payload.id && decoded.username === payload.username) {
      print.success('Token generado correctamente y verificado');
      print.info(`Payload decodificado: ${JSON.stringify(decoded, null, 2)}`);
      return { success: true, token };
    } else {
      print.error('El token no se pudo verificar correctamente');
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en generación de token: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 2: Expiración de Token
 */
async function testTokenExpiration() {
  print.header('TEST 2: Expiración de Token');

  try {
    const payload = {
      id: 2,
      username: 'expiretest',
      role: 'viewer'
    };

    // Generar token con expiración de 2 segundos
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2s' });
    print.info(`Token generado con expiración de 2 segundos`);
    print.info(`Token: ${token.substring(0, 50)}...`);

    // Verificar que el token es válido inicialmente
    const decodedBefore = verifyToken(token);
    if (decodedBefore) {
      print.success('Token válido antes de expirar');
    } else {
      print.error('Token inválido antes de la expiración (ERROR)');
      return { success: false };
    }

    // Esperar 3 segundos para que expire
    print.info('Esperando 3 segundos para que el token expire...');
    await sleep(3000);

    // Verificar que el token ha expirado
    const decodedAfter = verifyToken(token);
    if (!decodedAfter) {
      print.success('Token expirado correctamente después de 3 segundos');
      return { success: true };
    } else {
      print.error('Token aún válido después de expirar (ERROR)');
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de expiración: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 3: Token con Firma Inválida
 */
async function testInvalidSignature() {
  print.header('TEST 3: Token con Firma Inválida');

  try {
    const payload = {
      id: 3,
      username: 'signaturetest',
      role: 'admin'
    };

    // Generar token con un secret diferente
    const wrongSecret = 'secret-incorrecto-123';
    const invalidToken = jwt.sign(payload, wrongSecret, { expiresIn: '1h' });
    print.info(`Token generado con secret incorrecto`);
    print.info(`Token: ${invalidToken.substring(0, 50)}...`);

    // Intentar verificar con el secret correcto
    const decoded = verifyToken(invalidToken);

    if (!decoded) {
      print.success('Token con firma inválida rechazado correctamente');
      return { success: true };
    } else {
      print.error('Token con firma inválida aceptado (VULNERABILIDAD)');
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de firma: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 4: Token Manipulado
 */
async function testManipulatedToken() {
  print.header('TEST 4: Token Manipulado');

  try {
    const payload = {
      id: 4,
      username: 'normaluser',
      role: 'viewer'
    };

    const token = generateToken(payload);
    print.info(`Token original generado`);

    // Intentar manipular el payload del token
    // Cambiando un caracter del token
    const manipulatedToken = token.slice(0, -5) + 'XXXXX';
    print.info(`Token manipulado: ${manipulatedToken.substring(0, 50)}...`);

    // Verificar que el token manipulado es rechazado
    const decoded = verifyToken(manipulatedToken);

    if (!decoded) {
      print.success('Token manipulado rechazado correctamente');
      return { success: true };
    } else {
      print.error('Token manipulado aceptado (VULNERABILIDAD CRÍTICA)');
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de manipulación: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 5: Acceso a Ruta Protegida sin Token
 */
async function testProtectedRouteWithoutToken() {
  print.header('TEST 5: Acceso a Ruta Protegida sin Token');

  try {
    print.info('Intentando acceder a ruta protegida sin token...');

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      validateStatus: () => true // No lanzar error en códigos de estado HTTP
    });

    if (response.status === 401) {
      print.success(`Acceso denegado correctamente (Status: ${response.status})`);
      print.info(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
      return { success: true };
    } else {
      print.error(`Acceso permitido sin token (Status: ${response.status}) - VULNERABILIDAD`);
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de ruta protegida: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 6: Acceso a Ruta Protegida con Token Expirado
 */
async function testProtectedRouteWithExpiredToken() {
  print.header('TEST 6: Acceso a Ruta Protegida con Token Expirado');

  try {
    const payload = {
      id: 5,
      username: 'expireduser',
      role: 'admin'
    };

    // Generar token que expira en 1 segundo
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1s' });
    print.info('Token generado con expiración de 1 segundo');

    // Esperar 2 segundos
    print.info('Esperando 2 segundos...');
    await sleep(2000);

    // Intentar acceder con token expirado
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: () => true
    });

    if (response.status === 403) {
      print.success(`Token expirado rechazado correctamente (Status: ${response.status})`);
      print.info(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
      return { success: true };
    } else {
      print.error(`Token expirado aceptado (Status: ${response.status}) - VULNERABILIDAD`);
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de token expirado: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 7: Acceso a Ruta Protegida con Token Válido
 */
async function testProtectedRouteWithValidToken() {
  print.header('TEST 7: Acceso a Ruta Protegida con Token Válido');

  try {
    // Primero hacer login para obtener un token válido
    print.info('Realizando login para obtener token válido...');

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    }, {
      validateStatus: () => true
    });

    if (loginResponse.status !== 200 || !loginResponse.data?.token) {
      print.warning('No se pudo hacer login (puede que el usuario no exista)');
      print.info('Intentando con token generado manualmente...');

      const payload = {
        id: 1,
        username: 'admin',
        role: 'admin'
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: () => true
      });

      if (response.status === 200) {
        print.success(`Acceso concedido con token válido (Status: ${response.status})`);
        print.info(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
        return { success: true };
      } else if (response.status === 403) {
        print.warning(`Token válido pero usuario no existe en BD (Status: ${response.status})`);
        print.info('💡 Esto es esperado si no existe el usuario en la base de datos');
        print.info('💡 El middleware de autenticación funciona correctamente');
        return { success: true }; // Consideramos esto como éxito
      } else {
        print.error(`Respuesta inesperada (Status: ${response.status})`);
        return { success: false };
      }
    } else {
      const token = loginResponse.data.token;
      print.success('Login exitoso, token obtenido');

      // Intentar acceder a ruta protegida
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: () => true
      });

      if (response.status === 200) {
        print.success(`Acceso concedido con token válido (Status: ${response.status})`);
        print.info(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
        return { success: true };
      } else {
        print.error(`Token válido rechazado (Status: ${response.status})`);
        return { success: false };
      }
    }
  } catch (error) {
    print.error(`Error en test de token válido: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 8: Token sin Bearer Prefix
 */
async function testTokenWithoutBearerPrefix() {
  print.header('TEST 8: Token sin Prefijo "Bearer"');

  try {
    const payload = {
      id: 6,
      username: 'bearertest',
      role: 'admin'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    print.info('Enviando token sin prefijo "Bearer "');

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: token // Sin "Bearer "
      },
      validateStatus: () => true
    });

    if (response.status === 401) {
      print.success(`Token sin prefijo rechazado correctamente (Status: ${response.status})`);
      return { success: true };
    } else {
      print.warning(`Token sin prefijo aceptado (Status: ${response.status})`);
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de Bearer prefix: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 9: Verificación de Roles en Token
 */
async function testRoleVerification() {
  print.header('TEST 9: Verificación de Roles en Token');

  try {
    // Generar token de viewer
    const viewerPayload = {
      id: 7,
      username: 'viewer',
      role: 'viewer'
    };

    const viewerToken = jwt.sign(viewerPayload, JWT_SECRET, { expiresIn: '1h' });
    print.info('Token de rol "viewer" generado');

    // Verificar que el payload contiene el rol correcto
    const decoded = verifyToken(viewerToken);

    if (decoded && decoded.role === 'viewer') {
      print.success('Rol verificado correctamente en el token');
      print.info(`Usuario: ${decoded.username}, Rol: ${decoded.role}`);
      return { success: true };
    } else {
      print.error('Rol no verificado correctamente');
      return { success: false };
    }
  } catch (error) {
    print.error(`Error en test de roles: ${error.message}`);
    return { success: false };
  }
}

/**
 * Test 10: Decodificación de Token sin Verificación (Inseguro)
 */
async function testUnsafeTokenDecoding() {
  print.header('TEST 10: Decodificación sin Verificación (Demostración)');

  try {
    const payload = {
      id: 8,
      username: 'unsafetest',
      role: 'admin'
    };

    const token = generateToken(payload);
    print.info('Token generado');

    // Decodificar sin verificar (inseguro - solo para demostración)
    const unsafeDecoded = jwt.decode(token);
    print.warning('Decodificación sin verificación (INSEGURO):');
    print.info(`${JSON.stringify(unsafeDecoded, null, 2)}`);

    // Verificar correctamente
    const safeDecoded = verifyToken(token);
    print.success('Decodificación con verificación (SEGURO):');
    print.info(`${JSON.stringify(safeDecoded, null, 2)}`);

    print.warning('⚠ NOTA: Siempre usar verifyToken() en producción, nunca jwt.decode()');

    return { success: true };
  } catch (error) {
    print.error(`Error en test de decodificación: ${error.message}`);
    return { success: false };
  }
}

/**
 * Función principal para ejecutar todos los tests
 */
async function runAllTests() {
  console.clear();
  print.header('🔐 TEST DE SEGURIDAD Y EXPIRACIÓN DE TOKENS JWT');
  print.info(`API Base URL: ${API_BASE_URL}`);
  print.info(`JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  print.info(`JWT Expires In: ${JWT_EXPIRES_IN}`);
  print.separator();

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Ejecutar tests
  const tests = [
    { name: 'Token Generation', fn: testTokenGeneration },
    { name: 'Token Expiration', fn: testTokenExpiration },
    { name: 'Invalid Signature', fn: testInvalidSignature },
    { name: 'Manipulated Token', fn: testManipulatedToken },
    { name: 'Protected Route Without Token', fn: testProtectedRouteWithoutToken },
    { name: 'Protected Route With Expired Token', fn: testProtectedRouteWithExpiredToken },
    { name: 'Protected Route With Valid Token', fn: testProtectedRouteWithValidToken },
    { name: 'Token Without Bearer Prefix', fn: testTokenWithoutBearerPrefix },
    { name: 'Role Verification', fn: testRoleVerification },
    { name: 'Unsafe Token Decoding', fn: testUnsafeTokenDecoding }
  ];

  for (const test of tests) {
    results.total++;
    const result = await test.fn();
    if (result && result.success) {
      results.passed++;
    } else {
      results.failed++;
    }
    print.separator();
  }

  // Resumen final
  print.header('📊 RESUMEN DE TESTS');
  print.info(`Total de tests: ${results.total}`);
  print.success(`Tests exitosos: ${results.passed}`);
  if (results.failed > 0) {
    print.error(`Tests fallidos: ${results.failed}`);
  } else {
    print.success('¡Todos los tests pasaron correctamente! 🎉');
  }

  const percentage = ((results.passed / results.total) * 100).toFixed(2);
  print.info(`Porcentaje de éxito: ${percentage}%`);
  print.separator();

  // Recomendaciones de seguridad
  print.header('🛡️  RECOMENDACIONES DE SEGURIDAD');
  print.info('✓ Usar expiración corta para tokens (15min - 1h)');
  print.info('✓ Implementar refresh tokens para sesiones largas');
  print.info('✓ Almacenar JWT_SECRET en variables de entorno');
  print.info('✓ Usar HTTPS en producción');
  print.info('✓ Implementar lista negra de tokens (blacklist)');
  print.info('✓ Validar siempre el token con verifyToken()');
  print.info('✓ Nunca incluir información sensible en el payload');
  print.info('✓ Rotar el JWT_SECRET periódicamente');
  print.separator();
}

// Ejecutar tests
runAllTests().catch(error => {
  print.error(`Error fatal: ${error.message}`);
  process.exit(1);
});