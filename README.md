# Biblioteca
Se desarrollo una aplicación web que gestione el proceso de préstamo de libros a sus estudiantes, profesores y funcionarios en general de dicha organización.

Funcionalidades:
El frontend del sistema será desarrollado en REACT y Bootstrap.
La parte del backend estará soportada en los servicios de autenticación (Auth), almacenamiento (firestore).

Características:

➢ Interfaz de usuario responsive e intuitiva.

➢ Autenticación de usuarios (email y password).

➢ Rutas protegidas (solo los usuarios registrados pueden buscar libros, hacer préstamos y devolver libros, solo los usuarios tipo administrador pueden gestionar libros).

➢ Módulo admin de gestión de libros (crud de libros – solo para usuarios administradores).

➢ Módulo de búsqueda de libros por título.
➢ Módulo de registro de préstamo y devolución de libros.(crud de préstamos).

La aplicación cuenta con página de inicio, navbar (presente en todo el sitio), el cual cuenta con links a:
• formularios de registro/logueo,
• consultas, búsquedas y registro de prestamos y devoluciones (solo para usuarios logueados).
• link cerrar sesión(disponible una vez el usuario este logueado). 
