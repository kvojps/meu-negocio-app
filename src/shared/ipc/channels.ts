export const IPC_CHANNELS = {
  productsGetAll: 'products:getAll',
  productsAdd: 'products:add',
  productsUpdate: 'products:update',
  productsDelete: 'products:delete',
  ordersGetAll: 'orders:getAll',
  ordersAdd: 'orders:add',
  ordersUpdate: 'orders:update',
  ordersSetStatus: 'orders:setStatus',
  ordersDelete: 'orders:delete',
  settingsGet: 'settings:get',
  settingsUpdate: 'settings:update',
} as const;
