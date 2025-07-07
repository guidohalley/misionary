
# Misionary

![GitHub repo size](https://img.shields.io/github/repo-size/guidohalley/misionary)
![GitHub issues](https://img.shields.io/github/issues/guidohalley/misionary)
![GitHub stars](https://img.shields.io/github/stars/guidohalley/misionary?style=social)
![License](https://img.shields.io/github/license/guidohalley/misionary)

Sistema integral de gestión empresarial con arquitectura moderna, desarrollado en TypeScript, React, Node.js y Prisma. Incluye frontend y backend desacoplados, autenticación, gestión de empresas, clientes, facturación, presupuestos y más.

---

## Tabla de Contenidos
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación rápida](#instalación-rápida)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Características
- Frontend moderno con React + Vite + TailwindCSS
- Backend robusto con Node.js, Express y Prisma ORM
- Autenticación JWT y control de roles
- Gestión de empresas, clientes, productos, servicios, presupuestos y facturación
- Soporte multimoneda y control de impuestos
- Docker y docker-compose para despliegue rápido
- Código tipado y validado con TypeScript y Zod
- Arquitectura escalable y desacoplada

## Tecnologías
- React, Vite, TailwindCSS
- Node.js, Express
- Prisma ORM, PostgreSQL
- Docker, Docker Compose
- TypeScript, Zod

## Instalación rápida

```bash
# Clona el repositorio
$ git clone https://github.com/guidohalley/misionary.git
$ cd misionary

# Crea el archivo de variables de entorno para backend y frontend según corresponda

# Levanta todo con Docker
$ docker-compose up --build
```

## Estructura del proyecto

```
/ ├─ backend/   # API Node.js + Prisma
│ └─ prisma/    # Esquema y migraciones
├─ frontend/    # React + Vite
│ └─ src/       # Código fuente
├─ docker-compose.yml
└─ README.md
```

## Uso
- Accede a la app en `http://localhost:3000` (frontend)
- API disponible en `http://localhost:4000` (backend)



## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más información.

## Contacto
- Guido Halley - [guidohalley@hotmail.com](mailto:guidohalley@hotmail.com)
- [LinkedIn](https://www.linkedin.com/in/guidohalley)

---

> Proyecto profesional, mantenido y actualizado siguiendo las mejores prácticas de la comunidad open source.