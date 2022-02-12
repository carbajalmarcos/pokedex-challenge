export interface IPokemonDetails {
    basicInformation:IPokemonListItem;
    description:string;
    movements: [string];

}
interface IPokemonListItem{
    photo:string;
    type:[string];
    weight: number;
    abilities:[string]
}

export interface IPokemonList {
    items:[IPokemonListItem]
}

