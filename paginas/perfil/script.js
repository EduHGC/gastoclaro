document.addEventListener("DOMContentLoaded", () => {
    const nome = sessionStorage.getItem("nome");
    const sobrenome = sessionStorage.getItem("sobrenome");

    const titulo = document.getElementById("titulo");
    titulo.querySelector("h1").textContent = `Olá ${nome} ${sobrenome}`;
})

document.getElementById("deslogar").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
})