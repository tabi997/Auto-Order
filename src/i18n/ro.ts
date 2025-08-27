export const ro = {
  // Common
  common: {
    loading: "Se încarcă...",
    error: "A apărut o eroare",
    empty: "Nu am găsit rezultate",
    submit: "Trimite",
    cancel: "Anulează",
    save: "Salvează",
    edit: "Editează",
    delete: "Șterge",
    view: "Vezi",
    back: "Înapoi",
    next: "Următorul",
    previous: "Anterior",
    close: "Închide",
    search: "Caută",
    filter: "Filtrează",
    clear: "Curăță",
    apply: "Aplică",
    reset: "Resetează",
    all: "Toate",
    none: "Niciunul",
    yes: "Da",
    no: "Nu",
    required: "Obligatoriu",
    optional: "Opțional",
  },

  // Navigation
  nav: {
    home: "Acasă",
    stock: "Stock",
    sourcing: "Sourcing",
    contact: "Contact",
    requestOffer: "Cere ofertă",
  },

  // Hero
  hero: {
    title: "Mașini la Comandă",
    subtitle: "Licitații B2B transparente și garantate",
    ctaPrimary: "Cere ofertă",
    ctaSecondary: "Vezi oportunități",
  },

  // Process
  process: {
    title: "Cum lucrăm",
    step1: {
      title: "Brief",
      description: "Ne spui ce vrei",
    },
    step2: {
      title: "Sourcing licitații B2B",
      description: "Căutăm în licitații",
    },
    step3: {
      title: "Licitație & Achiziție",
      description: "Licităm pentru tine",
    },
    step4: {
      title: "Transport & Livrare",
      description: "Îți aducem mașina",
    },
  },

  // Benefits
  benefits: {
    title: "De ce AutoOrder",
    transparency: "Transparență totală",
    guarantee: "Garanție 100%",
    expertise: "Expertiză în licitații",
    speed: "Viteză de execuție",
    savings: "Economii garantate",
    support: "Suport 24/7",
  },

  // Calculator
  calculator: {
    title: "Calculator estimativ",
    purchasePrice: "Preț achiziție (EUR)",
    country: "Țara",
    commission: "Comision (%)",
    transport: "Transport (%)",
    total: "Total estimat",
    breakdown: "Detalii costuri",
    calculate: "Calculează",
  },

  // FAQ
  faq: {
    title: "Întrebări frecvente",
    items: {
      q1: "Cum funcționează procesul?",
      a1: "Procesul este simplu: ne dai brief-ul, noi căutăm în licitații B2B, licităm și îți aducem mașina.",
      q2: "Ce garanții oferiți?",
      a2: "Oferim garanție 100% pentru toate serviciile noastre.",
      q3: "Cât durează procesul?",
      a3: "În medie, procesul durează 2-4 săptămâni, în funcție de complexitate.",
      q4: "Ce costuri sunt implicate?",
      a4: "Costurile includ comisionul nostru și transportul. Toate sunt transparente din start.",
    },
  },

  // Testimonials
  testimonials: {
    title: "Ce spun clienții noștri",
  },

  // Stock
  stock: {
    title: "Explorare oportunități",
    filters: {
      brand: "Brand",
      model: "Model",
      body: "Caroserie",
      fuel: "Combustibil",
      yearMin: "An minim",
      yearMax: "An maxim",
      kmMax: "Km maxim",
      priceMin: "Preț minim",
      priceMax: "Preț maxim",
      country: "Țară",
      transmission: "Cutie",
    },
    empty: "Nu am găsit vehicule pe filtrele tale",
    viewDetails: "Vezi detalii",
    requestVerification: "Solicită verificare / ofertă",
  },

  // Sourcing
  sourcing: {
    title: "Sourcing inteligent",
    subtitle: "Licitații B2B transparente și garantate",
    process: "Procesul nostru",
    questions: "Întrebări frecvente pentru sourcing",
    quickBrief: "Briefează-ne rapid",
    briefForm: {
      brand: "Marcă",
      model: "Model",
      budget: "Buget",
      yearMin: "An minim",
      kmMax: "Km maxim",
      preferences: "Preferințe",
    },
  },

  // Contact
  contact: {
    title: "Contactează-ne",
    subtitle: "Suntem aici să te ajutăm",
    form: {
      name: "Nume complet",
      phone: "Telefon",
      email: "Email",
      requestType: "Tip solicitare",
      message: "Mesaj",
      gdpr: "Sunt de acord cu prelucrarea datelor mele personale",
      requestTypes: {
        offer: "Ofertă",
        evaluation: "Evaluare",
        question: "Întrebare",
      },
    },
    contactInfo: {
      title: "Informații contact",
      email: "contact@autoorder.ro",
      phone: "+40 123 456 789",
      address: "București, România",
    },
  },

  // Footer
  footer: {
    sections: {
      autoorder: "AutoOrder",
      help: "Ajutor & Suport",
      legal: "Legal",
      contact: "Contact",
    },
    links: {
      about: "Despre noi",
      services: "Servicii",
      faq: "FAQ",
      privacy: "Confidențialitate",
      terms: "Termeni și condiții",
      support: "Suport",
    },
  },

  // Countries
  countries: {
    DE: "Germania",
    FR: "Franța",
    NL: "Olanda",
    BE: "Belgia",
    IT: "Italia",
  },

  // Body types
  bodyTypes: {
    sedan: "Sedan",
    hatchback: "Hatchback",
    suv: "SUV",
    wagon: "Break",
    coupe: "Coupe",
    convertible: "Cabrio",
    van: "Minivan",
    pickup: "Pickup",
  },

  // Fuel types
  fuelTypes: {
    petrol: "Benzină",
    diesel: "Diesel",
    hybrid: "Hibrid",
    electric: "Electric",
    lpg: "GPL",
  },

  // Transmission
  transmission: {
    manual: "Manuală",
    automatic: "Automată",
    cvt: "CVT",
  },
} as const;

export type Translation = typeof ro;
