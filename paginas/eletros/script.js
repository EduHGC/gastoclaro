const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.getElementById("cadastrar-eletro").addEventListener("click", () => {
    window.location.href = "./eletroscadastrar.html";
})

document.addEventListener("DOMContentLoaded", async () => {
    const nome = document.getElementById("titulo");
    nome.querySelector("h1").textContent = sessionStorage.getItem("nomeEstabelecimento");

    const resposta = await requisicaoEletros();
    criarElementos(resposta);
    console.log(resposta);
});


async function requisicaoEletros(){
    const idAmbiente = sessionStorage.getItem("id_ambiente");
    const where = encodeURIComponent(JSON.stringify({id_ambiente: {
            __type: "Pointer",
            className: "ambiente",
            objectId: idAmbiente
        }
    }))
    const resposta = await fetch(`https://parseapi.back4app.com/classes/eletrodomestico?where=${where}`, {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dado = await resposta.json();

    return dado.results;
}

function criarElementos(dados){
    const eletro = document.getElementById("lista-eletros");

    dados.forEach((elemento) => {
        const card = document.createElement("div");
        card.classList.add("card");
       
        //pontos
        const pontos = document.createElement("div");
        pontos.classList.add("pontos");

        //descricao
        const descricao = document.createElement("div");
        descricao.classList.add("descricao");

        const nome = document.createElement("div");
        nome.classList.add("nome-eletro");
        nome.textContent = elemento.nome;

        const tempoUso = document.createElement("div");
        tempoUso.classList.add("tempo-uso");
        tempoUso.textContent = "Tempo de de uso em horas: 1h"; 

        const consumo = document.createElement("div");
        consumo.classList.add("consumo");
        consumo.textContent = "Média de consumo: xxKWh"; 

        descricao.appendChild(nome);
        descricao.appendChild(tempoUso);
        descricao.appendChild(consumo);

        
        

        const editar = document.createElement("div");
        editar.classList.add("editar");

        const linkEditar = document.createElement("a");
        linkEditar.href = "#";

        const iconeEditar = document.createElement("img");
        iconeEditar.src = "../../assets/edit.png"
        iconeEditar.alt = "#";

        linkEditar.appendChild(iconeEditar);
        editar.appendChild(linkEditar);

        //Apagar
        const apagar = document.createElement("div");
        apagar.classList.add("apagar");

        const linkApagar = document.createElement("a");
        linkApagar.href = "#";

        const iconeApagar = document.createElement("img");
        iconeApagar.src = "../../assets/trash.png"
        iconeApagar.alt = "#";

        linkApagar.appendChild(iconeApagar);
        apagar.appendChild(linkApagar);

        card.appendChild(pontos);
        card.appendChild(descricao);
        card.appendChild(editar);
        card.appendChild(apagar);
        
        eletro.appendChild(card); 
    });
}