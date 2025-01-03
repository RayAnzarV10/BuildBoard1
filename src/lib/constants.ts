export const pricingCards = [
    {
      title: 'Básico',
      description: 'Para pequeños equipos',
      price: '0',
      duration: '',
      highlight: 'Key features',
      features: ['3 Sub accounts', '2 Team members', 'Unlimited pipelines'],
      priceId: '',
    },
    {
      title: 'Profesional',
      description: 'Para equipos en crecimiento',
      price: '199',
      duration: 'month',
      highlight: 'Key features',
      features: ['Rebilling', '24/7 Support team'],
      priceId: 'price_1OYxkqFj9oKEERu1KfJGWxgN',
    },
    {
      title: 'Corporativo',
      description: 'Para grandes empresas',
      price: '299',
      duration: 'month',
      highlight: 'Everything in Starter, plus',
      features: ['Unlimited Sub accounts', 'Unlimited Team members'],
      priceId: 'price_1OYxkqFj9oKEERu1NbKUxXxN',
    },
  ]

export const projects = [
  {
    id: '1',
    name: 'Edificio A',
    status: 'En Progreso', 
    location: 'Guadalajara', 
    estimated_completion: '2024-12-31',
    budget: 1500000.0,
    income: 1225000,
    expense: 1016112.50,
    description: 'Proyecto de construcción de edificio comercial'
  },
  {
    id: '2',
    name: 'Casa Madero',
    status: 'Completado', 
    location: 'Chapala', 
    estimated_completion: '2024-09-10',
    budget: 6500000.0,
    income: 6525000.0,
    expense: 5972923.0,
    description: 'Casa de campo con estilo rústico' 
  }
]

export const statusIcons = {
  "En Progreso": "🏗️",
  "Completado": "🏁",
  "Planeando": "📝",
};

export const getSideBar = (subAccountId: string) => [
  {
    name: 'Dashboard',
    icon: 'layout-dashboard',
    link: `/organization/${subAccountId}`,
  },
  {
    name: 'Launchpad',
    icon: 'clipboard',
    link: `/organization/${subAccountId}/launchpad`,
  },
  {
    name: 'Billing',
    icon: 'credit-card',
    link: `/organization/${subAccountId}/billing`,
  },
  {
    name: 'Settings',
    icon: 'settings',
    link: `/organization/${subAccountId}/settings`,
  },
  {
    name: 'Sub Accounts',
    icon: 'book-user',
    link: `/organization/${subAccountId}/all-subaccounts`,
  },
  {
    name: 'Team',
    icon: 'users',
    link: `/organization/${subAccountId}/team`,
  }
];