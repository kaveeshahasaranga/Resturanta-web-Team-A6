const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const createDemoOrders = () => [
  {
    id: 8429,
    customerName: 'Nadeesha Perera',
    customerEmail: 'nadeesha@example.com',
    customerPhone: '+94 77 123 4821',
    deliveryAddress: '42 Cinnamon Gardens Boulevard, Suite 5B',
    status: 'PREPARING',
    createdAt: minutesAgo(18),
    notes: 'Less chilli, please. | Payment preference: Pay at restaurant',
    total: 386.45,
    items: [
      { id: '8429-1', quantity: 1, unitPrice: 245.45, totalPrice: 245.45, menuItem: { name: 'Clay Pot Chicken Curry' } },
      { id: '8429-2', quantity: 1, unitPrice: 141, totalPrice: 141, menuItem: { name: 'Coconut Roti' } },
    ],
  },
  {
    id: 7914,
    customerName: 'Rohan Wickramasinghe',
    customerEmail: 'rohan@example.com',
    customerPhone: '+94 71 555 7914',
    deliveryAddress: '88 Ward Place, Penthouse A',
    status: 'PENDING',
    createdAt: minutesAgo(35),
    notes: 'Payment preference: Card',
    total: 741.6,
    items: [{ id: '7914-1', quantity: 2, unitPrice: 370.8, totalPrice: 741.6, menuItem: { name: 'Hearth Feast for Two' } }],
  },
  {
    id: 6582,
    customerName: 'Dr. Amaya Silva',
    customerEmail: 'amaya@example.com',
    customerPhone: '+94 76 202 6582',
    deliveryAddress: '14/2 Alfred House Gardens',
    status: 'READY',
    createdAt: minutesAgo(54),
    notes: 'Please leave with the reception desk. | Payment preference: Apple Pay / Google Pay',
    total: 319.5,
    items: [
      { id: '6582-1', quantity: 1, unitPrice: 195.5, totalPrice: 195.5, menuItem: { name: 'Roasted Pumpkin Curry' } },
      { id: '6582-2', quantity: 1, unitPrice: 124, totalPrice: 124, menuItem: { name: 'Ceylon Rice' } },
    ],
  },
  {
    id: 5120,
    customerName: 'Marcus Vance & Delegation',
    customerEmail: 'marcus@example.com',
    customerPhone: '+94 77 404 5120',
    deliveryAddress: '',
    status: 'DELIVERED',
    createdAt: minutesAgo(92),
    notes: 'Pickup at the Hearth counter. | Payment preference: Pay at restaurant',
    total: 1242.6,
    items: [{ id: '5120-1', quantity: 4, unitPrice: 310.65, totalPrice: 1242.6, menuItem: { name: 'Ironwood Sharing Platter' } }],
  },
  {
    id: 4391,
    customerName: 'Ishara Fernando',
    customerEmail: 'ishara@example.com',
    customerPhone: '+94 75 310 4391',
    deliveryAddress: '6 Lighthouse Street, Galle Fort',
    status: 'CONFIRMED',
    createdAt: minutesAgo(126),
    notes: 'No peanuts, please. | Payment preference: Card',
    total: 485,
    items: [{ id: '4391-1', quantity: 1, unitPrice: 485, totalPrice: 485, menuItem: { name: 'Smoked Jackfruit Biryani' } }],
  },
];

export const DEMO_ORDERS = createDemoOrders();

export const getDemoDashboardStats = (orders = DEMO_ORDERS) => ({
  totalOrders: orders.length,
  totalRevenue: orders.filter((order) => order.status !== 'CANCELLED').reduce((sum, order) => sum + Number(order.total), 0),
  pendingOrders: orders.filter((order) => order.status === 'PENDING').length,
  totalMenuItems: 4,
  unreadMessages: 2,
});
