const fs = require ("fs");

//variavel de teste
let InformaçõesProduto ={
    Nome:"aspirador de pó",
    Preço:"1000"
}

const json = JSON.stringify(InformaçõesProduto, null, 2);

fs.writeFileSync("dados.json", json);
