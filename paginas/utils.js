function logado(){
    const token = sessionStorage.getItem("sessionToken");
    if(!token){
        window.location.href = "./bemvindo/bemvindo.html";
    }
}


