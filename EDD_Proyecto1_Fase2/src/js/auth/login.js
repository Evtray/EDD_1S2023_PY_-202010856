var avlTree = new AvlTree();

if (localStorage.getItem("estudiantes")) {
  let avlTreeJSON = localStorage.getItem("estudiantes");
  estudiantes = JSON.parse(avlTreeJSON);

  estudiantes.forEach((item) => {
    let estudiante = new Estudiante(item.nombre, item.carnet, item.password);
    avlTree.insert(estudiante);
  });
}

function login() {
  let carnet = document.getElementById("carnet").value;
  let password = document.getElementById("password").value;
  let estudiante = avlTree.search(parseInt(carnet));

  if (carnet.toLowerCase() == "admin" && password.toLowerCase() == "admin") {
    localStorage.setItem("estudiante", JSON.stringify({ carnet: "Admin" , nombre: "Administrador" }));
    window.location.href = "../views/admin.html";
    
  } else {
    if (estudiante != null) {
      if (estudiante.password == password) {
        // set local storage estudiante
        localStorage.setItem("estudiante", JSON.stringify(estudiante));
        window.location.href = "../views/usuario.html";

      } else {
        alert("Contraseña incorrecta");
      }
    } else {
      alert("El carnet no existe");
    }
  }
}
