const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';


document.addEventListener("DOMContentLoaded", async () => {
    const nome = document.getElementById("titulo");
    nome.querySelector("h1").textContent = sessionStorage.getItem("nomeEstabelecimento");
});

document.getElementById("novo-eletro").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("input-nome").value;
    const inputConsumo = document.getElementById("input-consumo").value;
    const consumo = parseFloat(inputConsumo);
    const inputLigado = document.getElementById("input-ligado").value;
    const tempoUso = parseInt(inputLigado);
    const idAmbiente = sessionStorage.getItem("id_ambiente");

    const dados = {
        nome: nome,
        consumo: consumo,
        tempo_uso: tempoUso,
        id_ambiente: {
            "__type": "Pointer",
            "className": "ambiente",
            "objectId": idAmbiente
        }
    }

    try{
        const resposta = await cadastrarEletro(dados);
        alert(`Eletrodoméstico cadastrado com sucesso`);
        window.location.reload();
    }catch(erro){
        console.error("Erro ao cadastrar:", erro);            
        alert(erro.message);
    }
})

async function cadastrarEletro(dados){
    const resposta = await fetch("https://parseapi.back4app.com/classes/eletrodomestico/", {
        method: "POST",
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const resultado = await resposta.json();

    return resultado;
}
