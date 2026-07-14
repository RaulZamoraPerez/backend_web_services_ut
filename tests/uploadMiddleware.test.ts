import { uploadMiddleware, uploadEventos } from '../src/middleware/uploadMiddleware';

describe('uploadMiddleware exports', () => {
  test('uploadMiddleware should be a multer instance with .single method', () => {
    expect(uploadMiddleware).toBeDefined();
    // multer instances have a 'single' method
    // @ts-ignore - runtime check
    expect(typeof (uploadMiddleware as any).single).toBe('function');
  });

  test('uploadEventos should be a multer instance with .single method', () => {
    expect(uploadEventos).toBeDefined();
    // @ts-ignore - runtime check
    expect(typeof (uploadEventos as any).single).toBe('function');
  });
});
