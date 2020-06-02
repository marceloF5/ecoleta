import Knex from 'knex'

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Lamps', image: 'lamps.svg' },
    { title: 'Heaps and Batteries', image: 'batteries.svg' },
    { title: 'Papers and Cardboard', image: 'cardboard.svg' },
    { title: 'Eletronics Residues', image: 'eletronics.svg' },
    { title: 'Organics Residues', image: 'organics.svg' },
    { title: 'Kitchen Oil', image: 'oil.svg' },
  ])
}
