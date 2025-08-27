export const en = {
  // Common
  common: {
    loading: "Loading...",
    error: "An error occurred",
    empty: "No results found",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    apply: "Apply",
    reset: "Reset",
    all: "All",
    none: "None",
    yes: "Yes",
    no: "No",
    required: "Required",
    optional: "Optional",
  },

  // Navigation
  nav: {
    home: "Home",
    stock: "Stock",
    sourcing: "Sourcing",
    contact: "Contact",
    requestOffer: "Request Offer",
  },

  // Hero
  hero: {
    title: "Cars on Demand",
    subtitle: "Transparent and guaranteed B2B auctions",
    ctaPrimary: "Request Offer",
    ctaSecondary: "View Opportunities",
  },

  // Process
  process: {
    title: "How we work",
    step1: {
      title: "Brief",
      description: "You tell us what you want",
    },
    step2: {
      title: "B2B auction sourcing",
      description: "We search in auctions",
    },
    step3: {
      title: "Auction & Purchase",
      description: "We bid for you",
    },
    step4: {
      title: "Transport & Delivery",
      description: "We bring you the car",
    },
  },

  // Benefits
  benefits: {
    title: "Why AutoOrder",
    transparency: "Total transparency",
    guarantee: "100% guarantee",
    expertise: "Auction expertise",
    speed: "Execution speed",
    savings: "Guaranteed savings",
    support: "24/7 support",
  },

  // Calculator
  calculator: {
    title: "Estimate calculator",
    purchasePrice: "Purchase price (EUR)",
    country: "Country",
    commission: "Commission (%)",
    transport: "Transport (%)",
    total: "Total estimate",
    breakdown: "Cost breakdown",
    calculate: "Calculate",
  },

  // FAQ
  faq: {
    title: "Frequently asked questions",
    items: {
      q1: "How does the process work?",
      a1: "The process is simple: you give us the brief, we search in B2B auctions, we bid and bring you the car.",
      q2: "What guarantees do you offer?",
      a2: "We offer 100% guarantee for all our services.",
      q3: "How long does the process take?",
      a3: "On average, the process takes 2-4 weeks, depending on complexity.",
      q4: "What costs are involved?",
      a4: "Costs include our commission and transport. All are transparent from the start.",
    },
  },

  // Testimonials
  testimonials: {
    title: "What our clients say",
  },

  // Stock
  stock: {
    title: "Explore opportunities",
    filters: {
      brand: "Brand",
      model: "Model",
      body: "Body",
      fuel: "Fuel",
      yearMin: "Min year",
      yearMax: "Max year",
      kmMax: "Max km",
      priceMin: "Min price",
      priceMax: "Max price",
      country: "Country",
      transmission: "Transmission",
    },
    empty: "We didn't find vehicles matching your filters",
    viewDetails: "View details",
    requestVerification: "Request verification / offer",
  },

  // Sourcing
  sourcing: {
    title: "Smart sourcing",
    subtitle: "Transparent and guaranteed B2B auctions",
    process: "Our process",
    questions: "Frequently asked questions for sourcing",
    quickBrief: "Quick brief",
    briefForm: {
      brand: "Brand",
      model: "Model",
      budget: "Budget",
      yearMin: "Min year",
      kmMax: "Max km",
      preferences: "Preferences",
    },
  },

  // Contact
  contact: {
    title: "Contact us",
    subtitle: "We're here to help",
    form: {
      name: "Full name",
      phone: "Phone",
      email: "Email",
      requestType: "Request type",
      message: "Message",
      gdpr: "I agree to the processing of my personal data",
      requestTypes: {
        offer: "Offer",
        evaluation: "Evaluation",
        question: "Question",
      },
    },
    contactInfo: {
      title: "Contact information",
      email: "contact@autoorder.ro",
      phone: "+40 123 456 789",
      address: "Bucharest, Romania",
    },
  },

  // Footer
  footer: {
    sections: {
      autoorder: "AutoOrder",
      help: "Help & Support",
      legal: "Legal",
      contact: "Contact",
    },
    links: {
      about: "About us",
      services: "Services",
      faq: "FAQ",
      privacy: "Privacy",
      terms: "Terms & Conditions",
      support: "Support",
    },
  },

  // Countries
  countries: {
    DE: "Germany",
    FR: "France",
    NL: "Netherlands",
    BE: "Belgium",
    IT: "Italy",
  },

  // Body types
  bodyTypes: {
    sedan: "Sedan",
    hatchback: "Hatchback",
    suv: "SUV",
    wagon: "Wagon",
    coupe: "Coupe",
    convertible: "Convertible",
    van: "Minivan",
    pickup: "Pickup",
  },

  // Fuel types
  fuelTypes: {
    petrol: "Petrol",
    diesel: "Diesel",
    hybrid: "Hybrid",
    electric: "Electric",
    lpg: "LPG",
  },

  // Transmission
  transmission: {
    manual: "Manual",
    automatic: "Automatic",
    cvt: "CVT",
  },
} as const;

export type Translation = typeof en;
