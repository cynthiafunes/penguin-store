# Penguin Store

Sistema de comercio electrónico dividido en dos componentes principales:

### Backend (Node.js)
- Panel de administración para gestión de productos y pedidos
- Sistema de autenticación mediante JWT
- API RESTful para gestionar:
  - Productos (crear, editar, eliminar, listar)
  - Pedidos (crear, ver detalles, listar)
  - Autenticación de administradores
- Base de datos MongoDB para almacenamiento
- Plantillas EJS para las vistas del panel administrativo

### Frontend (Go)
- Interfaz pública para clientes
- Catálogo de productos con precios y stock
- Sistema de pedidos con dirección de entrega
- Plantillas HTML para el renderizado
- Conexión directa con MongoDB para consultas

El sistema está diseñado para una tienda de productos con gestión de inventario, pedidos y administración centralizada.



## Configuración del Backend (Node.js)

1. Navega al directorio backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con:
```
MONGODB_URI=mongodb://localhost:27017/penguin-store
JWT_SECRET=tu_clave_secreta
```

4. Inicia el servidor:
```bash
node index.js
```

El backend estará disponible en `http://localhost:3000`

## Configuración del Frontend (Go)

1. Navega al directorio frontend:
```bash
cd frontend
```

2. Descarga las dependencias:
```bash
go mod download
```

3. Inicia el servidor:
```bash
go run main.go
```

El frontend estará disponible en `http://localhost:8080`

## Uso

1. Panel de Administración (Backend):
   - Accede a `http://localhost:3000/login`
   - Gestiona productos y pedidos

2. Tienda (Frontend):
   - Accede a `http://localhost:8080`
   - Visualiza productos y realiza pedidos