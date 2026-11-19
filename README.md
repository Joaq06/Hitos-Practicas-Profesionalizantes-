# BiblioTech - Sistema de Gestión de Biblioteca (MVP)

Aplicación web integral desarrollada para **Prácticas Profesionalizantes I** (*Tecnicatura Superior en Desarrollo de Software - ISFT Leopoldo Marechal*).

## Enlaces de Despliegue (Render)
- **Frontend (Static Site):** `https://bibliotech-frontend-h3xq.onrender.com`
- **Backend (Web Service / API):** `https://bibliotech-backend-owo2.onrender.com/api`

## Equipo desarrollador
- Joaquín Cardozo
- Katia Pastorini
- Michael Villaruel
- Joaquín Suárez

## Descripción del sistema
Plataforma web orientada a la gestión y control de préstamos bibliotecarios. Permite consultar el catálogo, buscar libros, registrar solicitudes para retiro a domicilio o lectura en sala y gestionar devoluciones mediante una API REST.

## Estructura del repositorio
- `/backend`: API REST en Node.js y Express con almacenamiento en memoria y validación de reglas de negocio.
- `/frontend`: Interfaz web estática en HTML, CSS y JavaScript puro consumiendo la API mediante `fetch()`.
- `/documentacion`: Relevamiento funcional, anotaciones técnicas y documentación del proyecto.

## Instalación y ejecución local

### Backend
1. Ingresar a la carpeta: `cd backend`
2. Instalar dependencias: `npm install`
3. Iniciar servidor: `npm start` (puerto `4000`)

### Frontend
1. Abrir `/frontend/index.html` mediante **Live Server** en Visual Studio Code.

## Endpoints de la API REST

| Método | Ruta | Operación | Datos requeridos |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/libros` | Lista el catálogo completo de libros y sus estados. | Ninguno |
| `GET` | `/api/prestamos` | Lista todos los préstamos o filtra por socio. | Query opcional: `?codigoSocio=SOC-102` |
| `POST` | `/api/prestamos` | Registra un nuevo préstamo validando cupo (máx. 3), disponibilidad y modalidad. | JSON: `{ codigoSocio, libroId, modalidad }` |
| `PATCH` | `/api/prestamos/:id` | Actualiza el estado de un préstamo (ej. a `Devuelto`). | JSON: `{ estado }` |

## Mejoras futuras
- Autenticación real de usuarios y panel de administración ampliado.
- Sistema de notificaciones por correo electrónico ante vencimientos próximos.
- Búsqueda avanzada por género, autor o año de publicación.
- Módulo de penalizaciones por devoluciones fuera de término.