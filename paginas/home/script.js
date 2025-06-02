const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    
    requisicao().then((dados) => {
        criarElementos(dados);
    }) 

})
 
async function requisicao(){
    const resultado = await fetch('https://parseapi.back4app.com/classes/Estabelecimentos/', {
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

        
        card.addEventListener("click", () => {
            sessionStorage.setItem("objectId", elemento.objectId);
            sessionStorage.setItem("nome", elemento.nome);
            sessionStorage.setItem("meta_consumo", elemento.meta_consumo);
            sessionStorage.setItem("fatura", elemento.fatura);

            /*
            const teste = sessionStorage.getItem("objectId");
            alert(`Estabelecimento: ${elemento.nome}
            Meta de consumo: R$${elemento.meta_consumo}
            Fatura: R$${elemento.fatura}
            ID: ${teste}`);*/

            window.location.href = "../ambientes/ambiente.html";
        });


        estabelecimento.appendChild(card);
    });
}

document.getElementById("cadastro-estabelecimento").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "./homecadastro.html";
});




