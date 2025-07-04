-- Crear roles de usuario
INSERT INTO "Role" (nombre, "createdAt", "updatedAt") VALUES 
  ('ADMIN', NOW(), NOW()),
  ('USER', NOW(), NOW()),
  ('MANAGER', NOW(), NOW());

-- Crear usuario administrador inicial
INSERT INTO "Persona" (nombre, tipo, email, password, roles, "createdAt", "updatedAt")
VALUES (
  'Admin',
  'EMPLEADO',
  'admin@misionary.com',
  '$2a$10$XDqY1VXS3wgQiX.8GRGTfOHshh6hx.nwL3QHvxF1D6V8pqFU3T2u2',  -- Contraseña: Admin123!
  ARRAY['ADMIN']::"RolUsuario"[],
  NOW(),
  NOW()
);

-- Crear usuarios de ejemplo
INSERT INTO "Persona" (nombre, tipo, email, password, roles, "createdAt", "updatedAt") VALUES 
  ('Juan Pérez', 'CLIENTE', 'juan@ejemplo.com', '$2a$10$XDqY1VXS3wgQiX.8GRGTfOHshh6hx.nwL3QHvxF1D6V8pqFU3T2u2', ARRAY['USER']::"RolUsuario"[], NOW(), NOW()),
  ('María García', 'CLIENTE', 'maria@ejemplo.com', '$2a$10$XDqY1VXS3wgQiX.8GRGTfOHshh6hx.nwL3QHvxF1D6V8pqFU3T2u2', ARRAY['USER']::"RolUsuario"[], NOW(), NOW()),
  ('Carlos López', 'PROVEEDOR', 'carlos@ejemplo.com', '$2a$10$XDqY1VXS3wgQiX.8GRGTfOHshh6hx.nwL3QHvxF1D6V8pqFU3T2u2', ARRAY['USER']::"RolUsuario"[], NOW(), NOW());

-- Crear productos de ejemplo
INSERT INTO "Producto" (nombre, descripcion, precio, stock, "createdAt", "updatedAt") VALUES 
  ('Laptop Pro', 'Laptop de última generación', 1200.00, 10, NOW(), NOW()),
  ('Monitor 4K', 'Monitor de alta resolución', 400.00, 15, NOW(), NOW()),
  ('Teclado Mecánico', 'Teclado gaming con switches Cherry MX', 100.00, 20, NOW(), NOW()),
  ('Mouse Inalámbrico', 'Mouse ergonómico con batería de larga duración', 50.00, 30, NOW(), NOW());

-- Crear presupuestos de ejemplo
INSERT INTO "Presupuesto" ("personaId", fecha, estado, total, "createdAt", "updatedAt") VALUES 
  (2, NOW(), 'PENDIENTE', 1800.00, NOW(), NOW()),
  (3, NOW(), 'APROBADO', 550.00, NOW(), NOW());

-- Crear items de presupuestos
INSERT INTO "ItemPresupuesto" ("presupuestoId", "productoId", cantidad, "precioUnitario", subtotal, "createdAt", "updatedAt") VALUES 
  (1, 1, 1, 1200.00, 1200.00, NOW(), NOW()),
  (1, 2, 1, 400.00, 400.00, NOW(), NOW()),
  (2, 3, 1, 100.00, 100.00, NOW(), NOW()),
  (2, 4, 1, 50.00, 50.00, NOW(), NOW());

-- Crear algunos clientes de ejemplo
INSERT INTO "Persona" (nombre, tipo, email, password, roles, telefono, "createdAt", "updatedAt")
VALUES 
  ('Cliente Demo 1', 'CLIENTE', 'cliente1@demo.com', '$2a$10$YourHashedPasswordHere', ARRAY['CLIENTE']::"RolUsuario"[], '+1234567890', NOW(), NOW()),
  ('Cliente Demo 2', 'CLIENTE', 'cliente2@demo.com', '$2a$10$YourHashedPasswordHere', ARRAY['CLIENTE']::"RolUsuario"[], '+1234567891', NOW(), NOW());

-- Crear algunos proveedores de ejemplo
INSERT INTO "Persona" (nombre, tipo, email, password, roles, telefono, "createdAt", "updatedAt")
VALUES 
  ('Proveedor Demo 1', 'PROVEEDOR', 'proveedor1@demo.com', '$2a$10$YourHashedPasswordHere', ARRAY['PROVEEDOR']::"RolUsuario"[], '+1234567892', NOW(), NOW()),
  ('Proveedor Demo 2', 'PROVEEDOR', 'proveedor2@demo.com', '$2a$10$YourHashedPasswordHere', ARRAY['PROVEEDOR']::"RolUsuario"[], '+1234567893', NOW(), NOW());
