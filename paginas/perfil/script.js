document.addEventListener("DOMContentLoaded", () => {
    const nome = sessionStorage.getItem("nome").split(" ")[0];

    const titulo = document.getElementById("titulo");
    titulo.querySelector("h1").textContent = `Olá ${nome}`;

    const fotourl = sessionStorage.getItem("foto");
    const foto = document.getElementById("foto");
    foto.src = fotourl;
})

document.getElementById("deslogar").addEventListener("click", () => {
    sessionStorage.clear();
    location.replace("../login/login.html");
})