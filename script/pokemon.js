//Variable global para almacenar la información
var pokeData = "";

//Función para pedir la data del pokémon solicitado
async function getPokemon() {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const id = url.searchParams.get("id");
  
  await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(function (response) {
    pokeData = response.data;
  })
  .catch(function (error) {
    console.log(error);
  });

  showInfo();
}

//Función para mostrar la información solicitada
async function showInfo() {
  console.log(pokeData);
  //Número de la pokédex
  document.getElementById("number").innerHTML = pokeData.id;
  //Nombre del pokémon
  document.getElementById("name").innerHTML = pokeData.name;
  //Textos alternativos por si las imágenes no se cargaran
  document.getElementById("male_front").alt = `male_front_${pokeData.name}.jpg`;
  document.getElementById("male_back").alt = `male_back_${pokeData.name}.jpg`;

  document.getElementById("female_front").alt = `female_front_${pokeData.name}.jpg`;
  document.getElementById("female_back").alt = `female_back_${pokeData.name}.jpg`;

  document.getElementById("male_sFront").alt = `shiny_male_front_${pokeData.name}.jpg`;
  document.getElementById("male_sBack").alt = `shiny_male_back_${pokeData.name}.jpg`;

  document.getElementById("female_sFront").alt = `shiny_female_front_${pokeData.name}.jpg`;
  document.getElementById("female_sBack").alt = `shiny_female_back_${pokeData.name}.jpg`;
  //Imágenes
  //Revisando si están presentes las llaves de front_female, back_female, front_shiny_female, back_shiny_female
  var spritesData = pokeData.sprites;
  if (spritesData.front_female == "" || spritesData.front_female == null) {
    document.getElementById("male_front").src = pokeData.sprites.front_default;
    document.getElementById("male_back").src = pokeData.sprites.back_default;

    document.getElementById("male_sFront").src = pokeData.sprites.front_shiny;
    document.getElementById("male_sBack").src = pokeData.sprites.back_shiny;
  }
  else {
    document.getElementById("male_front").src = pokeData.sprites.front_default;
    document.getElementById("male_back").src = pokeData.sprites.back_default;

    document.getElementById("female_front").src = pokeData.sprites.front_female;
    document.getElementById("female_back").src = pokeData.sprites.back_female;

    document.getElementById("male_sFront").src = pokeData.sprites.front_shiny;
    document.getElementById("male_sBack").src = pokeData.sprites.back_shiny;

    document.getElementById("female_sFront").src = pokeData.sprites.front_shiny_female;
    document.getElementById("female_sBack").src = pokeData.sprites.back_shiny_female;
  }

  //Estadísticas 
  //HP
  document.getElementById("health").style.width = `${(pokeData.stats[0].base_stat)/255*765}px`;
  document.getElementById("health").innerText = `${pokeData.stats[0].stat.name}-${pokeData.stats[0].base_stat}`;
  //Ataque
  document.getElementById("attack").style.width = `${(pokeData.stats[1].base_stat)/255*765}px`;
  document.getElementById("attack").innerText = `${pokeData.stats[1].stat.name}-${pokeData.stats[1].base_stat}`;
  //Defensa
  document.getElementById("defense").style.width = `${(pokeData.stats[2].base_stat)/255*765}px`;
  document.getElementById("defense").innerText = `${pokeData.stats[2].stat.name}-${pokeData.stats[2].base_stat}`;
  //Ataque Especial
  document.getElementById("sp_attack").style.width = `${(pokeData.stats[3].base_stat)/255*765}px`;
  document.getElementById("sp_attack").innerText = `${pokeData.stats[3].stat.name}-${pokeData.stats[3].base_stat}`;
  //Defensa Especial
  document.getElementById("sp_defense").style.width = `${(pokeData.stats[4].base_stat)/255*765}px`;
  document.getElementById("sp_defense").innerText = `${pokeData.stats[4].stat.name}-${pokeData.stats[4].base_stat}`;
  //Velocidad
  document.getElementById("speed").style.width = `${(pokeData.stats[5].base_stat)/255*765}px`;
  document.getElementById("speed").innerText = `${pokeData.stats[5].stat.name}-${pokeData.stats[5].base_stat}`;

  //Lista de Movimientos
  var outputMoves = "";
  let arrMoves = pokeData.moves;

  for (var pokeMove of arrMoves) {
    outputMoves +=`
      <li>${pokeMove.move.name}</li>
    `;
  }
 
  document.querySelector("#pokeMoves").innerHTML = outputMoves;

  //Debilidades, solicitud por URL al servidor
  var urlData = [];
  let arrTypes = pokeData.types;

  for (var pokeType of arrTypes) {
    urlData.push(pokeType.type.url);
  }
  var weaknessesType = await getWeaknesses(urlData);
  //Imprimiendo las debilidades
  var outputWeek = "";
  
  for (var pokeWeek of weaknessesType) {
    outputWeek +=`
      <li>${pokeWeek.name}</li>
    `;
  }

  document.querySelector("#pokeWeaknesses").innerHTML = outputWeek;
  
  //Peso
  var peso = pokeData.weight;
  document.querySelector("#kgs").innerHTML = (peso/10).toFixed(4);
  document.querySelector("#lbs").innerHTML = (peso/4.53592).toFixed(4);
  //Altura
  var altura = pokeData.height;
  document.querySelector("#mts").innerHTML = (altura/10).toFixed(4);
  document.querySelector("#ft").innerHTML = (altura/3.048).toFixed(4);

}

//Función para solicitar al servidor las debilidades del pokémon
async function getWeaknesses(urlArr) {
  var weekArr = [];
  for (var i in urlArr) {
    await axios.get(urlArr[i])
    .then(function (response) {
      let type = response.data.damage_relations.double_damage_from;
      for (var k in type) {
        let jsn = {
          "name": type[k].name
        };
        weekArr.push(jsn);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  return weekArr;
}