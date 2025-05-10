require('dotenv').config();  // Cargar las variables de entorno
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');  // Importar el módulo 'path'
const app = express();
const PORT = 3000;

// Configura el cliente de Supabase usando las variables de entorno
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Servir archivos estáticos desde la carpeta 'public'

// Ruta para servir index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para recibir los datos de ubicación y guardarlos en Supabase
app.post('/save-location', async (req, res) => {
    const { latitude, longitude, timestamp } = req.body;

    // Insertar los datos de ubicación en la tabla 'locations' de Supabase
    const { data, error } = await supabase
        .from('locations')
        .insert([{ latitude, longitude, timestamp }]);

    if (error) {
        return res.status(500).send({ message: "Error al guardar los datos." });
    }

    res.send({ message: "Ubicación guardada correctamente." });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
