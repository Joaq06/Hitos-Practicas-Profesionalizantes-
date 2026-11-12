document.addEventListener("DOMContentLoaded", () => {
  const dentroDePages = window.location.pathname.includes("/pages/");
  
  document.querySelectorAll("nav a").forEach(enlace => {
    const hrefOriginal = enlace.getAttribute("href");
    if (!hrefOriginal.startsWith("http") && !hrefOriginal.startsWith("#")) {
      if (dentroDePages && !hrefOriginal.startsWith("../")) {
        if (hrefOriginal === "index.html") {
          enlace.setAttribute("href", "../index.html");
        }
      } else if (!dentroDePages && hrefOriginal.startsWith("../")) {
        enlace.setAttribute("href", hrefOriginal.replace("../", ""));
      }
    }
  });
});

async function renderizarMisPrestamos() {
  const tbody = document.querySelector(".tabla-prestamos tbody");
  const pCupo = document.querySelector("main section p");
  if (!tbody) return;

  const datosGlobales = await obtenerDatosGlobales();
  
  let usuarioActual = obtenerUsuarioActual();
  if (!usuarioActual) {
    usuarioActual = { codigoSocio: "SOC-102", rol: "socio" };
  }

  let prestamosUsuario = datosGlobales.prestamos.filter(p => 
    p.codigoSocio === usuarioActual.codigoSocio || p.usuarioId === usuarioActual.id
  );

  if (prestamosUsuario.length === 0 && datosGlobales.prestamos.length > 0) {
    prestamosUsuario = datosGlobales.prestamos; 
  }

  tbody.innerHTML = "";

  prestamosUsuario.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.libro}</td>
      <td>${p.modalidad || "Domicilio"}</td>
      <td>${p.devolverAntesDe || "23/08/2026"}</td>
      <td>${p.estado || "Activo"}</td>
    `;
    tbody.appendChild(tr);
  });

  if (pCupo) {
    pCupo.textContent = `Cupo actual: ${prestamosUsuario.length} de 3 libros. (Socio: ${usuarioActual.codigoSocio})`;
  }
}