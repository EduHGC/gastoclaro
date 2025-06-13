const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.addEventListener("DOMContentLoaded", async () => {
    const titulo = document.getElementById("header-title");
    const nome = sessionStorage.getItem("nome_eletro");
    const nomeAmbiente = sessionStorage.getItem("nomeAmbiente");
    titulo.textContent = `${nomeAmbiente} > ${nome}`;
    const idEletro = sessionStorage.getItem("id_eletro");

    const inputNome = document.getElementById("input-nome");
    const inputConsumo = document.getElementById("input-consumo");
    const inputTempoUso = document.getElementById("input-ligado");


    try{
        const resposta = await buscarEletro(idEletro);
        inputNome.value = resposta.nome;
        inputConsumo.value = resposta.consumo;
        inputTempoUso.value = resposta.tempo_uso;
    }catch(erro){
        console.error(`Erro ao carregar nome do eletro${resposta.nome}:`, erro);            
        alert(erro.message);
    }
});

document.getElementById("voltar").addEventListener("click", () => {
    window.location.href = "./eletros.html";
})

document.getElementById("editar-eletro").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const idEletro = sessionStorage.getItem("id_eletro");
    const inputNome = document.getElementById("input-nome").value;
    const inputConsumo = document.getElementById("input-consumo").value;
    const inputTempoUso = document.getElementById("input-ligado").value;
    const consumo = parseFloat(inputConsumo);
    const tempo_uso = parseFloat(inputTempoUso)
    const dados = {
        nome: inputNome,
        consumo: consumo,
        tempo_uso: tempo_uso
    }

    try{
        const resposta = await editarEletro(idEletro, dados);
    }catch(erro){
        console.error(`Erro ao editar eletro ${inputNome}:`, erro)
    }
    alert("Eletro editado com sucesso");
    window.location.href = "./eletros.html";
})


async function editarEletro(idEletro, dados) {
    const resposta = await fetch(`https://parseapi.back4app.com/classes/eletrodomestico/${idEletro}`, {
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

async function buscarEletro(idEletro) {
    const resposta = await fetch(`https://parseapi.back4app.com/classes/eletrodomestico/${idEletro}`, {
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