import express from 'express';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// aquí configuro handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../public')));

// aquí dejo mi codigo para las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 

const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('newProduct', (product) => {
        io.emit('updateProducts', product); 
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('removeProduct', productId);
    });
});

export { io };

