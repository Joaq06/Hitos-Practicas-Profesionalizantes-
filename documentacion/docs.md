# Relevamiento Funcional - BiblioTech (MVP)

## 1. Objetivo del sistema
Permitir la consulta del catálogo de libros, la solicitud de préstamos con validación de reglas de negocio y el seguimiento/devolución de préstamos mediante una aplicación web conectada a una API REST.

## 2. Roles del sistema
- **Socio (`SOC-102`):** Puede consultar el catálogo, buscar libros, solicitar préstamos según reglas vigentes y revisar sus propios préstamos y cupo activo.
- **Administrador (Bibliotecario):** Puede visualizar el listado general de préstamos del sistema y registrar la devolución de préstamos activos.

*(Nota: Los roles se simulan desde la interfaz mediante un selector en la barra de navegación, sin autenticación compleja).*

## 3. Pantallas y flujos principales
- **Inicio (`index.html`):** Buscador por título o autor y catálogo de libros obtenido desde `/api/libros`, con acceso directo a solicitar préstamo en ejemplares habilitados.
- **Solicitar Préstamo (`solicitar-prestamo.html`):** Formulario con código/nombre de socio, selección de libro y modalidad (`Domicilio` o `Sala`), enviando la solicitud por `POST /api/prestamos`.
- **Confirmación (`confirmacion.html`):** Muestra el comprobante digital del préstamo registrado con fecha límite de devolución.
- **Mis Préstamos (`mis-prestamos.html`):** Lista los préstamos del socio o todos los préstamos si se cambia a vista Administrador, permitiendo marcar devoluciones (`PATCH /api/prestamos/:id`).

## 4. Reglas de negocio (validadas en backend)
- **Cupo máximo:** Un socio no puede superar los **3 préstamos activos** simultáneos.
- **Disponibilidad del libro:** No se pueden solicitar préstamos de libros marcados como `No disponible (Agotado)`.
- **Restricción por modalidad:** Los libros marcados como `Solo Sala de Lectura` no se pueden solicitar en modalidad `Domicilio`.

## 5. Endpoints de la API REST
- `GET /api/libros`: Devuelve la lista de libros del catálogo.
- `GET /api/prestamos`: Devuelve todos los préstamos o los filtrados por `codigoSocio`.
- `POST /api/prestamos`: Valida reglas de negocio y crea un nuevo préstamo.
- `PATCH /api/prestamos/:id`: Actualiza el estado de un préstamo (por ejemplo, a `Devuelto`).