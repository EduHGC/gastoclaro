const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.getElementById("cadastrar-ambiente").addEventListener("click", () => {
    window.location.href = "./ambientecadastro.html";
})

document.addEventListener("DOMContentLoaded", async () => {
    
    const nome = document.getElementById("titulo");
    nome.querySelector("h1").textContent = sessionStorage.getItem("nomeEstabelecimento");
    
    const resposta = await requisicaoAmbientes();
    await criarElementos(resposta);
    console.log(resposta);


});

async function criarElementos(dados){
    const ambientes = document.getElementById("lista-ambientes");
    let maiorConsumo = 0;
    let ambienteMaiorConsumo = "";
    let consumoPorAmbiente = 0.0;
    for(const elemento of dados){
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

        const eletroInfo = await buscarEletros(elemento.objectId);
        const totalConsumo = eletroInfo.reduce((acumulador, atual) => {
            const kwh = atual.consumo * atual.tempo_uso;
            return acumulador + kwh;
        }, 0);

        consumoPorAmbiente += totalConsumo;

        if(totalConsumo > maiorConsumo){
            maiorConsumo = totalConsumo;
            ambienteMaiorConsumo = elemento.nome;
        }

        const quantidadeEletro = document.createElement("div");
        quantidadeEletro.classList.add("quantidade-eletro");
        quantidadeEletro.textContent = `${eletroInfo.length} eletrodomestico cadastrado`; 

        const mediaConsumo = document.createElement("div");
        mediaConsumo.classList.add("media-consumo");
        mediaConsumo.textContent = `Média de consumo: ${totalConsumo}KW`; 

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

        editar.addEventListener("click", (evento) => {
            evento.preventDefault();
            sessionStorage.setItem("id_ambiente", elemento.objectId);
            sessionStorage.setItem("nome_ambiente", elemento.nome);
            window.location.href = "./ambienteeditar.html";
        })

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

        apagar.addEventListener("click", async () =>{
            
            const confirmacao = confirm(`Tem certeza que deseja excluir o ambiente "${elemento.nome}" e todos os dados associados?`);
            if(!confirmacao) return;

            try{
                const resposta = await buscarEletros(elemento.objectId);
                for(let eletros of resposta){
                    await deletarEletro(eletros.objectId);
                }
            }catch(erro){
                console.error(`Erro ao deletar eletrodomésticos do ambiente ${elemento.nome}:`, erro);            
                alert(erro.message);
            }
            
            try{
                await deletarAmbiente(elemento.objectId);
            }catch(erro){
                console.error(`Erro ao deletar o ambiente ${elemento.nome}:`, erro);            
                alert(erro.message);
            }
            location.reload();
        })

        card.appendChild(pontos);
        card.appendChild(descricao);
        card.appendChild(editar);
        card.appendChild(apagar);
        
        ambientes.appendChild(card);
    }
    const metaConsumo = document.getElementById("meta");
    const percentualMaior = (100.0 * maiorConsumo) / consumoPorAmbiente;
    const consumoAmbiente = document.getElementById("consumo-ambiente");
    if(consumoPorAmbiente != 0){
        consumoAmbiente.querySelector("h1").textContent = `${percentualMaior.toFixed(2)}%`;
    }else{
        consumoAmbiente.querySelector("h1").textContent = "0.00%";
    }
    consumoAmbiente.querySelector("h2").textContent = `${ambienteMaiorConsumo}`;

    const metaValorMetaConsumo = await buscarMetaConsumo(sessionStorage.getItem("id_imovel"));
    console.log(metaValorMetaConsumo[0].consumo);
    const valorMeta = (consumoPorAmbiente * 100) / metaValorMetaConsumo[0].consumo;
    console.log(valorMeta);
    metaConsumo.querySelector("h1").textContent = `${valorMeta.toFixed(2)}%`
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

async function buscarEletros(objectIdAmbiente){ 
    const where = encodeURIComponent(JSON.stringify({id_ambiente: {
        __type: "Pointer",
        className: "ambiente",
        objectId: objectIdAmbiente
    }}))

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

async function buscarMetaConsumo(id_estabelecimento){
    const resposta = await fetch(`https://parseapi.back4app.com/classes/meta_consumo/`, {
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

async function buscarEletros(idAmbiente){
    const where = encodeURIComponent(JSON.stringify({id_ambiente: {
        __type: "Pointer",
        className: "ambiente",
        objectId: idAmbiente
        }
    }))
    
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/eletrodomestico?where=${where}`, {
        method: 'GET',
        headers:{
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dado = await resposta.json();

    return dado.results;
}

async function deletarEletro(idEletro){
    await fetch(`https://parseapi.back4app.com/classes/eletrodomestico/${idEletro}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}

async function deletarAmbiente(idAmbiente){
    await fetch(`https://parseapi.back4app.com/classes/ambiente/${idAmbiente}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}