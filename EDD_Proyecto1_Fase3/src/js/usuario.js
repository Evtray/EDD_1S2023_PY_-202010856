var grafoDirigido = new GrafoDirigido();
let nombreArchivo = "";
let nombreCarpeta = "";
let base64String = "";

var rutaCorrecta = "";

var tablaHash = new TablaHash();
let tabla = localStorage.getItem("tabla");
if (tabla) {
  var copytablaHash = JSON.parse(tabla);
  tablaHash.tabla = copytablaHash.tabla;
  tablaHash.capacidad = copytablaHash.capacidad;
  tablaHash.utilizacion = copytablaHash.utilizacion;
}

var usuario = JSON.parse(localStorage.getItem("estudiante"));
console.log(usuario, "usuario");

if (usuario.grafo !== undefined && usuario.grafo !== null) {
  if (usuario.grafo.primero !== null) {
    grafoDirigido.primero = usuario.grafo.primero;
    mostrarCarpetas(grafoDirigido.primero);
  }
}

var compartidos = [];

let compartidosStorage = localStorage.getItem("compartidos");
if (compartidosStorage) {
  compartidos = JSON.parse(compartidosStorage);
  var contenedor = document.getElementById("contenedor-archivos-comp");
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  for (let i = 0; i < compartidos.length; i++) {
    if (compartidos[i].destino === usuario.carnet.toString()) {
      let carpeta = document.createElement("div");
      let icono = "";
      let nombre = compartidos[i].archivo;
      let contenido = compartidos[i].data;
      let tipo = compartidos[i].tipo;
      let propietario = compartidos[i].usuario;
      if (tipo === "Imagen") {
        icono = "far fa-file-image";
      } else if (tipo === "pdf") {
        icono = "fas fa-file-pdf";
      } else if (tipo === "txt") {
        icono = "far fa-file-alt";
      }

      carpeta.className = "w-48 bg-gray-100 p-2 px-4 rounded";
      carpeta.innerHTML = `<div class=" flex justify-between">
      <div>
            <i class="${icono}"></i> <span class="text-gray-700 text-sm">${nombre}</span>
        </div>
        <div>
            <button id="btn-comp-${nombre}"  class="text-gray-700"><i class="far fa-eye"></i></button>
        </div>
        </div>
        <div class="text-xs text-gray-700 border-gray-300 border-t mt-1 pt-1">
            <i class="fas fa-user mr-1"></i>  ${propietario}
        </div>
        `;
      contenedor.appendChild(carpeta);

      let boton = document.getElementById(`btn-comp-${nombre}`);
      boton.addEventListener("click", () => {
        let contenedor = document.getElementById("file-view-comp");
        contenedor.innerHTML = "";
        if (tipo === "Imagen") {
          contenedor.innerHTML = `<img src="${contenido}" class="w-full">`;
        } else if (tipo === "pdf") {
          contenedor.innerHTML = `<embed src="${contenido}" type="application/pdf" width="100%" height="600px" />`;
        } else if (tipo === "txt") {
          // El texto original codificado en Base64
          var cadena_codificada = contenido;

          // Eliminar la parte inicial "data:text/plain;base64,"
          cadena_codificada = cadena_codificada.replace(
            "data:text/plain;base64,",
            ""
          );

          // Decodificar la cadena codificada en Base64
          var bytes_decodificados = atob(cadena_codificada);

          // Convertir los bytes decodificados en una cadena de texto utilizando la codificación UTF-8
          var texto_decodificado = decodeURIComponent(
            escape(bytes_decodificados)
          );

          contenedor.innerHTML = `<textarea class="w-full h-64 p-2 focus:outline-none" disabled>${texto_decodificado}</textarea>`;
        }

        // add boton close view file
        let botonCerrar = document.createElement("view-file-close");
        botonCerrar.className =
          "bg-red-500 text-white p-2 px-4 rounded focus:outline-none";
        botonCerrar.innerHTML = `<i class="fas fa-times"></i>`;
        botonCerrar.addEventListener("click", () => {
          contenedor.innerHTML = "";
        });
        contenedor.appendChild(botonCerrar);
      });
    }
  }
}

function guardarUsuario() {
  usuario.grafo = grafoDirigido;
  usuario = eliminarReferenciasCirculares(usuario);
  localStorage.setItem("estudiante", JSON.stringify(usuario));
  console.log(usuario, "guadar");
  tablaHash.actualizarUsuario(usuario.carnet, usuario);
  localStorage.setItem("tabla", JSON.stringify(tablaHash));
  localStorage.setItem("compartidos", JSON.stringify(compartidos));
}

let botonCrear = document.getElementById("btn-carpeta");
botonCrear.addEventListener("click", crearCarpeta);

function crearCarpeta() {
  let ruta = document.getElementById("input-buscar").value;
  if (ruta === "") {
    ruta = "/";
  }
  nombre = document.getElementById("input-carpeta").value;
  if (nombre !== "") {
    try {
      grafoDirigido.InsertarValores(ruta, nombre);
    } catch (error) {
      alert("Hubo un error al insertar el nodo");
    }
    buscarCarpeta();
    guardarUsuario();
    document.getElementById("input-carpeta").value = "";
  } else {
    alert("Se necesita un nombre para la carpeta");
  }
}

let botonBuscar = document.getElementById("btn-buscar");
botonBuscar.addEventListener("click", buscarCarpeta);

function buscarCarpeta() {
  var contenedor = document.getElementById("contenedor-archivos");

  var ruta = document.getElementById("input-buscar").value;
  if (ruta === "") {
    ruta = "/";
  }
  let carpeta = grafoDirigido.contenidoCarpeta(ruta);
  if (carpeta !== null) {
    rutaCorrecta = ruta;
    mostrarCarpetas(carpeta);
    return carpeta;
  } else {
    contenedor.innerHTML = `<div class="text-gray-700 font-normal p-2 text-sm bg-red-100 text-red-400 rounded px-4">
        <h3>No se encontro la carpeta</h3>
    </div>`;
    return null;
  }
}

function mostrarCarpetas(carpeta) {
  var contenedor = document.getElementById("contenedor-archivos");
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  let actual = carpeta.siguiente;
  let archivo = carpeta.matriz.principal.abajo;
  if (actual !== null || archivo !== null) {
    while (actual && carpeta.tipo === "padre") {
      let carpeta = document.createElement("div");
      carpeta.className = "w-48 bg-gray-100 p-2 px-4 rounded";
      carpeta.innerHTML = `<i class="fas fa-folder"></i> <span class="text-gray-700 text-sm">${actual.nombre}</span>`;
      contenedor.appendChild(carpeta);
      actual = actual.siguiente;
    }
    while (archivo) {
      let carpeta = document.createElement("div");
      let icono = "";
      if (archivo.tipo === "Imagen") {
        icono = "far fa-file-image";
      } else if (archivo.tipo === "pdf") {
        icono = "fas fa-file-pdf";
      } else if (archivo.tipo === "txt") {
        icono = "far fa-file-alt";
      }
      let nombre = archivo.contenido;
      let contenido = archivo.data;
      let tipo = archivo.tipo;

      carpeta.className =
        "w-48 bg-gray-100 p-2 px-4 rounded flex justify-between";
      carpeta.innerHTML = `<div>
          <i class="${icono}"></i> <span class="text-gray-700 text-sm">${nombre}</span>
      </div>
      <div>
          <button id="btn-${nombre}"  class="text-gray-700"><i class="far fa-eye"></i></button>
      </div>`;
      contenedor.appendChild(carpeta);

      let boton = document.getElementById(`btn-${nombre}`);
      boton.addEventListener("click", () => {
        let contenedor = document.getElementById("file-view");
        contenedor.innerHTML = "";
        if (tipo === "Imagen") {
          contenedor.innerHTML = `<img src="${contenido}" class="w-full">`;
        } else if (tipo === "pdf") {
          contenedor.innerHTML = `<embed src="${contenido}" type="application/pdf" width="100%" height="600px" />`;
        } else if (tipo === "txt") {
          // El texto original codificado en Base64
          var cadena_codificada = contenido;

          // Eliminar la parte inicial "data:text/plain;base64,"
          cadena_codificada = cadena_codificada.replace(
            "data:text/plain;base64,",
            ""
          );

          // Decodificar la cadena codificada en Base64
          var bytes_decodificados = atob(cadena_codificada);

          // Convertir los bytes decodificados en una cadena de texto utilizando la codificación UTF-8
          var texto_decodificado = decodeURIComponent(
            escape(bytes_decodificados)
          );

          contenedor.innerHTML = `<textarea class="w-full h-64 p-2 focus:outline-none" disabled>${texto_decodificado}</textarea>`;
        }

        // add boton close view file
        let botonCerrar = document.createElement("view-file-close");
        botonCerrar.className =
          "bg-red-500 text-white p-2 px-4 rounded focus:outline-none";
        botonCerrar.innerHTML = `<i class="fas fa-times"></i>`;
        botonCerrar.addEventListener("click", () => {
          contenedor.innerHTML = "";
        });
        contenedor.appendChild(botonCerrar);
      });

      archivo = archivo.abajo;
    }
  } else {
    contenedor.innerHTML = `<div class="text-gray-700 font-normal p-2 text-sm">
        <h3>No hay archivos</h3>
    </div>`;
  }

  let url = "https://quickchart.io/graphviz?graph=";
  let body = grafoDirigido.grafica();
  document.getElementById("graph").src = url + body;
}

let botonArchivo = document.getElementById("btn-archivo");
botonArchivo.addEventListener("click", cargarArchivo);

const archivo = document.getElementById("input-archivo");
archivo.addEventListener("change", onChange, false);

function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  nombreArchivo = event.target.files[0].name;
  document.getElementById("input-archivo-renombrar").value = nombreArchivo;
  reader.readAsDataURL(event.target.files[0]);
}

function onReaderLoad(event) {
  base64String = event.target.result;
}

function cargarArchivo() {
  let carpeta = buscarCarpeta();
  console.log(carpeta);
  let nombre = document.getElementById("input-archivo-renombrar").value;
  let tipo = "";
  if (carpeta) {
    let matriz = carpeta.matriz;
    let matriznueva = new Matriz();
    matriznueva.principal = matriz.principal;
    matriznueva.coordenadaX = matriz.coordenadaX;
    matriznueva.coordenadaY = matriz.coordenadaY;
    carpeta.matriz = matriznueva;

    if (nombreArchivo !== "") {
      let archivo = nombreArchivo.split(".");
      let extencion = archivo[1];
      let imagen = ["png", "jpeg", "jpg"];
      if (imagen.includes(extencion)) {
        tipo = "Imagen";
      } else if (extencion === "pdf") {
        tipo = "pdf";
      } else if (extencion === "txt") {
        tipo = "txt";
      }
      if (nombre == "") {
        nombre = nombreArchivo;
      }
      carpeta.matriz.InsertarArchivo(nombre, 1, tipo, base64String);
      document.getElementById("input-archivo").value = "";
      document.getElementById("input-archivo-renombrar").value = "";
      nombreArchivo = "";
      console.log(carpeta.matriz);
      guardarUsuario();
      buscarCarpeta();
    } else {
      alert("Se necesita un archivo");
    }
  }
}

function eliminarReferenciasCirculares(objeto, ancestros = []) {
  if (ancestros.includes(objeto)) {
    return null;
  }

  ancestros.push(objeto);

  for (let propiedad in objeto) {
    let valor = objeto[propiedad];

    if (typeof valor === "object" && valor !== null) {
      objeto[propiedad] = eliminarReferenciasCirculares(valor, [...ancestros]);
    }
  }

  return objeto;
}

let BotonPermiso = document.getElementById("btn-permiso");
BotonPermiso.addEventListener("click", archivoPermisos);
function archivoPermisos() {
  let carpeta = buscarCarpeta();
  if (carpeta) {
    let matriz = carpeta.matriz;
    let matrizNueva = new Matriz();
    matrizNueva.principal = matriz.principal;
    matrizNueva.coordenadaY = matriz.coordenadaY;
    matrizNueva.coordenadaX = matriz.coordenadaX;
    carpeta.matriz = matrizNueva;
    matriz = carpeta.matriz;
    let cadena = document.getElementById("input-permiso").value;
    if (cadena !== "") {
      let arreglo = cadena.split("-");
      let archivo = arreglo[0];
      let carnet = arreglo[1];
      let permisos = arreglo[2];
      if (carnet && permisos) {
        busqueda = true;
        if (busqueda) {
          let nodoArchivo = matriz.BuscarFila(arreglo[0]);
          if (nodoArchivo) {
            let nuevoPermiso = new Permiso(
              usuario.carnet,
              carnet,
              archivo,
              permisos,
              rutaCorrecta,
              nodoArchivo.data,
              nodoArchivo.tipo
            );
            compartidos.push(nuevoPermiso);
            matriz.ColocarPermiso(arreglo[0], carnet, permisos);
            document.getElementById("input-permiso").value = "";
            guardarUsuario();
            alert("Archivo compartido");
          } else {
            alert("No existe el archivo");
          }
        } else {
          alert("No existe el usuario indicado");
        }
      } else {
        alert("Ingrese los permisos");
      }
    } else {
      alert("Ingrese los permisos");
    }
  }
}
