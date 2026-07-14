import request from 'supertest';

// Test de diagnóstico para un backend ya desplegado (online)
// Uso:
// - Definir la URL base con la variable de entorno DIAGNOSTIC_BACKEND_URL o BACKEND_URL
// - (Opcional) PROBAR_LOGIN_EMAIL y PROBAR_LOGIN_PASSWORD para validar login
// - (Opcional) DIAGNOSTIC_ENDPOINTS con endpoints públicos separados por comas

const BASE_URL =
  process.env.DIAGNOSTIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3002';

// Endpoints candidatos para probar (se pueden sobreescribir con DIAGNOSTIC_ENDPOINTS)
const DEFAULT_PUBLIC_ENDPOINTS = ['/api/areas', '/api/extension', '/api/actividades', '/api/archivos', '/'];
const HEALTH_CANDIDATES = ['/health', '/api/health', '/status', '/api/status'];

jest.setTimeout(30000);

async function firstSuccessful(paths: string[]) {
  for (const p of paths) {
    try {
      const start = Date.now();
      const base = BASE_URL.replace(/\/$/, '');
      const target = `${base}${p}`;
      console.log(`[diagnostic] probando ${target}`);
      const res = await request(base).get(p).set('Accept', 'application/json');
      const ms = Date.now() - start;
      console.log(`[diagnostic] respuesta ${res.status} ${target} (${ms}ms)`);
      if (res.status === 200) return { path: p, res, time: ms };
    } catch (err: any) {
      console.error(`[diagnostic] error al pedir ${BASE_URL}${p}:`, err && (err.message || err.code || err));
      // probar siguiente ruta
    }
  }
  console.warn('[diagnostic] ninguna ruta respondió 200');
  return null;
}

describe('Diagnóstico online del backend', () => {
  test('Health endpoint disponible y responde 200', async () => {
    const found = await firstSuccessful(HEALTH_CANDIDATES);
    expect(found).not.toBeNull();
    expect(found!.res.status).toBe(200);
    // Si es JSON esperamos al menos que devuelva un objeto
    if (found!.res.type && /json/.test(found!.res.type)) {
      expect(typeof found!.res.body).toBe('object');
    }
  });

  test('Al menos un endpoint público responde 200', async () => {
    const custom = process.env.DIAGNOSTIC_ENDPOINTS
      ? process.env.DIAGNOSTIC_ENDPOINTS.split(',').map(s => s.trim()).filter(Boolean)
      : DEFAULT_PUBLIC_ENDPOINTS;

    const found = await firstSuccessful(custom);
    expect(found).not.toBeNull();
    expect(found!.res.status).toBe(200);
  });

  test('Tiempo de respuesta razonable', async () => {
    const candidate = await firstSuccessful(HEALTH_CANDIDATES.concat(DEFAULT_PUBLIC_ENDPOINTS));
    expect(candidate).not.toBeNull();
    // Consideramos aceptable < 3000ms para diagnóstico básico
    expect(candidate!.time).toBeLessThan(3000);
  });

  test('Intentar login si se proporcionan credenciales (opcional)', async () => {
    const email = process.env.PROBAR_LOGIN_EMAIL;
    const password = process.env.PROBAR_LOGIN_PASSWORD;

    if (!email || !password) {
      return expect(true).toBe(true); // Test marcado como skip implícito
    }

    const loginPaths = ['/api/login', '/auth/login', '/login'];
    let lastError: any = null;

    for (const path of loginPaths) {
      try {
        const res = await request(BASE_URL)
          .post(path)
          .send({ email, password })
          .set('Accept', 'application/json');

        if (res.status === 200 || res.status === 201) {
          // Buscamos token en body (token, jwt, accessToken)
          const hasToken = res.body && (res.body.token || res.body.jwt || res.body.accessToken);
          expect(hasToken).toBeTruthy();
          return;
        }
      } catch (err) {
        lastError = err;
      }
    }

    // Si llegamos aquí, falló el login en todos los endpoints
    throw lastError || new Error('No se pudo autenticar con las credenciales provistas');
  });
});
