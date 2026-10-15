# tastebox-api
API REST de TasteBox (Node.js, Express y MySQL): suscripciones, usuarios, recetas, reseñas y recetas guardadas. Proyecto académico, segundo corte.
# TasteBox API

API REST del backend de **TasteBox**, una plataforma de recetas con suscripciones, reseñas y recetas guardadas. Proyecto académico del segundo corte.

## Tecnologías

- Node.js y Express
- MySQL 8
- Documentación OpenAPI 3.0
- Pruebas con Postman

## Recursos de la API

| Recurso | Ruta base | Descripción |
|---|---|---|
| Suscripciones | `/subscriptions` | Planes disponibles (Gratuito, Premium) |
| Usuarios | `/users` | Registro, consulta, actualización, eliminación e inicio de sesión (`POST /users/login`) |
| Recetas | `/recipes` | Catálogo de recetas |
| Reseñas | `/reviews` | Reseñas de los usuarios; consulta por receta en `/reviews/recipe/{recipeId}` |
| Recetas guardadas | `/saved-recipes` | Relación usuario–receta; consulta por usuario en `/saved-recipes/user/{userId}` |

En total son 26 endpoints, descritos con parámetros, cuerpos y respuestas de éxito y de error en [`docs/openapi.yaml`](docs/openapi.yaml).

## Estructura del proyecto

```
├── server.js            Punto de entrada y registro de rutas
├── routes/              Definición de rutas por recurso
├── dao/                 Validación de datos y acceso a la base de datos
├── services/            Conexión a MySQL
├── utils/               Utilidades compartidas
├── env/                 Configuración de la base de datos
├── database/            Script SQL de la base de datos
├── docs/                Especificación OpenAPI
└── tests/               Colección de Postman
```

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- MySQL 8 en ejecución
- Postman (opcional, para las pruebas)

## Instalación y ejecución

1. Clonar el repositorio e instalar dependencias:

   ```bash
   git clone https://github.com/SofiaSocha/tastebox-api.git
   cd tastebox-api
   npm install
   ```

2. Crear la base de datos ejecutando el script `database/BaseDefSiiiiiiiiii.sql` en MySQL Workbench (crea el esquema `tasteBox`, sus tablas y los planes Gratuito y Premium).

3. Configurar la conexión: copiar `env/mysqlConfig.example.js` como `env/mysqlConfig.js` y escribir el usuario y la contraseña de MySQL local. Este archivo no se sube al repositorio.

4. Iniciar la API:

   ```bash
   npm start
   ```

   La API queda disponible en `http://localhost:5000`.

## Documentación

La especificación completa está en `docs/openapi.yaml`. Para verla de forma interactiva, abrir <https://editor.swagger.io> y pegar el contenido del archivo.

## Pruebas

La carpeta `tests/` contiene la colección de Postman (`TasteBox_postman_collection.json`) con 53 peticiones y 83 verificaciones; cada endpoint tiene al menos un caso de éxito y uno de error, salvo la creación y eliminación de planes, que solo cuentan con caso de error.

1. Importar la colección en Postman.
2. Con la base de datos recién creada y la API en ejecución, abrir la colección y usar **Run** para ejecutarla en orden.

Las peticiones dependen unas de otras (por ejemplo, la receta se crea antes de la reseña), por lo que conviene ejecutarlas en el orden de las carpetas.

## Alcance y limitaciones de este corte

- La contraseña se almacena en texto plano, como lo establece el enunciado.
- El inicio de sesión verifica las credenciales, pero no emite tokens ni protege el resto de los endpoints.
- Los listados no tienen paginación ni filtros.
- Quedan fuera de este corte la caja semanal de ingredientes y la actividad de cocina.

## Equipo

- Sofía Socha
- Mariana Javier
- Valentina Cruz
