function logado(){
    const token = sessionStorage.getItem("sessionToken");
    if(!token){
        location.replace("../login/login.html");
    }
}


