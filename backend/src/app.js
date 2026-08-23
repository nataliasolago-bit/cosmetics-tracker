const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/productoRoutes');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});
app.use('/api/productos', productoRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ No se pudo iniciar el servidor:', err);
        process.exit(1);
    }
}

start();