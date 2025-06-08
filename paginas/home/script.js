const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    
    try{
        const resposta = await requisicao();
        await criarElementos(resposta);
    }catch(erro){
        console.error("Erro ao carregar estabelecimentos:", erro);            
        alert(erro.message);
    } 

    /*requisicao().then((dados) => {
        criarElementos(dados).then();
    })*/

})
 
async function requisicao(){
    const idProprietario = sessionStorage.getItem("userId");
    const where = encodeURIComponent(JSON.stringify({id_usuario: {
        __type: "Pointer",
        className: "_User",
        objectId: idProprietario
        }
    }))
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/Estabelecimentos?where=${where}`, {
        method: 'GET',
        headers:{
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })
    /*.then((res) => res.json())
    .then((data) => {
        console.log(data);
        return data.results;
    })
    .catch(error => {
    console.error("Error na requisição: ", error);
    return[];
})*/
    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dado = await resposta.json();

    return dado.results;
};

async function criarElementos(resultado){
    const estabelecimento = document.getElementById("lista-estabelecimento");
    
    for(const elemento of resultado) {
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

        const metaCosumoResposta = await metaCosumo(elemento.objectId);
        let valorMeta = 0;
        if(metaCosumoResposta.length > 0){
            valorMeta = metaCosumoResposta[0].consumo;
        }

        const valor = await buscarFatura(elemento.objectId);
        let total = 0;
        if(valor.length > 0){
            total = valor[0].valor.toFixed(2);
        }

        const meta = document.createElement("div");
        meta.classList.add("meta");
        meta.textContent = `Meta de consumo: ${valorMeta}Kwh`; 

        const fatura = document.createElement("div");
        fatura.classList.add("fatura");
        fatura.textContent = `Fatura: R$${total}`; 

        descricao.appendChild(estabelecimentoNome);
        descricao.appendChild(meta);
        descricao.appendChild(fatura);

        descricao.addEventListener("click", () => {
            sessionStorage.setItem("id_imovel", elemento.objectId);
            sessionStorage.setItem("nomeEstabelecimento", elemento.nome);

            /*
            const teste = sessionStorage.getItem("objectId");
            alert(`Estabelecimento: ${elemento.nome}
            Meta de consumo: R$${elemento.meta_consumo}
            Fatura: R$${elemento.fatura}
            ID: ${teste}`);*/

            window.location.href = "../ambientes/ambiente.html";
        });

        //Editar
        const editar = document.createElement("div");
        editar.classList.add("editar");

        const linkEditar = document.createElement("a");

        const iconeEditar = document.createElement("img");
        iconeEditar.src = "../../assets/edit.png"
        iconeEditar.alt = "";

        linkEditar.appendChild(iconeEditar);
        editar.appendChild(linkEditar);

        editar.addEventListener('click', (evento) =>{
            evento.preventDefault();
            window.location.href = "./homeeditar.html";
            //aqui criar uma tela para campos de edição;
        })

        //Apagar
        const apagar = document.createElement("div");
        apagar.classList.add("apagar");

        const linkApagar = document.createElement("a");

        const iconeApagar = document.createElement("img");
        iconeApagar.src = "../../assets/trash.png"
        iconeApagar.alt = "";

        linkApagar.appendChild(iconeApagar);
        apagar.appendChild(linkApagar);

        apagar.addEventListener('click', async (evento) =>{
            evento.preventDefault();
            //elemento.objectId
            const confirmacao = confirm(`Tem certeza que deseja excluir o estabelecimento "${elemento.nome}" e todos os dados associados?`);
            if (!confirmacao) return;

            try{
                const metaCosumoResp = await metaCosumo(elemento.objectId);
                for(let meta of metaCosumoResp){
                    await deletarMetaConsumo(meta.objectId);
                    console.log(`${JSON.stringify(metaCosumoResp)} - ${elemento.objectId}`);
                }
            }catch(erro){
                console.error("Erro ao deletar Meta de consumo:", erro);            
                alert(erro.message);
            }
            try{
                const valorResposta = await buscarFatura(elemento.objectId)
                for(let valorFatura of valorResposta){
                    await deletarFatura(valorFatura.objectId);
                    console.log(`${valorFatura} - ${elemento.objectId}`);
                }
            }catch(erro){
                console.error("Erro ao deletar Fatura:", erro);            
                alert(erro.message);
            }
            
            try{
                await deletarAmbientesEletros(elemento.objectId);
            }catch(erro){
                console.error("Erro ao deletar Fatura:", erro);            
                alert(erro.message);
            }

            try{
                await deletarEstabelecimento(elemento.objectId);
            }catch(erro){
                console.error("Erro ao deletar Estabelecimento:", erro);            
                alert(erro.message);
            }
            alert('Estabelecimento deletado com sucesso');
            location.reload();
        })

        card.appendChild(pontos);
        card.appendChild(descricao);
        card.appendChild(editar);
        card.appendChild(apagar);

        
        estabelecimento.appendChild(card);
    }
}

document.getElementById("cadastro-estabelecimento").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "./homecadastro.html";
});


async function metaCosumo(idEstabelecimento) {
    const where = encodeURIComponent(JSON.stringify({id_estabelecimento: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
        }
    }))
    
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/meta_consumo?where=${where}`, {
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

async function buscarFatura(idEstabelecimento) {
    const where = encodeURIComponent(JSON.stringify({id_estabelecimento: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
        }
    }))
    
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/fatura?where=${where}`, {
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

async function buscarAmbientes(idEstabelecimento){
    const where = encodeURIComponent(JSON.stringify({id_estabelecimento: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
        }
    }))
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/ambiente?where=${where}`, {
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

    return dado.results[0].objectId;
}

async function deletarMetaConsumo(idMeta){
    await fetch(`https://parseapi.back4app.com/classes/meta_consumo/${idMeta}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}

async function deletarFatura(idFatura){
    await fetch(`https://parseapi.back4app.com/classes/fatura/${idFatura}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}

async function deletarAmbientesEletros(idEstabelecimento){
    const where = encodeURIComponent(JSON.stringify({id_imovel: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
        }
    }))
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/ambiente?where=${where}`, {
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
    
    const vetorAmbientes = dado.results;

   for(const elemento of vetorAmbientes){
       const respostaEletro = await buscarEletro(elemento.objectId);
       for(const eletros of respostaEletro){
            await deletarEletro(eletros.objectId);
            console.log(eletros);
            
       }
       await deletarAmbientes(elemento.objectId);
    }
}

async function buscarEletro(idAmbiente){
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

async function deletarAmbientes(idAmbiente) {
    await fetch(`https://parseapi.back4app.com/classes/ambiente/${idAmbiente}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}

async function deletarEstabelecimento(idEstabelecimento){
    await fetch(`https://parseapi.back4app.com/classes/Estabelecimentos/${idEstabelecimento}`, {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY
        }
    })
}