/*
  Variables globales
   -Trabajamos con 151 pokémon para no sobrecargar servidor de pokéApi
   -Hay un total de 898 pokémon
   -#1: bulbasaur
   -#898: calyrex
*/
var cant_pokemon = 9;
var Pokemon = [];

async function getList() {
  for (var i=1; i<=cant_pokemon; i++) {
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then(function (response) {
      Pokemon.push(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  pokeCards();
 
}

function pokeCards() {
  console.log(Pokemon);
  var output = "";

  for (var pkm of Pokemon) {
    //Tipos para las clases
    let typesArr = pkm.types;
    let classArr = [];

    for (var i in typesArr) {
      let jsn = {
        "name": typesArr[i].type.name
      }
      classArr.push(jsn);
    }

    if (classArr.length == 1) {
      output += `
      <div class="card ${classArr[0].name}" style="width: 18rem;">
        <img class="card-img-top" src="${pkm.sprites.front_default}" alt="${pkm.name}.jpg">
        <div class="card-body">
          <h5 class="card-title">${pkm.name}</h5>
          <a href="./pokemon.html?id=${pkm.id}" class="btn btn-primary">Ver más</a>
        </div>
      </div>
      `;

    }
    else {
      output += `
      <div class="card ${classArr[0].name} ${classArr[1].name}" style="width: 18rem;">
        <img class="card-img-top" src="${pkm.sprites.front_default}" alt="${pkm.name}.jpg">
        <div class="card-body">
          <h5 class="card-title">${pkm.name}</h5>
          <a href="./pokemon.html?id=${pkm.id}" class="btn btn-primary">Ver más</a>
        </div>
      </div>
      `;
    }
  }

  document.getElementById("pokeList").innerHTML = output;
}

async function searchPoke() {
  var name = document.getElementById("input_search").value.toLowerCase();

  await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
  .then(function (response) {
    
    var data = response.data;

    //Tipos para las clases
    let typesArr = response.data.types;
    let classArr = [];
    for (var i in typesArr) {
      let jsn = {
        "name": typesArr[i].type.name
      }
      classArr.push(jsn);
    }
    console.log(classArr, classArr.length);

    if (classArr.length == 1) {
      output = `
      <div class="card ${classArr[0].name}" style="width: 18rem;">
        <img class="card-img-top" src="${data.sprites.front_default}" alt="${data.name}.jpg">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <a href="./pokemon.html?id=${data.id}" class="btn btn-primary">Ver más</a>
        </div>
      </div>
      `;
    }
    else {
      output = `
      <div class="card ${classArr[0].name} ${classArr[1].name}" style="width: 18rem;">
        <img class="card-img-top" src="${data.sprites.front_default}" alt="${data.name}.jpg">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <a href="./pokemon.html?id=${data.id}" class="btn btn-primary">Ver más</a>
        </div>
      </div>
      `;
    }

    document.getElementById("pokeList").innerHTML = output;
  })
  .catch(function (error) {
    console.log(error);
    document.getElementById("input_search").value = "";
    alert("Pokémon no encontrado");
  });
}

function filterPoke(stringParam) {
  //pokeList
  var myCards = document.getElementById("pokeList").querySelectorAll('.card');
  var status;

  if (stringParam == "all") {
    for (var i in myCards) {
      var element = myCards[i];
      element.style.display="block";
    }
  }
  else {
    for (var i in myCards) {
      var element = myCards[i];
      status = element.classList.contains(stringParam);
      
      if (!status) {
        element.style.display="none";
      }
      else {
        element.style.display="block";
      }
    }
  }

}

async function searchRegion(stringParam) {
  var indexValues = region(stringParam);
  var inicio = indexValues.start;
  var final = indexValues.end;
  
  Pokemon = [];
 
  for (var i=inicio; i<=final; i++) {
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then(function (response) {
      Pokemon.push(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  pokeCards();
}

function region(stringParam) {
  var inicio = 0;
  var final = 0;

  switch (stringParam) {
    case 'kanto':
      inicio = 1; 
      final = 151;
    break;

    case 'johto':
      inicio = 152; 
      final = 251;
    break;

    case 'hoenn':
      inicio = 252; 
      final = 386;
    break;

    case 'sinnoh':
      inicio = 387; 
      final = 494;
    break;

    case 'teselia':
      inicio = 495; 
      final = 649;
    break;

    case 'kalos':
      inicio = 650; 
      final = 721;
    break;

    default:
      console.log("Ha ocurrido un error");
      alert("Ha ocurrido un error");
    break;

  }

  let jsn = {
    "start": inicio,
    "end": final
  }

  return jsn;

}


/*
  https://pokeres.bastionbot.org/images/pokemon/1.png
  - Esta página contiene las imágenes de los pokémon en formato png 
  - Imágenes vistosas y de calidad
  - Límite hasta el pokémon 890 (mugendaina - eternatus)
*/

/*
  - Lección: la API de pokemon, tiene que solicitar a una base de datos la información solicitada. Esta actividad requiere un tiempo
  para procesar la solicitud y atrapar (to fetch) toda la información para luego enviarla. Como este evento es asíncrono, se nece-
  sita utilizar async/await para indicar que la operación es asíncrona y que antes de realizar la siguiente solicitud se necesita
  primero terminar la anterior para que no haya error o problemas por parte del servidor (await).

  - Try/Catch

  for (var i=1; i<=cant_pokemon; i++) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
      Pokemon.push(response.data);
    } 
    catch (error) {
      console.error(error);
    }
  }
*/

/*
  - Tipos de pokémon
  https://as.com/meristation/2019/12/01/guia_pagina/1575197597_259376.html
*/