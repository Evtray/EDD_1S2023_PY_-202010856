var tablaHash = new TablaHash();
cargarTabla();

var bloque = new Bloque();
let bloquesStorage = localStorage.getItem("bloques");
if (bloquesStorage) {
  var copybloques = JSON.parse(bloquesStorage);
  bloque.inicio = copybloques.inicio;
  bloque.bloques_creados = copybloques.bloques_creados;
}

var compartidos = [];

let compartidosStorage = localStorage.getItem("compartidos");
if (compartidosStorage) {
  compartidos = JSON.parse(compartidosStorage);

  var tblBody = document.getElementById("tabla-compartidos");

  for (var i = 0; i < compartidos.length; i++) {
    var hilera = document.createElement("tr");

    var celda = document.createElement("td");
    // add p-2 class to td element
    celda.classList.add("p-2");
    // add border border-gray-300
    celda.classList.add("border", "border-gray-300");
    var textoCelda = document.createTextNode(compartidos[i].usuario);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.classList.add("p-2");
    celda.classList.add("border", "border-gray-300");

    var textoCelda = document.createTextNode(compartidos[i].destino);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.classList.add("p-2");
    celda.classList.add("border", "border-gray-300");

    var textoCelda = document.createTextNode(compartidos[i].ubicacion);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.classList.add("p-2");
    celda.classList.add("border", "border-gray-300");

    var textoCelda = document.createTextNode(compartidos[i].archivo);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.classList.add("p-2");
    celda.classList.add("border", "border-gray-300");

    var textoCelda = document.createTextNode(compartidos[i].permisos);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);
    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }
}

const inputElement = document.getElementById("input-cargamasiva");
inputElement.addEventListener("change", onChange, false);
function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

async function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  for (var i = 0; i < obj.alumnos.length; i++) {
    let pass_en = await tablaHash.sha256(obj.alumnos[i].password);
    tablaHash.insertar(
      obj.alumnos[i].carnet,
      obj.alumnos[i].nombre,
      pass_en,
      obj.alumnos[i].password
    );
  }
  guardarTabla();
  tablaHash.genera_tabla();
}

function guardarTabla() {
  localStorage.setItem("tabla", JSON.stringify(tablaHash));
}

function cargarTabla() {
  let tabla = localStorage.getItem("tabla");
  if (tabla) {
    var copytablaHash = JSON.parse(tabla);
    tablaHash.tabla = copytablaHash.tabla;
    tablaHash.capacidad = copytablaHash.capacidad;
    tablaHash.utilizacion = copytablaHash.utilizacion;
    tablaHash.genera_tabla();
  }
}

const btnReporte = document.getElementById("reporte");
btnReporte.addEventListener("click", reporte);

function reporte() {
  bloque_actual = bloque.inicio;
  if (bloque_actual != null) {
    let cadena = "Index: " + bloque_actual.valor["index"];
    cadena += "\nTimeStamp: " + bloque_actual.valor["timestamp"];
    cadena += "\nEmisor: " + bloque_actual.valor["transmitter"];
    cadena += "\nReceptor: " + bloque_actual.valor["receiver"];
    cadena += "\nMensaje: " + bloque_actual.valor["message"];
    cadena += "\nPreviousHash: " + bloque_actual.valor["previoushash"];
    cadena += "\nHash: " + bloque_actual.valor["hash"];
    document.getElementById("reporte-bloques").value = cadena;
    mostrar_Mensaje_descriptado();
  }
}

const btnReporte1 = document.getElementById("siguiente-bloque");
btnReporte1.addEventListener("click", reporte_siguente);

function reporte_siguente() {
  if (bloque_actual.siguiente != null) {
    bloque_actual = bloque_actual.siguiente;
    let cadena = "Index: " + bloque_actual.valor["index"];
    cadena += "\nTimeStamp: " + bloque_actual.valor["timestamp"];
    cadena += "\nEmisor: " + bloque_actual.valor["transmitter"];
    cadena += "\nReceptor: " + bloque_actual.valor["receiver"];
    cadena += "\nMensaje: " + bloque_actual.valor["message"];
    cadena += "\nPreviousHash: " + bloque_actual.valor["previoushash"];
    cadena += "\nHash: " + bloque_actual.valor["hash"];
    document.getElementById("reporte-bloques").value = cadena;
    mostrar_Mensaje_descriptado();
  } else {
    alert("No hay mas bloques");
  }
}

const btnReporte2 = document.getElementById("anterior-bloque");
btnReporte2.addEventListener("click", reporte_anterior);

function reporte_anterior() {
  if (bloque_actual.anterior != null) {
    bloque_actual = bloque_actual.anterior;
    let cadena = "Index: " + bloque_actual.valor["index"];
    cadena += "\nTimeStamp: " + bloque_actual.valor["timestamp"];
    cadena += "\nEmisor: " + bloque_actual.valor["transmitter"];
    cadena += "\nReceptor: " + bloque_actual.valor["receiver"];
    cadena += "\nMensaje: " + bloque_actual.valor["message"];
    cadena += "\nPreviousHash: " + bloque_actual.valor["previoushash"];
    cadena += "\nHash: " + bloque_actual.valor["hash"];
    document.getElementById("reporte-bloques").value = cadena;
    mostrar_Mensaje_descriptado();
  } else {
    alert("No hay mas bloques");
  }
}

async function mostrar_Mensaje_descriptado() {
  let cadena = await desencriptacion(
    bloque_actual.valor["message"],
    bloque_actual.valor["view"],
    bloque_actual.valor["algoritmo"]
  );

  document.getElementById("reporte-mensajes").value = cadena;
}
