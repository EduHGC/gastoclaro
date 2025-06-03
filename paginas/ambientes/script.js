const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.getElementById("cadastrar-ambiente").addEventListener("click", () => {
    window.location.href = "./ambientecadastro.html";
})

document.addEventListener("DOMContentLoaded", async () => {
    
    const nome = document.getElementById("titulo");
    nome.querySelector("h1").textContent = sessionStorage.getItem("nomeEstabelecimento");

    const resposta = await requisicaoAmbientes();
    criarElementos(resposta);
    console.log(resposta);

});

function criarElementos(dados){
    const ambientes = document.getElementById("lista-ambientes");

    dados.forEach((elemento) => {
        const card = document.createElement("div");
        card.classList.add("card");
       
        //pontos
        const pontos = document.createElement("div");
        pontos.classList.add("pontos");

        //descricao
        const descricao = document.createElement("div");
        descricao.classList.add("descricao");

        const ambiente = document.createElement("div");
        ambiente.classList.add("ambiente");
        ambiente.textContent = elemento.nome;

        const quantidadeEletro = document.createElement("div");
        quantidadeEletro.classList.add("quantidade-eletro");
        quantidadeEletro.textContent = "5 eletrodomestico cadastrado"; 

        const mediaConsumo = document.createElement("div");
        mediaConsumo.classList.add("media-consumo");
        mediaConsumo.textContent = "Média de consumo: xxKWh"; 

        descricao.appendChild(ambiente);
        descricao.appendChild(quantidadeEletro);
        descricao.appendChild(mediaConsumo);

        descricao.addEventListener("click", () => {
            sessionStorage.setItem("id_ambiente", elemento.objectId);
            sessionStorage.setItem("nomeAmbiente", elemento.nome);
            window.location.href = "../eletros/eletros.html";
        });

        //editar
        const editar = document.createElement("div");
        editar.classList.add("editar");

        const linkEditar = document.createElement("a");
        linkEditar.href = "#";

        const iconeEditar = document.createElement("img");
        iconeEditar.src = "../../assets/edit.png"
        iconeEditar.alt = "";

        linkEditar.appendChild(iconeEditar);
        editar.appendChild(linkEditar);

        //Apagar
        const apagar = document.createElement("div");
        apagar.classList.add("apagar");

        const linkApagar = document.createElement("a");
        linkApagar.href = "#";

        const iconeApagar = document.createElement("img");
        iconeApagar.src = "../../assets/trash.png"
        iconeApagar.alt = "";

        linkApagar.appendChild(iconeApagar);
        apagar.appendChild(linkApagar);

        card.appendChild(pontos);
        card.appendChild(descricao);
        card.appendChild(editar);
        card.appendChild(apagar);
        
        ambientes.appendChild(card); 
    });
}

async function requisicaoAmbientes(){
    const idImovel = sessionStorage.getItem("id_imovel");
    const where = encodeURIComponent(JSON.stringify({id_imovel: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idImovel
    }
    }))

    const resposta = await fetch(`https://parseapi.back4app.com/classes/ambiente?where=${where}`, {
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




