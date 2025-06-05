const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

/*document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    
    requisicao().then((dados) => {
        criarElementos(dados);
    }) 

})
 
async function requisicao(){
    const idProprietario = sessionStorage.getItem("userId");
    const where = encodeURIComponent(JSON.stringify({id_usuario: {
        __type: "Pointer",
        className: "_User",
        objectId: idProprietario
        }
    }))
    
    const resultado = await fetch(`https://parseapi.back4app.com/classes/Estabelecimentos?where=${where}`, {
        method: 'GET',
        headers:{
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        return data.results;
    })
    .catch(error => {
    console.error("Error na requisição: ", error);
    return[];
})

    return resultado;
};

function criarElementos(resultado){
    const estabelecimento = document.getElementById("lista-estabelecimento");
    
    resultado.forEach((elemento) => {
        const card = document.createElement("div");
        card.classList.add("card");


        //pontos
        const pontos = document.createElement("div");
        pontos.classList.add("pontos");

        //descricao
        const descricao = document.createElement("div");
        descricao.classList.add("descricao");

        const estabelecimentoNome = document.createElement("div");
        estabelecimentoNome.classList.add("estabelecimento");
        estabelecimentoNome.textContent = elemento.nome;

        const meta = document.createElement("div");
        meta.classList.add("meta");
        meta.textContent = `Meta de consumo: R$${elemento.meta_consumo}`; 

        const fatura = document.createElement("div");
        fatura.classList.add("fatura");
        fatura.textContent = `Fatura: R$${elemento.fatura}`; 

        descricao.appendChild(estabelecimentoNome);
        descricao.appendChild(meta);
        descricao.appendChild(fatura);

        //Editar
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

        estabelecimento.appendChild(card);
    });
}*/



document.getElementById("novo-estabelecimento").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    //sessionStorage.getItem("sessionToken");
    const idProprietario = sessionStorage.getItem("userId");
    const nomeEstabelecimento = document.getElementById("input-nome").value;
    const cep = document.getElementById("input-cep").value;
    const tipo = document.getElementById("input-tipo").value;
    const endereco = document.getElementById("input-endereco").value;
    const metaConsumo = document.getElementById("input-meta-consumo").value;
    const valorFatura = document.getElementById("input-conta").value;
    const vencimentoFatura = document.getElementById("input-vencimento-fatura").value;

    const dados = {
        id_usuario: {
            "__type": "Pointer",
            "className": "_User",
            "objectId": idProprietario
        },
        nome: nomeEstabelecimento,
        cep: cep,
        tipo: tipo,
        endereco: endereco
    }

    console.log(dados);

    try{
        const resposta = await cadastrarEstabelecimento(dados);
        console.log(resposta);
        const id_estabelecimento = resposta.objectId;
        const data = {
            "__type": "Date",
            "iso": new Date(resposta.createdAt).toISOString()
        };
        
       const consumo = parseInt(metaConsumo);
        const dadosMetaConsumo = {
        id_estabelecimento: {
            __type: "Pointer",
            className: "Estabelecimentos",
            objectId: id_estabelecimento
            },
            consumo: consumo,
            data: data
        }  
        const respostaCosumo = await cadastrarMetaCosumo(dadosMetaConsumo);
        console.log(respostaCosumo);
    
        const fatura = parseFloat(valorFatura);
        const vencimento = {
            "__type": "Date",
            "iso": new Date(vencimentoFatura).toISOString()
        };
        const dadosFatura = {
            id_estabelecimento: {
                __type: "Pointer",
                className: "Estabelecimentos",
                objectId: id_estabelecimento
            },
            data_vencimento: vencimento,
            valor: fatura
        }
        const respostaFatura = await cadastrarFatura(dadosFatura);
        console.log(respostaFatura);
        window.location.href = "./home.html";
        alert("Imóvel cadastrado com sucesso");
    }catch(erro){
        console.error("Erro ao cadastrar:", erro);            
        alert(erro.message);
    } 
})

async function cadastrarEstabelecimento(dados){
    
    const resposta = await fetch("https://parseapi.back4app.com/classes/Estabelecimentos/", {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status} no cadastro do estabelecimento`);
    }

    const dado = await resposta.json();

    return dado;
}

async function cadastrarMetaCosumo(dados) {
    const resposta = await fetch("https://parseapi.back4app.com/classes/meta_consumo/", {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status} - no cadastro da meta de cosumo`);
    }

    const dado = await resposta.json();

    return dado;
}

async function cadastrarFatura(dados) {
    const resposta = await fetch("https://parseapi.back4app.com/classes/fatura/", {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status} - no cadastro da fatura`);
    }

    const dado = await resposta.json();

    return dado;
}