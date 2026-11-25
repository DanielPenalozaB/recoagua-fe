# RecoAgua · Front-end (aplicación web)

Interfaz web de **RecoAgua**, el *Sistema de Gestión para la Recolección de Agua en Hogares de
Cali, Valle del Cauca*. RecoAgua es una plataforma web educativa que orienta a los hogares en el
aprovechamiento de agua lluvia para usos no potables. Ofrece guías interactivas, una calculadora
hídrica, un mapa de zonas de Cali y retos con insignias, además de un panel de administración.

Este repositorio forma parte del trabajo de grado para optar al título de Ingeniero de Sistemas
en la **Institución Universitaria Antonio José Camacho (UNIAJC)**, Facultad de Ingenierías (2026).

| | |
| --- | --- |
| **Autores** | Ismael Yate Calderón · Juan Daniel Peñaloza Brito |
| **Directora** | Beatriz Eugenia Marín Ospina (Grupo de Investigación GRINTIC) |
| **Aplicación** | <https://recoagua.com> |
| **Back-end (API)** | [DanielPenalozaB/recoagua-be](https://github.com/DanielPenalozaB/recoagua-be) |

## Tecnologías

Next.js 16 (App Router) · React 19 · TypeScript · NextAuth.js v4 · TanStack Query · Tailwind CSS v4 ·
shadcn/ui (Radix) · Mapbox GL · Recharts · Docker · GitHub Actions + Coolify.

## Ejecución local

Requisitos: Node.js ≥ 20.9 y npm. La API ([recoagua-be](https://github.com/DanielPenalozaB/recoagua-be))
debe estar en ejecución.

```bash
git clone https://github.com/DanielPenalozaB/recoagua-fe.git
cd recoagua-fe
npm install
cp template.env .env.local        # completar los valores (ver Manual Técnico, sección 5.2)
npm run dev
```

La aplicación queda disponible en <http://localhost:3000>.

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de la API, por ejemplo `http://localhost:4000` |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Token público de Mapbox |
| `NEXTAUTH_URL` | URL de la aplicación, por ejemplo `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Clave para cifrar la cookie de sesión |

## Scripts principales

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` / `npm run start` | Compilación y ejecución en producción |
| `npm run lint` | ESLint |
| `npx biome check --write .` | Linter y formateador Biome |

## Estructura

```
src/
├── app/          # Rutas: (citizen)/ ciudadano, admin/ administración, auth/ autenticación
├── components/   # Componentes compartidos (shadcn/ui, tablas, vistas del ciudadano)
├── features/     # Módulos CRUD del panel de administración
├── services/     # Clientes HTTP de la API
├── hooks/, lib/, types/, context/
└── proxy.ts      # Protección de rutas por sesión y rol
```

## Despliegue

Cada *push* a `develop` ejecuta `.github/workflows/deploy.yml`, que construye la imagen
`ghcr.io/danielpenalozab/recoagua-fe:latest` (con las variables `NEXT_PUBLIC_*` como argumentos
de construcción), la publica en GitHub Container Registry y notifica a Coolify para desplegarla.

## Documentación

Los detalles de arquitectura, variables de entorno, Docker y CI/CD están en el **Manual Técnico de
Implementación**. El uso de la plataforma se describe en el **Manual de Usuario**. Ambos se
entregan con el trabajo de grado.
