# CreditCloud - Documentación Completa del Proyecto

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Base de Datos](#base-de-datos)
7. [Backend - Implementación Detallada](#backend---implementación-detallada)
8. [Frontend - Implementación Detallada](#frontend---implementación-detallada)
9. [API REST - Especificación Completa](#api-rest---especificación-completa)
10. [Docker y Contenedores](#docker-y-contenedores)
11. [Flujos de Negocio](#flujos-de-negocio)
12. [Instalación y Configuración](#instalación-y-configuración)
13. [Consideraciones de Diseño](#consideraciones-de-diseño)
14. [Escalabilidad y Cloud](#escalabilidad-y-cloud)
15. [Mejoras Futuras](#mejoras-futuras)

---

## Introducción

**CreditCloud** es un sistema de gestión de Líneas de Crédito para Empresas diseñado para registrar clientes corporativos, gestionar solicitudes de financiamiento y automatizar notificaciones de estado. El proyecto está construido con una arquitectura moderna de microservicios, utilizando tecnologías de código abierto y diseñado para ser desplegado en múltiples proveedores de cloud.

---

## Descripción del Proyecto

### Propósito

El sistema permite a las instituciones financieras:

- **Registrar empresas corporativas** con información clave (nombre, NIT/RFC, sector, ingresos anuales)
- **Gestionar solicitudes de crédito** asociadas a cada empresa
- **Aprobar o rechazar créditos** con cambio de estados
- **Consultar historial** de créditos por empresa
- **Notificar eventos** relacionados con empresas y créditos

### Características Principales

- ✅ API RESTful completa
- ✅ Interfaz web moderna y responsiva
- ✅ Base de datos relacional con MySQL
- ✅ Sistema de notificaciones mediante logs estructurados
- ✅ Contenedores Docker para fácil despliegue
- ✅ Arquitectura cloud-agnostic (multicloud-ready)
- ✅ Validaciones de datos robustas
- ✅ Manejo de errores centralizado

---

## Arquitectura del Sistema

### Arquitectura General

El sistema sigue una **arquitectura de tres capas** (3-tier architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│                  (Frontend - Angular 19)                 │
│                    Puerto: 80/4200                       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────┴──────────────────────────────────┐
│                    CAPA DE APLICACIÓN                    │
│              (Backend - Node.js + Express)               │
│                    Puerto: 3000                          │
└──────────────────────┬──────────────────────────────────┘
                       │ Prisma ORM
                       │
┌──────────────────────┴──────────────────────────────────┐
│                    CAPA DE DATOS                         │
│                    (MySQL 8)                             │
│                    Puerto: 3306                          │
└──────────────────────────────────────────────────────────┘
```

### Diagrama de Flujo de Datos

```
Cliente (Navegador)
    │
    │ HTTP Request
    ▼
Frontend (Angular)
    │ ┌─────────────────┐
    │ │ Componentes     │
    │ │ Services        │
    │ │ Routing         │
    │ └─────────────────┘
    │
    │ HTTP/REST API
    ▼
Backend (Express)
    │ ┌─────────────────┐
    │ │ Routes          │
    │ │ Controllers     │
    │ │ Services        │
    │ └─────────────────┘
    │
    │ ┌─────────────────┐
    │ Prisma ORM        │
    │ └─────────────────┘
    │
    │ SQL Queries
    ▼
MySQL Database
    │
    │ Event Logs
    ▼
Notification Service (Logs JSON)
```

### Componentes del Sistema

1. **Frontend (Angular 19)**
   - Aplicación Single Page Application (SPA)
   - Servida mediante Nginx en producción
   - Comunicación con backend vía HTTP/REST

2. **Backend (Node.js + Express)**
   - API RESTful
   - Controladores para manejo de lógica de negocio
   - Servicios para operaciones auxiliares (notificaciones)
   - Prisma ORM para acceso a base de datos

3. **Base de Datos (MySQL 8)**
   - Almacenamiento persistente
   - Relaciones entre tablas (Companies ↔ Credits)
   - Migraciones gestionadas por Prisma

4. **Sistema de Notificaciones**
   - Logs estructurados en formato JSON
   - Preparado para migración a sistemas de mensajería (Pub/Sub, SQS)

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 19.2.0 | Framework de desarrollo frontend |
| **TypeScript** | 5.7.2 | Lenguaje de programación tipado |
| **RxJS** | 7.8.0 | Programación reactiva para manejo de observables |
| **Tailwind CSS** | 4.18 | Framework CSS utility-first |
| **Angular Router** | 19.2.0 | Sistema de enrutamiento |
| **HTTP Client** | 19.2.0 | Cliente HTTP para comunicación con API |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 22.x | Runtime de JavaScript |
| **Express** | 5.2.1 | Framework web minimalista |
| **Prisma** | 6.19.1 | ORM (Object-Relational Mapping) |
| **Prisma Client** | 6.19.1 | Cliente generado para acceso a BD |
| **CORS** | 2.8.5 | Middleware para Cross-Origin Resource Sharing |
| **Nodemon** | 3.1.11 | Herramienta de desarrollo (hot-reload) |

### Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **MySQL** | 8.0 | Sistema de gestión de base de datos relacional |

### DevOps y Contenedores

| Tecnología | Propósito |
|------------|-----------|
| **Docker** | Contenedorización de aplicaciones |
| **Docker Compose** | Orquestación de múltiples contenedores |
| **Nginx** | Servidor web para servir frontend y proxy reverso |
| **Alpine Linux** | Imagen base ligera para contenedores |

---

## Estructura del Proyecto

```
credit-multicloud-challenge/
│
├── backend/                          # Aplicación Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js            # Configuración del cliente Prisma
│   │   ├── controllers/
│   │   │   ├── company.controller.js # Lógica de negocio para empresas
│   │   │   └── credit.controller.js  # Lógica de negocio para créditos
│   │   ├── routes/
│   │   │   ├── company.routes.js    # Definición de rutas de empresas
│   │   │   └── credit.routes.js     # Definición de rutas de créditos
│   │   ├── services/
│   │   │   └── notification.service.js # Servicio de notificaciones
│   │   └── server.js                # Punto de entrada de la aplicación
│   │
│   ├── prisma/
│   │   ├── schema.prisma            # Esquema de base de datos (Prisma)
│   │   └── migrations/
│   │       └── 20260104010106_init/ # Migración inicial
│   │           └── migration.sql    # SQL generado por Prisma
│   │
│   ├── Dockerfile                   # Imagen Docker del backend
│   ├── .dockerignore               # Archivos excluidos del build Docker
│   └── package.json                # Dependencias y scripts del backend
│
├── frontend/                        # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Código core de la aplicación
│   │   │   │   ├── models/
│   │   │   │   │   ├── company.model.ts # Interfaces TypeScript para empresas
│   │   │   │   │   └── credit.model.ts  # Interfaces TypeScript para créditos
│   │   │   │   └── services/
│   │   │   │       ├── company.service.ts # Servicio HTTP para empresas
│   │   │   │       └── credit.service.ts  # Servicio HTTP para créditos
│   │   │   │
│   │   │   ├── pages/              # Componentes de página
│   │   │   │   ├── companies/
│   │   │   │   │   └── companies.component.ts # Lista de empresas
│   │   │   │   ├── company-detail/
│   │   │   │   │   └── company-detail.component.ts # Detalle de empresa
│   │   │   │   └── credits/
│   │   │   │       └── credits.component.ts # Lista de créditos
│   │   │   │
│   │   │   ├── shared/             # Componentes compartidos
│   │   │   │   └── components/
│   │   │   │       └── navbar/
│   │   │   │           └── navbar.component.ts # Barra de navegación
│   │   │   │
│   │   │   ├── app.component.ts    # Componente raíz
│   │   │   ├── app.config.ts       # Configuración de la aplicación
│   │   │   └── app.routes.ts       # Definición de rutas
│   │   │
│   │   ├── index.html              # HTML principal
│   │   ├── main.ts                 # Punto de entrada de Angular
│   │   └── styles.css              # Estilos globales
│   │
│   ├── Dockerfile                  # Imagen Docker del frontend (multi-stage)
│   ├── .dockerignore              # Archivos excluidos del build Docker
│   ├── nginx.conf                  # Configuración de Nginx para producción
│   ├── proxy.conf.json            # Configuración de proxy para desarrollo
│   ├── angular.json                # Configuración del proyecto Angular
│   └── package.json                # Dependencias y scripts del frontend
│
├── docker-compose.yml              # Orquestación de servicios Docker
├── .gitignore                      # Archivos ignorados por Git
└── README.md                       # Documentación básica del proyecto
```

---

## Base de Datos

### Esquema de Base de Datos

El esquema está definido en `backend/prisma/schema.prisma` y utiliza **Prisma ORM** como herramienta de modelado.

#### Modelo: Company (Empresa)

```prisma
model Company {
  id           String   @id @default(uuid())
  name         String
  taxId        String   @unique
  sector       String
  annualIncome Decimal
  createdAt    DateTime @default(now())
  
  credits      Credit[]
}
```

**Campos:**
- `id`: Identificador único (UUID v4)
- `name`: Nombre de la empresa
- `taxId`: NIT/RFC/CIF único (constraint de unicidad)
- `sector`: Sector económico de la empresa
- `annualIncome`: Ingresos anuales (tipo Decimal para precisión)
- `createdAt`: Timestamp de creación (automático)
- `credits`: Relación uno-a-muchos con Credit

#### Modelo: Credit (Crédito)

```prisma
model Credit {
  id         String       @id @default(uuid())
  amount     Decimal
  termMonths Int
  status     CreditStatus @default(PENDING)
  createdAt  DateTime     @default(now())
  
  companyId  String
  company    Company      @relation(fields: [companyId], references: [id])
}
```

**Campos:**
- `id`: Identificador único (UUID v4)
- `amount`: Monto del crédito (Decimal)
- `termMonths`: Plazo en meses (Integer)
- `status`: Estado del crédito (enum: PENDING, APPROVED)
- `createdAt`: Timestamp de creación (automático)
- `companyId`: Foreign key hacia Company
- `company`: Relación muchos-a-uno con Company

#### Enum: CreditStatus

```prisma
enum CreditStatus {
  PENDING
  APPROVED
}
```

**Estados:**
- `PENDING`: Crédito pendiente de aprobación
- `APPROVED`: Crédito aprobado

### Relaciones

- **Company ↔ Credit**: Relación uno-a-muchos
  - Una empresa puede tener múltiples créditos
  - Un crédito pertenece a una única empresa
  - Relación mediante foreign key `companyId`

### Migraciones

Las migraciones están gestionadas por Prisma. La migración inicial crea:
- Tabla `Company`
- Tabla `Credit`
- Enum `CreditStatus`
- Índices y constraints (primary keys, foreign keys, unique constraints)

**Ejecutar migraciones:**
```bash
cd backend
npx prisma migrate dev      # Desarrollo (crea nueva migración)
npx prisma migrate deploy   # Producción (aplica migraciones pendientes)
```

---

## Backend - Implementación Detallada

### Arquitectura del Backend

El backend sigue el patrón **MVC (Model-View-Controller)** adaptado a API REST:

- **Models**: Definidos en Prisma (schema.prisma)
- **Views**: JSON responses (REST API)
- **Controllers**: Lógica de negocio (controllers/)
- **Routes**: Definición de endpoints (routes/)

### Punto de Entrada: server.js

```javascript
const express = require('express');
const cors = require('cors');

const companyRoutes = require('./routes/company.routes');
const creditRoutes = require('./routes/credit.routes');

const app = express();

// Middlewares
app.use(cors());                    // Habilita CORS
app.use(express.json());            // Parsea JSON en requests

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/companies', companyRoutes);
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
```

**Características:**
- Express 5.2.1 como framework web
- CORS habilitado para permitir requests desde frontend
- Parsing automático de JSON
- Logging de todas las peticiones
- Endpoint `/health` para health checks
- Separación de rutas por dominio (companies, credits)

### Configuración: config/prisma.js

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma };
```

**Propósito:**
- Crea una instancia singleton de PrismaClient
- Centraliza la configuración de Prisma
- Evita múltiples conexiones a la base de datos

### Controladores

#### Company Controller (`controllers/company.controller.js`)

**Funciones:**

1. **createCompany** - POST /companies
   - Valida campos requeridos: `name`, `taxId`, `sector`, `annualIncome`
   - Valida que `annualIncome` sea un número positivo
   - Crea empresa en base de datos
   - Emite notificación `company.created`
   - Maneja error de duplicado (taxId único)

2. **listCompanies** - GET /companies
   - Lista todas las empresas
   - Ordenadas por fecha de creación descendente

3. **listCompanyCredits** - GET /companies/:id/credits
   - Valida existencia de la empresa
   - Retorna empresa y todos sus créditos
   - Ordenados por fecha de creación descendente

**Validaciones:**
- Campos requeridos
- Tipos de datos correctos
- Valores numéricos positivos
- Existencia de entidades relacionadas

#### Credit Controller (`controllers/credit.controller.js`)

**Funciones:**

1. **createCredit** - POST /credits
   - Valida campos: `companyId`, `amount`, `termMonths`
   - Valida que empresa exista
   - Crea crédito con status `PENDING` por defecto
   - Emite notificación `credit.created`

2. **listCredits** - GET /credits
   - Lista todos los créditos
   - Incluye información de la empresa (join)
   - Ordenados por fecha descendente

3. **updateCreditStatus** - PUT /credits/:id/status
   - Valida que status sea `PENDING` o `APPROVED`
   - Valida existencia del crédito
   - Actualiza status
   - Emite notificación `credit.status_updated` con estado anterior y nuevo

**Validaciones:**
- Montos positivos
- Plazos enteros positivos
- Estados válidos (enum)
- Existencia de entidades

### Rutas

#### Company Routes (`routes/company.routes.js`)

```javascript
router.post('/', createCompany);
router.get('/', listCompanies);
router.get('/:id/credits', listCompanyCredits);
```

**Endpoints:**
- `POST /companies` → Crear empresa
- `GET /companies` → Listar empresas
- `GET /companies/:id/credits` → Créditos de una empresa

#### Credit Routes (`routes/credit.routes.js`)

```javascript
router.put('/:id/status', updateCreditStatus);
router.post('/', createCredit);
router.get('/', listCredits);
```

**Endpoints:**
- `PUT /credits/:id/status` → Actualizar estado
- `POST /credits` → Crear crédito
- `GET /credits` → Listar créditos

**Nota:** La ruta específica `/:id/status` debe ir antes de rutas genéricas para evitar conflictos.

### Servicio de Notificaciones

**Archivo:** `services/notification.service.js`

```javascript
function notify(event, payload) {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    payload
  };
  
  console.log(JSON.stringify(log));
}

module.exports = { notify };
```

**Propósito:**
- Centraliza la emisión de eventos
- Formato JSON estructurado para fácil parsing
- Preparado para migración a sistemas de mensajería (Pub/Sub, SQS, RabbitMQ)

**Eventos emitidos:**
- `company.created`: Cuando se crea una empresa
- `credit.created`: Cuando se crea un crédito
- `credit.status_updated`: Cuando cambia el estado de un crédito

**Ejemplo de log:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "event": "credit.created",
  "payload": {
    "creditId": "550e8400-e29b-41d4-a716-446655440000",
    "companyId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "amount": "50000",
    "termMonths": 12
  }
}
```

### Manejo de Errores

El backend implementa manejo de errores consistente:

**Códigos HTTP:**
- `200 OK`: Operación exitosa (GET, PUT)
- `201 Created`: Recurso creado exitosamente (POST)
- `400 Bad Request`: Error de validación
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: taxId duplicado)
- `500 Internal Server Error`: Error del servidor

**Formato de errores:**
```json
{
  "error": "validation_error",
  "message": "amount must be a number greater than 0"
}
```

**Errores manejados:**
- Validación de campos requeridos
- Validación de tipos de datos
- Duplicados (constraint único)
- Recursos no encontrados
- Errores de base de datos (Prisma)

---

## Frontend - Implementación Detallada

### Arquitectura del Frontend

El frontend utiliza **Angular 19** con arquitectura modular:

- **Componentes**: Páginas y componentes reutilizables
- **Servicios**: Lógica de comunicación con API
- **Models**: Interfaces TypeScript para tipado
- **Routing**: Navegación de la aplicación

### Configuración: app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

**Características:**
- Zone.js para detección de cambios optimizada
- Router configurado para lazy loading
- HTTP Client para comunicación con API

### Routing: app.routes.ts

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component')
  },
  {
    path: 'companies/:id',
    loadComponent: () => import('./pages/company-detail/company-detail.component')
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.component')
  },
  { path: '**', redirectTo: '/companies' }
];
```

**Rutas:**
- `/` → Redirige a `/companies`
- `/companies` → Lista de empresas
- `/companies/:id` → Detalle de empresa
- `/credits` → Lista de créditos
- `**` → Redirige a `/companies` (404)

**Características:**
- Lazy loading de componentes (mejora performance)
- Ruta por defecto: lista de empresas
- Manejo de rutas no encontradas

### Modelos TypeScript

#### Company Model (`core/models/company.model.ts`)

```typescript
export interface Company {
  id: string;
  name: string;
  taxId: string;
  sector: string;
  annualIncome: string;  // String porque viene de Decimal
  createdAt: string;
}

export interface CreateCompanyDto {
  name: string;
  taxId: string;
  sector: string;
  annualIncome: number;
}
```

#### Credit Model (`core/models/credit.model.ts`)

```typescript
export type CreditStatus = 'PENDING' | 'APPROVED';

export interface Credit {
  id: string;
  amount: string;
  termMonths: number;
  status: CreditStatus;
  createdAt: string;
  companyId: string;
  company?: Pick<Company, 'id' | 'name' | 'taxId'>;
}

export interface CreateCreditDto {
  companyId: string;
  amount: number;
  termMonths: number;
}

export interface CompanyCreditsResponse {
  company: Company;
  credits: Credit[];
}
```

**Notas:**
- `amount` y `annualIncome` son strings porque Prisma retorna Decimal como string
- Type unions para estados tipados
- DTOs separados para requests de creación

### Servicios HTTP

#### Company Service (`core/services/company.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/companies';

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCreditsById(id: string): Observable<CompanyCreditsResponse> {
    return this.http.get<CompanyCreditsResponse>(`${this.apiUrl}/${id}/credits`);
  }

  create(data: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, data);
  }
}
```

**Métodos:**
- `getAll()`: Obtiene todas las empresas
- `getCreditsById(id)`: Obtiene empresa y sus créditos
- `create(data)`: Crea una nueva empresa

#### Credit Service (`core/services/credit.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class CreditService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/credits';

  getAll(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }

  create(data: CreateCreditDto): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, data);
  }

  updateStatus(id: string, status: 'PENDING' | 'APPROVED'): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}/${id}/status`, { status });
  }
}
```

**Métodos:**
- `getAll()`: Obtiene todos los créditos
- `create(data)`: Crea un nuevo crédito
- `updateStatus(id, status)`: Actualiza el estado de un crédito

**Características:**
- Servicios singleton (`providedIn: 'root'`)
- Uso de `inject()` (dependency injection moderna)
- Observable patterns con RxJS
- Tipado fuerte con TypeScript

### Componentes

Los componentes principales están en `pages/`:

1. **CompaniesComponent**: Lista de empresas
2. **CompanyDetailComponent**: Detalle de empresa con créditos
3. **CreditsComponent**: Lista de todos los créditos
4. **NavbarComponent**: Barra de navegación compartida

### Estilos

- **Tailwind CSS 4.18**: Framework utility-first
- **CSS Custom**: Estilos globales en `styles.css`
- Diseño responsivo y moderno

### Proxy y Configuración

**proxy.conf.json** (desarrollo):
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

**nginx.conf** (producción):
- Servir archivos estáticos de Angular
- Proxy `/api/*` hacia backend
- Soporte para SPA routing (try_files)
- Compresión Gzip
- Cache de assets estáticos

---

## API REST - Especificación Completa

### Base URL

- **Desarrollo local**: `http://localhost:3000`
- **Docker**: `http://localhost:3000`
- **Frontend proxy**: `/api/*` → Backend

### Endpoints

#### Empresas (Companies)

##### POST /companies

Crea una nueva empresa.

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "taxId": "900123456",
  "sector": "Technology",
  "annualIncome": 1000000
}
```

**Response 201 Created:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "taxId": "900123456",
  "sector": "Technology",
  "annualIncome": "1000000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errores:**
- `400`: Validación fallida
- `409`: taxId ya existe

##### GET /companies

Lista todas las empresas.

**Response 200 OK:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "taxId": "900123456",
    "sector": "Technology",
    "annualIncome": "1000000",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

##### GET /companies/:id/credits

Obtiene una empresa y todos sus créditos.

**Response 200 OK:**
```json
{
  "company": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "taxId": "900123456",
    "sector": "Technology",
    "annualIncome": "1000000",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "credits": [
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "amount": "50000",
      "termMonths": 12,
      "status": "PENDING",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "companyId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

**Errores:**
- `404`: Empresa no encontrada

#### Créditos (Credits)

##### POST /credits

Crea un nuevo crédito.

**Request Body:**
```json
{
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 50000,
  "termMonths": 12
}
```

**Response 201 Created:**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "amount": "50000",
  "termMonths": 12,
  "status": "PENDING",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "companyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Errores:**
- `400`: Validación fallida
- `404`: Empresa no encontrada

##### GET /credits

Lista todos los créditos con información de empresa.

**Response 200 OK:**
```json
[
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "amount": "50000",
    "termMonths": 12,
    "status": "PENDING",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "taxId": "900123456"
    }
  }
]
```

##### PUT /credits/:id/status

Actualiza el estado de un crédito.

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Response 200 OK:**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "amount": "50000",
  "termMonths": 12,
  "status": "APPROVED",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "company": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "taxId": "900123456"
  }
}
```

**Errores:**
- `400`: Status inválido (debe ser PENDING o APPROVED)
- `404`: Crédito no encontrado

#### Health Check

##### GET /health

Verifica el estado de la API.

**Response 200 OK:**
```json
{
  "ok": true
}
```

---

## Docker y Contenedores

### Docker Compose

El archivo `docker-compose.yml` orquesta tres servicios:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8
    container_name: creditcloud-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: creditdb
    ports:
      - "3306:3306"
    volumes:
      - mysqldata:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: creditcloud-backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://root:root@db:3306/creditdb
      PORT: 3000
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: creditcloud-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysqldata:
```

**Características:**
- **MySQL**: Base de datos con healthcheck
- **Backend**: Construido desde Dockerfile, espera a que DB esté saludable
- **Frontend**: Construido desde Dockerfile (multi-stage), depende de backend
- **Volúmenes**: Persistencia de datos de MySQL
- **Networking**: Servicios se comunican por nombre de servicio (db, backend)

### Backend Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/server.js"]
```

**Características:**
- Imagen base: `node:22-alpine` (ligera)
- Instalación de dependencias de producción
- Generación de Prisma Client
- Puerto 3000 expuesto

### Frontend Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build -- --configuration=production

# Stage 2: Serve con nginx
FROM nginx:alpine

# Copiar build de Angular
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Características:**
- **Stage 1 (Build)**: Compila Angular en imagen Node.js
- **Stage 2 (Serve)**: Sirve archivos estáticos con Nginx
- Resultado: Imagen ligera (solo Nginx + archivos compilados)
- Configuración de Nginx incluida

### Comandos Docker

```bash
# Construir y levantar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (reset BD)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up --build -d backend

# Ejecutar comandos en un contenedor
docker-compose exec backend npx prisma migrate deploy
```

---

## Flujos de Negocio

### Flujo 1: Registrar Nueva Empresa

```
1. Usuario completa formulario en Frontend
   └─> Datos: name, taxId, sector, annualIncome

2. Frontend envía POST /companies
   └─> CompanyService.create()

3. Backend valida datos
   └─> company.controller.createCompany()

4. Backend crea registro en BD
   └─> Prisma: company.create()

5. Backend emite notificación
   └─> notify('company.created', payload)

6. Backend retorna empresa creada (201)

7. Frontend actualiza lista/muestra confirmación
```

### Flujo 2: Solicitar Nuevo Crédito

```
1. Usuario selecciona empresa y completa formulario
   └─> Datos: companyId, amount, termMonths

2. Frontend envía POST /credits
   └─> CreditService.create()

3. Backend valida datos y existencia de empresa
   └─> credit.controller.createCredit()

4. Backend crea crédito con status PENDING
   └─> Prisma: credit.create({ status: 'PENDING' })

5. Backend emite notificación
   └─> notify('credit.created', payload)

6. Backend retorna crédito creado (201)

7. Frontend actualiza vista/muestra confirmación
```

### Flujo 3: Aprobar Crédito

```
1. Usuario selecciona crédito y cambia status a APPROVED
   └─> Frontend: updateStatus(id, 'APPROVED')

2. Frontend envía PUT /credits/:id/status
   └─> CreditService.updateStatus()

3. Backend valida status y existencia
   └─> credit.controller.updateCreditStatus()

4. Backend actualiza status en BD
   └─> Prisma: credit.update({ status: 'APPROVED' })

5. Backend emite notificación con estados anterior/nuevo
   └─> notify('credit.status_updated', { oldStatus, newStatus })

6. Backend retorna crédito actualizado (200)

7. Frontend actualiza vista/muestra nuevo estado
```

### Flujo 4: Consultar Historial de Créditos

```
1. Usuario navega a detalle de empresa
   └─> Route: /companies/:id

2. Frontend carga componente CompanyDetailComponent

3. Frontend solicita GET /companies/:id/credits
   └─> CompanyService.getCreditsById()

4. Backend obtiene empresa y créditos
   └─> Prisma: company.findUnique() + credit.findMany()

5. Backend retorna empresa y lista de créditos (200)

6. Frontend muestra información de empresa y tabla de créditos
```

---

## Instalación y Configuración

### Requisitos Previos

- **Node.js** v20 o superior
- **Docker** y **Docker Compose**
- **npm** o **yarn**
- **Git** (opcional, para clonar repositorio)

### Opción A: Docker Compose (Recomendado)

**Ventajas:**
- ✅ Instalación rápida
- ✅ No requiere configuración manual de BD
- ✅ Ambiente aislado
- ✅ Fácil de desplegar

**Pasos:**

1. **Clonar repositorio** (si aplica)
   ```bash
   git clone <repo-url>
   cd credit-multicloud-challenge
   ```

2. **Levantar servicios**
   ```bash
   docker-compose up --build -d
   ```

3. **Ejecutar migraciones** (primera vez)
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

4. **Verificar servicios**
   ```bash
   # Health check del backend
   curl http://localhost:3000/health
   
   # Acceder al frontend
   # Abrir navegador en: http://localhost
   ```

5. **Ver logs** (opcional)
   ```bash
   docker-compose logs -f
   ```

**Servicios disponibles:**
- Frontend: `http://localhost` (puerto 80)
- Backend API: `http://localhost:3000`
- MySQL: `localhost:3306`
  - Usuario: `root`
  - Contraseña: `root`
  - Base de datos: `creditdb`

### Opción B: Desarrollo Local

**Ventajas:**
- ✅ Hot-reload más rápido
- ✅ Debugging más fácil
- ✅ Mayor control del entorno

**Pasos:**

1. **Clonar repositorio**
   ```bash
   git clone <repo-url>
   cd credit-multicloud-challenge
   ```

2. **Iniciar base de datos**
   ```bash
   docker-compose up db -d
   ```

3. **Configurar Backend**

   ```bash
   cd backend
   
   # Instalar dependencias
   npm install
   
   # Crear archivo .env (si no existe)
   echo "DATABASE_URL=mysql://root:root@localhost:3306/creditdb" > .env
   
   # Ejecutar migraciones
   npx prisma migrate dev
   
   # Iniciar servidor de desarrollo
   npm run dev
   ```

   El backend estará en: `http://localhost:3000`

4. **Configurar Frontend**

   ```bash
   cd frontend
   
   # Instalar dependencias
   npm install
   
   # Iniciar servidor de desarrollo
   npm start
   ```

   El frontend estará en: `http://localhost:4200`

5. **Verificar instalación**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Abrir navegador
   # http://localhost:4200
   ```

### Variables de Entorno

#### Backend (.env)

```env
DATABASE_URL=mysql://root:root@localhost:3306/creditdb
PORT=3000
NODE_ENV=development
```

**Para producción:**
```env
DATABASE_URL=mysql://user:password@cloud-sql-ip:3306/creditdb
PORT=3000
NODE_ENV=production
```

### Comandos Útiles

#### Backend

```bash
npm run dev      # Desarrollo con hot-reload (nodemon)
npm start        # Producción
npx prisma studio  # Interfaz visual de BD (desarrollo)
npx prisma migrate dev    # Crear nueva migración
npx prisma migrate deploy # Aplicar migraciones (producción)
npx prisma generate      # Regenerar Prisma Client
```

#### Frontend

```bash
npm start        # Desarrollo (puerto 4200)
npm run build    # Build de producción
npm test         # Ejecutar tests (si existen)
```

#### Docker

```bash
docker-compose up --build -d  # Construir y levantar
docker-compose down           # Detener servicios
docker-compose down -v        # Detener y eliminar volúmenes
docker-compose logs -f        # Ver logs en tiempo real
docker-compose ps             # Estado de servicios
```

---

## Consideraciones de Diseño

### Decisiones de Arquitectura

#### 1. Separación Frontend/Backend

**Decisión:** Aplicaciones separadas (SPA + API REST)

**Razones:**
- ✅ Escalabilidad independiente
- ✅ Reutilización de API para múltiples clientes (web, mobile, etc.)
- ✅ Desarrollo paralelo de equipos
- ✅ Despliegue independiente

#### 2. Prisma ORM

**Decisión:** Prisma en lugar de Sequelize/TypeORM

**Razones:**
- ✅ Type-safety automático
- ✅ Migraciones gestionadas
- ✅ Mejor DX (Developer Experience)
- ✅ Generación de tipos TypeScript

#### 3. Logs Estructurados para Notificaciones

**Decisión:** Logs JSON en lugar de sistema de mensajería completo

**Razones:**
- ✅ Costo cero para MVP
- ✅ Fácil migración a Pub/Sub/SQS después
- ✅ Compatible con Cloud Logging
- ✅ Suficiente para desarrollo y staging

#### 4. MySQL como Base de Datos

**Decisión:** MySQL en lugar de PostgreSQL/MongoDB

**Razones:**
- ✅ Amplia adopción en la industria
- ✅ Compatible con múltiples clouds (Cloud SQL, RDS, Azure SQL)
- ✅ Relaciones bien soportadas (empresa ↔ créditos)
- ✅ Facilita migración a cloud

#### 5. Docker Multi-stage para Frontend

**Decisión:** Build multi-stage para reducir tamaño de imagen

**Razones:**
- ✅ Imagen final ligera (solo Nginx + archivos estáticos)
- ✅ Build tools no incluidos en imagen final
- ✅ Menor tamaño = despliegue más rápido
- ✅ Mejor seguridad (menos superficie de ataque)

### Patrones de Diseño

#### 1. MVC (Model-View-Controller)

- **Models**: Prisma schema
- **Views**: JSON responses
- **Controllers**: Lógica de negocio

#### 2. Dependency Injection

- Frontend: Angular DI (servicios singleton)
- Backend: CommonJS modules

#### 3. Repository Pattern (implícito)

- Prisma Client actúa como repositorio
- Abstrae acceso a BD

#### 4. Service Layer

- Servicios separados (notifications, HTTP)
- Lógica reutilizable

### Seguridad

#### Implementado

- ✅ Validación de inputs
- ✅ Manejo de errores sin exponer detalles internos
- ✅ CORS configurado
- ✅ Tipos de datos validados

#### Recomendaciones para Producción

- 🔒 Autenticación y autorización (JWT, OAuth2)
- 🔒 Rate limiting
- 🔒 HTTPS/TLS
- 🔒 Variables de entorno para secretos
- 🔒 Validación más estricta (bibliotecas como Joi/Zod)
- 🔒 Sanitización de inputs
- 🔒 Logging de auditoría
- 🔒 Backup automático de BD

---

## Escalabilidad y Cloud

### Arquitectura Cloud-Ready

El sistema está diseñado para ser **cloud-agnostic**, es decir, puede ejecutarse en múltiples proveedores sin cambios significativos.

### Opciones de Despliegue

#### GCP (Google Cloud Platform)

**Componentes:**
- **Cloud SQL (MySQL)**: Base de datos gestionada
- **Cloud Run**: Backend serverless
- **Cloud Storage + Cloud CDN**: Frontend estático

**Ventajas:**
- Escalado automático
- Pay-per-use
- Integración nativa

**Costo estimado:** ~$30-80/mes (desarrollo/staging)

#### AWS (Amazon Web Services)

**Componentes:**
- **RDS (MySQL)**: Base de datos gestionada
- **Elastic Beanstalk o ECS**: Backend
- **S3 + CloudFront**: Frontend estático

**Ventajas:**
- Ecosistema amplio
- Alta disponibilidad
- Múltiples regiones

**Costo estimado:** ~$40-100/mes (desarrollo/staging)

#### Azure (Microsoft Azure)

**Componentes:**
- **Azure Database for MySQL**: Base de datos gestionada
- **App Service o Container Instances**: Backend
- **Blob Storage + CDN**: Frontend estático

**Ventajas:**
- Integración con herramientas Microsoft
- Enterprise-ready

**Costo estimado:** ~$50-120/mes (desarrollo/staging)

### Migración a Cloud

#### Paso 1: Base de Datos

```env
# Local
DATABASE_URL=mysql://root:root@localhost:3306/creditdb

# Cloud SQL (GCP)
DATABASE_URL=mysql://user:pass@35.123.45.67:3306/creditdb

# RDS (AWS)
DATABASE_URL=mysql://user:pass@my-db.region.rds.amazonaws.com:3306/creditdb
```

Solo cambiar `DATABASE_URL` en `.env` o variables de entorno.

#### Paso 2: Backend

**Opción A: Cloud Run / App Service**
- Desplegar Dockerfile del backend
- Configurar variables de entorno
- Configurar health checks

**Opción B: Container Instances**
- Similar a Docker Compose pero en cloud
- Más control sobre recursos

#### Paso 3: Frontend

**Opción A: Cloud Storage + CDN**
- Subir archivos estáticos a bucket
- Configurar CDN para distribución global
- Configurar dominio personalizado

**Opción B: Firebase Hosting / Vercel**
- Despliegue simple
- CDN incluido
- Gratis para proyectos pequeños

### Escalabilidad Horizontal

#### Backend

- **Load Balancer**: Distribuir tráfico entre instancias
- **Múltiples réplicas**: Escalar según demanda
- **Stateless**: Backend sin estado (fácil escalado)

#### Base de Datos

- **Read Replicas**: Para consultas de solo lectura
- **Connection Pooling**: Manejo eficiente de conexiones
- **Sharding**: Si es necesario (futuro)

#### Frontend

- **CDN Global**: Distribución de contenido estático
- **Cache de assets**: Reducir carga en servidor

### Monitoreo y Observabilidad

#### Recomendaciones

- **Cloud Logging**: Centralizar logs
- **Cloud Monitoring**: Métricas y alertas
- **Tracing**: Para debugging (OpenTelemetry)
- **Health Checks**: Endpoint `/health`

#### Notificaciones (Próximos Pasos)

Migrar de logs a sistema de mensajería:

```javascript
// Actual (logs)
notify('credit.created', payload);

// Futuro (Pub/Sub)
await pubsub.topic('credits').publish(payload);
```

**Opciones:**
- **GCP Pub/Sub**: ~$0.04/millón mensajes
- **AWS SQS**: ~$0.40/millón mensajes
- **Azure Service Bus**: Similar precio

---

## Mejoras Futuras

### Funcionalidades Pendientes

1. **Autenticación y Autorización**
   - JWT tokens
   - Roles de usuario (admin, analista, etc.)
   - Protección de endpoints

2. **Más Estados de Crédito**
   - `REJECTED`: Crédito rechazado
   - `CANCELLED`: Crédito cancelado
   - `PAID`: Crédito pagado

3. **Búsqueda y Filtros**
   - Búsqueda por nombre de empresa
   - Filtros por sector, estado, fecha
   - Paginación de resultados

4. **Validaciones Avanzadas**
   - Validación de NIT/RFC por país
   - Límites de crédito según ingresos anuales
   - Reglas de negocio más complejas

5. **Notificaciones Reales**
   - Email cuando se aprueba crédito
   - SMS para cambios críticos
   - Webhooks para integraciones

6. **Dashboard y Reportes**
   - Estadísticas de créditos
   - Gráficos de tendencias
   - Exportación a PDF/Excel

7. **Auditoría**
   - Log de cambios (quién, cuándo, qué)
   - Historial completo de estados
   - Trazabilidad de operaciones

8. **Testing**
   - Unit tests (Jest, Jasmine)
   - Integration tests
   - E2E tests (Cypress, Playwright)

9. **Documentación API**
   - Swagger/OpenAPI
   - Postman collection
   - Ejemplos de uso

10. **CI/CD**
    - GitHub Actions / GitLab CI
    - Tests automáticos
    - Despliegue automático

### Optimizaciones Técnicas

1. **Caching**
   - Redis para cache de consultas frecuentes
   - Cache de listas de empresas/créditos

2. **Performance**
   - Índices adicionales en BD
   - Lazy loading en frontend
   - Compresión de respuestas

3. **Seguridad**
   - Rate limiting
   - Input sanitization
   - SQL injection prevention (ya con Prisma)
   - XSS prevention

4. **Observabilidad**
   - Métricas de performance
   - Tracing distribuido
   - Alertas automáticas

---

## Conclusión

**CreditCloud** es un sistema moderno y bien estructurado para la gestión de créditos corporativos. Su arquitectura modular, uso de tecnologías estándar y diseño cloud-agnostic lo hacen escalable y fácil de mantener.

### Puntos Fuertes

✅ Arquitectura clara y separada  
✅ Tecnologías modernas y estables  
✅ Fácil de desplegar con Docker  
✅ Preparado para cloud  
✅ Código limpio y mantenible  
✅ API RESTful bien diseñada  

### Próximos Pasos Recomendados

1. Implementar autenticación
2. Agregar tests
3. Configurar CI/CD
4. Migrar a cloud (staging primero)
5. Implementar monitoreo
6. Agregar más funcionalidades según necesidades de negocio

---

**Documentación generada:** 2024  
**Versión del proyecto:** 1.0.0  
**Licencia:** MIT

