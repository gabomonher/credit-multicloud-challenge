# CreditCloud - Sistema de Gestión de Créditos Corporativos

Sistema de gestión de Líneas de Crédito para Empresas que permite registrar clientes corporativos, gestionar solicitudes de financiamiento y automatizar notificaciones de estado.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Setup](#instalación-y-setup)
- [Endpoints de la API](#endpoints-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Análisis de Costo-Eficiencia](#análisis-de-costo-eficiencia)

---

## Arquitectura

```mermaid
flowchart TB
    subgraph Cliente["🖥️ Cliente"]
        Browser[Navegador Web]
    end

    subgraph Frontend["Frontend - Angular 19"]
        NG[Angular App<br/>Puerto 4200]
        Components[Componentes]
        Services[Servicios HTTP]
    end

    subgraph Backend["Backend - Node.js Express"]
        API[REST API<br/>Puerto 3000]
        Controllers[Controllers]
        Prisma[Prisma ORM]
        Notifications[Notification Service<br/>Logs Estructurados]
    end

    subgraph Database["Base de Datos"]
        MySQL[(MySQL 8<br/>Puerto 3306)]
    end

    subgraph Cloud["☁️ Opciones Cloud"]
        GCP[Cloud SQL<br/>GCP]
        AWS[RDS<br/>AWS]
        Azure[Azure SQL<br/>Azure]
    end

    Browser --> NG
    NG --> Components
    Components --> Services
    Services -->|HTTP/REST| API
    API --> Controllers
    Controllers --> Prisma
    Controllers --> Notifications
    Prisma --> MySQL
    MySQL -.->|Migración| GCP
    MySQL -.->|Migración| AWS
    MySQL -.->|Migración| Azure
```

### Flujo de Datos

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend API
    participant N as Notification Service
    participant DB as MySQL

    U->>F: Registra Empresa/Crédito
    F->>B: POST /companies o /credits
    B->>DB: INSERT via Prisma
    DB-->>B: Registro creado
    B->>N: notify('credit.created', payload)
    N-->>N: console.log(JSON estructurado)
    B-->>F: 201 Created + datos
    F-->>U: Muestra confirmación
```

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Frontend** | Angular | 19.x |
| **Estilos** | CSS Custom + Tailwind | 4.x |
| **Backend** | Node.js + Express | 22.x / 5.x |
| **ORM** | Prisma | 6.x |
| **Base de Datos** | MySQL | 8.x |
| **Contenedores** | Docker + Docker Compose | - |

---

## Requisitos Previos

- **Node.js** v20+ 
- **Docker** y **Docker Compose**
- **npm** o **yarn**

---

## Instalación y Setup

### Opción A: Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone <repo-url>
cd credit-multicloud-challenge

# Levantar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

Servicios disponibles:
- **Frontend:** http://localhost (puerto 80)
- **Backend API:** http://localhost:3000
- **MySQL:** localhost:3306

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (reset DB)
docker-compose down -v
```

---

### Opción B: Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd credit-multicloud-challenge
```

### 2. Iniciar la base de datos

```bash
docker-compose up db -d
```

Esto levanta MySQL en `localhost:3306` con:
- Usuario: `root`
- Contraseña: `root`
- Base de datos: `creditdb`

### 3. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 4. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en `http://localhost:4200`

### 5. Verificar instalación

```bash
# Health check del backend
curl http://localhost:3000/health
# Respuesta: {"ok":true}

# Abrir frontend en navegador
# Docker: http://localhost
# Local:  http://localhost:4200
```

---

## Endpoints de la API

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/companies` | Registrar nueva empresa |
| `GET` | `/companies` | Listar todas las empresas |
| `GET` | `/companies/:id/credits` | Historial de créditos de una empresa |

#### Crear Empresa
```bash
curl -X POST http://localhost:3000/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "taxId": "900123456",
    "sector": "Technology",
    "annualIncome": 1000000
  }'
```

### Créditos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/credits` | Solicitar nuevo crédito |
| `GET` | `/credits` | Listar todos los créditos |
| `PUT` | `/credits/:id/status` | Actualizar estado del crédito |

#### Solicitar Crédito
```bash
curl -X POST http://localhost:3000/credits \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "<UUID>",
    "amount": 50000,
    "termMonths": 12
  }'
```

#### Aprobar Crédito
```bash
curl -X PUT http://localhost:3000/credits/<UUID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'
```

---

## Estructura del Proyecto

```
credit-multicloud-challenge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de BD
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js       # Cliente Prisma
│   │   ├── controllers/
│   │   │   ├── company.controller.js
│   │   │   └── credit.controller.js
│   │   ├── routes/
│   │   │   ├── company.routes.js
│   │   │   └── credit.routes.js
│   │   ├── services/
│   │   │   └── notification.service.js
│   │   └── server.js           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios y modelos
│   │   │   ├── pages/          # Componentes de página
│   │   │   └── shared/         # Componentes compartidos
│   │   ├── styles.css          # Estilos globales
│   │   └── index.html
│   └── package.json
├── docker-compose.yml          # MySQL containerizado
├── .gitignore
└── README.md
```

---

## Análisis de Costo-Eficiencia

### Decisiones de Arquitectura

#### 1. Base de Datos: MySQL Local → Cloud SQL (GCP)

| Opción | Costo Estimado | Justificación |
|--------|----------------|---------------|
| **MySQL Local (Docker)** | $0/mes | Desarrollo y pruebas |
| **Cloud SQL (GCP)** | ~$25-50/mes | Escalabilidad automática, backups, alta disponibilidad |
| **RDS (AWS)** | ~$30-60/mes | Similar a Cloud SQL, buena integración con servicios AWS |
| **Azure SQL** | ~$35-70/mes | Integración con ecosistema Microsoft |

**Elección recomendada para producción:** Cloud SQL de GCP
- **Razón:** Mejor relación costo/rendimiento para cargas de trabajo pequeñas-medianas
- Escalado automático sin intervención manual
- Backups automáticos incluidos en el precio base
- Réplicas de lectura disponibles para alta disponibilidad

#### 2. Backend: Node.js + Express

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Node.js Express** ✅ | Ligero, rápido desarrollo, gran ecosistema | Single-threaded |
| Spring Boot | Robusto, tipado fuerte | Mayor consumo de recursos, más verbose |
| Python Flask | Simple, legible | Menos performante para APIs de alto tráfico |

**Elección:** Node.js Express
- Bajo consumo de memoria (~50-100MB)
- Ideal para APIs I/O-bound como esta
- Fácil despliegue en Cloud Run, App Engine o Lambda

#### 3. Sistema de Notificaciones

| Opción | Costo | Uso Recomendado |
|--------|-------|-----------------|
| **Logs Estructurados** ✅ | $0 | MVP, desarrollo, auditoría |
| Pub/Sub (GCP) | ~$0.04/millón msg | Eventos en tiempo real, microservicios |
| SQS (AWS) | ~$0.40/millón msg | Cola de mensajes, procesamiento async |
| SendGrid/Mailgun | ~$15-20/mes | Emails transaccionales |

**Elección actual:** Logs Estructurados (JSON)
- Costo cero para MVP
- Fácil migración a Pub/Sub cuando sea necesario
- Compatible con Cloud Logging para análisis

#### 4. Hosting Frontend

| Opción | Costo | Latencia |
|--------|-------|----------|
| **Firebase Hosting** | $0 (hasta 10GB) | Excelente (CDN global) |
| Vercel | $0 (hobby) | Excelente |
| Cloud Storage + CDN | ~$1-5/mes | Muy buena |

### Resumen de Costos Estimados

| Ambiente | Costo Mensual |
|----------|---------------|
| **Desarrollo (Local)** | $0 |
| **Staging (Cloud mínimo)** | ~$30-50 |
| **Producción (escalable)** | ~$80-150 |

### Interoperabilidad Cloud

El sistema está diseñado para ser **cloud-agnostic**:

```bash
# Variables de entorno para cambiar de proveedor
DATABASE_URL="mysql://user:pass@localhost:3306/creditdb"     # Local
DATABASE_URL="mysql://user:pass@cloud-sql-ip:3306/creditdb"  # GCP
DATABASE_URL="mysql://user:pass@rds-endpoint:3306/creditdb"  # AWS
```

Solo cambiar `DATABASE_URL` en el archivo `.env` permite migrar entre proveedores sin modificar código.

---

## Scripts Disponibles

### Docker
```bash
docker-compose up --build -d   # Levantar todo
docker-compose down            # Detener
docker-compose logs -f         # Ver logs
docker-compose down -v         # Reset completo
```

### Backend
```bash
npm run dev    # Desarrollo con hot-reload
npm start      # Producción
```

### Frontend
```bash
npm start      # Desarrollo (puerto 4200)
npm run build  # Build de producción
```

---

## Licencia

MIT License

