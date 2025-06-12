const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';

document.getElementById("form-recuperar").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = document.getElementById("input-email").value;
    const dado = {
        email: email
    }

    try{
        const resposta = await resetarSenha(dado, email);
        alert(`${resposta}`);
    }catch(erro){
        console.error("Erro ao resetar a senha:", erro);            
        alert(erro.message);
    }
    
    window.location.href = "./login.html";
})

async function resetarSenha(dados, email){

    const resposta = await fetch("https://parseapi.back4app.com/requestPasswordReset", {
        method: 'Post',
        headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

    const dado = await resposta.json();

    if(!resposta.ok){
        if(dado){
            if(dado.code === 125){
                throw new Error("Email não encontrado");
            }
        }else{
            throw new Error("Erro de conexão com o servidor");
        }
    }

    return `Um email para redefinição da senha foi enviado para ${email}, verifique na caixa de entrada e span`;
}