-- Usuarios para testing E2E
-- Este archivo agrega usuarios específicos para Playwright testing

-- Usuario ADMIN para testing (guido@misionary con password: 4C0@Cs4^6WuK@jci)
INSERT INTO "Persona" (nombre, tipo, email, password, roles, "createdAt", "updatedAt")
VALUES (
  'Guido Admin Testing',
  'INTERNO',
  'guido@misionary',
  '$2b$10$WAF0ZxM6A6c2O0l10p4GieN0NW2kOYSKfsYu6zE7uAtEUn.4dX0mS',
  ARRAY['ADMIN']::"RolUsuario"[],
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    roles = EXCLUDED.roles,
    "updatedAt" = NOW();

-- Usuario CONTADOR para testing
INSERT INTO "Persona" (nombre, tipo, email, password, roles, "createdAt", "updatedAt")
VALUES (
  'Contador Testing',
  'INTERNO',
  'contador@misionary.com',
  '$2b$10$8oW7EJYTRLCUSniWgdbYten9aB/G6oa1CcdNRKzjCcB934PCVZhuK',
  ARRAY['CONTADOR']::"RolUsuario"[],
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    roles = EXCLUDED.roles,
    "updatedAt" = NOW();

-- Usuario PROVEEDOR para testing
INSERT INTO "Persona" (nombre, tipo, email, password, roles, telefono, "createdAt", "updatedAt")
VALUES (
  'Proveedor Testing',
  'PROVEEDOR',
  'proveedor@misionary.com',
  '$2b$10$8oW7EJYTRLCUSniWgdbYten9aB/G6oa1CcdNRKzjCcB934PCVZhuK',
  ARRAY['PROVEEDOR']::"RolUsuario"[],
  '+54 9 11 1234-5678',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    roles = EXCLUDED.roles,
    "updatedAt" = NOW();

-- Usuario CLIENTE para testing (sin roles especiales, solo persona tipo CLIENTE)
INSERT INTO "Persona" (nombre, tipo, email, password, roles, telefono, "createdAt", "updatedAt")
VALUES (
  'Cliente Testing',
  'CLIENTE',
  'cliente@misionary.com',
  '$2b$10$8oW7EJYTRLCUSniWgdbYten9aB/G6oa1CcdNRKzjCcB934PCVZhuK',
  ARRAY[]::"RolUsuario"[],
  '+54 9 11 9876-5432',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    roles = EXCLUDED.roles,
    "updatedAt" = NOW();
