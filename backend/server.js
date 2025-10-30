const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria (simulando base de datos)
let citas = [];

// Endpoint para obtener todas las citas
app.get('/api/citas', (req, res) => {
    res.json(citas);
});

// Endpoint para crear una nueva cita
app.post('/api/citas', (req, res) => {
    const { nombre, modeloMoto, servicio, fecha } = req.body;
    
    // Validación básica
    if (!nombre || !modeloMoto || !servicio || !fecha) {
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos' 
        });
    }

    // Crear nueva cita
    const nuevaCita = {
        id: Date.now().toString(),
        nombre,
        modeloMoto,
        servicio,
        fecha,
        createdAt: new Date().toISOString()
    };

    citas.push(nuevaCita);
    res.status(201).json(nuevaCita);
});

// Endpoint para actualizar una cita existente
app.put('/api/citas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, modeloMoto, servicio, fecha } = req.body;
    
    const index = citas.findIndex(cita => cita.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (!nombre || !modeloMoto || !servicio || !fecha) {
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos' 
        });
    }

    citas[index] = {
        ...citas[index],
        nombre,
        modeloMoto,
        servicio,
        fecha,
        updatedAt: new Date().toISOString()
    };

    res.json(citas[index]);
});

// Endpoint para eliminar una cita
app.delete('/api/citas/:id', (req, res) => {
    const { id } = req.params;
    
    const index = citas.findIndex(cita => cita.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const citaEliminada = citas.splice(index, 1)[0];
    res.json({ message: 'Cita eliminada correctamente', cita: citaEliminada });
});

// Endpoint para obtener una cita por ID
app.get('/api/citas/:id', (req, res) => {
    const { id } = req.params;
    const cita = citas.find(c => c.id === id);
    
    if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json(cita);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`📋 Sistema de Gestión de Citas para Mecánica de Motos`);
});

