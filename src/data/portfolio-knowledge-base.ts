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
        role: 'Software Engineer',
        location: 'Sevilla, España',
        email: 'sanchez.dorado@outlook.com',
        phone: '+34 613 077 246',
        bio: 'Software Engineer especializado en el desarrollo de aplicaciones robustas y escalables. Metodología basada en SOLID, Clean Architecture y Clean Code, apoyada siempre en documentación oficial. Especializado en el diseño de APIs y microservicios en el ecosistema Java con Spring Boot, priorizando la legibilidad del código y altos estándares de seguridad desde las primeras fases del desarrollo. Complementa el backend con interfaces modernas y reactivas en Angular y React. Diferencial principal: implementación práctica de IA Generativa en proyectos reales, construyendo sistemas RAG y conectando LLMs para dotar a las aplicaciones de capacidades inteligentes que aportan valor directo al negocio. Trabaja bajo metodologías Agile, flujos CI/CD con Docker y GitLab, e integra el motor de persistencia adecuado para cada caso de uso: PostgreSQL, MongoDB y Milvus para el ecosistema de IA.',
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
            period: 'Mayo 2025 – Enero 2026',
            institution: 'World Tech Enterprises',
            role: 'AI & Software Engineer (Intern) | AI Dept. & Internal Software Development',
            description: [
                'Orquestación de Arquitecturas RAG: Diseño y despliegue de microservicios asíncronos en Python utilizando Milvus para la gestión de embeddings vectoriales, optimizando la recuperación semántica de información técnica y la latencia en la respuesta de agentes inteligentes.',
                'Gobernanza y Arquitectura Full Stack: Desarrollo de plataformas de gestión centralizada bajo Clean Architecture utilizando Spring Boot y MongoDB, implementando sistemas de control de cuotas y seguridad avanzada para la optimización de costes operativos en servicios de IA.',
                'Ecosistemas de Desarrollo y DevOps: Ingeniería de herramientas de desarrollo personalizadas mediante un fork de VS Code (Electron), integrando flujos de despliegue automatizado con Docker y GitLab CI/CD para la estandarización del entorno técnico interno.',
                'Calidad de Software y Seguridad: Aplicación rigurosa de principios SOLID y Clean Code basados en documentación oficial, priorizando la escalabilidad del sistema y la protección proactiva contra vectores de ataque para garantizar la integridad del software.',
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
            institution: 'E-commerce de Pirograbados (Emprendimiento Propio)',
            role: 'Software Engineer | Founder',
            description: [
                'Full-stack Architecture & Lifecycle Management: Diseño y despliegue integral de una plataforma e-commerce bajo Clean Architecture, utilizando Spring Boot y React para digitalizar y escalar un modelo de negocio tradicional hacia un entorno de alta disponibilidad.',
                'Data Modeling & Schema Design: Modelado de datos en MongoDB para la gestión de catálogos dinámicos y polimórficos, optimizando la estructura de documentos para manejar variantes técnicas complejas de materiales y personalizaciones con un enfoque desacoplado.',
                'Payment Orchestration & Secure Integration: Implementación y orquestación de pasarelas de pago mediante la API oficial de PayPal, garantizando el cumplimiento de estándares de seguridad críticos y el manejo íntegro de transacciones financieras.',
                'Engineering for Business Impact: Aplicación de principios SOLID y metodologías de ingeniería de software para alinear la arquitectura técnica con los objetivos de conversión, asegurando un código mantenible y un flujo de usuario de baja fricción.',
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
                'Liderazgo de Equipos y Optimización de Workflows: Dirección y coordinación de equipos multidisciplinares en entornos de alto rendimiento, con enfoque en la optimización de procesos operativos y el cumplimiento de estándares de calidad.',
                'Gestión de Incidencias y Mitigación de Riesgos: Toma de decisiones estratégicas bajo alta presión para la resolución de bloqueos operativos, aplicando metodologías de resolución de problemas para minimizar el impacto en la continuidad del servicio.',
                'Análisis de Datos y Gestión de Recursos: Supervisión analítica mediante herramientas ERP para la optimización de costes, control de stock y eficiencia económica del centro.',
                'Compromiso con la Excelencia Técnica: Autogestión y disciplina demostradas al compaginar una posición de alta responsabilidad con la formación técnica superior en desarrollo de software.',
            ],
            skills: [
                'Team Leadership', 'Incident Management', 'SLA Monitoring',
                'Workflow Optimization', 'ERP Systems', 'Data Analysis', 'Agile Methodologies',
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
            description: 'Portfolio de alto rendimiento diseñada con Astro 5.0 e Island Architecture para optimizar la hidratación parcial y el rendimiento. Integra un sistema RAG orquestado mediante Milvus, HuggingFace y Groq, garantizando una inferencia semántica avanzada. La arquitectura implementa Clean Architecture, principios SOLID y validación de esquemas con Zod, asegurando escalabilidad, seguridad y el cumplimiento de estándares industriales de desarrollo.',
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
            description: 'Red social escalable basada en Java 21 y Angular 21, diseñada bajo los estándares de Clean Architecture y principios SOLID. El backend implementa un sistema de seguridad proactiva con Spring Boot 3.4, integrando JWT (OAuth2), protección contra ataques de fuerza bruta (Rate Limiting) y auditoría inmutable de acciones. El frontend utiliza Signals y Lazy Loading para una reactividad optimizada, apoyado en un sistema de diseño modular (Design Tokens) en Sass. Gestión de persistencia robusta con PostgreSQL y migraciones atómicas mediante Flyway.',
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
