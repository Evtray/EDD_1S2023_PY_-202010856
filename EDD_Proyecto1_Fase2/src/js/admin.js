var avlTree = new AvlTree();
cargarAvlTree();
generarAvlDot();

document
  .getElementById("input-cargamasiva")
  .addEventListener("change", function (event) {
    const archivo = event.target.files[0];

    const lector = new FileReader();

    lector.onload = function (event) {
      const contenido = event.target.result;
      const items = JSON.parse(contenido);

      items.alumnos.forEach((item) => {
        let estudiante = new Estudiante(
          item.nombre,
          item.carnet,
          item.password,
          new MatrizDispersa(),
          new MatrizDispersa()
        );
        avlTree.insert(estudiante);
      });

      guardarAvl();
      generarAvlDot();
      document.getElementById("tabla-estudiantes").innerHTML =
        avlTree.inOrder();
    };

    lector.readAsText(archivo);
  });

var selectOrden = 1;

document
  .getElementById("select-ordenar")
  .addEventListener("change", function () {
    const opcionSeleccionada = this.value;
    switch (opcionSeleccionada) {
      case "In-order":
        document.getElementById("tabla-estudiantes").innerHTML =
          avlTree.inOrder();
        selectOrden = 1;
        break;
      case "Pre-order":
        document.getElementById("tabla-estudiantes").innerHTML =
          avlTree.preOrder();
        selectOrden = 2;
        break;
      case "Post-order":
        document.getElementById("tabla-estudiantes").innerHTML =
          avlTree.postOrder();
        selectOrden = 3;
        break;
      default:
        console.log("No se selecciono ninguna opcion");
        break;
    }
    generarAvlDot();
  });

function guardarAvl() {
  let estudiantes = avlTree.avlToArray();
  let estudiantesJSON = JSON.stringify(estudiantes);
  console.log(estudiantesJSON);
  localStorage.setItem("estudiantes", estudiantesJSON);
}

function cargarAvlTree() {
  if (localStorage.getItem("estudiantes")) {
    let avlTreeJSON = localStorage.getItem("estudiantes");
    estudiantes = JSON.parse(avlTreeJSON);
    console.log(estudiantes);

    estudiantes.forEach((item) => {
      let estudiante = new Estudiante(item.nombre, item.carnet, item.password, new MatrizDispersa(), new MatrizDispersa());
      avlTree.insert(estudiante);
    });

    let tabla = document.getElementById("tabla-estudiantes");
    if (tabla) {
      tabla.innerHTML = avlTree.inOrder();
    }
  }
}

function generarAvlDot() {
  let dot = "";
  switch (selectOrden) {
    case 1:
      dot = avlTree.threeGraphInOrder();
      break;
    case 2:
      dot = avlTree.threeGraphPreOrder();
      break;
    case 3:
      dot = avlTree.threeGraphPostOrder();
      break;
    default:
      dot = avlTree.threeGraphInOrder();
      break;
  }

  const svg = Viz(dot, { format: "svg" });
  const graphContainer = document.getElementById("graph");
  graphContainer.innerHTML = svg;
}