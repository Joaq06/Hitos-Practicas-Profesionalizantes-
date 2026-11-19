const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let datosGlobales = {
  usuarios: [
    { id: 1, codigoSocio: "SOC-101", nombre: "Ana Pérez", email: "ana@bibliotech.com", rol: "socio" },
    { id: 2, codigoSocio: "SOC-102", nombre: "Joaquín Suárez", email: "joaquin@bibliotech.com", rol: "socio" },
    { id: 3, codigoSocio: "ADM-01", nombre: "Carlos Bibliotecario", email: "admin@bibliotech.com", rol: "admin" }
  ],
  libros: [
    { id: 1, titulo: "Rayuela", autor: "Julio Cortázar", estado: "Disponible" },
    { id: 2, titulo: "Ficciones", autor: "Jorge Luis Borges", estado: "Solo Sala de Lectura" },
    { id: 3, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", estado: "No disponible (Agotado)" }
  ],
  prestamos: [
    { id: 1, codigoSocio: "SOC-102", libro: "Rayuela", modalidad: "Domicilio", devolverAntesDe: "23/08/2026", estado: "Activo" },
    { id: 2, codigoSocio: "SOC-102", libro: "Ficciones", modalidad: "Sala", devolverAntesDe: "01/08/2026", estado: "Devuelto" }
  ]
};

app.get('/', (req, res) => {
  res.json({ estado: "OK", mensaje: "API BiblioTech funcionando" });
});

app.get('/api/libros', (req, res) => {
  res.json(datosGlobales.libros);
});

app.get('/api/prestamos', (req, res) => {
  const { codigoSocio } = req.query;
  if (!codigoSocio) {
    return res.json(datosGlobales.prestamos);
  }
  const filtrados = datosGlobales.prestamos.filter(
    p => p.codigoSocio.toUpperCase() === codigoSocio.toUpperCase()
  );
  res.json(filtrados);
});

app.post('/api/prestamos', (req, res) => {
  const { codigoSocio, libro, modalidad } = req.body;

  if (!codigoSocio || !libro || !modalidad) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const libroObj = datosGlobales.libros.find(l => l.titulo === libro);
  if (!libroObj) {
    return res.status(404).json({ error: "El libro seleccionado no existe." });
  }

  if (libroObj.estado === "No disponible (Agotado)") {
    return res.status(400).json({ error: "Este ejemplar se encuentra agotado." });
  }
  if (libroObj.estado === "Solo Sala de Lectura" && modalidad === "Domicilio") {
    return res.status(400).json({ error: "El libro 'Ficciones' es exclusivo para lectura en Sala." });
  }

  const activosSocio = datosGlobales.prestamos.filter(
    p => p.codigoSocio.toUpperCase() === codigoSocio.toUpperCase() && p.estado === "Activo"
  );
  if (activosSocio.length >= 3) {
    return res.status(400).json({ error: "Cupo excedido: El socio ya tiene 3 préstamos activos." });
  }

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 7);

  const nuevoPrestamo = {
    id: Date.now(),
    codigoSocio: codigoSocio.toUpperCase(),
    libro,
    modalidad,
    devolverAntesDe: fechaLimite.toLocaleDateString("es-AR"),
    estado: "Activo"
  };

  datosGlobales.prestamos.push(nuevoPrestamo);
  res.status(201).json({ mensaje: "Préstamo registrado con éxito", prestamo: nuevoPrestamo });
});

app.patch('/api/prestamos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  const prestamo = datosGlobales.prestamos.find(p => p.id === id);
  if (!prestamo) {
    return res.status(404).json({ error: "Préstamo no encontrado." });
  }

  prestamo.estado = estado || "Devuelto";
  res.json({ mensaje: "Estado actualizado correctamente", prestamo });
});

app.listen(PORT, () => {
  console.log(`Servidor BiblioTech escuchando en http://localhost:${PORT}`);
  });