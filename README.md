# Finance — Personal Finance Tracker (Frontend)

Aplicación web para el registro y visualización de finanzas personales: ingresos, gastos, categorías y resúmenes gráficos. Frontend en Next.js con React 19, comunicado con una API propia de Fastify + MongoDB.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts](#scripts)
- [Variables de entorno](#variables-de-entorno)
- [Puesta en marcha](#puesta-en-marcha)
- [Pruebas](#pruebas)

---

## Tecnologías

### Dependencias de producción

| Tecnología | Versión | Uso |
| --- | --- | --- |
| [Next.js](https://nextjs.org) | 16.3.0 | Framework React con App Router, Server Components, proxy de autenticación y metadata SEO |
| [React](https://react.dev) | 19.2.8 | Librería de interfaz de usuario |
| [React DOM](https://react.dev) | 19.2.8 | Renderizado de React en el navegador |
| [TypeScript](https://www.typescriptlang.org) | 5.9.3 | Tipado estático en todo el proyecto |
| [Tailwind CSS](https://tailwindcss.com) | 4.3.3 | Estilos utilitarios con tokens de tema (`@theme`) |
| [@tailwindcss/postcss](https://tailwindcss.com) | 4.3.3 | Plugin de PostCSS para Tailwind v4 |
| [Redux Toolkit](https://redux-toolkit.js.org) | 2.12.0 | Estado global de UI (loader global y tema) |
| [React Redux](https://react-redux.js.org) | 9.3.0 | Bindings oficiales de Redux para React 19 |
| [TanStack React Query](https://tanstack.com/query) | 5.101.4 | Cache, sincronización y mutaciones de datos del servidor |
| [Axios](https://axios-http.com) | 1.19.0 | Cliente HTTP con interceptores (loader, refresh de sesión, redirección) |
| [React Hook Form](https://react-hook-form.com) | 7.84.0 | Formularios con validación y rendimiento optimizado |
| [jwt-decode](https://github.com/auth0/jwt-decode) | 4.0.0 | Decodificación de tokens JWT (validación de expiración) |

### Dependencias de desarrollo

| Tecnología | Versión | Uso |
| --- | --- | --- |
| [Vitest](https://vitest.dev) | 4.1.10 | Framework de pruebas unitarias e integración |
| [@vitest/coverage-v8](https://vitest.dev) | 4.1.10 | Reporte de cobertura con umbrales configurados |
| [Testing Library (React)](https://testing-library.com) | 16.3.2 | Pruebas de hooks y componentes React |
| [@testing-library/jest-dom](https://testing-library.com) | 7.0.0 | Matchers de DOM para Vitest |
| [@testing-library/user-event](https://testing-library.com) | 14.6.3 | Interacción de usuario simulada |
| [MSW](https://mswjs.io) | 2.15.0 | Intercepción de red para mocks de la API en pruebas |
| [jsdom](https://github.com/jsdom/jsdom) | 30.0.1 | Entorno DOM para pruebas |
| [ESLint](https://eslint.org) | 9.39.5 | Lint del código (config de Next.js) |
| [eslint-config-next](https://nextjs.org) | 16.3.0 | Reglas oficiales de ESLint para Next.js |
| [pnpm](https://pnpm.io) | 11.10.0 | Gestor de paquetes (definido en `packageManager`) |

---

## Arquitectura

La aplicación sigue la arquitectura del **App Router de Next.js**, separando de forma estricta el **estado de UI** (Redux) del **estado del servidor** (React Query), y manteniendo una **capa de servicios** independiente que concentra todo el acceso HTTP a la API.

### Flujo de datos

```
Componente (Server Component / Client Component)
        │
        ▼
hooks/ (useTransactions, useLogin, …)          ← React Query (queries/mutations)
        │
        ▼
services/ (transactions.ts, auth.ts, …)        ← Única capa que habla con axios
        │
        ▼
lib/api/client.ts                               ← axios con interceptores
        │
        ▼
API (Fastify + MongoDB)
```

### Capas

| Capa | Ruta | Responsabilidad |
| --- | --- | --- |
| **Páginas y layouts** | `src/app` | Rutas, metadata SEO, layouts (auth, dashboard), middleware de sesión (`proxy.ts`) |
| **Componentes** | `src/components` | UI por dominio: `auth`, `dashboard`, `transactions`, `categories`, `ui` (primitivas), `common` |
| **Hooks** | `src/hooks` | Hooks de React Query divididos en `queries/` y `mutations/`, con claves centralizadas (`*.keys.ts`) |
| **Servicios** | `src/services` | Funciones `async` que envuelven a `apiClient` con tipos de respuesta fuertes |
| **Estado de UI** | `src/store` | Slices de Redux: `loader` (contador de requests en vuelo) y `theme` (claro/oscuro) |
| **Lib** | `src/lib` | Cliente HTTP, manejo de mensajes de éxito/error, sesión, utilidades de formato y redirección segura |
| **Layouts** | `src/layouts` | Cabecera y pie reutilizables de la web pública |
| **Pruebas** | `tests` | Espejo de la estructura de `src` para `lib`, `services`, `store` y `hooks` |

### Autenticación

El esquema de sesión es de **cookies con tokens rotables**:

1. **Backend** emite `refresh_token` y `access_token` como cookies `httpOnly` en su propio dominio.
2. **Frontend** replica una cookie de sesión (`auth_session`, `SameSite=Lax`, 7 días) en su dominio (`lib/auth/session-cookie.ts`). Es la señal que usa el middleware para decidir si el usuario está autenticado.
3. **Middleware (`proxy.ts`)**: en el servidor, redirige a `/login` si falta sesión en rutas protegidas, y a `/dashboard` si hay sesión en `/`, `/login` o `/register`.
4. **Interceptor de respuestas (`lib/api/client.ts`)**: cualquier respuesta `401` (excepto el propio endpoint de refresh) dispara un refresh de tokens vía `/auth/refresh`; las requests concurrentes se encolan hasta que el refresh termina. Si el refresh falla, se limpia la sesión y se redirige a `/login?from=…`.
5. **Login/registro**: tras autenticarse, el cliente setea `auth_session` y redirige (el login a través de `resolvePostAuthPath`, que protege contra open redirect con `/login`, `/register`, `//` y `\`).

### Manejo de errores

El backend responde los errores con `{ code, message }`. El frontend mapea esos códigos a mensajes legibles:

- **`lib/api/error-message.ts`** → `getMutationErrorMessage(code)`: mapa `MUTATION_ERROR_MESSAGES` con fallback por defecto.
- **`lib/api/success-message.ts`** → `getMutationSuccessMessage(code)`: mensajes de éxito por código de operación.
- **`lib/api/client.ts`** → `attachBackendCode()`: normaliza el error de axios para que `catch (error)` pueda leer `error.code` con el código del backend (el interceptor copia `response.data.code` a `error.code`).

El `tsconfig.json` usa `useUnknownInCatchVariables: false` para permitir el acceso directo a `error.code` en los bloques `catch`.

### Estado global vs. servidor

- **React Query** gestiona todo el estado del servidor: cache de transacciones, categorías, perfil y parámetros. `QueryProvider` configura `retry: 1`, `refetchOnWindowFocus: false` y `staleTime: 60s`.
- **Redux** solo gestiona UI efímera y global: el **loader global** (incremento/decremento por request del interceptor) y el **tema** (persistido en `localStorage` con un script inline en `<head>` para evitar FOUC).

### Gráfica de saldo

El `BalanceCard` dibuja la gráfica de líneas con **SVG nativo** (sin librería de charts). Soporta:

- Rangos (`6m`, `3m`, `30d`, `7d`) y filtros (`ingresos`, `gastos`, `todo`) mantenidos en la **URL** (`?range=&chart=`) vía `useChartTypeFilter`/`useChartRangeFilter`, lo que los hace compartibles y persistibles.
- Modo `mock` para la web pública (homepage y login), con animaciones CSS (`chart-draw`, `chart-flow`).

### Estilos y tema

- **Tailwind CSS v4** con tokens definidos en `@theme` (`globals.css`): `paper`, `surface`, `ink`, `ink-soft`, `line`, `leaf-*` (verde), `gold-*`.
- Los tokens **se invierten en modo oscuro** (`.dark`): `ink` pasa de oscuro a claro. Los componentes con fondos "fijos" (tarjetas oscuras tipo `bg-ink`) sobrescriben con `dark:bg-[#18221d] dark:text-ink`.
- **Diseño mobile-first**: todos los breakpoints usan variantes min-width (`sm:`, `lg:`, …); ninguna `max-*:`. Navegación inferior móvil, sidebar colapsable en escritorio y textos centrados en pantallas pequeñas.

---

## Decisiones de diseño

1. **Server Components por defecto** — Las páginas públicas (`home`, `login`, `register`) son server components con metadata SEO completa; solo los componentes interactivos se marcan `"use client"`.
2. **Capa de servicios única** — `src/services` es el único lugar que importa `apiClient`, lo que facilita mockear la red en pruebas (MSW o `vi.mock`).
3. **Claves tipadas de React Query** — Cada dominio expone `*.keys.ts` (ej. `transactionKeys.list(filters)`) para invalidar queries de forma consistente.
4. **Errores mapeados por código** — Los mensajes de error de UI provienen de códigos del backend, nunca de strings del servidor ni de mensajes por defecto hardcodeados en cada componente.
5. **Formato de moneda determinista** — `formatCompactCurrency` en `BalanceCard` evita la diferencia entre el ICU de Node y el del navegador (hydrate mismatch).
6. **Filtros en la URL** — Los filtros de transacciones y de la gráfica viven en query params, no en estado local: compartibles, retrocedibles y limpiables.
7. **Seguridad de redirección** — `resolvePostAuthPath` valida el destino post-login contra open redirects.
8. **Tema sin parpadeo (FOUC)** — Script inline en `<head>` lee `localStorage`/`prefers-color-scheme` antes del primer render.
9. **Sin librería de gráficas** — SVG nativo: control total del diseño, cero dependencias y animaciones CSS ligeras.
10. **pnpm como gestor** — Velocidad de instalación y deduplicación estricta; la versión queda fijada en `packageManager`.

---

## Estructura del proyecto

```
├── src/
│   ├── app/                        # App Router: rutas, layouts, metadata
│   │   ├── (dashboard)/            # Grupo de rutas autenticadas
│   │   │   ├── dashboard/
│   │   │   ├── movements/
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   ├── login/
│   │   ├── register/
│   │   ├── oauth-success/
│   │   ├── layout.tsx              # Layout raíz (providers + tema)
│   │   ├── page.tsx                # Homepage pública
│   │   ├── globals.css             # Tokens de tema y estilos base
│   │   ├── proxy.ts                # Middleware de sesión (redirecciones)
│   │   ├── robots.ts / sitemap.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── auth/                   # AuthShell, BalanceCard, formularios
│   │   ├── dashboard/              # Shell, sidebar, header, profile
│   │   ├── transactions/           # Lista, formulario, filtros, fila
│   │   ├── categories/             # Lista, grupos, modal de borrado
│   │   ├── ui/                     # Primitivas: Modal, Field, InfoModal, icons
│   │   └── common/                 # Loader
│   ├── hooks/                      # React Query por dominio
│   │   ├── auth/                   # useLogin, useRegister, useLogout, …
│   │   ├── transactions/           # useTransactions, useTransactionSummary, …
│   │   ├── categories/
│   │   ├── profile/
│   │   └── params/
│   ├── layouts/                    # header.ts, footer.ts (web pública)
│   ├── lib/
│   │   ├── api/                    # client.ts, error-message.ts, success-message.ts
│   │   ├── auth/                   # session-cookie.ts, tokens.ts
│   │   ├── providers/              # QueryProvider, StoreProvider
│   │   ├── types/                  # auth, transaction, category, params, error
│   │   └── utils/                  # format, redirect, provider, loaderEvents
│   ├── services/                   # auth.ts, transactions.ts, categories.ts, params.ts
│   └── store/                      # Redux: index.ts, loader.slice, theme.slice
├── tests/                          # Espejo de src (lib, services, store, hooks)
├── vitest.config.ts                # Config de pruebas y umbrales de cobertura
├── next.config.ts
├── tsconfig.json                   # Paths @/* y @test/*
└── package.json
```

---

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (Next.js) |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | ESLint del proyecto |
| `pnpm test` | Ejecuta Vitest (una sola pasada) |
| `pnpm test:watch` | Vitest en modo watch |
| `pnpm test:coverage` | Vitest con cobertura (v8) y umbrales |

---

## Variables de entorno

| Variable | Descripción | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base de la API (Fastify) | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (para metadata/SEO) | `http://localhost:3000` |

---

## Puesta en marcha

Requisitos: Node.js ≥ 20 y pnpm.

```bash
# 1. Instalar dependencias
pnpm install

# 2. Variables de entorno (opcional, usa los defaults)
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Levantar el backend (repo personal-finance-tracker-api) en el puerto 4000

# 4. Iniciar el frontend
pnpm dev
```

La app estará disponible en `http://localhost:3000` y la documentación de la API en `http://localhost:4000/docs` (Swagger).

---

## Pruebas

Suite de **Vitest + Testing Library** con entorno `jsdom` y cobertura v8. Estructura espejada:

- `tests/lib` — utilidades puras: formato, redirección, tokens, mensajes de error, cliente HTTP.
- `tests/services` — contratos HTTP de cada servicio (URLs, payloads, headers).
- `tests/store` — slices de Redux (loader, theme).
- `tests/hooks` — hooks de React Query: llamado al servicio, invalidación de cache y propagación de errores.

Umbrales de cobertura (ver `vitest.config.ts`): 75% statements/lines/functions y 65% branches en `src/lib`, `src/services` y `src/store`.

---

## Repos relacionados

- **API**: `personal-finance-tracker-api` — Fastify, MongoDB (Mongoose), autenticación JWT con cookies rotables, OAuth (Google/GitHub), Cloudinary para avatares, Swagger en `/docs`.
