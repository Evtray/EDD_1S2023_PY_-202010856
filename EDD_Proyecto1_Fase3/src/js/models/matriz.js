class NodoMatriz {
  constructor(posX, posY, contenido, tipo, data = null) {
    this.siguiente = null;
    this.anterior = null;
    this.abajo = null;
    this.arriba = null;
    this.posX = posX;
    this.posY = posY;
    this.contenido = contenido;
    this.data = data;
    this.tipo = tipo;
  }
}

class Matriz {
  constructor() {
    this.principal = new NodoMatriz(-1, -1, "Raiz", "");
    this.coordenadaY = 0;
    this.coordenadaX = 0;
  }

  BuscarFila(nombreArchivo) {
    let aux = this.principal;
    while (aux) {
      if (aux.contenido === nombreArchivo) {
        return aux;
      }
      aux = aux.abajo;
    }
    return null;
  }

  BuscarColumna(carnet) {
    let aux = this.principal;
    while (aux) {
      if (aux.contenido === carnet) {
        return aux;
      }
      aux = aux.siguiente;
    }
    return null;
  }

  InsertarColumna(posicion, carnet) {
    const nuevoNodo = new NodoMatriz(posicion, -1, carnet, "");
    let piv = this.principal;
    let pivA = this.principal;
    while (piv.siguiente) {
      if (nuevoNodo.posX > piv.posX) {
        pivA = piv;
        piv = piv.siguiente;
      } else {
        nuevoNodo.siguiente = piv;
        nuevoNodo.anterior = pivA;
        pivA.siguiente = nuevoNodo;
        piv.anterior = nuevoNodo;
        return;
      }
    }
    nuevoNodo.anterior = piv;
    piv.siguiente = nuevoNodo;
  }

  InsertarFila(posicion, nombre, tipo, data) {
    //practiacamente siempre se inserta al final ya sea la fila o columna
    const nuevoNodo = new NodoMatriz(-1, posicion, nombre, tipo, data);
    let piv = this.principal;
    let pivA = this.principal;
    while (piv.abajo) {
      if (nuevoNodo.posY > piv.posY) {
        pivA = piv;
        piv = piv.abajo;
      } else {
        nuevoNodo.abajo = piv;
        nuevoNodo.arriba = pivA;
        pivA.abajo = nuevoNodo;
        piv.arriba = nuevoNodo;
        return;
      }
    }
    nuevoNodo.arriba = piv;
    piv.abajo = nuevoNodo;
  }

  InsertarArchivo(nombre, numero, tipo, data) {
    let fila = this.BuscarFila(nombre);
    if (fila === null) {
      this.InsertarFila(this.coordenadaY, nombre, tipo, data);
      this.coordenadaY++;
    } else {
      let copiaArchivo = "(" + numero++ + ")" + nombre;
      this.InsertarArchivo(copiaArchivo, numero, tipo, data);
    }
  }

  ColocarPermiso(archivo, carnet, permisos) {
    /** NOTA: Paso Previo Buscar en AVL si existe el carnet*/
    let columna = this.BuscarColumna(carnet);
    let fila = this.BuscarFila(archivo);
    if (columna === null) {
      this.InsertarColumna(this.coordenadaX, carnet);
      this.coordenadaX++;
      columna = this.BuscarColumna(carnet);
    }
    if (columna !== null && fila !== null) {
      this.InsertarNodo(columna.posX, fila.posY, permisos);
    }
  }

  InsertarNodo(x, y, permiso) {
    const nuevoNodo = new NodoMatriz(x, y, permiso, "");
    let tempX = this.principal;
    let tempY = this.principal;
    while (tempX.siguiente) {
      if (tempX.posX === nuevoNodo.posX) {
        break;
      }
      tempX = tempX.siguiente;
    }
    while (true) {
      if (tempX.posY === nuevoNodo.posY) {
        break;
      } else if (tempX.abajo !== null && tempX.abajo.posY > nuevoNodo.posY) {
        nuevoNodo.abajo = tempX.abajo;
        nuevoNodo.arriba = tempX;
        tempX.abajo = nuevoNodo;
        break;
      } else if (tempX.abajo === null) {
        nuevoNodo.arriba = tempX;
        nuevoNodo.abajo = tempX.abajo;
        tempX.abajo = nuevoNodo;
        break;
      } else {
        tempX = tempX.abajo;
      }
    }
    while (tempY.abajo) {
      if (tempY.posY === nuevoNodo.posY) {
        break;
      }
      tempY = tempY.abajo;
    }
    while (true) {
      if (tempY.posX === nuevoNodo.posX) {
        break;
      } else if (
        tempY.siguiente !== null &&
        tempY.siguiente.posX > nuevoNodo.posX
      ) {
        nuevoNodo.siguiente = tempY.siguiente;
        nuevoNodo.anterior = tempY;
        tempY.siguiente = nuevoNodo;
      } else if (tempY.siguiente === null) {
        nuevoNodo.anterior = tempY;
        nuevoNodo.siguiente = tempY.siguiente;
        tempY.siguiente = nuevoNodo;
      } else {
        tempY = tempY.siguiente;
      }
    }
  }
}
