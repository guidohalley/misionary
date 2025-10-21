import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para Misionary CRM/ERP
 * 
 * Esta configuración está optimizada para testing E2E del sistema Misionary
 * con soporte para diferentes roles, temas y dispositivos.
 */
export default defineConfig({
  // Directorio base para los tests
  testDir: '../e2e',
  
  // Directorio para reportes
  outputDir: '../reports/test-results',
  
  // Configuración global de timeouts
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  // Configuración de retry
  retries: process.env.CI ? 2 : 0,
  
  // Workers para ejecución paralela
  workers: process.env.CI ? 1 : undefined,
  
  // Reporteros
  reporter: [
    ['html', { outputFolder: '../reports/html-report' }],
    ['json', { outputFile: '../reports/results.json' }],
    ['junit', { outputFile: '../reports/results.xml' }],
  ],
  
  // Configuración global
  use: {
    // URL base del sistema Misionary
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Configuración de navegador
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Headers por defecto
    extraHTTPHeaders: {
      'Accept-Language': 'es-ES,es;q=0.9',
    },
    
    // Configuración de viewport
    viewport: { width: 1280, height: 720 },
    
    // Configuración de geolocalización (Argentina)
    geolocation: { latitude: -34.6037, longitude: -58.3816 },
    locale: 'es-ES',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },

  // Configuración de proyectos para diferentes escenarios
  projects: [
    // Proyecto para testing de escritorio
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        // Configuración específica para escritorio
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Proyecto para testing móvil
    {
      name: 'chromium-mobile',
      use: { 
        ...devices['Pixel 5'],
        // Configuración específica para móvil
        isMobile: true,
        hasTouch: true,
      },
    },
    
    // Proyecto para testing de tablet
    {
      name: 'chromium-tablet',
      use: { 
        ...devices['iPad Pro'],
        // Configuración específica para tablet
        isMobile: true,
        hasTouch: true,
      },
    },
    
    // Proyecto para testing con Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    // Proyecto para testing con Safari/WebKit
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Proyecto para testing de modo oscuro
    {
      name: 'chromium-dark',
      use: { 
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        // Simular preferencia de tema oscuro
        extraHTTPHeaders: {
          'Accept-Language': 'es-ES,es;q=0.9',
          'Sec-CH-Prefers-Color-Scheme': 'dark',
        },
      },
    },
  ],

  // Configuración del servidor web (opcional)
  // Comentado porque el servidor debe estar corriendo manualmente
  // webServer: process.env.CI ? undefined : {
  //   command: 'cd ../frontend && npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});

