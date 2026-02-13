# Sistema de Control de Asistencias 🕒

Sistema integral de gestión de asistencias y personal con arquitectura de microservicios y asistente virtual inteligente.

## 👥 Equipo de Desarrollo

- Daniel Guaman
- Kevin Amaguana
- Reishel Tipan
- Ariel Morillo

## 📋 Descripción

Sistema modular para el control y gestión de asistencias del personal, que incluye:

- ✅ Registro de asistencias (firmas)
- 👤 Gestión de personal
- 📅 Control de turnos
- ⏸️ Gestión de pausas y recesos
- 📊 Reportes y estadísticas
- 🤖 Asistente virtual inteligente (Chatbot)

## 🏗️ Arquitectura

### Frontend
- **Next.js 16** (React 19)
- **TypeScript**
- **Tailwind CSS**
- **Arquitectura Limpia** (Clean Architecture)
  - Domain Layer (Entidades, Interfaces)
  - Application Layer (Casos de Uso)
  - Infrastructure Layer (Repositorios, API Clients)
  - Presentation Layer (Componentes UI)

### Backend - Microservicios
- **API Personal** (Puerto 5001) - Gestión de empleados
- **API Recesos** (Puerto 5002) - Control de recesos
- **API Turnos** (Puerto 5003) - Gestión de turnos
- **API Tiempos Fuera** (Puerto 5004) - Control de pausas
- **API Login** (Puerto 5005) - Autenticación
- **API Firmas** (Puerto 5006) - Registro de asistencias
- **Chatbot API** (Puerto 5007) - Asistente virtual con IA

### Base de Datos
- **PostgreSQL 16** (Puerto 5432)

### Chatbot
- **FastAPI** - Framework web
- **Pydantic AI** - Agente inteligente
- **NVIDIA AI** - Procesamiento de lenguaje natural
- **ChromaDB** - Base de datos vectorial
- **Clean Architecture** - Arquitectura limpia

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Docker** y **Docker Compose**
- **Node.js 18+** (para desarrollo local)
- **API Key de NVIDIA** (para el chatbot)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd attendance-control-system
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Base de datos
POSTGRES_USER=daniel
POSTGRES_PASSWORD=espe123
POSTGRES_DB=personal

# Chatbot - IMPORTANTE: Obtén tu API key en https://build.nvidia.com/
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxx

# Timezone
NEXT_PUBLIC_TIMEZONE=America/Guayaquil
TZ=America/Guayaquil
```

### 3. Obtener API Key de NVIDIA (para Chatbot)

1. Ve a: https://build.nvidia.com/
2. Crea una cuenta o inicia sesión
3. Selecciona un modelo (ej: Nemotron)
4. Haz clic en "Get API Key" → "Generate API Key"
5. Copia tu clave (formato: `nvapi-xxxxx...`)
6. Pégala en el archivo `.env`

⚠️ **IMPORTANTE**: La API key solo se muestra una vez. Guárdala en un lugar seguro.

### 4. Levantar el Sistema con Docker Compose

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# O en segundo plano (detached mode)
docker-compose up -d --build
```

### 5. Verificar que Todo Funciona

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs solo del chatbot
docker-compose logs -f chatbot
```

### 6. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Chatbot**: Botón 💬 en la esquina inferior derecha
- **API Docs (Chatbot)**: http://localhost:5007/docs
- **Base de Datos**: localhost:5432

## 🤖 Uso del Chatbot

El asistente virtual está disponible en todas las páginas del sistema. Ejemplos de consultas:

- "¿Cómo registro mi asistencia?"
- "¿Cómo gestiono los turnos del personal?"
- "¿Qué es un receso?"
- "Ayúdame con el sistema de pausas"
- "¿Cómo generar un reporte?"

## 🛠️ Comandos Útiles

### Docker Compose

```bash
# Levantar servicios
docker-compose up

# Levantar en segundo plano
docker-compose up -d

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up -d --build chatbot

# Ver logs de un servicio
docker-compose logs -f chatbot

# Reiniciar un servicio
docker-compose restart chatbot
```

### Desarrollo Local (Next.js)

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

## 📁 Estructura del Proyecto

```
attendance-control-system/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── chatbot/      # ⭐ Endpoint del chatbot
│   │   │   └── orchestrator/ # Orquestador de APIs
│   │   ├── dashboard/        # Páginas del dashboard
│   │   └── page.tsx          # Página principal
│   ├── application/           # Casos de uso (Clean Architecture)
│   ├── domain/               # Entidades e interfaces
│   ├── infrastructure/       # Implementaciones
│   │   ├── api-clients/     # Clientes de APIs
│   │   ├── config/          # Configuración
│   │   └── repositories/    # Repositorios
│   └── presentation/         # Componentes UI
│       └── components/
│           └── ChatbotWidget.tsx  # ⭐ Widget del chatbot
├── docker-compose.yaml       # Orquestación de servicios
├── .env                      # Variables de entorno
├── .env.example             # Plantilla de variables
├── package.json
└── README.md

ChatBot-Basadas/              # Proyecto del chatbot
├── app/
│   ├── application/         # Servicios de aplicación
│   ├── domain/             # Modelos de dominio
│   ├── infrastructure/     # Implementaciones
│   └── interfaces/         # API endpoints
├── knowledge/              # Base de conocimiento
├── vector_db/             # ChromaDB (persistente)
├── Dockerfile             # ⭐ Configuración Docker
├── main.py               # Punto de entrada
└── requirements.txt
```

## 🔐 Seguridad

### Variables de Entorno

- ✅ El archivo `.env` está en `.gitignore` (NO se sube a Git)
- ✅ Usa `.env.example` como plantilla sin datos sensibles
- ✅ Nunca compartas tu `NVIDIA_API_KEY` públicamente
- ✅ Rota las credenciales regularmente

### API Keys

Si expones accidentalmente una API key:

1. **REVÓCALA** inmediatamente en https://build.nvidia.com/
2. **GENERA** una nueva clave
3. **ACTUALIZA** tu archivo `.env`
4. **REINICIA** el servicio: `docker-compose restart chatbot`

## 📊 Servicios y Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| PostgreSQL | 5432 | Base de datos |
| API Personal | 5001 | Gestión de personal |
| API Recesos | 5002 | Control de recesos |
| API Turnos | 5003 | Gestión de turnos |
| API Tiempos Fuera | 5004 | Control de pausas |
| API Login | 5005 | Autenticación |
| API Firmas | 5006 | Registro de asistencias |
| **Chatbot** | **5007** | **Asistente virtual** |

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📚 Documentación Adicional

- [CHATBOT_INTEGRATION.md](CHATBOT_INTEGRATION.md) - Guía completa de integración del chatbot
- [ChatBot-Basadas/DOCKER.md](../ChatBot-Basadas/DOCKER.md) - Documentación Docker del chatbot
- [.env.example](.env.example) - Plantilla de variables de entorno

## 🐛 Solución de Problemas

### El chatbot no responde

1. Verifica que el servicio esté corriendo:
   ```bash
   docker-compose ps chatbot
   ```

2. Revisa los logs:
   ```bash
   docker-compose logs chatbot
   ```

3. Verifica tu API key en `.env`

4. Reinicia el servicio:
   ```bash
   docker-compose restart chatbot
   ```

### Error de conexión con la base de datos

```bash
# Reiniciar la base de datos
docker-compose restart db

# Verificar salud de la DB
docker-compose exec db pg_isready -U daniel -d personal
```

### Puerto ya en uso

Si un puerto está ocupado, puedes cambiar los puertos en `docker-compose.yaml`:

```yaml
chatbot:
  ports:
    - "8007:5000"  # Cambia 5007 por otro puerto
```

## 🚢 Despliegue en Producción

### Variables de Entorno

En producción, configura las variables de entorno de forma segura:

- Usa servicios de gestión de secretos (AWS Secrets Manager, Azure Key Vault, etc.)
- No uses el archivo `.env` directamente
- Configura variables de entorno en el servidor/contenedor

### Docker Compose (Producción)

```bash
# Usar configuración de producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la [documentación del chatbot](CHATBOT_INTEGRATION.md)
2. Consulta los logs: `docker-compose logs`
3. Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto es propiedad de ESPE - Escuela Politécnica del Ejército.

---

**Desarrollado con ❤️ por el equipo de ESPE**