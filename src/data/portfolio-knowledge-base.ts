export type LanguageLevel = 'Native' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';
export type ExperienceType = 'experience' | 'education';
export type ProjectStatus = 'production' | 'development' | 'archived';

export interface Language {
    readonly name: string;
    readonly level: LanguageLevel;
}

export interface SocialLink {
    readonly label: string;
    readonly url: string;
}

export interface PersonalProfile {
    readonly fullName: string;
    readonly role: string;
    readonly location: string;
    readonly email: string;
    readonly phone: string;
    readonly bio: string;
    readonly languages: readonly Language[];
    readonly links: readonly SocialLink[];
}

export interface TrajectoryEntry {
    readonly order: number;
    readonly type: ExperienceType;
    readonly period: string;
    readonly institution: string;
    readonly role: string;
    readonly description: readonly string[];
    readonly skills: readonly string[];
}

export interface RepositoryLink {
    readonly label: string;
    readonly url: string;
}

export interface Project {
    readonly featured: boolean;
    readonly priority: number;
    readonly title: string;
    readonly description: string;
    readonly repository: string | readonly RepositoryLink[];
    readonly status: ProjectStatus;
    readonly skills: readonly string[];
}

export interface TechnologyCategory {
    readonly name: string;
    readonly technologies: readonly string[];
}

export interface PortfolioKnowledgeBase {
    readonly profile: PersonalProfile;
    readonly trajectory: readonly TrajectoryEntry[];
    readonly projects: readonly Project[];
    readonly technologyCategories: readonly TechnologyCategory[];
}

export const portfolioKnowledgeBase = {
    profile: {
        fullName: 'Santiago Dorado Sánchez',
        role: 'Software Developer',
        location: 'Sevilla, España',
        email: 'sanchez.dorado@outlook.com',
        phone: '+34 613 077 246',
        bio: 'Software Developer especializado en el desarrollo de aplicaciones robustas y escalables. Metodología basada en SOLID, Clean Architecture y Clean Code, apoyada siempre en documentación oficial. Especializado en el diseño de APIs y microservicios en el ecosistema Java con Spring Boot, priorizando la legibilidad del código y altos estándares de seguridad desde las primeras fases del desarrollo. Complementa el backend con interfaces modernas y reactivas en Angular y React. Diferencial principal: implementación práctica de IA Generativa en proyectos reales, construyendo sistemas RAG y conectando LLMs para dotar a las aplicaciones de capacidades inteligentes que aportan valor directo al negocio. Trabaja bajo metodologías Agile, flujos CI/CD con Docker y GitLab, e integra el motor de persistencia adecuado para cada caso de uso: PostgreSQL, MongoDB y Milvus para el ecosistema de IA.',
        languages: [
            { name: 'Español', level: 'Native' },
            { name: 'Inglés', level: 'B1' },
        ],
        links: [
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/santiago-dorado-s%C3%A1nchez-6933583b3' },
            { label: 'GitHub', url: 'https://github.com/sanchezdorado-dev' },
        ],
    },
    trajectory: [
        {
            order: 1,
            type: 'experience',
            period: 'Septiembre 2025 – Diciembre 2025',
            institution: 'World Tech Enterprises',
            role: 'AI & Software Developer (Intern) | AI Dept. & Internal Software Development',
            description: [
                'Sistemas de Recuperación Semántica (RAG): Diseño y despliegue de microservicios asíncronos en Python utilizando Milvus para la gestión de embeddings vectoriales, optimizando la recuperación semántica de información técnica y la latencia en la respuesta de agentes inteligentes.',
                'Arquitectura de Servicios Centralizados: Desarrollo de plataformas de gestión centralizada bajo Clean Architecture utilizando Spring Boot y MongoDB, implementando sistemas de control de cuotas y seguridad para optimizar los costes de consumo en servicios de IA.',
                'Ecosistemas de Desarrollo y DevOps: Adaptación y personalización de un entorno de desarrollo mediante un fork de VS Code (Electron), integrando flujos de despliegue automatizado con Docker y GitLab CI/CD para la estandarización del entorno.',
                'Calidad de Software y Seguridad: Aplicación rigurosa de principios SOLID y Clean Code basados en documentación oficial, priorizando la escalabilidad del sistema y seguridad robusta (JWT) para garantizar la integridad del software.',
            ],
            skills: [
                'Python', 'Java', 'Spring Boot', 'Electron', 'LangChain', 'Milvus', 'MongoDB',
                'RAG', 'Clean Architecture', 'Clean Code', 'SOLID', 'Maven', 'JUnit',
                'Mockito', 'Swagger', 'Pytest', 'Docker', 'Git', 'GitLab CI/CD',
            ],
        },
        {
            order: 2,
            type: 'experience',
            period: 'Junio 2023 – Diciembre 2024',
            institution: 'Arte en Llamas | E-commerce Platform',
            role: 'Software Developer & Entrepreneur',
            description: [
                'Ingeniería de Software y Arquitectura: Diseño y desarrollo de una plataforma e-commerce integral con Spring Boot (Java) y React. Implementación de una arquitectura backend estructurada por capas lógicas para separar claramente la exposición, la lógica de negocio y la persistencia, aplicando principios SOLID para garantizar un código limpio y escalable sin añadir sobreingeniería.',
                'Gestión de Datos NoSQL: Modelado y gestión de persistencia en MongoDB, diseñando esquemas de documentos flexibles para soportar un catálogo de productos con múltiples variantes. Optimización de la capa de datos mediante el diseño de consultas eficientes para minimizar los tiempos de respuesta.',
                'Integración de Pasarela de Pagos: Implementación de la API REST de PayPal para el procesamiento de cobros desde el backend. Resolución de la validación de transacciones y manejo seguro de tokens de autenticación, basando el desarrollo en el estudio riguroso de la documentación oficial.',
                'Digitalización y Ciclo de Vida: Gestión práctica de todo el ciclo de vida del software: desde la toma de requisitos y diseño de interfaces hasta la puesta en producción, logrando digitalizar de forma funcional un negocio artesanal real.',
            ],
            skills: [
                'Java', 'TypeScript', 'Spring Boot', 'React', 'MongoDB',
                'Clean Architecture', 'Clean Code', 'SOLID', 'Maven', 'JUnit',
                'Mockito', 'Swagger', 'PayPal API', 'Docker', 'Git',
            ],
        },
        {
            order: 3,
            type: 'experience',
            period: 'Febrero 2021 – Mayo 2025',
            institution: 'Supermercados CODI',
            role: 'Assistant Manager | Team Lead',
            description: [
                'Gestión de Incidencias y Toma de Decisiones: Resolución ágil de bloqueos operativos en entornos de alta presión. Capacidad probada para analizar situaciones críticas en tiempo real y ejecutar soluciones inmediatas, garantizando la continuidad del servicio al cliente.',
                'Liderazgo y Mentoría de Equipos: Dirección diaria del personal, planificación estratégica de la carga de trabajo y ejecución integral de procesos de onboarding. Fomento del trabajo colaborativo mediante comunicación asertiva y resolución eficaz de conflictos.',
                'Resiliencia y Ética Profesional: Alto nivel de autogestión y disciplina. Compaginación exitosa de responsabilidades de gestión operativa con la superación del Grado Superior (DAW) y la formación técnica autodidacta en arquitectura de software.',
            ],
            skills: [
                'Team Leadership', 'Incident Management', 'Workflow Optimization',
                'Problem Solving', 'Troubleshooting', 'Time Management', 'Resilience',
            ],
        },
        {
            order: 4,
            type: 'education',
            period: '2023 – 2025',
            institution: 'Universidad Internacional de La Rioja (UNIR)',
            role: 'Grado Superior en Desarrollo de Aplicaciones Web',
            description: [],
            skills: [],
        },
    ],
    projects: [
        {
            featured: true,
            priority: 1,
            title: 'Engineering Portfolio & RAG',
            description: 'Portfolio diseñado con Astro 5.0 e Island Architecture para optimizar la hidratación parcial y el rendimiento. Integra un sistema RAG mediante Milvus como base de datos vectorial, HuggingFace para la generación de embeddings y Groq (LLM). La arquitectura implementa Clean Architecture, principios SOLID y validación de esquemas con Zod, asegurando escalabilidad, seguridad y una base de código mantenible.',
            repository: 'https://github.com/sanchezdorado-dev/engineering-portfolio-rag',
            status: 'production',
            skills: [
                'Astro 5.0', 'TypeScript', 'RAG Architectures', 'Generative AI',
                'Language Models (LLMs)', 'Vector Embeddings', 'Milvus', 'HuggingFace',
                'Groq', 'Zod', 'Clean Architecture', 'SOLID', 'Clean Code',
                'Island Architecture', 'Agile Methodologies (Scrum)',
            ],
        },
        {
            featured: true,
            priority: 2,
            title: 'Reactive Social Architecture',
            description: 'Red social escalable basada en Java 21 y Angular 21, diseñada bajo los estándares de Clean Architecture y principios SOLID. El backend implementa un sistema de seguridad con Spring Boot 3.4, integrando JWT (OAuth2), protección contra ataques de fuerza bruta (Rate Limiting) y registro de auditoría. El frontend utiliza Signals y Lazy Loading para una reactividad optimizada, apoyado en un sistema de diseño modular (Design Tokens) en Sass. Gestión de persistencia con PostgreSQL y migraciones mediante Flyway.',
            repository: [
                { label: 'Client', url: 'https://github.com/sanchezdorado-dev/social-platform-client' },
                { label: 'Core', url: 'https://github.com/sanchezdorado-dev/social-platform-core' },
            ],
            status: 'production',
            skills: [
                'Java 21', 'TypeScript', 'Spring Boot 3.4', 'Angular 21', 'PostgreSQL',
                'Maven', 'Swagger', 'Flyway', 'JWT/OAuth2', 'Signals',
                'Clean Architecture', 'SOLID', 'Clean Code', 'Sass', 'Agile Methodologies (Scrum)',
            ],
        },
    ],
    technologyCategories: [
        {
            name: 'Arquitectura de Software',
            technologies: ['Clean Architecture', 'SOLID Principles', 'Clean Code', 'Design Patterns', 'Hexagonal Architecture'],
        },
        {
            name: 'Backend & Sistemas de IA',
            technologies: ['Java', 'Spring Boot', 'Python', 'LangChain', 'RAG Architectures', 'Generative AI', 'Language Models (LLMs)', 'Vector Embeddings'],
        },
        {
            name: 'Frontend & Rendimiento',
            technologies: ['TypeScript', 'Angular', 'React', 'Astro'],
        },
        {
            name: 'Ecosistemas de Datos & Persistencia',
            technologies: ['PostgreSQL', 'MongoDB', 'Milvus'],
        },
        {
            name: 'Infraestructura, DevOps & CI/CD',
            technologies: ['Docker', 'Git', 'GitLab CI/CD', 'Maven'],
        },
        {
            name: 'Validación, Testing & Documentación',
            technologies: ['JUnit', 'Mockito', 'Pytest', 'Swagger'],
        },
        {
            name: 'Gestión de Proyectos & Metodologías',
            technologies: ['Agile Methodologies (Scrum)'],
        },
    ],
} as const satisfies PortfolioKnowledgeBase;
