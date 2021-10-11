window.addEventListener("DOMContentLoaded", () => obtenerLexemas());
const lexico = document.getElementById("aLexico");
const sintac = document.getElementById("aSintactico");
let codigo = document.getElementById("codigo");
let cCodigo = document.getElementById("container_codigo");
let lexemas;
let tokens = [];

const obtenerLexemas = async () => {
  try {
    const rs = await fetch("./lexemas.json");
    const data = await rs.json();
    lexemas = data;
  } catch (error) {
    console.log(error);
  }
};

function buscar(listaDePalabras) {
  let subTokens =[];
  let noencontrados = [];
  listaDePalabras.forEach((palabra)=>{
    lexemas.filter((item) => {
      if (item.nombre == palabra) {
        console.log(item);
        subTokens.push(item);
      }else if (subTokens.includes(palabra) && !noencontrados.includes(palabra)){
        noencontrados.push(palabra);
        console.log(noencontrados);
      }
    });
    if (palabra != '') {
      temp = {
        nombre: palabra,
        tipo: "identidicador",
        codigo: "101"
      };
      subTokens.push(temp);
    }
  });
  tokens.push(subTokens);
  console.log(subTokens,tokens);
}

function dividirLineas(cadenas){
  let listDeCadenas = cadenas.split(/\n/g);
/*   console.log(listDeCadenas); */
  return listDeCadenas;
}
function dividirPalabras(cadenas){
  cadenas.forEach((cadena)=>{
    cadena = cadena.replace(';',' ;');
    cadena = cadena.replace('.',' ');
    cadena = cadena.replace('(',' ( ');
    cadena = cadena.replace(')',' ) ');
/*     console.log(cadena) */
    let listaDePalabras = cadena.split(/\s/g);
/*     console.log(listaDePalabras); */
    buscar(listaDePalabras);
  });
}
cCodigo.addEventListener('submit', event=>{
  event.preventDefault();
  tokens=[];
  dividirPalabras(dividirLineas(codigo.value));
/*   dividirLineas() */
})