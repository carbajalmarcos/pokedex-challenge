# pokedex-challenge

## Features

# list
```sh
/list?limit=10&offset=20
```
```json
{
  "count": 1118,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=2&limit=1",
  "previous": "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1",
  "results": [
    {
      "name": "ivysaur",
      "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      "type": "grass,poison",
      "weight": 130,
      "abilities": "overgrow,chlorophyll"
    }
  ]
}
```
# details
```sh
/details/{pokemon name}
```
```json
{
  "basicInformation": {
    "name": "ditto",
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    "type": "normal",
    "weight": "40,",
    "abilities": "limber,imposter"
  },
  "movements": "transform",
  "description": "Puede alterar por completo su estructura celular para\\nemular cualquier objeto que vea."
}
```

## Swagger

https://pokedex-api-challenge.herokuapp.com/api-doc/

## Installation

```sh
npm i
npm run dev
```

For production environments...

```sh
npm run build
npm start
```