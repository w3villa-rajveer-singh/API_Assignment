const express = require("express");
const axios = require("axios");
const app = express();

const PORT = 3000;

// Fetch all Pokémon 
app.get("/pokemons", async (req, res) => {
  
  const limit = req.query.limit || 100;
  const apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

  try {
    const response = await axios.get(apiURL);

    const rawJSON = response.data.results; // Full list of Pokémon objects


    res.status(200).json({
      statusCode: response.status,
      count: rawJSON.length,
      rawJSON
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        statusCode: error.response.status,
        message: "Unable to fetch Pokémon list",
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Server Error",
      });
    }
  }
});

// Endpoint to fetch Pokémon by name
app.get("/pokemon/:name", async (req, res) => {
  const pokemonName = req.params.name;
  const apiURL = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

  try {
    const response = await axios.get(apiURL);

    // RAW JSON 
    const rawJSON = {
      name: response.data.name,
      height: response.data.height,
      abilities: response.data.abilities,
    };

    res.status(200).json({
      statusCode: response.status,
      rawJSON
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        statusCode: error.response.status,
        message: "Endpoint or Pokémon Not Found",
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Server Error",
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
