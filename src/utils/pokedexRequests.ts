import axios from 'axios';
import { POKE_API_URL_BASE } from './constants';

export const getPokemonList = async (limit: string, offset: string) => {
  return await axios.get<{
    count: number;
    next: string;
    previous: string;
    results: [{ name: string; url: string }];
  }>(`${POKE_API_URL_BASE}`, { params: { limit, offset } });
};

export const getPokemonDetails = async (name: string) => {
  return await axios.get(`${POKE_API_URL_BASE}/${name}`);
};

export const getPokemonSpecies = async (id: number) => {
  return await axios.get(`${POKE_API_URL_BASE}-species/${id}`);
};
