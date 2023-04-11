class AvlNode {
  constructor(item) {
    this.item = item;
    this.left = null;
    this.right = null;
    this.height = 0;
  }
}
let = nodes = "";
let = connections = "";
class AvlTree {
  constructor() {
    this.root = null;
    this.prueba = [];
  }

  insert(item) {
    this.root = this.#insertRecursive(item, this.root);
  }

  getHeight(node) {
    return node === null ? -1 : node.height;
  }
  getMaxHeight(leftNode, rightNode) {
    return leftNode.height > rightNode.height
      ? leftNode.height
      : rightNode.height;
  }
  #insertRecursive(item, node) {
    if (node == null) {
      node = new AvlNode(item);
    } else if (item.nombre < node.item.nombre) {
      node.left = this.#insertRecursive(item, node.left);
      if (this.getHeight(node.left) - this.getHeight(node.right) == 2) {
        if (item.nombre < node.left.item.nombre) {
          node = this.#rotateLeft(node);
        } else {
          node = this.#doubleLeft(node);
        }
      }
    } else if (item.nombre > node.item.nombre) {
      node.right = this.#insertRecursive(item, node.right);
      if (this.getHeight(node.right) - this.getHeight(node.left) == 2) {
        if (item.nombre < node.right.item.nombre) {
          node = this.#rotateRight(node);
        } else {
          node = this.#doubleRight(node);
        }
      }
    } else {
      console.log("Elemento ya existe en el árbol");
    }
    node.height =
      this.getMaxHeight(this.getHeight(node.left), this.getHeight(node.right)) +
      1;
    return node;
  }

  //--------------------------------------------------------------------------
  //                   ROTACIONES
  //--------------------------------------------------------------------------
  #rotateRight(node1) {
    node2 = node1.right;
    node1.right = node2.left;
    node2.left = node1;
    node1.height =
      this.getMaxHeight(
        this.getHeight(node1.left),
        this.getHeight(node1.right)
      ) + 1;
    node2.height =
      this.getMaxHeight(this.getHeight(node2.right), node1.height) + 1;
    return node2;
  }
  #rotateLeft(node2) {
    node1 = node2.left;
    node2.left = node1.right;
    node1.right = node2;
    node2.height =
      this.getMaxHeight(
        this.getHeight(node2.left),
        this.getHeight(node2.right)
      ) + 1;
    node1.height =
      this.getMaxHeight(this.getHeight(node1.left), node2.height) + 1;
    return node1;
  }
  #doubleLeft(node) {
    node.left = this.#rotateRight(node.left);
    return this.#rotateLeft(node);
  }
  #doubleRight(node) {
    node.right = this.#rotateLeft(node.right);
    return this.#rotateRight(node);
  }

  search(carnet) {
    return this.#searchRecursive(carnet, this.root);
  }

  #searchRecursive(carnet, node) {
    if (node == null) {
      return null;
    } else if (carnet < node.item.carnet) {
      return this.#searchRecursive(carnet, node.left);
    } else if (carnet > node.item.carnet) {
      return this.#searchRecursive(carnet, node.right);
    } else {
      return node.item;
    }
  }

   //--------------------------------------------------------------------------
  //                  RECORRIDO IN ORDER
  //--------------------------------------------------------------------------
  inOrder() {
    let html = this.#inOrderRecursive(this.root);
    return html;
  }
  #inOrderRecursive(current) {
    let row = "";
    if (current.left != null) {
      row += this.#inOrderRecursive(current.left);
    }
    row += `
            <tr>
                <td class="px-4 py-2">${current.item.carnet}</td>
                <td class="px-4 py-2">${current.item.nombre}</td>
                <td class="px-4 py-2">${current.item.password}</td>
            </tr>
        `;
    if (current.right != null) {
      row += this.#inOrderRecursive(current.right);
    }
    return row;
  }
  //--------------------------------------------------------------------------
  //                  RECORRIDO PRE ORDER
  //--------------------------------------------------------------------------
  preOrder() {
    let html = this.#preOrderRecursive(this.root);
    return html;
  }
  #preOrderRecursive(current) {
    let row = "";
    row += `
            <tr>
                <td class="px-4 py-2">${current.item.carnet}</td>
                <td class="px-4 py-2">${current.item.nombre}</td>
                <td class="px-4 py-2">${current.item.password}</td>
            </tr>
        `;
    if (current.left != null) {
      row += this.#inOrderRecursive(current.left);
    }
    if (current.right != null) {
      row += this.#inOrderRecursive(current.right);
    }
    return row;
  }

  //--------------------------------------------------------------------------
  //                  RECORRIDO POST ORDER
  //--------------------------------------------------------------------------
  postOrder() {
    let html = this.#postOrderRecursive(this.root);
    return html;
  }
  #postOrderRecursive(current) {
    let row = "";
    if (current.left != null) {
      row += this.#inOrderRecursive(current.left);
    }
    if (current.right != null) {
      row += this.#inOrderRecursive(current.right);
    }
    row += `
            <tr>
                <td class="px-4 py-2">${current.item.carnet}</td>
                <td class="px-4 py-2" >${current.item.nombre}</td>
                <td class="px-4 py-2">${current.item.password}</td>
            </tr>
        `;
    return row;
  }

  //--------------------------------------------------------------------------
  //                  REPORTE DEL ARBOL
  //--------------------------------------------------------------------------
  threeGraphInOrder() {
    nodes = "";
    connections = "";
    this.#treeGraphRecursive(this.root);
    return `
        digraph G {
            node [shape=record, style=filled, fillcolor=white];
            ${nodes}
            ${connections}
        }
    `;
  }
  #treeGraphRecursive(current) {
    if (current != null) {
      nodes += `

                ${current.item.carnet} [label="<f0> |<f1> ${current.item.carnet} ${current.item.nombre}  |<f2>"];
            `;
      if (current.left != null) {
        connections += `
                    ${current.item.carnet}:f0 -> ${current.left.item.carnet}:f1;
                `;
        this.#treeGraphRecursive(current.left);
      }
      if (current.right != null) {
        connections += `
                    ${current.item.carnet}:f2 -> ${current.right.item.carnet}:f1;
                `;
        this.#treeGraphRecursive(current.right);
      }
    }
  }

  threeGraphPreOrder() {
    nodes = "";
    connections = "";
    this.#threeGraphPreOrderRecursive(this.root);
    return `
        digraph G {
            node [shape=record, style=filled, fillcolor=white];
            ${nodes}
            ${connections}
        }
    `;
  }
  #threeGraphPreOrderRecursive(current) {
    if (current != null) {
      nodes += `
                ${current.item.carnet} [label="<f0> |<f1> ${current.item.carnet} ${current.item.nombre}  |<f2>"];
            `;
      if (current.left != null) {
        connections += `
                    ${current.item.carnet}:f0 -> ${current.left.item.carnet}:f1;
                `;
        this.#threeGraphPreOrderRecursive(current.left);
      }
      if (current.right != null) {
        connections += `
                    ${current.item.carnet}:f2 -> ${current.right.item.carnet}:f1;
                `;
        this.#threeGraphPreOrderRecursive(current.right);
      }
    }
  }

  threeGraphPostOrder() {
    nodes = "";
    connections = "";
    this.#threeGraphPostOrderRecursive(this.root);
    return `
        digraph G {
            node [shape=record, style=filled, fillcolor=white];
            ${nodes}
            ${connections}
        }
    `;
  }
  #threeGraphPostOrderRecursive(current) {
    if (current != null) {
      nodes += `
                ${current.item.carnet} [label="<f0> |<f1> ${current.item.carnet} ${current.item.nombre}  |<f2>"];
            `;
      if (current.left != null) {
        connections += `
                    ${current.item.carnet}:f0 -> ${current.left.item.carnet}:f1;
                `;
        this.#threeGraphPostOrderRecursive(current.left);
      }
      if (current.right != null) {
        connections += `
                    ${current.item.carnet}:f2 -> ${current.right.item.carnet}:f1;
                `;
        this.#threeGraphPostOrderRecursive(current.right);
      }
    }
  }

  avlToArray() {
    this.estudiantes = [];
    this.#avlToArrayRecursive(this.root);
    return this.estudiantes;
  }

  #avlToArrayRecursive(current) {
    if (current.item.carnet) {
      console.log(current.item.carpeta);
      if (current.item.carpeta.root != null) {
        current.item.carpeta = current.item.carpeta.avlToArray();
      } else {
        current.item.carpeta = [];
      }

      if (current.item.bitacora.root != null) {
        current.item.bitacora = current.item.bitacora.avlToArray();
      } else {
        current.item.bitacora = [];
      }
    }
    this.estudiantes.push(current.item);

    if (current.left != null) {
      this.#avlToArrayRecursive(current.left);
    }

    if (current.right != null) {
      this.#avlToArrayRecursive(current.right);
    }
  }
}
