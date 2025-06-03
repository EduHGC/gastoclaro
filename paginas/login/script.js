const APP_ID = 'ubZ4XLWmNivxZCMH7ArJ4ck8bwkf67OEt9VOGNHF';
const API_KEY = 'ZhfsOKyedOFj6E4RDYpgasmvvjPEmoDICFOlBB1R';


document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('input-email').value;
    const senha = document.getElementById('input-password').value;
    const URL = `https://parseapi.back4app.com/login?username=${encodeURIComponent(email)}&password=${encodeURIComponent(senha)}`;
    
    try{
        const response = await fetch(URL, {
        method: 'GET',
        headers:{
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": API_KEY,
            'content-type': 'application/json'
        }
        })

        if(!response.ok){
            throw new Error("Email ou senha inválido");
            
            
        }

        const data = await response.json();
        console.log("Usuário autenticado", data);

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("userId", data.objectId);
        sessionStorage.setItem("nome", data.nome);
        sessionStorage.setItem("sobrenome", data.sobrenome);
        window.location.href = "../home/home.html";
    }catch (error) {
        console.error("Erro ao fazer login:", error);
        const erroMensagem = document.getElementById("mensagem-erro");
        erroMensagem.style.display = "block";

    }
})

    
//sessionStorage.setItem('sessinonToken', data.sessionToken);
        //window.location.href = "../home/home.html";