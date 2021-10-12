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
  let encontrados = [];
  let noencontrados = [];
  listaDePalabras.forEach((palabra)=>{
    lexemas.filter((item) => {
      if (item.nombre == palabra) {
        subTokens.push(item);
      }else{
/*         console.log(subTokens,item) */
        if (item.nombre !== palabra && subTokens.includes(item)){
          console.log('no se encontro',palabra);

        }
      }
      /* else if (item.nombre != palabra && subTokens.includes(item)){
        console.log('No se encontro',palabra)
        noencontrados.push(palabra);
      } */
    });
    console.log(noencontrados)
    noencontrados.forEach(item=>{
      console.log(subTokens[subTokens.length-1].nombre)
      if (palabra !== '' &&  palabra == item) {
        temp = {
          nombre: palabra,
          tipo: "identidicador",
          codigo: "101"
        };
        subTokens.push(temp);
      }
    })
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