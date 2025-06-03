document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    
    const nome = document.getElementById("titulo");
    nome.querySelector("h1").textContent = sessionStorage.getItem("nome");
    
});



