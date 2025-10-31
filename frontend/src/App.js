import React, { useState, useEffect } from 'react';
import './App.css';

// URL del backend
const API_URL = 'http://localhost:3001/api';

function App() {
  const [citas, setCitas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    modeloMoto: '',
    servicio: '',
    fecha: ''
  });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await fetch(`${API_URL}/citas`);
      if (response.ok) {
        const data = await response.json();
        setCitas(data);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setError('Error al cargar las citas');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.modeloMoto || !formData.servicio || !formData.fecha) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      let response;
      if (editando) {
        // Actualizar cita existente
        response = await fetch(`${API_URL}/citas/${editando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Crear nueva cita
        response = await fetch(`${API_URL}/citas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        cargarCitas();
        setFormData({
          nombre: '',
          modeloMoto: '',
          servicio: '',
          fecha: ''
        });
        setEditando(null);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar la cita');
      }
    } catch (error) {
      console.error('Error al guardar cita:', error);
      setError('Error al conectar con el servidor');
    }
  };

  const handleEditar = (cita) => {
    setFormData({
      nombre: cita.nombre,
      modeloMoto: cita.modeloMoto,
      servicio: cita.servicio,
      fecha: cita.fecha
    });
    setEditando(cita);
  };

  const handleCancelarEdicion = () => {
    setFormData({
      nombre: '',
      modeloMoto: '',
      servicio: '',
      fecha: ''
    });
    setEditando(null);
    setError('');
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        const response = await fetch(`${API_URL}/citas/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          cargarCitas();
        } else {
          setError('Error al eliminar la cita');
        }
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        setError('Error al conectar con el servidor');
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏍️ Moto Rápida</h1>
          <p>Sistema de Gestión de Citas</p>
        </header>

        <div className="main-content">
          {/* Formulario de registro/edición */}
          <section className="form-section">
            <h2>{editando ? 'Editar Cita' : 'Registrar Nueva Cita'}</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="cita-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Cliente</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Reyes"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modeloMoto">Modelo de Moto</label>
                <input
                  type="text"
                  id="modeloMoto"
                  name="modeloMoto"
                  value={formData.modeloMoto}
                  onChange={handleInputChange}
                  placeholder="Ej: Honda CBR 600"
                />
              </div>

              <div className="form-group">
                <label htmlFor="servicio">Servicio Solicitado</label>
                <select
                  id="servicio"
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un servicio</option>
                  <option value="Mantenimiento general">Mantenimiento general</option>
                  <option value="Cambio de aceite">Cambio de aceite</option>
                  <option value="Revisión de frenos">Revisión de frenos</option>
                  <option value="Reparación de motor">Reparación de motor</option>
                  <option value="Cambio de neumáticos">Cambio de neumáticos</option>
                  <option value="Afinación">Afinación</option>
                  <option value="Diagnóstico electrónico">Diagnóstico electrónico</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fecha">Fecha de la Cita</label>
                <input
                  type="datetime-local"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Actualizar Cita' : 'Registrar Cita'}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={handleCancelarEdicion}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Lista de citas */}
          <section className="list-section">
            <h2>Citas Programadas ({citas.length})</h2>

            {citas.length === 0 ? (
              <div className="empty-state">
                <p>No hay citas programadas</p>
                <span className="emoji">📅</span>
              </div>
            ) : (
              <div className="citas-grid">
                {citas.map((cita) => (
                  <div key={cita.id} className="cita-card">
                    <div className="cita-header">
                      <h3>{cita.nombre}</h3>
                      <span className="cita-id">#{cita.id.slice(-4)}</span>
                    </div>
                    
                    <div className="cita-details">
                      <div className="detail-item">
                        <span className="label">🏍️ Moto:</span>
                        <span className="value">{cita.modeloMoto}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">🔧 Servicio:</span>
                        <span className="value">{cita.servicio}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">📅 Fecha:</span>
                        <span className="value">{formatearFecha(cita.fecha)}</span>
                      </div>
                    </div>

                    <div className="cita-actions">
                      <button
                        onClick={() => handleEditar(cita)}
                        className="btn btn-edit"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(cita.id)}
                        className="btn btn-delete"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
