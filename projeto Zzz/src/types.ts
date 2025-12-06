// ================================
// TRAVEL PROPOSAL GENERATOR - TYPES
// ================================

export interface AgencyTheme {
    id: string;
    name: string;
    primary: string;
    accent: string;
    primaryLight: string;
    accentLight: string;
}

export const THEME_PRESETS: AgencyTheme[] = [
    {
        id: 'blue-professional',
        name: '💼 Azul Profissional',
        primary: '#0052CC',
        primaryLight: '#4C9AFF',
        accent: '#FFC107',
        accentLight: '#FFE082',
    },
    {
        id: 'purple-luxury',
        name: '👑 Roxo Luxo',
        primary: '#6B46C1',
        primaryLight: '#9F7AEA',
        accent: '#FFD700',
        accentLight: '#FFF59D',
    },
    {
        id: 'green-eco',
        name: '🌿 Verde Eco',
        primary: '#059669',
        primaryLight: '#34D399',
        accent: '#F59E0B',
        accentLight: '#FCD34D',
    },
    {
        id: 'red-passion',
        name: '❤️ Vermelho Paixão',
        primary: '#DC2626',
        primaryLight: '#F87171',
        accent: '#FCD34D',
        accentLight: '#FEF3C7',
    },
    {
        id: 'turquoise-beach',
        name: '🏖️ Turquesa Praia',
        primary: '#0891B2',
        primaryLight: '#22D3EE',
        accent: '#FB923C',
        accentLight: '#FDBA74',
    },
    {
        id: 'minimalist',
        name: '⬛ Minimalista',
        primary: '#1F2937',
        primaryLight: '#4B5563',
        accent: '#10B981',
        accentLight: '#6EE7B7',
    },
    {
        id: 'custom',
        name: '🎨 Personalizado',
        primary: '#3B82F6',
        primaryLight: '#60A5FA',
        accent: '#F59E0B',
        accentLight: '#FCD34D',
    },
];

export interface Flight {
    time: string;
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
    duration: string;
    stops: string;
    company?: string;
}

export interface Accommodation {
    name: string;
    roomType: string;
    location: string;
    stars: number;
    rating: number;
    description: string;
    amenities: string[];
    photos: string[];
}

export interface Experience {
    name: string;
    emoji: string;
    description?: string;
}

export interface Inclusions {
    carRental: boolean;
    carCategory?: string;
    airportTransfer: boolean;
    tourTransfer: boolean;
    accommodation: boolean;
    breakfast: boolean;
    meals: boolean;
    flights: boolean;
    taxes: boolean;
    insurance: boolean;
    customItems: string[];
}

export interface Investment {
    price: number;
    travelers: number;
    conditions: string;
    installments: string;
}

export interface Consultant {
    name: string;
    title: string;
    phone: string;
    email: string;
    photo?: string;
}

export interface TravelProposal {
    id: string;
    createdAt: string;

    // Agency
    agency: {
        name: string;
        slogan?: string;
        logo?: string;
        theme: AgencyTheme;
    };

    // Destination
    destination: {
        name: string;
        checkIn: string;
        checkOut: string;
        heroImage?: string;
    };

    // About
    about: {
        description: string;
        climate: string;
        bestSeason: string;
        language: string;
        currency: string;
        highlights: string[];
        curiosities: string;
        photos: string[];
    };

    // Flights
    flights: {
        outbound: Flight;
        return: Flight;
    };

    // Accommodation
    accommodation: Accommodation;

    // Inclusions
    inclusions: Inclusions;

    // Experiences
    experiencesEnabled: boolean;
    experiences: Experience[];

    // Investment
    investment: Investment;

    // Consultant
    consultant: Consultant;
}

export const createEmptyProposal = (): Omit<TravelProposal, 'id' | 'createdAt'> => ({
    agency: {
        name: '',
        slogan: '',
        logo: '',
        theme: THEME_PRESETS[0],
    },
    destination: {
        name: '',
        checkIn: '',
        checkOut: '',
        heroImage: '',
    },
    about: {
        description: '',
        climate: '',
        bestSeason: '',
        language: '',
        currency: '',
        highlights: [],
        curiosities: '',
        photos: [],
    },
    flights: {
        outbound: {
            time: '',
            origin: '',
            originCode: '',
            destination: '',
            destinationCode: '',
            duration: '',
            stops: 'Direto',
        },
        return: {
            time: '',
            origin: '',
            originCode: '',
            destination: '',
            destinationCode: '',
            duration: '',
            stops: 'Direto',
        },
    },
    accommodation: {
        name: '',
        roomType: '',
        location: '',
        stars: 5,
        rating: 9.0,
        description: '',
        amenities: [],
        photos: [],
    },
    inclusions: {
        carRental: false,
        carCategory: '',
        airportTransfer: true,
        tourTransfer: false,
        accommodation: true,
        breakfast: true,
        meals: false,
        flights: true,
        taxes: true,
        insurance: true,
        customItems: [],
    },
    experiencesEnabled: true,
    experiences: [],
    investment: {
        price: 0,
        travelers: 2,
        conditions: '',
        installments: '',
    },
    consultant: {
        name: '',
        title: '',
        phone: '',
        email: '',
    },
});
