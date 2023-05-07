var tablaHash = new TablaHash();
let tabla = localStorage.getItem("tabla");
if (tabla) {
  var copytablaHash = JSON.parse(tabla);
  tablaHash.tabla = copytablaHash.tabla;
  tablaHash.capacidad = copytablaHash.capacidad;
  tablaHash.utilizacion = copytablaHash.utilizacion;
}
async function login() {
  let carnet = document.getElementById("carnet").value;
  let password = document.getElementById("password").value;

  if (carnet.toLowerCase() == "admin" && password.toLowerCase() == "admin") {
    localStorage.setItem(
      "estudiante",
      JSON.stringify({ carnet: "Admin", usuario: "Administrador" })
    );
    window.location.href = "../views/admin.html";
  } else {
    let pass_en = await tablaHash.sha256(password);
    let estudiante = tablaHash.busquedaUsuario(carnet, pass_en);
    if (estudiante) {
      localStorage.setItem("estudiante", JSON.stringify(estudiante));
      window.location.href = "../views/usuario.html";
    } else {
      console.log(estudiante);
      alert("Usuario o contraseña incorrecta", estudiante);
    }
  }
}
