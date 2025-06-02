let nome = "";
let sobrenome = "";
let data = "";
document.getElementById("form-cadastro").addEventListener('submit', (evento) => {
    evento.preventDefault();
    nome = document.getElementById('input-nome').value;
    sobrenome = document.getElementById('input-sobrenome').value;
    data = document.getElementById('input-data').value;
    //console.log(nome, sobrenome, data);
    sessionStorage.setItem('nome', nome);
    sessionStorage.setItem('sobrenome', sobrenome);
    sessionStorage.setItem('data', data);
    window.location.href = "./credenciais.html";
})