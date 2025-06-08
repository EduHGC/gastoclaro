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
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
}

async function handleCredentialResponse(response) {
    const idToken = response.credential;
    const payload = parseJwt(idToken);
    const googleId = payload.sub;

    try {
        const res = await fetch("https://parseapi.back4app.com/users", {
            method: "POST",
            headers: {
                "X-Parse-Application-Id": APP_ID,
                "X-Parse-REST-API-Key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                authData: {
                    google: {
                        id: googleId,
                        id_token: idToken
                    }
                }
            })
        });

        const user = await res.json();

        if (!res.ok ) {
            throw new Error(user.error || "Erro ao logar com Google");
        }

        console.log("Login com Google bem-sucedido:", user);

        sessionStorage.setItem("sessionToken", user.sessionToken);
        sessionStorage.setItem("userId", user.objectId);
        //sessionStorage.setItem("nome" , payload.name);
        window.location.href = "../home/home.html";
    } catch (err) {
        console.error("Erro no login com Google:", err);
        alert("Erro ao fazer login com Google");
    }
}