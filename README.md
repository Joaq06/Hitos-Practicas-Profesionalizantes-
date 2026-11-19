# BiblioTech - Sistema de Gestión de Biblioteca (MVP)

Aplicación web integral desarrollada para **Prácticas Profesionalizantes I** (Tecnicatura Superior en Desarrollo de Software - ISFT Leopoldo Marechal).

## Enlaces de Despliegue (Render)
- **Frontend (Static Site):** `https://tu-frontend.onrender.com`
- **Backend (Web Service):** `https://tu-backend.onrender.com`

## Estructura del Repositorio
- `/backend`: API REST en Node.js y Express con almacenamiento en memoria y validación de reglas de negocio.
- `/frontend`: Interfaz web estática en HTML, CSS y JavaScript puro consumiendo la API mediante `fetch()`.
- `/documentacion`: Relevamiento funcional y documentación de hitos anteriores.

## Instalación y Ejecución Local

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
| `POST` | `/api/prestamos` | Registra un nuevo préstamo validando cupo (máx. 3) y modalidad. | JSON: `{ codigoSocio, libro, modalidad }` |
| `PATCH` | `/api/prestamos/:id` | Actualiza el estado de un préstamo (ej. a `Devuelto`). | JSON: `{ estado }` |