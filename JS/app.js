function GerarID(){
    return Math.random().toString(36).slice(2,11);
}

console.log("id gerado" + GerarID())

function Cadastro(objeto){
    let produtos=[]
    produtos.push(objeto)
    console.log("produto cadatrado como sucesso")
}   