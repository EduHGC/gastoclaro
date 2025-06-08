document.addEventListener("DOMContentLoaded", () => {
    const nome = sessionStorage.getItem("nome").split(" ")[0];

    const titulo = document.getElementById("titulo");
    titulo.querySelector("h1").textContent = `Olá ${nome}`;
})

document.getElementById("deslogar").addEventListener("click", () => {
    sessionStorage.clear();
    location.replace("../login/login.html");
})