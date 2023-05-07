class nodoBloque {
  constructor(
    index,
    fecha,
    emisor,
    receptor,
    mensaje,
    previousHash,
    hash,
    view,
    algoritmo
  ) {
    this.valor = {
      index: index,
      timestamp: fecha,
      transmitter: emisor,
      receiver: receptor,
      message: mensaje,
      previoushash: previousHash,
      hash: hash,
      view: view,
      algoritmo: algoritmo,
    };
    this.siguiente = null;
    this.anterior = null;
  }
}

class Bloque {
  constructor() {
    this.inicio = null;
    this.bloques_creados = 0;
  }

  async insertarBloque(fecha, emisor, receptor, mensaje) {
    if (this.inicio === null) {
      let cadena = this.bloques_creados + fecha + emisor + receptor + mensaje;
      let hash = await this.sha256(cadena);
      let mensajeEncriptado = await encriptacion(mensaje);
      const nuevoBloque = new nodoBloque(
        this.bloques_creados,
        fecha,
        emisor.toString(),
        receptor.toString(),
        mensajeEncriptado.cifradoBase64,
        "0000",
        hash,
        mensajeEncriptado.view,
        mensajeEncriptado.algoritmo
      );
      this.inicio = nuevoBloque;
      this.bloques_creados++;
    } else {
      let cadena = this.bloques_creados + fecha + emisor + receptor + mensaje;
      let hash = await this.sha256(cadena);
      let mensajeEncriptado = await encriptacion(mensaje);
      let aux = this.inicio;
      while (aux.siguiente) {
        aux = aux.siguiente;
      }
      const nuevoBloque = new nodoBloque(
        this.bloques_creados,
        fecha,
        emisor.toString(),
        receptor.toString(),
        mensajeEncriptado.cifradoBase64,
        aux.valor["hash"],
        hash,
        mensajeEncriptado.view,
        mensajeEncriptado.algoritmo
      );
      nuevoBloque.anterior = aux;
      aux.siguiente = nuevoBloque;
      this.bloques_creados++;
    }
  }

  async mostrarBloques(carnet, receptor) {
    let aux = this.inicio;
    let contenedor = document.getElementById("contenedor-chat");
    contenedor.innerHTML = "";
    console.log(carnet, receptor);
    while (aux) {
      if (aux.valor["transmitter"].toString()  == carnet.toString() ) {
        if (aux.valor["receiver"].toString()  == receptor.toString() ) {
          let mensajeDesencriptado = await desencriptacion(
            aux.valor["message"],
            aux.valor["view"],
            aux.valor["algoritmo"]
          );
          console.log(carnet, receptor, aux.valor);
          contenedor.appendChild(
            this.preparaBloqueEmisor(mensajeDesencriptado)
          );
        }
      } else if (aux.valor["receiver"].toString() == carnet.toString()) {
        if (aux.valor["transmitter"].toString() == receptor.toString()) {
          let mensajeDesencriptado = await desencriptacion(
            aux.valor["message"],
            aux.valor["view"],
            aux.valor["algoritmo"]
          );
          console.log(aux.valor);
          contenedor.appendChild(
            this.preparaBloqueReceptor(mensajeDesencriptado)
          );
        }
      }
      aux = aux.siguiente;
    }
  }

  buscarBloques(carnet) {
    let chats = [];
    let aux = this.inicio;
    let contenedor = document.getElementById("contenedor-chat-usuarios");
    contenedor.innerHTML = "";
    while (aux) {
      if (
        aux.valor["transmitter"].toString()  == carnet.toString()  ||
        aux.valor["receiver"].toString()  == carnet.toString() 
      ) {
        let existe = false;
        let receiver = null;
        if (aux.valor["transmitter"] == carnet) {
          receiver = aux.valor["receiver"];
        } else {
          receiver = aux.valor["transmitter"];
        }

        for (let x = 0; x < chats.length; x++) {
          if (chats[x].receiver === receiver) {
            existe = true;
          }
        }

        if (!existe) {
          chats.push({ receiver: receiver });
        }
      }
      aux = aux.siguiente;
    }

    for (let x = 0; x < chats.length; x++) {
      let div = document.createElement("div");
      div.setAttribute("class", "p-3 border-gray-300 border-t cursor-pointer");
      let span = document.createElement("span");
      span.setAttribute("class", "text-sm");
      let i = document.createElement("i");
      i.setAttribute("class", "fas fa-user mr-2");
      let span2 = document.createElement("span");
      span2.setAttribute("id", "pre-usuario-chat" + chats[x].receiver);
      span2.innerHTML = chats[x].receiver;
      span.appendChild(i);
      span.appendChild(span2);
      div.appendChild(span);
      contenedor.appendChild(div);

      let self = this;
      span2.addEventListener("click", function () {
        document.getElementById("input-receptor").value = chats[x].receiver;
        self.mostrarBloques(carnet, chats[x].receiver);
      });
    }
  }

  preparaBloqueReceptor(mensajeDesencriptado) {
    let carpeta = document.createElement("div");
    carpeta.setAttribute("class", "px-2 flex my-2");
    let mensaje = document.createElement("div");
    mensaje.setAttribute("class", "bg-blue-100 px-2 py-1 rounded");
    let texto = document.createElement("span");
    texto.setAttribute("class", "text-sm");
    texto.innerHTML = mensajeDesencriptado;
    mensaje.appendChild(texto);
    carpeta.appendChild(mensaje);

    return carpeta;
  }

  preparaBloqueEmisor(mensajeDesencriptado) {
    let carpeta = document.createElement("div");
    carpeta.setAttribute("class", "px-2 flex justify-end my-2");
    let mensaje = document.createElement("div");
    mensaje.setAttribute("class", "bg-green-200 px-2 py-1 rounded");
    let texto = document.createElement("span");
    texto.setAttribute("class", "text-sm");
    texto.innerHTML = mensajeDesencriptado;
    mensaje.appendChild(texto);
    carpeta.appendChild(mensaje);

    return carpeta;
  }

  async sha256(mensaje) {
    let cadenaFinal;
    const enconder = new TextEncoder();
    const mensajeCodificado = enconder.encode(mensaje);
    await crypto.subtle
      .digest("SHA-256", mensajeCodificado)
      .then((result) => {
        // 100 -> 6a
        const hashArray = Array.from(new Uint8Array(result));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        cadenaFinal = hashHex;
      })
      .catch((error) => console.log(error));
    return cadenaFinal;
  }

  grafica() {
    let cadena = "digraph { node [shape=record];";
    let aux = this.inicio;
    while (aux) {
      cadena +=
        aux.valor["index"] +
        '[label="TimeStamp = ' +
        aux.valor["timestamp"] +
        "\\n Emisor = " +
       aux.valor["transmitter"] +
        "\\n Receptor = " +
        aux.valor["receiver"] +
        "\\n Mensaje = " +
        aux.valor["message"] +
        "\\n Previou Hash = " +
        aux.valor["previoushash"] +
        "\\n Hash = " +
        aux.valor["hash"] +
        '"];';
      aux = aux.siguiente;
    }
    aux = this.inicio;
    while (aux.siguiente) {
      console.log(aux.valor["hash"], aux.siguiente.valor["hash"]);
      cadena += aux.valor["index"] + " -> " + aux.siguiente.valor["index"] + ";";
      aux = aux.siguiente;
    }
    cadena += "}";
    return cadena;
  }
}
