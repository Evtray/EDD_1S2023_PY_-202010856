console.log("Hello World haeder");

document.getElementById("navbar").innerHTML = `
<header class="font-semibold shadow-sm">
    <nav class="flex items-center justify-between p-2 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/EDD_Proyecto1_Fase2" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12 p-2">
        <a class="text-2xl font-semibold leading-6 text-gray-900">GoDrive</a>
      </div>
      <div class="flex flex-1 justify-end">
        <div>
          <div>
            <span id="user"></span>
          </div>
          <button id="login" class="text-base font-semibold leading-6 text-indigo-600"> Iniciar sesión
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
`;

var user = JSON.parse(localStorage.getItem("estudiante"));

if (user != null) {
  document.getElementById("user").innerHTML = user.usuario;
  document.getElementById("login").innerHTML = "Cerrar Sesión";
  document.getElementById("login").onclick = function () {
    localStorage.removeItem("user");
    location.reload();
  };

  userWelcome = document.getElementById("welcome-user");
  if (userWelcome) {
    userWelcome.innerHTML = "Bienvenido " + user.carnet;
  }

} else {
  document.getElementById("user").innerHTML = "";
  document.getElementById("user").href = "/EDD_Proyecto1_Fase2/views/login.html";
}

document.getElementById("login").onclick = function () {
  if (user == null) {
    window.location.href = "/EDD_1S2023_PY_-202010856/EDD_Proyecto1_Fase2/src/views/login.html";
  } else {
    localStorage.removeItem("estudiante");
    window.location.href = "/EDD_1S2023_PY_-202010856/EDD_Proyecto1_Fase2";
  }
};
