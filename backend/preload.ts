import { contextBridge, ipcRenderer } from 'electron';
import type { CreateSaleInput } from '../shared/sale';

contextBridge.exposeInMainWorld('api', {
  createProduct: (product: any) => ipcRenderer.invoke('products:create', product),
  listProducts: () => ipcRenderer.invoke('products:list'),
  updateProduct: (product: any) => ipcRenderer.invoke('products:update', product),
  deleteProduct: (payload: { id: number }) => ipcRenderer.invoke('products:delete', payload),
  createSale: (sale: CreateSaleInput) => ipcRenderer.invoke('sales:create', sale),
  listSales: () => ipcRenderer.invoke('sales:list'),
  getSaleById: (payload: { id: number }) => ipcRenderer.invoke('sales:getById', payload),
  deleteSale: (payload: { id: number }) => ipcRenderer.invoke('sales:delete', payload)
});
