import { Building, Calendar, Clipboard, File, LayoutDashboard, Settings, ThumbsUp, Truck, User2, Users2, Wallet } from "lucide-react";
import { title } from "process";

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
  },
  {
    id: '3',
    name: 'Casa de la Sierra',
    status: 'Planeando', 
    location: 'Tapalpa', 
    estimated_completion: '2024-06-30',
    budget: 4500000.0,
    income: 0.0,
    expense: 0.0,
    description: 'Casa de campo con estilo moderno' 
  },
  {
    id: '4',
    name: 'Edificio B',
    status: 'Planeando', 
    location: 'Zapopan', 
    estimated_completion: '2024-12-31',
    budget: 2000000.0,
    income: 0.0,
    expense: 0.0,
    description: 'Proyecto de construcción de edificio comercial' 
  },
  {
    id: '5',
    name: 'Casa de la Colina',
    status: 'Completado', 
    location: 'Tlaquepaque', 
    estimated_completion: '2024-09-10',
    budget: 3500000.0,
    income: 3525000.0,
    expense: 2972923.0,
    description: 'Casa de campo con estilo rústico' 
  },
  {
    id: '6',
    name: 'Edificio C',
    status: 'En Progreso', 
    location: 'Zapopan', 
    estimated_completion: '2024-12-31',
    budget: 2500000.0,
    income: 2225000.0,
    expense: 2016112.50,
    description: 'Proyecto de construcción de edificio comercial' 
  },
  {
    id: '7',
    name: 'Casa de la Laguna',
    status: 'Planeando', 
    location: 'Chapala', 
    estimated_completion: '2024-06-30',
    budget: 1500000.0,
    income: 0.0,
    expense: 0.0,
    description: 'Casa de campo con estilo moderno' 
  },
  {
    id: '8',
    name: 'Casa de la Montaña',
    status: 'Completado', 
    location: 'Tapalpa', 
    estimated_completion: '2024-09-10',
    budget: 5500000.0,
    income: 5525000.0,
    expense: 4972923.0,
    description: 'Casa de campo con estilo rústico' 
  },
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

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "",
      icon: LayoutDashboard,
      items: [
        {
          title: "Dashboard",
          url: "",
        },
        {
          title: "Ingresos",
          url: "ingresos",
        },
        {
          title: "Gastos",
          url: "gastos",
        },
        {
          title: "Impuestos",
          url: "impuestos",
        }
      ]
    },
    {
      title: "Calendario",
      url: "calendario",
      icon: Calendar,
    },
    {
      title: "Equipo",
      url: "equipo",
      icon: Users2,
    },
    {
      title: "Configuración",
      url: "configuracion",
      icon: Settings,
    },
  ],
  projects: [
    {
      title: "Proyectos",
      url: "proyectos",
      icon: Building,
    },
    {
      title: "Clientes",
      url: "clientes",
      icon: User2,
    },
    {
      title: "Proveedores",
      url: "proveedores",
      icon: Truck,
    },
  ],
  admin: [
    {
      title: "Nómina",
      url: "nomina",
      icon: Wallet,
    },
    {
      title: "Documentos",
      url: "documentos",
      icon: File,
    },
    {
      title: "Informes",
      url: "informes",
      icon: Clipboard,
    },
    {
      title: "Feedback IA",
      url: "feedback-ia",
      icon: ThumbsUp,
      isBeta: true,
    }
  ]
}

export const mails = [
  {
    name: "William Smith",
    email: "williamsmith@example.com",
    subject: "Meeting Tomorrow",
    date: "09:34 AM",
    teaser:
      "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
  },
  {
    name: "Alice Smith",
    email: "alicesmith@example.com",
    subject: "Re: Project Update",
    date: "Yesterday",
    teaser:
      "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
  },
  {
    name: "Bob Johnson",
    email: "bobjohnson@example.com",
    subject: "Weekend Plans",
    date: "2 days ago",
    teaser:
      "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
  },
  {
    name: "Emily Davis",
    email: "emilydavis@example.com",
    subject: "Re: Question about Budget",
    date: "2 days ago",
    teaser:
      "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
  },
  {
    name: "Michael Wilson",
    email: "michaelwilson@example.com",
    subject: "Important Announcement",
    date: "1 week ago",
    teaser:
      "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
  },
  {
    name: "Sarah Brown",
    email: "sarahbrown@example.com",
    subject: "Re: Feedback on Proposal",
    date: "1 week ago",
    teaser:
      "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
  },
  {
    name: "David Lee",
    email: "davidlee@example.com",
    subject: "New Project Idea",
    date: "1 week ago",
    teaser:
      "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
  },
  {
    name: "Olivia Wilson",
    email: "oliviawilson@example.com",
    subject: "Vacation Plans",
    date: "1 week ago",
    teaser:
      "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
  },
  {
    name: "James Martin",
    email: "jamesmartin@example.com",
    subject: "Re: Conference Registration",
    date: "1 week ago",
    teaser:
      "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
  },
  {
    name: "Sophia White",
    email: "sophiawhite@example.com",
    subject: "Team Dinner",
    date: "1 week ago",
    teaser:
      "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
  },
]