import type { Order } from '../../../shared/types/order';

export const mockOrders: Order[] = [
  {
    id: crypto.randomUUID(),
    customerName: 'João Silva',
    status: 'pending',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p1',
        productName: 'Camiseta Algodão',
        quantity: 2,
        unitPrice: 59.9,
      },
      {
        id: crypto.randomUUID(),
        productId: 'p2',
        productName: 'Caneca Personalizada',
        quantity: 1,
        unitPrice: 29.9,
      },
    ],
    createdAt: '2025-06-10T14:30:00.000Z',
    updatedAt: '2025-06-10T14:30:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    customerName: 'Maria Oliveira',
    status: 'completed',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p3',
        productName: 'Boné Aba Curva',
        quantity: 3,
        unitPrice: 49.9,
      },
    ],
    manualTotal: 130,
    createdAt: '2025-06-08T09:15:00.000Z',
    updatedAt: '2025-06-09T11:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    customerName: 'Carlos Santos',
    status: 'in_progress',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p4',
        productName: 'Carregador Portátil',
        quantity: 2,
        unitPrice: 99.9,
      },
      {
        id: crypto.randomUUID(),
        productId: 'p6',
        productName: 'Café Gourmet 250g',
        quantity: 4,
        unitPrice: 34.9,
      },
      {
        id: crypto.randomUUID(),
        productId: 'p7',
        productName: 'Mochila Executiva',
        quantity: 1,
        unitPrice: 129.9,
      },
    ],
    createdAt: '2025-06-07T10:00:00.000Z',
    updatedAt: '2025-06-09T08:30:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    customerName: 'Ana Costa',
    status: 'cancelled',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p5',
        productName: 'Vaso Decorativo',
        quantity: 1,
        unitPrice: 44.9,
      },
    ],
    createdAt: '2025-06-05T16:45:00.000Z',
    updatedAt: '2025-06-06T09:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    customerName: 'Pedro Almeida',
    status: 'pending',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p8',
        productName: 'Chaveiro Personalizado',
        quantity: 10,
        unitPrice: 9.9,
      },
      {
        id: crypto.randomUUID(),
        productId: 'p2',
        productName: 'Caneca Personalizada',
        quantity: 5,
        unitPrice: 29.9,
      },
    ],
    createdAt: '2025-06-11T08:00:00.000Z',
    updatedAt: '2025-06-11T08:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    customerName: 'Lucia Ferreira',
    status: 'in_progress',
    items: [
      {
        id: crypto.randomUUID(),
        productId: 'p1',
        productName: 'Camiseta Algodão',
        quantity: 1,
        unitPrice: 59.9,
      },
    ],
    createdAt: '2025-06-09T13:20:00.000Z',
    updatedAt: '2025-06-10T10:00:00.000Z',
  },
];
