const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const axios = require("axios");

const app = express();
const PORT = 4000;

// GraphQL schema
const schema = buildSchema(`
  type Ability {
    name: String
  }

  type Pokemon {
    name: String
    height: Int
    abilities: [Ability]
  }

  type Query {
    getPokemon(name: String!): Pokemon
    getAllPokemons(limit: Int = 1000): [String]
  }
`);

// Resolvers
const root = {
  getPokemon: async ({ name }) => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      return {
        name: res.data.name,
        height: res.data.height,
        abilities: res.data.abilities.map(a => ({ name: a.ability.name }))
      };
    } catch (error) {
      throw new Error(error.response ? "Pokémon Not Found" : error.message);
    }
  },

  getAllPokemons: async ({ limit }) => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      // Return only Pokémon names
      return res.data.results.map(p => p.name);
    } catch (error) {
      throw new Error("Unable to fetch Pokémon list");
    }
  }
};

// GraphQL endpoint
app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true  
}));

app.listen(PORT, () => {
  console.log(`GraphQL Server running at http://localhost:${PORT}/graphql`);
});
