const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';
const URL = "https://parseapi.back4app.com/users";

const senha = document.getElementById("input-senha");
const confirmarSenha = document.getElementById("input-confirmar-senha");
const teste = [false, false, false, false, false];

senha.addEventListener("input", (evento) => {
    const valor = evento.target.value;
    
    const maiuscula = document.getElementById("maiuscula");
    const minuscula = document.getElementById("minuscula");
    const especial = document.getElementById("especial")
    const tamanho = document.getElementById("tamanho");
    //✓
    //✕

    if(/[A-Z]/.test(valor)){
        maiuscula.style.color = "#34C759";
        maiuscula.querySelector("span").textContent = "✓";
        teste[0] = true;
    }else{
        maiuscula.style.color = "black";
        maiuscula.querySelector("span").textContent = "✕";
        teste[0] = false;
    }
    
    if(/[a-z]/.test(valor)){
        minuscula.style.color = "#34C759";
        minuscula.querySelector("span").textContent = "✓";
        teste[1] = true;
    }else{
        minuscula.style.color = "black";
        minuscula.querySelector('span').textContent = "✕";
        teste[1] = false;
    }

    if(/[^A-Za-z0-9]/.test(valor)){
        especial.style.color = "#34C759";
        especial.querySelector("span").textContent = "✓";
        teste[2] = true;
    }else{
        especial.style.color = "black";
        especial.querySelector("span").textContent = "✕";
        teste[2] = false;
    }

    if(valor.length >= 8){
        tamanho.style.color = "#34C759";
        tamanho.querySelector("span").textContent = "✓";
        teste[3] = true;
    }else{
        tamanho.style.color = "black";
        tamanho.querySelector("span").textContent = "✕";
        teste[3] = false;
    }
})

confirmarSenha.addEventListener("input", (evento) => {
    const valor = evento.target.value;
    const confirmacao = document.getElementById("confirmacao");

    if(confirmarSenha.value !== senha.value){
        confirmacao.querySelector("p").style.display = "block";
        teste[4] = false;
    }else{
        confirmacao.querySelector("p").style.display = "none";
        teste[4] = true;
    }
})

document.getElementById("form-credenciais").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const credenciaisOK = teste.filter((valor) => valor === true);
    if(credenciaisOK.length === 5){
        const senhaInput = document.getElementById("input-senha").value;
        const nome = sessionStorage.getItem("nome");
        const sobrenome = sessionStorage.getItem("sobrenome");
        const data = sessionStorage.getItem("data");
        const email = document.getElementById("input-email").value;
        
        const data_nascimento = {
            "__type": "Date",
            "iso": new Date(data).toISOString()
        };

        const dados = {
            username: email,
            password: senhaInput,
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            data_nascimento: data_nascimento
        }
        
        console.log(data);

        try{
            const resultado = await cadastrar(dados, URL, APP_ID, API_KEY);
            console.log(resultado);
        }catch(erro){
            console.error("Erro ao cadastrar:", erro);
            alert(erro.message);
        }
        sessionStorage.removeItem("nome");
        sessionStorage.removeItem("data");
        sessionStorage.removeItem("sobrenome");


    }else{
        alert("Campo de email ou senha estão incorretos");
    }
})

async function cadastrar(dados, URL, APP_ID, API_KEY){
    const resposta = await fetch(URL, {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    if(!resposta.ok){
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    const dado = await resposta.json();
    return dado;
}