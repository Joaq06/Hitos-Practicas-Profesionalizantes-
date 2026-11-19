const API_URL = "http://localhost:4000/api";

function obtenerRolActual() {
  return sessionStorage.getItem("rolBiblioTech") || "socio";
}

function inicializarSelectorRol() {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  const contenedorRol = document.createElement("span");
  contenedorRol.style.marginLeft = "auto";
  contenedorRol.style.color = "#fff";

  const rolActual = obtenerRolActual();
  contenedorRol.innerHTML = `
    <label for="selector-rol" style="font-size: 0.9em;">Vista actual: </label>
    <select id="selector-rol" style="margin: 0; padding: 2px;">
      <option value="socio" ${rolActual === "socio" ? "selected" : ""}>Socio (SOC-102)</option>
      <option value="admin" ${rolActual === "admin" ? "selected" : ""}>Administrador (Bibliotecario)</option>
    </select>
  `;

  nav.appendChild(contenedorRol);

  document.querySelector("#selector-rol").addEventListener("change", (e) => {
    sessionStorage.setItem("rolBiblioTech", e.target.value);
    window.location.reload();
  });
}

async function inicializarIndex() {
  const seccionCatalogo = document.querySelector(".catalogo");
  if (!seccionCatalogo) return;

  let libros = [];
  try {
    const res = await fetch(`${API_URL}/libros`);
    libros = await res.json();
  } catch (error) {
    seccionCatalogo.innerHTML = "<h2>Catálogo de Libros</h2><p style='color:red;'>Error al conectar con el servidor backend.</p>";
    return;
  }

  function dibujarLibros(lista) {
    seccionCatalogo.innerHTML = "<h2>Catálogo de Libros</h2>";
    if (lista.length === 0) {
      seccionCatalogo.innerHTML += "<p>No se encontraron libros con ese criterio.</p>";
      return;
    }

    lista.forEach(libro => {
      const div = document.createElement("div");
      div.classList.add("tarjeta-libro");
      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p><b>Autor:</b> ${libro.autor}</p>
        <p><b>Estado:</b> ${libro.estado}</p>
        ${libro.estado !== "No disponible (Agotado)" 
          ? `<a href="pages/solicitar-prestamo.html?libro=${encodeURIComponent(libro.titulo)}">Pedir este libro</a>` 
          : ""}
      `;
      seccionCatalogo.appendChild(div);
    });
  }

  dibujarLibros(libros);

  // Buscador funcional
  const formBuscador = document.querySelector(".buscador form");
  if (formBuscador) {
    formBuscador.addEventListener("submit", (e) => {
      e.preventDefault();
      const texto = formBuscador.querySelector("input").value.toLowerCase().trim();
      const filtrados = libros.filter(
        l => l.titulo.toLowerCase().includes(texto) || l.autor.toLowerCase().includes(texto)
      );
      dibujarLibros(filtrados);
    });
  }
}


function inicializarFormulario() {
  const form = document.querySelector(".formulario form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const libroParam = params.get("libro");
  if (libroParam) {
    document.querySelector("#libro").value = libroParam;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigoSocio = document.querySelector("#socio").value.trim();
    const libro = document.querySelector("#libro").value;
    const modalidadSelect = document.querySelector("#modalidad").value;
    const modalidad = modalidadSelect === "domicilio" ? "Domicilio" : "Sala";

    try {
      const respuesta = await fetch(`${API_URL}/prestamos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoSocio, libro, modalidad })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(`No se pudo realizar el préstamo:\n${data.error}`);
        return;
      }

      sessionStorage.setItem("ultimoComprobante", JSON.stringify(data.prestamo));
      window.location.href = "confirmacion.html";
    } catch (error) {
      alert("Error de conexión con el servidor backend.");
    }
  });
}

function inicializarConfirmacion() {
  const divComprobante = document.querySelector(".comprobante");
  if (!divComprobante) return;

  const data = sessionStorage.getItem("ultimoComprobante");
  if (data) {
    const p = JSON.parse(data);
    divComprobante.innerHTML = `
      <h3>Comprobante Digital</h3>
      <p><b>Socio:</b> ${p.codigoSocio}</p>
      <p><b>Libro:</b> ${p.libro}</p>
      <p><b>Modalidad:</b> ${p.modalidad}</p>
      <p><b>Fecha límite para devolver:</b> ${p.devolverAntesDe}</p>
    `;
  }
}

async function inicializarMisPrestamos() {
  const tbody = document.querySelector(".tabla-prestamos tbody");
  const theadRow = document.querySelector(".tabla-prestamos thead tr");
  const tituloH2 = document.querySelector("main section h2");
  const pCupo = document.querySelector("main section p");
  if (!tbody) return;

  const rol = obtenerRolActual();
  const endpoint = rol === "admin" 
    ? `${API_URL}/prestamos` 
    : `${API_URL}/prestamos?codigoSocio=SOC-102`;

  try {
    const res = await fetch(endpoint);
    const prestamos = await res.json();

    tbody.innerHTML = "";

    if (rol === "admin") {
      tituloH2.textContent = "Panel de Administración - Todos los Préstamos";
      pCupo.textContent = `Total de registros en el sistema: ${prestamos.length}`;
      theadRow.innerHTML = `
        <th>Socio</th>
        <th>Libro</th>
        <th>Modalidad</th>
        <th>Devolver antes de</th>
        <th>Estado</th>
        <th>Acción</th>
      `;

      prestamos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.codigoSocio}</td>
          <td>${p.libro}</td>
          <td>${p.modalidad}</td>
          <td>${p.devolverAntesDe}</td>
          <td><b>${p.estado}</b></td>
          <td>
            ${p.estado === "Activo" 
              ? `<button onclick="marcarDevuelto(${p.id})">Registrar Devolución</button>` 
              : "Completado"}
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      const activos = prestamos.filter(p => p.estado === "Activo").length;
      tituloH2.textContent = "Mis Préstamos (SOC-102)";
      pCupo.textContent = `Cupo actual activo: ${activos} de 3 libros.`;

      prestamos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.libro}</td>
          <td>${p.modalidad}</td>
          <td>${p.devolverAntesDe}</td>
          <td>${p.estado}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    tbody.innerHTML = "<tr><td colspan='6'>Error al cargar datos del servidor.</td></tr>";
  }
}

window.marcarDevuelto = async function(id) {
  try {
    const res = await fetch(`${API_URL}/prestamos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Devuelto" })
    });

    if (res.ok) {
      alert("Devolución registrada con éxito.");
      inicializarMisPrestamos();
    }
  } catch (error) {
    alert("No se pudo actualizar el estado.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarSelectorRol();
  inicializarIndex();
  inicializarFormulario();
  inicializarConfirmacion();
  inicializarMisPrestamos();
});