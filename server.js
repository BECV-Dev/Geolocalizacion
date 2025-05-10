const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Servir archivos estáticos desde la carpeta 'public'

// Ruta para servir index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para recibir los datos de ubicación y guardarlos en un archivo JSON
app.post('/save-location', (req, res) => {
    const locationData = req.body;

    // Ruta del archivo JSON donde se guardarán las ubicaciones
    const filePath = path.join(__dirname, 'public', 'locations.json');

    // Leer los datos previos (si existen) y agregar la nueva ubicación
    fs.readFile(filePath, 'utf8', (err, data) => {
        let jsonData = [];
        
        if (!err && data) {
            jsonData = JSON.parse(data); // Si hay datos previos, los parseamos
        }

        // Agregar la nueva ubicación a los datos
        jsonData.push(locationData);

        // Escribir los datos en el archivo JSON
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: "Error al guardar los datos." });
            }
            res.send({ message: "Ubicación guardada correctamente." });
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});