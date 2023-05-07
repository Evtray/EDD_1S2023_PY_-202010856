class nodoHash {
  constructor(carnet, usuario, pass_en, password) {
    this.carnet = carnet;
    this.usuario = usuario;
    this.pass_en = pass_en;
    this.password = password;
    this.grafo = new GrafoDirigido();
  }
}

class TablaHash {
  constructor() {
    this.tabla = new Array(7);
    this.capacidad = 7;
    this.utilizacion = 0;
  }

  insertar(carnet, usuario, pass_en, password) {
    let indice = this.calculoIndice(carnet);
    const nuevoNodo = new nodoHash(carnet, usuario, pass_en, password);
    if (indice < this.capacidad) {
      try {
        if (this.tabla[indice] == null) {
          console.log("Entre");
          this.tabla[indice] = nuevoNodo;
          this.utilizacion++;
          this.capacidad_tabla();
        } else {
          let contador = 1;
          indice = this.RecalculoIndice(carnet, contador);
          while (this.tabla[indice] != null) {
            contador++;
            indice = this.RecalculoIndice(carnet, contador);
          }
          this.tabla[indice] = nuevoNodo;
          this.utilizacion++;
          this.capacidad_tabla();
        }
      } catch (err) {
        console.log("Hubo un error en insercion");
      }
    }
  }

  calculoIndice(carnet) {
    let carnet_cadena = carnet.toString();
    let divisor = 0;
    for (let i = 0; i < carnet_cadena.length; i++) {
      divisor = divisor + carnet_cadena.charCodeAt(i);
    }
    let indice_final = divisor % this.capacidad;
    return indice_final;
  }

  capacidad_tabla() {
    let aux_utilizacion = this.capacidad * 0.75;
    if (this.utilizacion > aux_utilizacion) {
      this.capacidad = this.nueva_capacidad();
      this.utilizacion = 0;
      this.ReInsertar();
    }
  }

  nueva_capacidad() {
    let numero = this.capacidad + 1;
    while (!this.isPrime(numero)) {
      numero++;
    }
    return numero;
  }

  ReInsertar() {
    const auxiliar_tabla = this.tabla;
    this.tabla = new Array(this.capacidad);
    auxiliar_tabla.forEach((alumno) => {
      this.insertar(
        alumno.carnet,
        alumno.usuario,
        alumno.pass_en,
        alumno.password
      );
    });
  }

  RecalculoIndice(carnet, intento) {
    let nuevo_indice = this.calculoIndice(carnet) + intento * intento;
    let nuevo = this.nuevo_Indice(nuevo_indice);
    return nuevo;
  }

  nuevo_Indice(numero) {
    let nueva_posicion = 0;
    if (numero < this.capacidad) {
      nueva_posicion = numero;
    } else {
      nueva_posicion = numero - this.capacidad;
      nueva_posicion = this.nuevo_Indice(nueva_posicion);
    }
    return nueva_posicion;
  }

  busquedaUsuario(carnet, pass_en) {
    let indice = this.calculoIndice(carnet);
    if (indice < this.capacidad) {
      try {
        if (this.tabla[indice] == null) {
          return null;
        } else if (
          this.tabla[indice] != null &&
          this.tabla[indice].carnet == carnet
        ) {
          if (this.tabla[indice].pass_en == pass_en) {
            return this.tabla[indice];
          } else {
            return null;
          }
        } else {
          let contador = 1;
          indice = this.RecalculoIndice(carnet, contador);
          while (this.tabla[indice] != null) {
            if (this.tabla[indice].carnet == carnet) {
              if (this.tabla[indice].pass_en == pass_en) {
                return this.tabla[indice];
              } else {
                return null;
              }
            }
            contador++;
            indice = this.RecalculoIndice(carnet, contador);
          }
        }
      } catch (err) {
        return null;
      }
    }
  }

  actualizarUsuario(carnet, usuario) {
    let indice = this.calculoIndice(carnet);
    if (indice < this.capacidad) {
      try {
        if (this.tabla[indice] == null) {
          return false;
        } else if (
          this.tabla[indice] != null &&
          this.tabla[indice].carnet == carnet
        ) {
          this.tabla[indice] = usuario;
          return true;
        } else {
          let contador = 1;
          indice = this.RecalculoIndice(carnet, contador);
          while (this.tabla[indice] != null) {
            if (this.tabla[indice].carnet == carnet) {
              this.tabla[indice] = usuario;
              return true;
            }
            contador++;
            indice = this.RecalculoIndice(carnet, contador);
          }
        }
      } catch (err) {
        return false;
      }
    }
  }
  genera_tabla() {
    var tblBody = document.getElementById("tabla-estudiantes");

    for (var i = 0; i < this.capacidad; i++) {
      if (this.tabla[i] != null) {
        var hilera = document.createElement("tr");

        var celda = document.createElement("td");
        celda.classList.add("p-2");
        celda.classList.add("border", "border-gray-300");
        var textoCelda = document.createTextNode(this.tabla[i].carnet);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);

        var celda = document.createElement("td");
        celda.classList.add("p-2");
        celda.classList.add("border", "border-gray-300");

        var textoCelda = document.createTextNode(this.tabla[i].usuario);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);

        var celda = document.createElement("td");
        celda.classList.add("p-2");
        celda.classList.add("border", "border-gray-300");

        var textoCelda = document.createTextNode(this.tabla[i].pass_en);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);

        tblBody.appendChild(hilera);
      }
    }
  }

  isPrime(numero) {
    if (numero <= 1) {
      return false;
    }
    if (numero === 2) {
      return true;
    }
    if (numero % 2 === 0) {
      return false;
    }
    for (let i = 3; i <= Math.sqrt(numero); i += 2) {
      if (numero % i === 0) {
        return false;
      }
    }
    return true;
  }

  async sha256(mensaje) {
    let cadenaFinal;
    const enconder = new TextEncoder();
    const mensajeCodificado = enconder.encode(mensaje);
    await crypto.subtle
      .digest("SHA-256", mensajeCodificado)
      .then((result) => {
        const hashArray = Array.from(new Uint8Array(result));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        cadenaFinal = hashHex;
      })
      .catch((error) => console.log(error));
    return cadenaFinal;
  }
}
