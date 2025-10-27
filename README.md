# DEVDOCS

- TODO: Create the README.md


dev-docs/
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
│
├── defaults/                        # Plantillas y configuraciones base
│   ├── templates/
│   │   ├── _TEMPLATE_feature.md
│   │   ├── _TEMPLATE_issue.md
│   │   ├── _TEMPLATE_common_error.md
│   │   └── _TEMPLATE_guide.md
│   └── config/
│       ├── default.env
│       └── config.json
│
├── src/
│   ├── bin/
│   │   └── cli.ts                   # Punto de entrada principal (registrar comandos)
│   │
│   ├── commands/                    # Cada comando tiene su propio módulo
│   │   ├── init/
│   │   │   ├── index.ts             # Lógica del comando init
│   │   │   ├── prompts.ts           # Preguntas relacionadas con init
│   │   │   └── utils.ts             # Funciones específicas de init
│   │   │
│   │   ├── new/
│   │   │   ├── index.ts             # Lógica del comando new
│   │   │   ├── prompts.ts           # Preguntas del comando new
│   │   │   └── utils.ts
│   │   │
│   │   └── build/
│   │       ├── index.ts             # (Ejemplo) comando para regenerar índices o docs
│   │       └── utils.ts
│   │
│   ├── core/                        # Capa transversal del CLI
│   │   ├── config.ts                # Carga .env + config.json
│   │   ├── paths.ts                 # Paths globales, resolución de rutas
│   │   ├── messages.ts              # Mensajes globales con chalk
│   │   ├── prompts.ts               # Prompts reutilizables
│   │   └── logger.ts                # Logger centralizado (si quieres más control)
│   │
│   ├── utils/                       # Utilidades genéricas (sin dependencias de comandos)
│   │   ├── fs.ts                    # Funciones de filesystem (copiar, crear carpetas, etc.)
│   │   ├── markdown.ts              # Funciones de parseo/sustitución de markdown
│   │   ├── sanitize.ts              # Sanitización de nombres o paths
│   │   ├── placeholders.ts          # Reemplazo de {{}} y {{@}} 
│   │   └── date.ts                  # Formateo de fechas y horas
│   │
│   └── types/                       # Tipos y modelos TypeScript
│       ├── config.d.ts
│       ├── prompts.d.ts
│       └── common.d.ts
│
└── dist/                            # Salida compilada (si usas build con tsc)
