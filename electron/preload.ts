import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  createProduct: (product: any) => ipcRenderer.invoke('products:create', product),
  listProducts: () => ipcRenderer.invoke('products:list')
});
