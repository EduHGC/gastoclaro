const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.getElementById("voltar").addEventListener("click", () => {
    window.location.href = "./home.html";
})

document.addEventListener("DOMContentLoaded", async () => {
    const idEstabelecimento = sessionStorage.getItem("id_imovel");
    const nome = sessionStorage.getItem("nomeEstabelecimento");

    const nomeEstabelecimento = document.getElementById("input-nome");
    const cep = document.getElementById("input-cep");
    const tipo = document.getElementById("input-tipo");
    const endereco = document.getElementById("input-endereco");
    const metaConsumo = document.getElementById("input-meta-consumo");
    const valorFatura = document.getElementById("input-conta");
    const vencimentoFatura = document.getElementById("input-vencimento-fatura");

    try{
        const resposta = await buscarEstabelecimento(idEstabelecimento);
        console.log(resposta);
        nomeEstabelecimento.value = resposta.nome;
        tipo.value = resposta.tipo;
        cep.value = resposta.cep;
        endereco.value = resposta.endereco;

        const respostaMetaConsumo = await buscarMetaConsumo(idEstabelecimento);
        metaConsumo.value = respostaMetaConsumo.consumo;
        const respostaFatura = await buscarFatura(idEstabelecimento);
        
        valorFatura.value = respostaFatura.valor.toFixed(2);
        const dataVencimento = new Date(respostaFatura.data_vencimento?.iso);
        vencimentoFatura.value = dataVencimento.toISOString().substring(0, 10);
        
        sessionStorage.setItem("id_meta_consumo", respostaMetaConsumo.objectId);
        console.log(respostaMetaConsumo.objectId);
        sessionStorage.setItem("id_fatura", respostaFatura.objectId);


    }catch(erro){
        console.error("Erro ao carregar edição de estabelecimento", erro);            
        alert(erro.message);
    }

    
});

async function buscarEstabelecimento(id_estabelecimento){
    const where = encodeURIComponent(JSON.stringify({
        objectId: id_estabelecimento
    }))
        
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/Estabelecimentos?where=${where}`, {
        method: 'GET',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }

    const dado = await resposta.json();

    return dado.results[0];
}

async function buscarMetaConsumo(idEstabelecimento){
    const where = encodeURIComponent(JSON.stringify({id_estabelecimento: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
    }       
    }))
        
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/meta_consumo?where=${where}`, {
        method: 'GET',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }

    const dado = await resposta.json();

    return dado.results[0];
}

async function buscarFatura(idEstabelecimento){
    const where = encodeURIComponent(JSON.stringify({id_estabelecimento: {
        __type: "Pointer",
        className: "Estabelecimentos",
        objectId: idEstabelecimento
    }       
    }))
        
    const resposta = await fetch(`https://parseapi.back4app.com/classes/fatura?where=${where}`, {
        method: 'GET',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }

    const dado = await resposta.json();

    return dado.results[0];
}

document.getElementById("editar-estabelecimento").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nomeEstabelecimento = document.getElementById("input-nome").value;
    const cep = document.getElementById("input-cep").value;
    const tipo = document.getElementById("input-tipo").value;
    const endereco = document.getElementById("input-endereco").value;
    const metaConsumo = document.getElementById("input-meta-consumo").value;
    const valorFatura = document.getElementById("input-conta").value;
    const vencimentoFatura = document.getElementById("input-vencimento-fatura").value;
    const idEstabelecimento = sessionStorage.getItem("id_imovel");

    const vencimento = {
            "__type": "Date",
            "iso": new Date(vencimentoFatura).toISOString()
        };

    const dadosEstabelecimento = {
            nome: nomeEstabelecimento,
            tipo: tipo,
            cep: cep, 
            endereco: endereco
    };

    const dadosMetaConsumo = {
        consumo: parseInt(metaConsumo)
    };

    const dadosFatura = {
        valor: parseFloat(valorFatura),
        data_vencimento: vencimento
    };



    try {
        await editarEstabelecimento(dadosEstabelecimento, idEstabelecimento);
        await editarMetaConsumo(dadosMetaConsumo, sessionStorage.getItem("id_meta_consumo"));
        await editarFatura(dadosFatura, sessionStorage.getItem("id_fatura"));
    } catch (erro) {
        console.error("Erro ao carregar edição de estabelecimento", erro);            
        alert(erro.message);
    }
    alert("Estabelecimento editado com sucesso");
    window.location.href = "./home.html";
})

async function editarEstabelecimento(dados, objectId){
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/Estabelecimentos/${objectId}`, {
        method: 'PUT',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }
}

async function editarMetaConsumo(dados, objectId){
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/meta_consumo/${objectId}`, {
        method: 'PUT',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }
}

async function editarFatura(dados, objectId){
    
    const resposta = await fetch(`https://parseapi.back4app.com/classes/fatura/${objectId}`, {
        method: 'PUT',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if(!resposta.ok){
        throw new Error(resposta.status);
    }
}