import type { Order } from '../../../shared/types/order';

const now = new Date();
const daysAgo = (d: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const names = [
  'João Silva',
  'Maria Oliveira',
  'Carlos Santos',
  'Ana Costa',
  'Pedro Almeida',
  'Lucia Ferreira',
  'Rafael Souza',
  'Juliana Lima',
  'Fernando Rocha',
  'Patrícia Gomes',
  'Lucas Martins',
  'Camila Barbosa',
  'Thiago Ribeiro',
  'Amanda Carvalho',
  'Gustavo Nunes',
  'Larissa Dias',
  'Eduardo Azevedo',
  'Fernanda Castro',
  'Rodrigo Moreira',
  'Vanessa Araújo',
  'Bruno Teixeira',
  'Isabela Campos',
  'Marcelo Dias',
  'Gabriela Freitas',
  'André Cardoso',
  'Tatiana Monteiro',
  'Felipe Peixoto',
  'Renata Gusmão',
  'Leonardo Pires',
  'Cíntia Viana',
  'Diego Bastos',
  'Priscila Lopes',
  'Alexandre Guerra',
  'Beatriz Alencar',
  'Henrique Fogaça',
  'Michele Prado',
  'Otávio Rezende',
  'Bianca Siqueira',
  'Vitor Valadares',
  'Letícia Jordão',
  'Samuel Beltrão',
  'Paola Marques',
  'Igor Madeira',
  'Sofia Ouriques',
  'Caio Noronha',
  'Manuela Bittencourt',
  'Renan Chaves',
  'Carolina Salgado',
  'Murilo Vergara',
  'Jéssica Toledo',
  'Danilo Quadros',
  'Elisa Ximenes',
  'Rui Campelo',
  'Tainá Figueiró',
  'Nelson Palhares',
  'Stella Arantes',
  'Geraldo Neto',
  'Adriana Marcondes',
];

const itemsPool = [
  { productId: 'p1', productName: 'Camiseta Algodão', unitPrice: 59.9 },
  { productId: 'p2', productName: 'Caneca Personalizada', unitPrice: 29.9 },
  { productId: 'p3', productName: 'Boné Aba Curva', unitPrice: 49.9 },
  { productId: 'p4', productName: 'Carregador Portátil', unitPrice: 99.9 },
  { productId: 'p5', productName: 'Vaso Decorativo', unitPrice: 44.9 },
  { productId: 'p6', productName: 'Café Gourmet 250g', unitPrice: 34.9 },
  { productId: 'p7', productName: 'Mochila Executiva', unitPrice: 129.9 },
  { productId: 'p8', productName: 'Chaveiro Personalizado', unitPrice: 9.9 },
];

function pickItems(): Order['items'] {
  const count = Math.floor(Math.random() * 3) + 1;
  const picked = new Set<number>();
  const items: Order['items'] = [];
  for (let i = 0; i < count; i++) {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * itemsPool.length);
    } while (picked.has(idx));
    picked.add(idx);
    const pool = itemsPool[idx];
    items.push({
      id: crypto.randomUUID(),
      productId: pool.productId,
      productName: pool.productName,
      quantity: Math.floor(Math.random() * 8) + 1,
      unitPrice: pool.unitPrice,
    });
  }
  return items;
}

const statuses: Order['status'][] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

export const mockOrders: Order[] = Array.from({ length: 58 }, (_, i) => {
  const createdAt = daysAgo(58 - i);
  const status: Order['status'] =
    i < 30 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: crypto.randomUUID(),
    customerName: names[i],
    status,
    items: pickItems(),
    createdAt,
    updatedAt: createdAt,
  };
});
