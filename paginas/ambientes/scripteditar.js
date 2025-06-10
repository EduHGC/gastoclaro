const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';


document.addEventListener("DOMContentLoaded", async () => {
    
    const nome = document.getElementById("header-title").textContent = sessionStorage.getItem("nome_ambiente");
    const idAmbiente = sessionStorage.getItem("id_ambiente");
    const inputNome = document.getElementById("input-nome");
    

    try{
        const resposta = await buscarAmbiente(idAmbiente);
        inputNome.value = resposta.nome;
    }catch(erro){
        console.error(`Erro ao carregar nome do ambiente ${resposta.nome}:`, erro);            
        alert(erro.message);
    }
});


document.getElementById("editar-ambiente").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("input-nome").value;
    const idAmbiente = sessionStorage.getItem("id_ambiente");
    const dados = {
        nome: nome
    }

    try{
        const resposta = await editarAmbiente(idAmbiente, dados);
    }catch(erro){
        console.erro(`Erro ao editar ambiente ${nome}:`, erro)
    }
    alert("Nome do ambiente editado com sucesso");
    window.location.href = "./ambiente.html";
})

async function buscarAmbiente(idAmbiente) {
    const resposta = await fetch(`https://parseapi.back4app.com/classes/ambiente/${idAmbiente}`, {
        method: 'GET',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dado = await resposta.json();

    return dado;
}

async function editarAmbiente(idAmbiente, dados) {
    const resposta = await fetch(`https://parseapi.back4app.com/classes/ambiente/${idAmbiente}`, {
        method: 'PUT',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dado = await resposta.json();

    return dado;
}