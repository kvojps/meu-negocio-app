import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  createProduct: (product: any) => ipcRenderer.invoke('products:create', product),
  listProducts: () => ipcRenderer.invoke('products:list'),
  updateProduct: (product: any) => ipcRenderer.invoke('products:update', product),
  deleteProduct: (payload: { id: number }) => ipcRenderer.invoke('products:delete', payload)
});
