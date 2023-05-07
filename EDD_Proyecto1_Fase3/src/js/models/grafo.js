class NodoMatrizAdyacencia {
  constructor(nombre, tipo) {
    this.nombre = nombre;
    this.matriz = new Matriz();
    this.tipo = tipo;
    this.siguiente = null;
    this.abajo = null;
  }
}

class GrafoDirigido {
  constructor() {
    this.primero = new NodoMatrizAdyacencia("/", "padre");
  }

  AgregarHijo(inicio, nuevoNodo) {
    if (inicio.incioCarpeta === null) {
      inicio.incioCarpeta = nuevoNodo;
    } else {
      let actual = inicio.incioCarpeta;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
    return inicio;
  }

  InsertarColumna(ruta, padre, nombre) {
    const nuevoNodo = new NodoMatrizAdyacencia(nombre, "hijo");
    if (this.primero !== null && this.primero.nombre === padre) {
      let actual = this.primero;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
      return true;
    } else {
      this.BuscarRutaV2(ruta, 2);
      let actual = this.primero;
      while (actual) {
        if (actual.nombre === padre) {
          break;
        }
        actual = actual.abajo;
      }
      if (actual) {
        while (actual.siguiente) {
          actual = actual.siguiente;
        }
        actual.siguiente = nuevoNodo;
        return true;
      } else {
        return false;
      }
    }
  }

  //Fila -> Insertar Padre
  InsertarFila(nodoPadre) {
    let actual = this.primero;
    while (actual.abajo) {
      actual = actual.abajo;
    }
    actual.abajo = nodoPadre;
  }

  BuscarRuta(nombreBuscado) {
    let padre = this.primero;
    while (padre) {
      let hijo = padre.siguiente;
      while (hijo) {
        if (hijo.nombre === nombreBuscado) {
          if (padre.nombre === "/") {
            return "/" + hijo.nombre;
          } else {
            return this.BuscarRuta(padre.nombre) + "/" + hijo.nombre;
          }
        }
        hijo = hijo.siguiente;
      }
      padre = padre.abajo;
    }
  }

  BuscarRutaV2(ruta, opc) {
    let nombres = ruta.split("/");
    let rutaArmada = "";
    let comprobacion = false;
    if (nombres[0] === "" && nombres[1] === "") {
      comprobacion = true;
    } else if (nombres[0] === "" && nombres[1] !== "") {
      nombres[0] = "/";
      for (let i = 0; i < nombres.length; i++) {
        if (nombres[i + 1]) {
          let padre = this.primero;
          while (padre) {
            if (padre.nombre === nombres[i]) {
              let hijo = padre.siguiente;
              while (hijo) {
                if (nombres[i + 1] === hijo.nombre) {
                  rutaArmada += "/" + hijo.nombre;
                  if (!nombres[i + 2] && ruta === rutaArmada) {
                    comprobacion = true;
                    if (opc === 2) {
                      let repetido = this.PadreReptido(hijo.nombre);
                      if (!repetido) {
                        let nuevoNodo = new NodoMatrizAdyacencia(
                          hijo.nombre,
                          "padre"
                        );
                        nuevoNodo.matriz = hijo.matriz;
                        this.InsertarFila(nuevoNodo);
                      }
                    } else if (opc === 3) {
                      return hijo;
                    }
                  }
                  break;
                }
                hijo = hijo.siguiente;
              }
              break;
            }
            padre = padre.abajo;
          }
        }
      }
    }
    return comprobacion;
  }

  InsertarValores(ruta, hijo) {
    let nombres = ruta.split("/");
    let padre = "";
    if (nombres[0] === "" && nombres[1] === "") {
      padre = "/";
    } else if (nombres[0] === "" && nombres[1] !== "") {
      padre = nombres[nombres.length - 1];
    }
    this.InsertarColumna(ruta, padre, hijo);
  }

  PadreReptido(nombre) {
    let actual = this.primero;
    while (actual) {
      if (actual.nombre === nombre) {
        return true;
      }
      actual = actual.abajo;
    }
    return false;
  }

  VerPadres() {
    let actual = this.primero;
    while (actual) {
      console.log("padre: ", actual.nombre);
      actual = actual.abajo;
    }

  }

  BuscarPadre(ruta) {
    let nombres = ruta.split("/");
    let nombre = "";
    let encontrado = null;
    if (nombres[0] === "" && nombres[1] === "") {
      nombre = "/";
    } else if (nombres[0] === "" && nombres[1] !== "") {
      nombre = nombres[nombres.length - 1];
    }

    let actual = this.primero;
    while (actual) {
      if (actual.nombre === nombre) {
        encontrado = actual;
        break;
      }
      actual = actual.abajo;
    }

    return encontrado;
  }

  contenidoCarpeta(ruta) {
    let hijo = this.BuscarRutaV2(ruta, 3);
    if (hijo) {
      let padre = this.BuscarPadre(ruta);
      if (padre) {
        return padre;
      } else {
        return hijo;
      }
    }

    return null;
  }

  Profundidad(nombreBuscado) {
    console.log(nombreBuscado);
    let padre = this.primero;
    while (padre) {
      let hijo = padre.siguiente;
      while (hijo) {
        if (hijo.nombre === nombreBuscado) {
          if (padre.nombre === "/") {
            console.log("ENTRO");
            return 2;
          } else {
            return this.Profundidad(padre.nombre) + 1;
          }
        }
        hijo = hijo.siguiente;
      }
      padre = padre.abajo;
    }
    return 1;
  }

  grafica() {
    let cadena =
      'graph grafoNoDirigido{ rankdir=LR; node [shape=box]; "/"; node [shape = ellipse] ; layout=neato; ';
    let auxPadre = this.primero;
    let auxHijo = this.primero;
    while (auxPadre) {
      auxHijo = auxPadre.siguiente;
      let peso = this.Profundidad(auxPadre.nombre);
      while (auxHijo) {
        cadena +=
          '"' +
          auxPadre.nombre +
          '"' +
          " -- " +
          '"' +
          auxHijo.nombre +
          '"' +
          ' [label="' +
          peso +
          '"] ';
        auxHijo = auxHijo.siguiente;
      }
      auxPadre = auxPadre.abajo;
    }
    cadena += "}";
    return cadena;
  }
}
