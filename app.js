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
  listaDePalabras.forEach((palabra)=>{
    lexemas.some((item)=> item.nombre == palabra)?
      lexemas.filter((item) => {
        if (item.nombre == palabra) {
          subTokens.push(item);
        }
      })
    : comprobarPalabraNoEncontrada(palabra) !== undefined ?
      subTokens.push(comprobarPalabraNoEncontrada(palabra)):
      console.log('es un estring vacio')
      ;
  });
  tokens.push(subTokens);
  console.log(subTokens,tokens);
}

function comprobarPalabraNoEncontrada(palabra){
/*   console.log('No se encontro',palabra); */
  let temp;
  if(typeof(palabra) == 'string' && palabra !== ''){
    temp = {
      nombre: palabra,
      tipo: "identidicador",
      codigo: "101"
    }
  }else if (typeof(palabra) === 'number'){
    temp = {
      nombre: palabra,
      tipo: "numero",
      codigo: "102"
    }
  }
  return temp;
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