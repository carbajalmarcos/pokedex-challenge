import express, { Request, Response, NextFunction } from 'express';
import * as utils from '../utils/pokedexRequests';
const router = express.Router();

/**
 * @swagger
 *components:
 *  schemas:
 *    PokemonList:
 *      type: object
 *      properties:
 *        count:
 *          type: integer
 *        next:
 *          type: string
 *        previous:
 *          type: string
 *        results:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              photo:
 *                type: string
 *                description: url photo of pokemon
 *              type:
 *                type: array
 *                items:
 *                  type: string
 *                description: type of pokemon
 *              weight:
 *                type: number
 *                description: pokemon weight
 *              abilities:
 *                type: array
 *                items:
 *                  type: string
 *                description: pokemon abilities
 *    PokemonDetails:
 *      type: object
 *      properties:
 *        basicInformation:
 *          type: object
 *          properties:
 *            photo:
 *              type: string
 *              description: url photo of pokemon
 *            type:
 *              type: array
 *              items:
 *                type: string
 *              description: type of pokemon
 *            weight:
 *              type: number
 *              description: pokemon weight
 *            abilities:
 *              type: array
 *              items:
 *                type: string
 *              description: pokemon abilities
 *        description:
 *          type: string
 *        movements:
 *          type: array
 *          items:
 *            type: string
 */

/**
 * @swagger
 * /list:
 *   get:
 *     summary: return pokemon details
 *     tags: [PokemonList]
 *     responses:
 *       200:
 *         description: pokemon list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref:'#/components/schemas/PokemonList
 *             examples:
 *               pokemonList:
 *                 summary: An example of pokemon list
 *                 value:
 *                   count: 1118
 *                   next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=1'
 *                   previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=1'
 *                   results:
 *                     - name: 'ivysaur'
 *                       photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'
 *                       type: 'grass,poison'
 *                       weight: 130
 *                       abilities: 'overgrow,chlorophyll'
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !(
        typeof req.query.limit === 'string' &&
        typeof req.query.offset === 'string'
      )
    )
      throw new Error('missing limit/offset params');
    const response = await utils.getPokemonList(
      req.query.limit,
      req.query.offset
    );
    const { results, count, previous, next } = response.data;
    const aux = await results.reduce(async (acc, current) => {
      const array = await acc;
      const pokemonDetails = await utils.getPokemonDetails(current.name);
      array.push({
        name: current.name,
        photo: pokemonDetails.data.sprites.front_default,
        type: pokemonDetails.data.types
          .map((x: { type: { name: string } }) => x.type.name)
          .join(),
        weight: pokemonDetails.data.weight,
        abilities: pokemonDetails.data.abilities
          .map((x: { ability: { name: string } }) => x.ability.name)
          .join(),
      });
      return array;
    }, Promise.resolve([{}]));

    aux.shift();
    res.status(200).send({
      count,
      next,
      previous,
      results: aux,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /details/{name}:
 *   get:
 *     summary: return a pokemon list
 *     tags: [PokemonDetails]
 *     responses:
 *       200:
 *         description: get pokemon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref:'#/components/schemas/PokemonDetails
 *             examples:
 *               pokemonDetails:
 *                 summary: An example of pokemon details
 *                 value:
 *                   basicInformation:
 *                     name: ditto
 *                     photo: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png
 *                     type: 'normal'
 *                     weight: 40,
 *                     abilities: 'limber,imposter'
 *                   movements: 'transform'
 *                   description: 'Puede alterar por completo su estructura celular para\nemular cualquier objeto que vea.'
 *     parameters:
 *       - name: name
 *         in: path
 *         description: ID of pet to use
 *         required: true
 *         schema:
 *           type: string
 * 
*/
router.get(
  '/details/:name',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // getting pokemon details
      const pokemonDetails = await utils.getPokemonDetails(req.params.name);
      // request to get description
      const pokemonSpecies = await utils.getPokemonSpecies(
        pokemonDetails.data.id
      );

      const description = pokemonSpecies.data.flavor_text_entries.find(
        (e: { flavor_text: string; language: { name: string } }) =>
          e.language.name === 'es'
      );

      const basicInformation = {
        name: pokemonDetails.data.name,
        photo: pokemonDetails.data.sprites.front_default,
        type: pokemonDetails.data.types
          .map((x: { type: { name: string } }) => x.type.name)
          .join(),
        weight: pokemonDetails.data.weight,
        abilities: pokemonDetails.data.abilities
          .map((x: { ability: { name: string } }) => x.ability.name)
          .join(),
      };
      res.status(200).send({
        basicInformation,
        movements: pokemonDetails.data.moves
          .map((x: { move: { name: string } }) => x.move.name)
          .join(),
        description: description.flavor_text,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
