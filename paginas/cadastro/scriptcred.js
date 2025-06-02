const senha = document.getElementById("input-senha");
const confirmarSenha = document.getElementById("input-confirmar-senha")

senha.addEventListener("input", (evento) => {
    const valor = evento.target.value;
    console.log(valor);
    
    const maiuscula = document.getElementById("maiuscula");
    const minuscula = document.getElementById("minuscula");
    const especial = document.getElementById("especial")
    const tamanho = document.getElementById("tamanho");
    //✓
    //✕

    if(/[A-Z]/.test(valor)){
        maiuscula.style.color = "#34C759";
        maiuscula.querySelector("span").textContent = "✓";
    }else{
        maiuscula.style.color = "black";
        maiuscula.querySelector("span").textContent = "✕";
        
    }
    
    if(/[a-z]/.test(valor)){
        minuscula.style.color = "#34C759";
        minuscula.querySelector("span").textContent = "✓";
    }else{
        minuscula.style.color = "black";
        minuscula.querySelector('span').textContent = "✕";
    }

    if(/[^A-Za-z0-9]/.test(valor)){
        especial.style.color = "#34C759";
        especial.querySelector("span").textContent = "✓";
    }else{
        especial.style.color = "black";
        especial.querySelector("span").textContent = "✕";
    }

    if(valor.length >= 8){
        tamanho.style.color = "#34C759";
        tamanho.querySelector("span").textContent = "✓";
    }else{
        tamanho.style.color = "black";
        tamanho.querySelector("span").textContent = "✕";
    }
})

confirmarSenha.addEventListener("input", (evento) => {
    const valor = evento.target.value;
    const confirmacao = document.getElementById("confirmacao");

    if(confirmarSenha.value !== senha.value){
        confirmacao.querySelector("p").style.display = "block";
    }else{
        confirmacao.querySelector("p").style.display = "none";
    }
})
