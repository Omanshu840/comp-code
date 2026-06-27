export const lecture = {
  id: "lecture-2-what-is-system-design",
  sectionId: "section-1-introduction",
  lectureNumber: 2,
  title: "What is System Design",
  slug: "what-is-system-design",
  estimatedMinutes: 12,
  difficulty: "beginner",
  prerequisites: [
    "Basic software engineering knowledge",
    "Familiarity with software applications, users, and data"
  ],
  learningOutcomes: [
    "Define system design as the translation of business requirements into technical architecture",
    "Identify the main decisions system designers make before large-scale implementation",
    "Explain why scalability, reliability, performance, and maintainability matter as systems grow",
    "Describe how clear boundaries reduce complexity and help systems evolve over time",
    "Connect early architecture choices to real-world operational outcomes"
  ],
  sourceFiles: {
    transcript: "System Design/Section 1: Introduction/2. What is System Design",
    sectionSlides: "System Design/Section 1: Introduction/00-System+Design+-+Updated+-+Section+1.pdf",
    interviewQuestions: null
  },
  sourceSummary: {
    transcriptFocus: "Introduces system design as a blueprinting and decision-making process for solving business problems with technology. Emphasizes architecture, user interaction, data storage, communication, growth, failure handling, and clear boundaries.",
    interviewFocus: "No separate interview Q&A file was provided, so interview preparation is derived from the transcript and the lecture-relevant slide content.",
    slideFocus: "Uses the lecture-relevant opening slide defining system design as architecture, components, interfaces, data flow, quality attributes, boundaries, and business-to-technical translation. Other section slides were treated as broader context only."
  },
  lessons: [
    {
      id: "lecture-2-what-is-system-design-lesson-1",
      title: "System Design as a Blueprint",
      goal: "Understand what system design is, what decisions it includes, and why those decisions matter as software grows.",
      order: 1,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "System design",
          explanation: "System design is the process of planning how a software system should work before building large parts of it. It turns a business need into a technical architecture made of components, interfaces, data flows, and operational choices.",
          whyItMatters: "Without a design, teams may build features that work today but become hard to scale, operate, or change later.",
          systemDesignConnection: "Every system design interview and real architecture discussion starts by turning requirements into a clear plan for users, data, services, and failure handling.",
          example: "For an online learning app, system design asks how learners sign in, where lesson progress is stored, how practice results are saved, and what happens when many users start lessons at once.",
          commonMisconception: "System design is not just drawing boxes and arrows. Diagrams help communicate the design, but the real work is making informed decisions that solve the business problem."
        },
        {
          name: "Architecture decisions",
          explanation: "A system designer decides how users interact with the system, where data lives, how components communicate, and how the system behaves under growth or failure.",
          whyItMatters: "These decisions shape user experience, implementation complexity, operational cost, and the team's ability to change the system later.",
          systemDesignConnection: "Architecture decisions connect requirements to concrete choices such as APIs, databases, services, queues, caches, and deployment boundaries.",
          example: "If traffic grows ten times larger, a single server may no longer be enough. The design may need load balancing, caching, database scaling, or asynchronous processing.",
          commonMisconception: "The first design is not automatically the best design. Good designers compare options against requirements, constraints, and likely growth."
        },
        {
          name: "Quality attributes",
          explanation: "A well-designed system must do more than provide features. It should also be scalable, reliable, performant, and maintainable.",
          whyItMatters: "At small scale, missing quality attributes may be invisible. As usage grows, weak scalability, reliability, performance, or maintainability can become more important than the feature list itself.",
          systemDesignConnection: "System design evaluates how architecture choices behave under load, during incidents, across deployments, and over future product changes.",
          example: "A payment service must be reliable because failed or duplicated payments hurt users and the business, even if the checkout feature appears complete in a demo.",
          commonMisconception: "Functionality alone does not mean a system is well designed. A feature can work in development and still fail under real traffic or operational pressure."
        },
        {
          name: "Boundaries and data flow",
          explanation: "System design defines where responsibilities begin and end: which component owns which behavior, which service stores which data, and how information moves through the system.",
          whyItMatters: "Clear boundaries reduce complexity, make teams more productive, and make it easier to evolve a system without breaking unrelated parts.",
          systemDesignConnection: "Boundaries are the foundation for service design, database ownership, API contracts, and maintainable architecture.",
          example: "In a food delivery app, order management, payment, driver assignment, and notifications should have clear responsibilities instead of all logic being mixed together.",
          commonMisconception: "Splitting a system into many parts does not automatically create good boundaries. The split must match responsibilities and data ownership."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "The Short Definition",
          body: "System design is creating a technical blueprint that explains how a software system will satisfy business requirements and keep working as conditions change.",
          takeaway: "Think business problem first, technical architecture second."
        },
        {
          type: "concept",
          title: "The Core Questions",
          body: "A designer asks: Who uses the system? What data is needed? Where is that data stored? How do parts communicate? How does the system handle growth? What happens when something fails?",
          takeaway: "System design is structured decision-making."
        },
        {
          type: "concept",
          title: "Beyond Features",
          body: "A feature that works for ten test users may fail for ten million real users. Design considers scalability, reliability, performance, and maintainability before those pressures appear.",
          takeaway: "A working feature is only one part of a working system."
        },
        {
          type: "concept",
          title: "Boundaries Keep Systems Understandable",
          body: "Boundaries clarify responsibility. They help engineers know which component owns a behavior, which data belongs where, and how changes should move through the system.",
          takeaway: "Clear boundaries reduce long-term complexity."
        }
      ],
      visualModels: [
        {
          title: "Business Need to Architecture",
          description: "System design transforms a real-world goal into technical structure and operational behavior.",
          flow: [
            "Business requirement",
            "Architecture decisions",
            "Components, interfaces, and data flow",
            "Scalable and maintainable system"
          ],
          learnerShouldNotice: "The design starts with the problem to solve, not with a favorite technology."
        },
        {
          title: "The Design Decision Loop",
          description: "Good system design repeatedly checks whether each choice supports current needs and future growth.",
          flow: [
            "Understand users and requirements",
            "Choose data and component responsibilities",
            "Plan communication paths",
            "Test the design against growth and failure"
          ],
          learnerShouldNotice: "A design choice is stronger when it has been tested against scale, reliability, and change."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which statement best describes system design?",
          options: [
            "Writing code as quickly as possible and improving it later",
            "Creating a technical blueprint that solves business requirements",
            "Choosing the newest database and framework for a project",
            "Drawing diagrams after the system has already been built"
          ],
          correctAnswerIndex: 1,
          explanation: "System design is about translating business requirements into a technical architecture before major implementation decisions are locked in."
        },
        {
          type: "true_false",
          prompt: "A system can be functionally correct but still poorly designed for real-world use.",
          correctAnswer: true,
          explanation: "Functionality is necessary, but systems also need scalability, reliability, performance, and maintainability as they grow."
        },
        {
          type: "fill_blank",
          prompt: "System design defines architecture, components, interfaces, and ____ so teams understand how information moves through the system.",
          options: [
            "data flow",
            "source formatting",
            "brand colors",
            "meeting notes"
          ],
          correctAnswerIndex: 0,
          explanation: "Data flow is central because designers must understand where data is created, stored, read, changed, and passed between components."
        },
        {
          type: "mcq",
          prompt: "Why do clear boundaries matter in a system design?",
          options: [
            "They guarantee that the system will never fail",
            "They remove the need for databases",
            "They make responsibilities and change impact easier to understand",
            "They make every service use the same programming language"
          ],
          correctAnswerIndex: 2,
          explanation: "Boundaries clarify ownership and reduce complexity, which helps teams evolve systems without accidentally breaking unrelated areas."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each system design idea to what it focuses on.",
          pairs: [
            {
              left: "Scalability",
              right: "Handling growth in users, traffic, or data"
            },
            {
              left: "Reliability",
              right: "Continuing to work correctly when problems happen"
            },
            {
              left: "Performance",
              right: "Responding efficiently with acceptable latency and throughput"
            },
            {
              left: "Maintainability",
              right: "Keeping the system understandable and changeable over time"
            }
          ],
          explanation: "These quality attributes help evaluate whether a system will keep serving users beyond the first working version."
        },
        {
          type: "ordering",
          prompt: "Put this system design reasoning process in a practical order.",
          items: [
            "Choose components, boundaries, and data flow",
            "Understand the business requirement and users",
            "Check the design against growth and failure cases",
            "Define how users and components interact"
          ],
          correctOrder: [
            "Understand the business requirement and users",
            "Define how users and components interact",
            "Choose components, boundaries, and data flow",
            "Check the design against growth and failure cases"
          ],
          explanation: "Design starts with the problem and user needs, then moves into architecture choices, then tests those choices against operational realities."
        },
        {
          type: "scenario",
          prompt: "You are designing a new course platform. The first prototype works for 100 learners, but the business expects a large launch next month. What should you examine before launch?",
          options: [
            "Only whether the user interface has the final colors",
            "Whether the system can handle more traffic, store progress safely, and recover from failures",
            "Whether all code is kept in one file for easier searching",
            "Whether the diagram uses the same number of boxes for every feature"
          ],
          correctAnswerIndex: 1,
          explanation: "The lecture emphasizes that design must consider growth, data storage, communication, and failure, not only whether the current feature demo works."
        },
        {
          type: "scenario",
          prompt: "A team mixes payment logic, user profile updates, email notifications, and reporting into one large service with unclear ownership. Which design issue is most visible?",
          options: [
            "Weak boundaries between responsibilities",
            "Too much focus on scalability",
            "Too many user requirements",
            "A lack of visual diagrams"
          ],
          correctAnswerIndex: 0,
          explanation: "The problem is not that the system lacks a diagram; it lacks clear responsibility boundaries, which increases complexity and makes change risky."
        }
      ],
      checkpoint: {
        summary: "System design is the blueprinting process that turns business needs into architecture. It defines users, components, interfaces, data flow, boundaries, and the operational qualities needed for growth and change.",
        learnerCanNow: [
          "Define system design in practical terms",
          "Name the main decisions made during system design",
          "Explain why non-functional qualities matter at scale",
          "Describe how boundaries reduce complexity",
          "Use growth and failure questions to evaluate an early design"
        ],
        explainInYourOwnWords: "Explain why a system that works for a small demo might still need deeper system design before it is ready for real users."
      }
    }
  ],
  interviewPrep: {
    questions: [
      {
        question: "What is system design?",
        whatInterviewerLooksFor: "A practical definition that connects business requirements, architecture, components, interfaces, data flow, and operational qualities.",
        strongAnswer: "System design is the process of translating business requirements into a technical blueprint for a software system. It defines how users interact with the system, where data is stored, how components communicate, and how the system handles scale, reliability, performance, maintainability, and change over time.",
        answerStructure: [
          "Start with the business-to-architecture translation",
          "Mention components, interfaces, data flow, and boundaries",
          "Close with quality attributes such as scalability, reliability, performance, and maintainability"
        ],
        commonMistakes: [
          "Describing system design as only diagramming",
          "Listing technologies without explaining the problem they solve",
          "Ignoring scale, failure, and future change"
        ],
        followUps: [
          "How is system design different from writing application code?",
          "What questions would you ask before designing a system?",
          "Why do boundaries matter in large systems?"
        ]
      },
      {
        question: "Why is functionality alone not enough when designing a system?",
        whatInterviewerLooksFor: "Recognition that real systems must operate under traffic, failures, future changes, and team maintenance constraints.",
        strongAnswer: "Functionality proves that the system can perform a feature, but it does not prove that the system can handle real usage. A design must also consider whether the system can scale with more traffic, remain reliable when components fail, perform within acceptable latency, and stay maintainable as requirements change.",
        answerStructure: [
          "Acknowledge that features are necessary",
          "Explain the operational pressures that appear as systems grow",
          "Give an example such as traffic growth or failure handling"
        ],
        commonMistakes: [
          "Assuming a working prototype is production-ready",
          "Treating scalability and reliability as optional extras",
          "Ignoring maintenance and evolution"
        ],
        followUps: [
          "How would you test whether a design can handle ten times more traffic?",
          "What is an example of a reliability concern?",
          "How can maintainability affect future product speed?"
        ]
      },
      {
        question: "What kinds of decisions are made during system design?",
        whatInterviewerLooksFor: "Coverage of users, data storage, component communication, growth, failure behavior, and boundaries.",
        strongAnswer: "System design decisions include how users interact with the product, where data is stored, which components own which responsibilities, how components communicate, how data flows through the system, how the system scales when traffic grows, and what happens when something goes wrong.",
        answerStructure: [
          "Group decisions by user interaction, data, and components",
          "Add operational concerns like scale and failure",
          "Connect decisions to long-term maintainability"
        ],
        commonMistakes: [
          "Jumping directly to a database choice",
          "Forgetting communication between components",
          "Skipping failure scenarios"
        ],
        followUps: [
          "How would you choose where to store data?",
          "How do components communicate in a system?",
          "What design choices change when traffic grows?"
        ]
      },
      {
        question: "What are boundaries in system design, and why do they matter?",
        whatInterviewerLooksFor: "Understanding that boundaries define responsibility, ownership, interfaces, and data flow, reducing complexity over time.",
        strongAnswer: "Boundaries define where one responsibility ends and another begins. They clarify which service owns which behavior, which database stores which data, and how components interact. Good boundaries reduce complexity, help teams reason about change, and make the system easier to evolve.",
        answerStructure: [
          "Define boundaries as responsibility and ownership lines",
          "Mention services, databases, users, and interfaces",
          "Explain how boundaries reduce complexity and support evolution"
        ],
        commonMistakes: [
          "Assuming more services automatically means better boundaries",
          "Defining boundaries around technology instead of responsibility",
          "Ignoring data ownership"
        ],
        followUps: [
          "What is a sign that boundaries are unclear?",
          "How can data flow reveal poor boundaries?",
          "How would boundaries help a team change one feature safely?"
        ]
      },
      {
        question: "How does system design help a system succeed as it grows?",
        whatInterviewerLooksFor: "A growth-aware answer that covers scale, failure, performance, maintainability, and future requirements.",
        strongAnswer: "System design helps teams think ahead about how architecture behaves when traffic, data, features, and teams grow. By planning data flow, component boundaries, communication patterns, and failure behavior, the system is more likely to remain scalable, reliable, performant, and maintainable instead of collapsing under new pressure.",
        answerStructure: [
          "Describe the kinds of growth a system can experience",
          "Connect growth to architecture decisions",
          "Name the qualities that protect the system over time"
        ],
        commonMistakes: [
          "Thinking growth only means more servers",
          "Ignoring data and organizational complexity",
          "Assuming future-proofing means predicting every future requirement"
        ],
        followUps: [
          "What would you revisit if traffic increased ten times?",
          "How does maintainability relate to growth?",
          "Why should failure handling be discussed early?"
        ]
      }
    ]
  },
  revision: {
    flashcards: [
      {
        front: "What is system design?",
        back: "The process of turning business requirements into a technical architecture or blueprint for a software system.",
        category: "definition"
      },
      {
        front: "Why is system design compared to a blueprint?",
        back: "Because it plans how parts of the system fit and work together before large amounts of code are built.",
        category: "mental-model"
      },
      {
        front: "Name four quality attributes of a well-designed system.",
        back: "Scalability, reliability, performance, and maintainability.",
        category: "quality-attributes"
      },
      {
        front: "What does scalability mean in this lecture's context?",
        back: "The system's ability to handle growth in traffic, users, or data without failing its goals.",
        category: "quality-attributes"
      },
      {
        front: "Why do boundaries matter?",
        back: "They clarify responsibilities, reduce complexity, and make systems easier to evolve over time.",
        category: "architecture"
      },
      {
        front: "What is a common misconception about system design?",
        back: "That it is mainly about diagrams, databases, servers, or architectural patterns rather than decision-making for business goals.",
        category: "misconceptions"
      },
      {
        front: "What should a designer ask when traffic grows ten times larger?",
        back: "Whether the current architecture, data storage, communication paths, and failure handling can still meet the system's goals.",
        category: "scale"
      },
      {
        front: "What does data flow describe?",
        back: "How data moves through users, services, databases, and interfaces in the system.",
        category: "architecture"
      },
      {
        front: "Why is maintainability part of system design?",
        back: "Because systems need to be understood, changed, and extended safely as requirements evolve.",
        category: "quality-attributes"
      },
      {
        front: "What is the main teaching intent of this lecture?",
        back: "To frame system design as practical business-to-architecture decision-making, not just technical diagramming.",
        category: "big-picture"
      }
    ],
    glossary: [
      {
        term: "System design",
        definition: "The process of creating a technical blueprint that translates business requirements into software architecture.",
        relatedConcepts: [
          "architecture",
          "requirements",
          "quality attributes"
        ]
      },
      {
        term: "Blueprint",
        definition: "A plan that shows how the parts of a system should fit and work together before implementation proceeds deeply.",
        relatedConcepts: [
          "planning",
          "architecture",
          "components"
        ]
      },
      {
        term: "Architecture",
        definition: "The high-level structure of a system, including its components, interfaces, responsibilities, and data flow.",
        relatedConcepts: [
          "components",
          "interfaces",
          "boundaries"
        ]
      },
      {
        term: "Component",
        definition: "A part of a system that owns a specific responsibility or function.",
        relatedConcepts: [
          "service",
          "responsibility",
          "boundary"
        ]
      },
      {
        term: "Interface",
        definition: "A defined way for users or components to interact with a system or with each other.",
        relatedConcepts: [
          "API",
          "communication",
          "contract"
        ]
      },
      {
        term: "Data flow",
        definition: "The path data follows as it is created, stored, read, changed, and passed between parts of the system.",
        relatedConcepts: [
          "storage",
          "communication",
          "architecture"
        ]
      },
      {
        term: "Scalability",
        definition: "The ability of a system to handle increased users, traffic, or data while continuing to meet its goals.",
        relatedConcepts: [
          "traffic growth",
          "capacity",
          "performance"
        ]
      },
      {
        term: "Reliability",
        definition: "The ability of a system to continue working correctly and predictably, especially when problems occur.",
        relatedConcepts: [
          "failure handling",
          "availability",
          "resilience"
        ]
      },
      {
        term: "Performance",
        definition: "How efficiently a system responds and processes work, often discussed through latency, throughput, and resource use.",
        relatedConcepts: [
          "latency",
          "throughput",
          "user experience"
        ]
      },
      {
        term: "Maintainability",
        definition: "How easily a system can be understood, changed, debugged, and extended over time.",
        relatedConcepts: [
          "evolution",
          "complexity",
          "boundaries"
        ]
      },
      {
        term: "Boundary",
        definition: "A responsibility line that separates users, services, databases, or components so ownership and interactions are clear.",
        relatedConcepts: [
          "responsibility",
          "ownership",
          "interfaces"
        ]
      },
      {
        term: "Operational realities",
        definition: "The real-world conditions a system must handle, such as growth, failures, latency, cost, and ongoing maintenance.",
        relatedConcepts: [
          "scale",
          "reliability",
          "maintenance"
        ]
      }
    ],
    finalQuiz: [
      {
        type: "mcq",
        prompt: "What is the best first mindset for system design?",
        options: [
          "Start by choosing the most popular technology stack",
          "Start by translating the business problem into architecture decisions",
          "Start by optimizing every possible component immediately",
          "Start by writing all code and documenting later"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "The lecture frames system design as converting business requirements into technical architecture."
      },
      {
        type: "mcq",
        prompt: "Which set best represents qualities a well-designed system should consider beyond functionality?",
        options: [
          "Color, typography, animation, and branding",
          "Scalability, reliability, performance, and maintainability",
          "Syntax, indentation, file names, and comments",
          "Hiring, budgeting, marketing, and sales"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "The transcript explicitly emphasizes scalability, reliability, performance, and maintainability as important system qualities."
      },
      {
        type: "true_false",
        prompt: "System design should include thinking about what happens if something goes wrong.",
        options: [
          "True",
          "False",
          "Only for interview systems",
          "Only after launch"
        ],
        correctAnswerIndex: 0,
        correctAnswer: true,
        explanation: "Failure behavior is one of the lecture's core design questions and is part of building reliable systems."
      },
      {
        type: "mcq",
        prompt: "A system's components communicate through unclear, undocumented assumptions. Which design area is most likely weak?",
        options: [
          "Interface and boundary definition",
          "Brand positioning",
          "Code editor configuration",
          "Lecture sequencing"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Interfaces and boundaries define how components work together. When they are unclear, the design becomes harder to reason about and change."
      },
      {
        type: "mcq",
        prompt: "Why does the lecture say some system properties become more important as a system grows?",
        options: [
          "Growth reduces the need for reliability",
          "Large systems face more traffic, data, failure modes, and change pressure",
          "Small systems never need design decisions",
          "Performance only matters after all features are removed"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "As systems grow, operational pressures increase. The architecture must support scale, reliability, performance, and maintainability."
      },
      {
        type: "mcq",
        prompt: "Which question is most directly a system design question?",
        options: [
          "What font should the landing page use?",
          "How will components communicate and where will data be stored?",
          "What should the company logo look like?",
          "Which laptop should each engineer use?"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "Communication and data storage are core architecture decisions in system design."
      },
      {
        type: "true_false",
        prompt: "Good boundaries make it easier to evolve a system over time.",
        options: [
          "True",
          "False",
          "Only if the system has no database",
          "Only for single-user applications"
        ],
        correctAnswerIndex: 0,
        correctAnswer: true,
        explanation: "The transcript explains that good boundaries reduce complexity and make systems easier to evolve."
      },
      {
        type: "mcq",
        prompt: "A team asks, 'What happens if traffic becomes ten times larger?' What quality are they primarily evaluating?",
        options: [
          "Scalability",
          "Code style",
          "Visual branding",
          "Meeting cadence"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Traffic growth is a scalability concern because the design must continue meeting its goals under increased load."
      }
    ]
  }
};
