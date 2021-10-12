window.addEventListener("DOMContentLoaded", () => obtenerLexemas());
const lexico = document.getElementById("datos");
const sintac = document.getElementById("aSintactico");
let codigo = document.getElementById("codigo");
let cCodigo = document.getElementById("container_codigo");
let lexemas;
let tokens = [];

/* obteniendo la informacion de la bd y pasandola a una variable local */
const obtenerLexemas = async () => {
  try {
    const rs = await fetch("./lexemas.json");
    const data = await rs.json();
    lexemas = data;
  } catch (error) {
    console.log(error);
  }
};

/* buscar palabra en lexemas */
function buscar(listaDePalabras) {
  let subTokens =[];
  /* recorrer la lista que nos pasan */
  listaDePalabras.forEach((palabra)=>{
    /* combrobar si la palabra se encuentra en la bd lexemas */
    lexemas.some((item)=> item.nombre == palabra)?
    lexemas.filter((item) => {
      if (item.nombre == palabra) {
        subTokens.push(item);
      }
    })
    /* combrobar si la palabra noencontrada no es un string vacio*/
    : comprobarPalabraNoEncontrada(palabra) !== undefined ?
      subTokens.push(comprobarPalabraNoEncontrada(palabra)):
      console.log('es un estring vacio')
      ;
  });
  tokens.push(subTokens);
  console.log(tokens);
  lexico.innerHTML=``;
  tokens.forEach(item=>{
    lexico.innerHTML+=`
      <tr>
      <td class='linea text-body-1' colspan='3'>
      Linea ${tokens.indexOf(item) + 1}
      </td>
      </tr>`
    item.forEach(item=>{
      lexico.innerHTML+=`
      <tr>
      <td class="text-body-1">
          ${item.nombre}
      </td>
      <td class="text-body-1">
        ${item.tipo}
      </td>
      <td class="text-body-1">
        ${item.codigo}
      </td>
    </tr>`;
    })
  })
}

/*  funcion que compara las palabras no encontradas*/
function comprobarPalabraNoEncontrada(palabra){
/*   console.log('No se encontro',palabra); */
  let temp;
  /* comprueba si no es un string vacio y no es un numero */
  if(palabra !== '' && isNaN(palabra)){
    temp = {
      nombre: palabra,
      tipo: "identidicador",
      codigo: "101"
    }
  /* comprueba si no es un string vacio y si es un numero */
  }else if (palabra !== '' && !isNaN(palabra)){
    temp = {
      nombre: palabra,
      tipo: "numero",
      codigo: "102"
    }
  }
  return temp;
}

/* funcion que divide el texto en bloque de codigo */
function dividirBloque(cadenas){
  let bloques = cadenas.split(';\n')
  console.log(bloques);
  return bloques;
}
/* funcion que separa los casos */
function comprobarCaso(bloques){
  bloques.forEach(item=>{
    item.startsWith('if')?
      item.match(/if\(\w+\s[=|==|<=|>=|===|!=|!==]+\s\w+\){\s?(.*\s*?)*};?/g)?
        console.log('compila correctamente el if'):
        console.log('La linea '+bloques.indexOf(item)+' es incorrecta')
    : item.startsWith('const') |item.startsWith('var') |item.startsWith('let')?
        item.match(/[const|var|let]\s\w+\s?=?\s?\w+?;?\s?/g)?
          console.log('compila correctamente el declaracion de variable'):
          console.log('La linea '+bloques.indexOf(item)+' es incorrecta declaracion')
    :item.match(/\w+\s?=\s?\w+;?\s?/g)?
        console.log('se inicializo correctamente')
    :console.log('no reconosco esta sintaxis')
  })

}
/* funcion que divide el texto en lineas */
function dividirLineas(cadenas){
  let listDeCadenas = cadenas.split(/\n/g);
  /*   console.log(listDeCadenas); */
  return listDeCadenas;
}
/* funcion que divide el texto en palabras y luego las busca en la bd lexemas */
function dividirPalabras(cadenas){
  /* recorremos las lineas */
  cadenas.forEach((cadena)=>{
    /* en cada linea separamos los simbolos*/
    cadena = cadena.replace(';',' ;');
    cadena = cadena.replace('=',' =');
    cadena = cadena.replace('+',' +');
    cadena = cadena.replace('.',' . ');
    cadena = cadena.replace('(',' ( ');
    cadena = cadena.replace(')',' ) ');
/*     console.log(cadena) */
  /* separamos cada linea por los espacios */
  let listaDePalabras = cadena.split(/\s/g);
  /*     console.log(listaDePalabras); */
  /* buscamos cada parabra */
  buscar(listaDePalabras);
  });
}
/* agregando la accion al form */
cCodigo.addEventListener('submit', event=>{
  event.preventDefault();
  tokens=[];
  dividirPalabras(dividirLineas(codigo.value));
  comprobarCaso(dividirBloque(codigo.value));
  /*   dividirLineas() */
})