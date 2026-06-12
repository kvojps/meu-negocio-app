import type { Product } from '../../../shared/types/product';

const now = new Date();
const daysAgo = (d: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

type ProductSeed = {
  name: string;
  description: string;
  category: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  minStock: number;
};

const seeds: ProductSeed[] = [
  {
    name: 'Camiseta Algodão',
    description: 'Camiseta branca em algodão premium, tamanho M',
    category: 'Vestuário',
    supplier: 'Malhas Sul',
    costPrice: 22.5,
    salePrice: 59.9,
    minStock: 10,
  },
  {
    name: 'Caneca Personalizada',
    description: 'Caneca de porcelana 300ml com logo térmico',
    category: 'Utilidades',
    supplier: 'Brindes Rápidos',
    costPrice: 8.75,
    salePrice: 29.9,
    minStock: 30,
  },
  {
    name: 'Boné Aba Curva',
    description: 'Boné pré-curvo em sarja, ajuste snapback',
    category: 'Vestuário',
    supplier: 'Estilo Esportivo',
    costPrice: 15.0,
    salePrice: 49.9,
    minStock: 15,
  },
  {
    name: 'Carregador Portátil',
    description: 'Power bank 10000mAh com entrada USB-C',
    category: 'Eletrônicos',
    supplier: 'Tech Import',
    costPrice: 45.0,
    salePrice: 99.9,
    minStock: 10,
  },
  {
    name: 'Vaso Decorativo',
    description: 'Vaso de cerâmica 20cm, acabamento fosco',
    category: 'Decoração',
    supplier: 'Arte & Lar',
    costPrice: 18.0,
    salePrice: 44.9,
    minStock: 5,
  },
  {
    name: 'Café Gourmet 250g',
    description: 'Café especial torra média, grãos selecionados',
    category: 'Alimentação',
    supplier: 'Coffee Lab',
    costPrice: 14.5,
    salePrice: 34.9,
    minStock: 20,
  },
  {
    name: 'Mochila Executiva',
    description: 'Mochila 25L com compartimento para notebook 15"',
    category: 'Utilidades',
    supplier: 'Office Plus',
    costPrice: 55.0,
    salePrice: 129.9,
    minStock: 5,
  },
  {
    name: 'Chaveiro Personalizado',
    description: 'Chaveiro em acrílico com impressão UV',
    category: 'Utilidades',
    supplier: 'Brindes Rápidos',
    costPrice: 3.25,
    salePrice: 9.9,
    minStock: 50,
  },
  {
    name: 'Jaqueta Jeans',
    description: 'Jaqueta jeans azul clara, tamanho G',
    category: 'Vestuário',
    supplier: 'Malhas Sul',
    costPrice: 68.0,
    salePrice: 149.9,
    minStock: 8,
  },
  {
    name: 'Garrafa Térmica',
    description: 'Garrafa térmica inox 500ml',
    category: 'Utilidades',
    supplier: 'Office Plus',
    costPrice: 28.0,
    salePrice: 69.9,
    minStock: 12,
  },
  {
    name: 'Fone Bluetooth',
    description: 'Fone sem fio com cancelamento de ruído',
    category: 'Eletrônicos',
    supplier: 'Tech Import',
    costPrice: 82.0,
    salePrice: 189.9,
    minStock: 6,
  },
  {
    name: 'Almofada Decorativa',
    description: 'Almofada 45cm com estampa geométrica',
    category: 'Decoração',
    supplier: 'Arte & Lar',
    costPrice: 22.0,
    salePrice: 54.9,
    minStock: 10,
  },
  {
    name: 'Chocolate Artesanal',
    description: 'Chocolate 70% cacau, embalagem 100g',
    category: 'Alimentação',
    supplier: 'Coffee Lab',
    costPrice: 9.8,
    salePrice: 24.9,
    minStock: 25,
  },
  {
    name: 'Relógio Digital',
    description: "Relógio digital esportivo à prova d'água",
    category: 'Eletrônicos',
    supplier: 'Tech Import',
    costPrice: 65.0,
    salePrice: 159.9,
    minStock: 8,
  },
  {
    name: 'Quadro Decorativo',
    description: 'Quadro 30x40cm, impressão fine art',
    category: 'Decoração',
    supplier: 'Arte & Lar',
    costPrice: 32.0,
    salePrice: 79.9,
    minStock: 5,
  },
  {
    name: 'Cesta de Café',
    description: 'Cesta com café gourmet, caneca e biscoitos',
    category: 'Alimentação',
    supplier: 'Coffee Lab',
    costPrice: 38.0,
    salePrice: 89.9,
    minStock: 10,
  },
  {
    name: 'Calça Sarja',
    description: 'Calça sarja preta, tamanho 42',
    category: 'Vestuário',
    supplier: 'Malhas Sul',
    costPrice: 48.0,
    salePrice: 119.9,
    minStock: 10,
  },
  {
    name: 'Agenda Planner',
    description: 'Agenda anual capa dura 2026',
    category: 'Utilidades',
    supplier: 'Office Plus',
    costPrice: 19.5,
    salePrice: 49.9,
    minStock: 20,
  },
  {
    name: 'Suporte Notebook',
    description: 'Suporte ergonômico ajustável em alumínio',
    category: 'Eletrônicos',
    supplier: 'Tech Import',
    costPrice: 52.0,
    salePrice: 124.9,
    minStock: 8,
  },
  {
    name: 'Capa de Almofada',
    description: 'Capa 50x50cm em linho natural',
    category: 'Decoração',
    supplier: 'Arte & Lar',
    costPrice: 14.0,
    salePrice: 34.9,
    minStock: 15,
  },
];

export const mockProducts: Product[] = seeds.map((seed, i) => ({
  id: crypto.randomUUID(),
  ...seed,
  stock: Math.floor(Math.random() * 150) + 1,
  createdAt: daysAgo(120 - i * 6),
  updatedAt: daysAgo(Math.floor(Math.random() * 30)),
}));
