import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiLink = "https://pokeapi.co/api/v2/";

let result;
let pokemonData;
let evoData;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    information: result,
    data: pokemonData,
    evo: evoData,
  });
  //reset result
  result = "";
});

app.post("/search", async (req, res) => {
  let pokemonName = req.body.name;
  try {
    //get from api/pokemon-species/:id
    const pokeData = await axios.get(
      apiLink + "pokemon-species/" + pokemonName
    );
    pokemonData = pokeData.data;
    //get from api/pokemon/:id
    const response = await axios.get(apiLink + "pokemon/" + pokemonData.id);
    result = response.data;
    //get from api/evolution-chain/:id
    const pokeEvo = await axios.get(pokemonData.evolution_chain.url);
    evoData = pokeEvo.data;

    console.log(response.data.species.url);
    res.redirect("/");
  } catch (error) {
    res.status(400).send("sorry The pokemon is not exist. Try another name.");
  }
});

app.post("/random", async (req, res) => {
  try {
    // pokemon have 1302 number, the id number is between 1-1025, 10001-10277
    // random id of pokemon
    let randomPokemonNumber = Math.floor(Math.random() * 1302);

    //if number is over than 1025, increase the number to start at 10000
    if (randomPokemonNumber > 1025) {
      randomPokemonNumber = randomPokemonNumber + 8975;
    }
    // get pokemon data from random number, from api/pokemon/:id
    const response = await axios.get(
      apiLink + "pokemon/" + randomPokemonNumber
    );
    result = response.data;
    //get from api/pokemon-species/:id
    const pokeData = await axios.get(result.species.url);
    pokemonData = pokeData.data;
    //get from api/evolution-chain/:id
    const pokeEvo = await axios.get(pokemonData.evolution_chain.url);
    evoData = pokeEvo.data;

    console.log(response.data.species.url);
    res.redirect("/");
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
