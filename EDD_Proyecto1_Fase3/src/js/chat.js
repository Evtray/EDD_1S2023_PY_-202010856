var bloques = new Bloque();
let bloquesStorage = localStorage.getItem("bloques");
if (bloquesStorage) {
  var copybloques = JSON.parse(bloquesStorage);
  bloques.inicio = copybloques.inicio;
  bloques.bloques_creados = copybloques.bloques_creados;
}

var usuario = JSON.parse(localStorage.getItem("estudiante"));

bloques.buscarBloques(usuario.carnet)

function fechaActual() {
  let cadena = "";
  const fechaActual = new Date();
  cadena +=
    fechaActual.getDate() < 10
      ? "0" + fechaActual.getDate() + "-"
      : fechaActual.getDate() + "-";
  cadena +=
    fechaActual.getMonth() < 10
      ? "0" + (fechaActual.getMonth() + 1) + "-"
      : fechaActual.getMonth() + "-";
  cadena += fechaActual.getFullYear() + "::";
  cadena +=
    fechaActual.getHours() < 10
      ? "0" + fechaActual.getHours() + ":"
      : fechaActual.getHours() + ":";
  cadena +=
    fechaActual.getMinutes() < 10
      ? "0" + fechaActual.getMinutes() + ":"
      : fechaActual.getMinutes() + ":";
  cadena +=
    fechaActual.getSeconds() < 10
      ? "0" + fechaActual.getSeconds()
      : fechaActual.getSeconds();
  return cadena;
}

let btnChat = document.getElementById("btn-chat");
btnChat.addEventListener("click", enviarMensaje);

function enviarMensaje() {
  let receptor_mensaje = document.getElementById("input-receptor").value;
  let mensaje_final = document.getElementById("input-chat").value;
  bloques
    .insertarBloque(
      fechaActual(),
      usuario.carnet,
      receptor_mensaje,
      mensaje_final
    )
    .then(() => {
      let bloques_ref = eliminarReferenciasCirculares(bloques);
      localStorage.setItem("bloques", JSON.stringify(bloques_ref));
      document.getElementById("input-chat").value = "";
      bloques.mostrarBloques(usuario.carnet, receptor_mensaje).then(() => {
        var element = document.getElementById("contenedor-chat");
        element.scrollTop = element.scrollHeight;
      });
    });
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
