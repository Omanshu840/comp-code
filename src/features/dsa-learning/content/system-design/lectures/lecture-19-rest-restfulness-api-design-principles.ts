export const lecture = {
  id: "lecture-19-rest-restfulness-api-design-principles",
  sectionId: "section-3-protocols",
  lectureNumber: 19,
  title: "REST & RESTfulness - API Design Principles",
  slug: "rest-restfulness-api-design-principles",
  estimatedMinutes: 32,
  difficulty: "beginner",
  prerequisites: [
    "Basic understanding of HTTP request-response communication",
    "Familiarity with HTTP methods such as GET, POST, PUT, PATCH, and DELETE",
    "Basic knowledge of client-server architecture",
    "Awareness that web APIs allow clients and backend services to communicate"
  ],
  learningOutcomes: [
    "Define REST and explain why it became the dominant web API architectural style",
    "Explain why statelessness improves scalability, fault tolerance, and load balancing",
    "Identify the main REST constraints, including client-server separation, cacheability, layered systems, and uniform interfaces",
    "Design RESTful endpoints around resources instead of actions",
    "Choose appropriate HTTP methods based on intent, safety, and idempotency",
    "Compare JSON and XML as REST API data formats",
    "Recognize common REST API best practices such as versioning, pagination, caching, authentication, and rate limiting",
    "Answer common system design interview questions about REST and RESTful APIs"
  ],
  sourceFiles: {
    transcript: "System Design/Section 3: Protocols/19. REST & RESTfulness - API Design Principles",
    sectionSlides: "System Design/Section 3: Protocols/00-System+Design+-+updated+-+Section+3.txt",
    interviewQuestions: "System Design/Section 3: Protocols/19. Interview+Questions+&+Answers+on+REST+&+RESTful+API+Design+Principles.txt"
  },
  sourceSummary: {
    transcriptFocus: "The transcript explains REST as a stateless, resource-oriented architectural style built on HTTP. It covers why REST matters for simplicity, interoperability, scalability, REST constraints, resource and endpoint design, JSON versus XML, HTTP method semantics, safe and idempotent operations, PUT versus PATCH, and long-term API concerns such as security, versioning, backward compatibility, and maintainability.",
    interviewFocus: "The interview material emphasizes REST versus SOAP, the six REST constraints including optional code on demand, REST API versus RESTful API, resources and endpoints, HTTP methods and status codes, best practices, HATEOAS, authentication and authorization, caching, pagination, versioning, REST versus GraphQL and gRPC, performance improvements, statefulness, and security vulnerabilities.",
    slideFocus: "The relevant slides define REST, explain why it matters, list REST constraints, describe RESTful API design principles, show resource endpoint examples, compare JSON and XML, summarize HTTP method semantics, and provide interview questions about REST design and production API concerns."
  },
  lessons: [
    {
      id: "lecture-19-rest-restfulness-api-design-principles-lesson-1",
      title: "What REST Is and Why It Scales",
      goal: "Understand REST as an architectural style that uses HTTP, resources, and stateless requests to make APIs predictable and scalable.",
      order: 1,
      estimatedMinutes: 7,
      concepts: [
        {
          name: "REST as an architectural style",
          explanation: "REST stands for Representational State Transfer. It is not a product or a strict wire protocol like TCP. It is an architectural style for designing networked applications, especially web APIs. REST became popular because it uses the architecture of the web instead of inventing a completely custom communication model.",
          whyItMatters: "When teams follow REST principles, APIs become easier to learn, test, document, monitor, and integrate across many types of clients.",
          systemDesignConnection: "In system design, REST is commonly used for mobile apps, web apps, partner integrations, admin dashboards, public APIs, and service-to-service communication when a simple request-response model is enough.",
          example: "A user service might expose GET /users/42 to retrieve a user and POST /users to create a user. The API uses HTTP and resource URLs instead of a custom protocol.",
          commonMisconception: "A common misconception is that any API using HTTP is automatically RESTful. In reality, RESTfulness depends on design principles such as statelessness, resource orientation, proper HTTP semantics, and a uniform interface."
        },
        {
          name: "Resources over custom actions",
          explanation: "REST treats important domain entities as resources. Users, orders, products, invoices, accounts, posts, and comments are all examples of resources. Clients interact with these resources using standard HTTP methods.",
          whyItMatters: "Resource-oriented design gives an API a predictable structure. Developers can often guess how an endpoint behaves before reading full documentation.",
          systemDesignConnection: "In large organizations, consistent resource modeling reduces integration friction between frontend teams, backend teams, partner teams, and platform teams.",
          example: "Instead of POST /createOrder, a RESTful design usually uses POST /orders. Instead of GET /fetchUser?id=42, it uses GET /users/42.",
          commonMisconception: "Many beginners design URLs around verbs because they think an API endpoint must describe an action. In REST, the URL identifies the resource, while the HTTP method describes the action."
        },
        {
          name: "Stateless communication",
          explanation: "REST is stateless. Each request must contain the context needed to process it, such as authentication credentials, parameters, and request body data. The server should not rely on remembering previous client requests in local session memory.",
          whyItMatters: "Statelessness makes backend services simpler to scale and recover. Any server instance can process any valid request.",
          systemDesignConnection: "At high traffic, stateless APIs work well behind load balancers because requests can be routed to any available server without sticky sessions or special session replication.",
          example: "A mobile app sends Authorization: Bearer <token> with every API request. The server verifies the token and processes the request without needing a server-side session tied to one machine.",
          commonMisconception: "Stateless does not mean the application has no data. It means the server does not store client session context between requests. Databases, caches, and durable storage still exist."
        },
        {
          name: "Why REST became the default API style",
          explanation: "REST gained adoption because it is simple, web-native, interoperable, and scalable. It relies on widely understood HTTP concepts such as methods, URLs, headers, status codes, and caching.",
          whyItMatters: "Teams can build APIs that work across programming languages, operating systems, browsers, mobile devices, and cloud platforms.",
          systemDesignConnection: "REST's simplicity makes it a strong default for many distributed systems, especially when the main interaction pattern is request-response data access.",
          example: "A JavaScript browser client, a Python backend job, and a Java Android app can all call the same REST endpoint using standard HTTP libraries.",
          commonMisconception: "REST is not always the best choice for every problem. Real-time streaming, ultra-low-latency internal RPC, or flexible client-driven data fetching may be better served by WebSockets, gRPC, or GraphQL."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "REST builds on the web",
          body: "REST became influential because it embraced HTTP instead of replacing it. It uses URLs to identify resources and HTTP methods to express operations.",
          takeaway: "REST is web-native API design."
        },
        {
          type: "concept",
          title: "The URL names the thing",
          body: "In REST, /users/42 names a resource. The method tells the API what to do with it: GET retrieves it, PUT replaces it, PATCH changes part of it, and DELETE removes it.",
          takeaway: "Resources are nouns; HTTP methods express actions."
        },
        {
          type: "concept",
          title: "Statelessness enables scale",
          body: "If each request contains everything needed, a load balancer can send the request to any healthy server. The system does not depend on one specific machine remembering the client.",
          takeaway: "Stateless APIs are easier to horizontally scale."
        },
        {
          type: "concept",
          title: "Interoperability is a major REST advantage",
          body: "Because REST uses HTTP standards, clients written in Java, Python, JavaScript, Go, .NET, or many other languages can consume the same API.",
          takeaway: "REST reduces coupling between technologies."
        }
      ],
      visualModels: [
        {
          title: "REST Request Flow",
          description: "A client interacts with a resource through a standard HTTP request and receives a representation of that resource in the response.",
          flow: [
            "Client chooses a resource URL such as /orders/123",
            "Client sends an HTTP method such as GET with headers and context",
            "Any available server instance processes the stateless request",
            "Server returns a status code, headers, and a resource representation such as JSON"
          ],
          learnerShouldNotice: "The resource identity and the operation are separate: the URL says what resource, while the HTTP method says what action."
        },
        {
          title: "Why Statelessness Helps Load Balancing",
          description: "Stateless requests remove the need for a client to keep talking to the same server instance.",
          flow: [
            "Request 1 goes to Server A with its auth token and parameters",
            "Request 2 goes to Server B with its auth token and parameters",
            "Server A fails, but Server C can process the next request",
            "The client continues without depending on local session state on one server"
          ],
          learnerShouldNotice: "Horizontal scaling and failure recovery become simpler when the server does not store client session context locally."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "What is REST?",
          options: [
            "An architectural style for designing networked applications around resources and standard HTTP semantics",
            "A database engine used to store API resources",
            "A replacement for TCP used by browsers",
            "A JavaScript framework for building frontend applications"
          ],
          correctAnswerIndex: 0,
          explanation: "REST is an architectural style. It commonly uses HTTP, resources, stateless communication, and a uniform interface."
        },
        {
          type: "true_false",
          prompt: "An API is RESTful just because it uses HTTP.",
          correctAnswer: false,
          explanation: "Using HTTP is not enough. A RESTful API should follow REST constraints such as statelessness, resource-oriented design, cacheability, layered systems, and consistent interfaces."
        },
        {
          type: "fill_blank",
          prompt: "In REST, the endpoint URL should primarily identify the ______, while the HTTP method identifies the operation.",
          options: [
            "resource",
            "database index",
            "server hostname",
            "frontend component"
          ],
          correctAnswerIndex: 0,
          explanation: "REST endpoints should be resource-oriented. For example, /users/42 identifies a user resource."
        },
        {
          type: "mcq",
          prompt: "Why does REST's statelessness help at scale?",
          options: [
            "Requests can be processed by any available server instance without relying on local session memory",
            "It removes the need for databases entirely",
            "It forces all clients to use the same programming language",
            "It guarantees every request will be faster than UDP"
          ],
          correctAnswerIndex: 0,
          explanation: "Stateless requests contain the context needed for processing, which simplifies load balancing, horizontal scaling, and failure recovery."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each REST idea to its meaning.",
          pairs: [
            {
              left: "Resource",
              right: "A domain entity such as a user, order, product, or invoice"
            },
            {
              left: "Endpoint",
              right: "The URL address clients use to interact with a resource"
            },
            {
              left: "Stateless request",
              right: "A request that carries the context needed to process it"
            },
            {
              left: "Interoperability",
              right: "Different platforms and languages can communicate using shared web standards"
            }
          ],
          explanation: "REST works well because resources, endpoints, statelessness, and standards-based communication create predictable APIs."
        },
        {
          type: "ordering",
          prompt: "Order the steps in a simple REST request-response interaction.",
          items: [
            "Server returns an HTTP response with status code and resource representation",
            "Client sends an HTTP request with method, URL, headers, and optional body",
            "Client identifies the resource it wants to work with",
            "Server processes the request without relying on local client session state"
          ],
          correctOrder: [
            "Client identifies the resource it wants to work with",
            "Client sends an HTTP request with method, URL, headers, and optional body",
            "Server processes the request without relying on local client session state",
            "Server returns an HTTP response with status code and resource representation"
          ],
          explanation: "REST separates resource identification, operation intent, stateless processing, and standardized response handling."
        },
        {
          type: "scenario",
          prompt: "You are designing an API for a shopping app. Which endpoint style is most RESTful for creating an order?",
          options: [
            "POST /orders",
            "GET /createOrder",
            "POST /doCreateOrderNow",
            "PUT /actions/create-new-order"
          ],
          correctAnswerIndex: 0,
          explanation: "POST /orders uses a resource-oriented collection URL. The method POST communicates creation."
        }
      ],
      checkpoint: {
        summary: "REST is a web-native architectural style that models business entities as resources, uses standard HTTP operations, and relies on stateless requests for scalable communication.",
        learnerCanNow: [
          "Define REST in practical system design terms",
          "Explain why REST uses resources instead of action-heavy endpoints",
          "Describe how statelessness supports load balancing and fault tolerance",
          "Recognize why REST works across many languages and platforms"
        ],
        explainInYourOwnWords: "Explain why /users/42 with GET is more RESTful than /getUser?id=42."
      }
    },
    {
      id: "lecture-19-rest-restfulness-api-design-principles-lesson-2",
      title: "REST Constraints: The Rules Behind RESTfulness",
      goal: "Learn the architectural constraints that distinguish truly RESTful APIs from APIs that merely use HTTP.",
      order: 2,
      estimatedMinutes: 7,
      concepts: [
        {
          name: "Client-server separation",
          explanation: "The client-server constraint separates user interface concerns from backend business logic and data management. Clients handle presentation and user interaction, while servers expose resources and enforce business rules.",
          whyItMatters: "This separation allows frontend and backend teams to evolve independently as long as the API contract remains stable.",
          systemDesignConnection: "In a large product, mobile apps, web apps, and partner clients can all use the same backend API while developing at different speeds.",
          example: "A web app and an iOS app both call GET /products, but each renders the product list differently.",
          commonMisconception: "Client-server separation does not mean there is only one server. The server side may contain many services, gateways, databases, and caches behind the API."
        },
        {
          name: "Statelessness as a REST constraint",
          explanation: "Statelessness means the server does not store client session context between requests. Every request must include enough information for the server to understand and authorize it.",
          whyItMatters: "Stateless services are easier to replicate, replace, deploy, and recover after failure.",
          systemDesignConnection: "A stateless user API can run as many identical instances behind a load balancer. If one instance dies, another can handle the next request.",
          example: "Instead of keeping login state only in memory on Server A, the client sends a JWT or session token with every request.",
          commonMisconception: "Using an authentication token does not violate statelessness. The key is that the server should not require local per-client session memory to process the request."
        },
        {
          name: "Cacheability",
          explanation: "Cacheability means responses should clearly indicate whether they can be cached and for how long. HTTP headers such as Cache-Control, ETag, and Last-Modified help clients and intermediaries reuse responses safely.",
          whyItMatters: "Caching reduces latency for users, lowers backend load, decreases bandwidth usage, and improves resilience during traffic spikes.",
          systemDesignConnection: "For high-read endpoints such as product catalogs, public profiles, or article pages, caching can dramatically reduce database pressure.",
          example: "GET /products/123 may return Cache-Control: max-age=300, allowing clients or CDNs to reuse the response for five minutes.",
          commonMisconception: "Caching is not only a browser feature. REST responses may be cached by browsers, mobile clients, CDNs, reverse proxies, gateways, and service-level caches."
        },
        {
          name: "Layered system",
          explanation: "A layered system allows intermediaries such as load balancers, gateways, proxies, security layers, and caches to sit between clients and backend services without changing the client experience.",
          whyItMatters: "Layering lets architects add cross-cutting capabilities such as authentication, rate limiting, observability, TLS termination, caching, and routing.",
          systemDesignConnection: "Most production REST APIs are accessed through an API gateway or load balancer before reaching internal services.",
          example: "A request may travel from mobile app to CDN to API gateway to authentication middleware to user service.",
          commonMisconception: "A REST client does not need to know whether it is talking directly to the service or through several intermediaries."
        },
        {
          name: "Uniform interface and optional code on demand",
          explanation: "The uniform interface constraint means resources are identified consistently, manipulated through representations, and operated on using standard semantics. Strict REST also includes an optional constraint called code on demand, where a server may send executable code such as JavaScript to a client.",
          whyItMatters: "A uniform interface makes APIs predictable, while optional code on demand can extend client functionality but is less central in most modern JSON APIs.",
          systemDesignConnection: "Uniform interfaces allow API gateways, caches, monitoring tools, SDK generators, documentation tools, and humans to understand API behavior more easily.",
          example: "GET /orders/123 retrieves an order, PATCH /orders/123 modifies fields, and DELETE /orders/123 removes it. The patterns are consistent across resources.",
          commonMisconception: "Many lists mention five REST constraints because code on demand is optional. In interviews, it is useful to know the full six: client-server, statelessness, cacheability, layered system, uniform interface, and optional code on demand."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Constraints create RESTfulness",
          body: "The power of REST does not come from HTTP alone. It comes from constraints that make APIs scalable, predictable, and maintainable.",
          takeaway: "RESTfulness is about design discipline."
        },
        {
          type: "concept",
          title: "Client and server evolve separately",
          body: "The client owns presentation. The server owns resources, business logic, and data. The API contract connects them.",
          takeaway: "Separation reduces coupling."
        },
        {
          type: "concept",
          title: "Caching protects the backend",
          body: "If many clients repeatedly request the same resource, cacheable responses can be served without hitting the origin service every time.",
          takeaway: "Cacheability improves latency and reduces load."
        },
        {
          type: "concept",
          title: "Layering is normal in production",
          body: "Real APIs often pass through CDNs, gateways, load balancers, proxies, auth services, and observability systems before reaching application code.",
          takeaway: "REST supports intermediaries."
        },
        {
          type: "concept",
          title: "Uniform interface equals predictability",
          body: "When every resource follows consistent naming, method usage, status codes, and representation patterns, APIs become easier to learn and operate.",
          takeaway: "Consistency is a scalability feature."
        }
      ],
      visualModels: [
        {
          title: "Layered REST Architecture",
          description: "A REST request can pass through multiple infrastructure layers without the client needing to know the internal topology.",
          flow: [
            "Client sends GET /users/42",
            "CDN or cache checks whether a valid cached response exists",
            "API gateway applies routing, authentication, and rate limiting",
            "Load balancer sends the request to a healthy service instance",
            "Service retrieves data and returns a standard HTTP response"
          ],
          learnerShouldNotice: "Layering adds operational capabilities while preserving the same external API contract."
        },
        {
          title: "REST Constraints Working Together",
          description: "Each constraint solves a different scaling or maintainability problem.",
          flow: [
            "Client-server separates UI from backend concerns",
            "Statelessness allows requests to go to any server",
            "Cacheability reduces repeated backend work",
            "Layered systems enable gateways, proxies, and security layers",
            "Uniform interfaces make behavior predictable"
          ],
          learnerShouldNotice: "REST's scalability comes from the combined effect of multiple constraints, not from one feature alone."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which REST constraint allows load balancers, gateways, proxies, and caching layers to exist between clients and services?",
          options: [
            "Layered system",
            "Code compilation",
            "Database normalization",
            "Sticky sessions"
          ],
          correctAnswerIndex: 0,
          explanation: "The layered system constraint supports intermediaries without requiring clients to know the internal system structure."
        },
        {
          type: "true_false",
          prompt: "REST cacheability can reduce backend load and improve user-perceived latency.",
          correctAnswer: true,
          explanation: "Cacheable responses can be reused by clients or intermediaries, avoiding unnecessary requests to origin services."
        },
        {
          type: "fill_blank",
          prompt: "The REST constraint that gives APIs predictable resource identification and method usage is the ______ interface.",
          options: [
            "uniform",
            "private",
            "binary",
            "stateful"
          ],
          correctAnswerIndex: 0,
          explanation: "A uniform interface makes APIs consistent and easier to integrate with."
        },
        {
          type: "mcq",
          prompt: "Which list best represents the full set of REST constraints often discussed in interviews?",
          options: [
            "Client-server, statelessness, cacheability, layered system, uniform interface, optional code on demand",
            "TCP, UDP, TLS, DNS, JSON, XML",
            "Authentication, authorization, encryption, indexing, replication, sharding",
            "Polling, long polling, WebSockets, SSE, gRPC, GraphQL"
          ],
          correctAnswerIndex: 0,
          explanation: "These are the REST constraints. Code on demand is optional and is often omitted from simplified practical discussions."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each REST constraint to the system design benefit it provides.",
          pairs: [
            {
              left: "Client-server",
              right: "Frontend and backend can evolve independently"
            },
            {
              left: "Statelessness",
              right: "Any healthy server can process a request"
            },
            {
              left: "Cacheability",
              right: "Repeated reads can avoid unnecessary backend work"
            },
            {
              left: "Layered system",
              right: "Gateways, load balancers, proxies, and security layers can be inserted"
            },
            {
              left: "Uniform interface",
              right: "APIs become predictable for developers and tooling"
            }
          ],
          explanation: "Each REST constraint exists to reduce coupling, improve scalability, or make behavior easier to reason about."
        },
        {
          type: "ordering",
          prompt: "Order the path of a typical production REST request through a layered system.",
          items: [
            "API gateway authenticates, rate limits, and routes",
            "Backend service processes the resource request",
            "Client sends the HTTP request",
            "Load balancer chooses a healthy server instance",
            "Response may be cached before being returned"
          ],
          correctOrder: [
            "Client sends the HTTP request",
            "API gateway authenticates, rate limits, and routes",
            "Load balancer chooses a healthy server instance",
            "Backend service processes the resource request",
            "Response may be cached before being returned"
          ],
          explanation: "Production REST systems commonly use multiple layers between the client and application code."
        },
        {
          type: "scenario",
          prompt: "Your REST service stores user login state only in local memory on one server. After adding more servers, users are randomly logged out when requests hit different machines. Which REST principle is being violated?",
          options: [
            "Statelessness",
            "JSON readability",
            "Resource pluralization",
            "HTTP port selection"
          ],
          correctAnswerIndex: 0,
          explanation: "The API depends on local per-client session state. A stateless design would send credentials or tokens with each request or use shared durable session infrastructure."
        }
      ],
      checkpoint: {
        summary: "REST constraints are the design rules that make APIs scalable and maintainable: client-server separation, statelessness, cacheability, layered systems, uniform interfaces, and optional code on demand.",
        learnerCanNow: [
          "Name the main REST constraints",
          "Explain why stateless APIs scale horizontally",
          "Describe how caching and layered systems reduce backend pressure",
          "Recognize why uniform interfaces improve developer experience"
        ],
        explainInYourOwnWords: "Explain how statelessness and layered systems work together when an API is placed behind a load balancer and gateway."
      }
    },
    {
      id: "lecture-19-rest-restfulness-api-design-principles-lesson-3",
      title: "Designing Resource-Oriented REST APIs",
      goal: "Practice designing clean, intuitive REST endpoints using resources, consistent URLs, versioning, and suitable response formats.",
      order: 3,
      estimatedMinutes: 8,
      concepts: [
        {
          name: "Resource modeling",
          explanation: "Resource modeling means identifying the important business entities your API exposes. Good REST design starts by modeling the domain clearly before choosing endpoint paths.",
          whyItMatters: "A strong resource model naturally leads to a clean and intuitive API. A weak model creates confusing endpoints and long-term integration friction.",
          systemDesignConnection: "In system design interviews, candidates are often evaluated on whether their API design reflects the domain: users, posts, comments, orders, payments, accounts, transactions, and similar entities.",
          example: "For a blogging platform, likely resources include users, posts, comments, tags, and likes.",
          commonMisconception: "Designers sometimes start by listing operations such as createPost, approvePost, publishPost, and deletePost. REST encourages first identifying resources and then applying HTTP methods to them."
        },
        {
          name: "Endpoints as resource addresses",
          explanation: "An endpoint is the URL where a client interacts with a resource. The endpoint answers, 'Which resource am I working with?' The HTTP method answers, 'What do I want to do with it?'",
          whyItMatters: "This separation makes APIs easier to understand and keeps endpoint naming from becoming inconsistent as features grow.",
          systemDesignConnection: "Large APIs can contain hundreds of endpoints. Predictable resource paths reduce onboarding time and documentation burden.",
          example: "GET /users/42 retrieves user 42. DELETE /products/99 deletes product 99. POST /orders creates a new order in the orders collection.",
          commonMisconception: "Endpoints should not usually contain verbs like /getUser or /deleteProduct because the HTTP method already expresses the operation."
        },
        {
          name: "Consistent URL structure",
          explanation: "RESTful APIs usually use plural nouns for collections, stable resource identifiers, nesting only when it clarifies ownership, and versioning when contracts change.",
          whyItMatters: "Consistency prevents confusion, reduces breaking changes, and helps clients predict API behavior.",
          systemDesignConnection: "Backward compatibility becomes critical when many clients depend on an API. Versioning such as /v1/users allows evolution without immediately breaking old consumers.",
          example: "Use /users, /orders, /products, and /v1/users. Prefer PATCH /users/42 with { \"active\": true } over an action-heavy endpoint like /users/42/activate when the operation is a state update.",
          commonMisconception: "Nested URLs are not always better. /users/42/orders can be useful, but deeply nested paths like /companies/1/teams/2/users/3/orders/4/items/5 often become hard to maintain."
        },
        {
          name: "REST API versus RESTful API",
          explanation: "People often use REST API broadly for APIs that follow some REST ideas. RESTful API usually means the API more fully follows REST constraints and design principles.",
          whyItMatters: "The distinction matters in interviews and architecture reviews because an API can use HTTP yet still be poorly designed from a REST perspective.",
          systemDesignConnection: "A system can expose HTTP endpoints but still be tightly coupled, stateful, action-heavy, inconsistent, or hard to cache. Calling it RESTful should imply more discipline.",
          example: "POST /doEverything with an action field in the body is not very RESTful even if it uses HTTP. GET /orders, POST /orders, GET /orders/123, and PATCH /orders/123 are more RESTful.",
          commonMisconception: "RESTful does not mean the API must be perfect or academically complete. In practice, it means the API follows the key REST constraints well enough to be predictable, scalable, and maintainable."
        },
        {
          name: "JSON versus XML",
          explanation: "REST APIs can use multiple representation formats, but JSON is the modern default because it is compact, readable, and maps naturally to objects in most programming languages. XML is still used in some legacy and enterprise systems.",
          whyItMatters: "Payload format affects network overhead, parsing speed, developer productivity, validation options, and integration compatibility.",
          systemDesignConnection: "At scale, smaller payloads and faster parsing reduce latency, bandwidth, and infrastructure cost. However, enterprise integration may require XML for compliance or legacy compatibility.",
          example: "A new public mobile API would typically return JSON. A banking integration with older enterprise systems might still use XML due to existing contracts and validation requirements.",
          commonMisconception: "REST does not require JSON. JSON is popular because it is convenient and efficient, but REST can represent resources using JSON, XML, HTML, or other formats."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Start with the domain",
          body: "Before designing endpoints, identify the resources your business cares about. Users, products, orders, accounts, transactions, posts, and comments are likely resources.",
          takeaway: "Good REST design begins with resource modeling."
        },
        {
          type: "concept",
          title: "Endpoint asks: which resource?",
          body: "GET /users/42 identifies user 42. The method GET expresses retrieval. This keeps URLs clean and predictable.",
          takeaway: "URL = resource; method = operation."
        },
        {
          type: "concept",
          title: "Use plural collection names",
          body: "Use /users, /orders, and /products for collections. It creates consistency across APIs and avoids one-off naming patterns.",
          takeaway: "Plural nouns make resource collections clear."
        },
        {
          type: "concept",
          title: "Version when contracts change",
          body: "If a breaking change is necessary, version the API contract with approaches such as /v1/users or version headers.",
          takeaway: "Versioning protects existing clients."
        },
        {
          type: "concept",
          title: "JSON is the practical default",
          body: "JSON usually wins for modern APIs because it is lightweight, easy to parse, and natural for web and mobile clients. XML remains useful for legacy, compliance, and document-heavy integrations.",
          takeaway: "Choose data formats based on ecosystem and requirements."
        }
      ],
      visualModels: [
        {
          title: "Resource-Oriented Endpoint Pattern",
          description: "A small set of method and URL combinations can express many operations consistently.",
          flow: [
            "GET /users retrieves a collection of users",
            "POST /users creates a new user",
            "GET /users/42 retrieves one user",
            "PUT /users/42 replaces the user",
            "PATCH /users/42 partially updates the user",
            "DELETE /users/42 removes the user"
          ],
          learnerShouldNotice: "The same URL can support different operations because the HTTP method carries intent."
        },
        {
          title: "From Domain Model to API",
          description: "A good REST API exposes business concepts directly rather than hiding them behind arbitrary action names.",
          flow: [
            "Identify business entities: users, posts, comments",
            "Create collection endpoints: /users, /posts, /comments",
            "Create item endpoints: /users/{id}, /posts/{id}, /comments/{id}",
            "Use HTTP methods to retrieve, create, update, and delete",
            "Add versioning and pagination as the API matures"
          ],
          learnerShouldNotice: "Clean endpoint design usually follows naturally from a clear resource model."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which endpoint is the most RESTful for retrieving a product by ID?",
          options: [
            "GET /products/123",
            "POST /getProduct",
            "GET /fetch-product?id=123",
            "DELETE /products/123"
          ],
          correctAnswerIndex: 0,
          explanation: "GET /products/123 uses a resource URL and the GET method to retrieve the resource."
        },
        {
          type: "true_false",
          prompt: "A resource in REST is usually a business entity such as a user, order, product, account, or transaction.",
          correctAnswer: true,
          explanation: "REST APIs should model domain concepts as resources."
        },
        {
          type: "fill_blank",
          prompt: "For modern web and mobile REST APIs, ______ is typically the default data format because it is lightweight and maps naturally to programming language objects.",
          options: [
            "JSON",
            "XML",
            "SMTP",
            "TCP"
          ],
          correctAnswerIndex: 0,
          explanation: "JSON is usually preferred for modern REST APIs due to simplicity, compactness, and broad ecosystem support."
        },
        {
          type: "mcq",
          prompt: "Which practice helps avoid breaking existing clients when an API contract changes?",
          options: [
            "API versioning",
            "Removing status codes",
            "Putting every action into one endpoint",
            "Using only POST for every operation"
          ],
          correctAnswerIndex: 0,
          explanation: "Versioning allows old and new contracts to coexist, which protects existing clients."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each API design choice with the RESTful version.",
          pairs: [
            {
              left: "Create a new order",
              right: "POST /orders"
            },
            {
              left: "Retrieve user 42",
              right: "GET /users/42"
            },
            {
              left: "Delete product 99",
              right: "DELETE /products/99"
            },
            {
              left: "Partially update a user's email",
              right: "PATCH /users/42"
            },
            {
              left: "List posts with pagination",
              right: "GET /posts?page=2&limit=20"
            }
          ],
          explanation: "RESTful endpoints pair resource URLs with HTTP methods and use query parameters for filtering, pagination, and similar read modifiers."
        },
        {
          type: "ordering",
          prompt: "Order the steps for designing a resource-oriented REST API.",
          items: [
            "Add versioning, pagination, caching, and status code conventions",
            "Identify domain resources",
            "Define collection and item URLs",
            "Map HTTP methods to resource operations"
          ],
          correctOrder: [
            "Identify domain resources",
            "Define collection and item URLs",
            "Map HTTP methods to resource operations",
            "Add versioning, pagination, caching, and status code conventions"
          ],
          explanation: "Start with the business domain, then design paths and methods, then add production conventions."
        },
        {
          type: "scenario",
          prompt: "A team is building a new public API for a mobile shopping app. They ask whether to use JSON or XML by default. What is the strongest recommendation?",
          options: [
            "Use JSON by default because it is lightweight, easy to parse, and well-supported by web and mobile ecosystems",
            "Use XML by default because REST requires XML",
            "Use XML because it is always faster than JSON",
            "Use no response format because REST only uses status codes"
          ],
          correctAnswerIndex: 0,
          explanation: "JSON is the modern default for most new REST APIs. XML may be chosen for legacy, validation, document, or compliance needs."
        }
      ],
      checkpoint: {
        summary: "RESTful API design starts with resources, uses endpoints as resource addresses, relies on HTTP methods for operations, keeps URL structures consistent, versions contracts carefully, and usually uses JSON for modern APIs.",
        learnerCanNow: [
          "Model API resources from a business domain",
          "Design basic RESTful endpoints for common CRUD operations",
          "Explain why action-heavy URLs are usually less RESTful",
          "Choose JSON or XML based on system requirements",
          "Describe why versioning matters for backward compatibility"
        ],
        explainInYourOwnWords: "Design REST endpoints for users, posts, and comments in a blogging platform, and explain why your URLs are resource-oriented."
      }
    },
    {
      id: "lecture-19-rest-restfulness-api-design-principles-lesson-4",
      title: "HTTP Semantics, Reliability, and Production API Concerns",
      goal: "Use HTTP methods correctly and connect REST API design choices to retries, caching, reliability, security, and interview-ready trade-offs.",
      order: 4,
      estimatedMinutes: 8,
      concepts: [
        {
          name: "HTTP methods communicate intent",
          explanation: "In REST, HTTP methods are not just arbitrary verbs. They communicate behavior and expectations to clients, developers, gateways, caches, monitoring systems, and retry logic.",
          whyItMatters: "Correct method usage makes APIs self-describing and predictable. Incorrect method usage can break caching, retries, safety assumptions, and developer expectations.",
          systemDesignConnection: "Infrastructure tools often rely on HTTP method semantics. For example, caches treat GET differently from POST, and retry systems treat idempotent operations more safely.",
          example: "GET /orders/123 should retrieve an order. POST /orders should create an order. DELETE /orders/123 should remove an order.",
          commonMisconception: "Some teams use POST for everything because it is flexible. This works mechanically but loses important REST and HTTP semantics."
        },
        {
          name: "Safe versus unsafe methods",
          explanation: "Safe methods are intended only for retrieval and should not change server state. GET and HEAD are considered safe. Unsafe methods such as POST, PUT, PATCH, and DELETE can modify server state.",
          whyItMatters: "Browsers, crawlers, caches, proxies, and monitoring tools may assume GET is safe. If GET changes data, accidental or repeated requests can cause damage.",
          systemDesignConnection: "At scale, automated systems may prefetch, cache, retry, or crawl GET requests. Safe semantics prevent unexpected side effects.",
          example: "GET /emails/123 should not mark an email as permanently deleted. A state change should use a modifying method such as PATCH or DELETE.",
          commonMisconception: "Safe does not mean private or secure. It means the method should not modify server state."
        },
        {
          name: "Idempotency",
          explanation: "An idempotent operation has the same intended result whether it is executed once or multiple times. GET, PUT, and DELETE are generally designed to be idempotent. POST is typically not idempotent, and PATCH may or may not be depending on the patch design.",
          whyItMatters: "Idempotency is crucial in distributed systems because network failures can cause clients, load balancers, queues, or SDKs to retry requests.",
          systemDesignConnection: "If a payment creation endpoint is retried after a timeout, non-idempotent behavior could accidentally charge a customer twice. Idempotency keys are often used for safer POST operations.",
          example: "Sending DELETE /users/42 twice should result in user 42 being absent. The second response may be 404 or 204 depending on design, but the final state is the same.",
          commonMisconception: "Idempotent does not mean the response must be identical every time. It means the resulting system state is the same after one or many identical requests."
        },
        {
          name: "PUT versus PATCH",
          explanation: "PUT is used for full replacement of a resource. PATCH is used for partial modification of specific fields. Choosing between them clarifies the API contract and helps prevent data loss.",
          whyItMatters: "If clients misunderstand PUT as partial update, missing fields may be overwritten or cleared accidentally.",
          systemDesignConnection: "In APIs with many clients, clear update semantics reduce bugs, data corruption, and compatibility issues.",
          example: "PUT /users/42 with a complete user document replaces the user. PATCH /users/42 with { \"email\": \"new@example.com\" } updates only the email.",
          commonMisconception: "PUT and PATCH are not interchangeable. PUT implies full replacement; PATCH implies partial change."
        },
        {
          name: "Production REST API concerns",
          explanation: "Successful REST APIs must handle more than endpoint shape. They need status codes, authentication, authorization, pagination, rate limiting, caching, security controls, observability, versioning, and backward compatibility.",
          whyItMatters: "An API that works for a demo may fail in production if it cannot handle abuse, large datasets, retries, client upgrades, or security threats.",
          systemDesignConnection: "System design interviews often test whether you think beyond CRUD endpoints and account for operational reality.",
          example: "A production GET /users endpoint should support pagination, enforce authorization, return proper status codes, be rate limited, and avoid leaking sensitive fields.",
          commonMisconception: "REST API design is not only naming endpoints. Long-term maintainability, security, and operational behavior are part of API design."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Methods are contracts",
          body: "GET should retrieve, POST should create or trigger non-idempotent processing, PUT should replace, PATCH should partially update, and DELETE should remove.",
          takeaway: "HTTP method semantics communicate intent."
        },
        {
          type: "concept",
          title: "GET must be safe",
          body: "A GET request should not change server state. This allows browsers, caches, crawlers, and proxies to optimize without causing side effects.",
          takeaway: "Never hide state-changing behavior behind GET."
        },
        {
          type: "concept",
          title: "Idempotency protects retries",
          body: "Distributed systems retry after timeouts and failures. Idempotent operations make retries safer because repeated requests have the same intended final state.",
          takeaway: "Idempotency is a reliability feature."
        },
        {
          type: "concept",
          title: "PUT replaces; PATCH modifies",
          body: "Use PUT when the client sends the full resource representation. Use PATCH when the client sends only the fields to change.",
          takeaway: "Clear update semantics prevent data loss."
        },
        {
          type: "concept",
          title: "Production APIs need guardrails",
          body: "Add authentication, authorization, pagination, rate limiting, caching, versioning, validation, observability, and security protections.",
          takeaway: "A scalable API is more than CRUD."
        }
      ],
      visualModels: [
        {
          title: "HTTP Method Semantics Map",
          description: "Each method carries expectations that affect infrastructure and client behavior.",
          flow: [
            "GET retrieves a representation and should be safe and idempotent",
            "POST creates or processes and is typically non-idempotent",
            "PUT fully replaces a resource and is idempotent",
            "PATCH partially updates a resource and may or may not be idempotent",
            "DELETE removes a resource and is idempotent in final state"
          ],
          learnerShouldNotice: "Method semantics affect reliability, retries, caching, monitoring, and developer expectations."
        },
        {
          title: "Retry Safety in Distributed Systems",
          description: "Network failures can leave clients unsure whether an operation succeeded, so method choice affects retry behavior.",
          flow: [
            "Client sends request",
            "Network timeout occurs before response is received",
            "Client or SDK decides whether to retry",
            "Idempotent operations can usually be retried more safely",
            "Non-idempotent operations may need idempotency keys or duplicate detection"
          ],
          learnerShouldNotice: "Reliability is not only about servers staying up; it is also about designing operations that behave safely under failure."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which HTTP method should be used for a full replacement of a resource?",
          options: [
            "PUT",
            "PATCH",
            "GET",
            "HEAD"
          ],
          correctAnswerIndex: 0,
          explanation: "PUT is used when the client sends a complete replacement representation for the resource."
        },
        {
          type: "true_false",
          prompt: "GET requests should be safe, meaning they should not change server state.",
          correctAnswer: true,
          explanation: "GET and HEAD are safe methods. They are intended for retrieval only."
        },
        {
          type: "fill_blank",
          prompt: "An operation that has the same intended final result whether it runs once or multiple times is called ______.",
          options: [
            "idempotent",
            "stateful",
            "encrypted",
            "serialized"
          ],
          correctAnswerIndex: 0,
          explanation: "Idempotency is especially important when requests may be retried after network failures."
        },
        {
          type: "mcq",
          prompt: "Which statement about DELETE is most accurate in REST?",
          options: [
            "DELETE is unsafe but generally idempotent because repeating it leaves the resource absent",
            "DELETE is safe because it only retrieves a resource",
            "DELETE must always return the exact same response body",
            "DELETE is never allowed in REST APIs"
          ],
          correctAnswerIndex: 0,
          explanation: "DELETE modifies state, so it is unsafe. But repeated DELETE requests should lead to the same final state: the resource is gone."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each HTTP method or concept to its correct meaning.",
          pairs: [
            {
              left: "GET",
              right: "Retrieve data; safe and idempotent"
            },
            {
              left: "POST",
              right: "Create or submit processing; typically non-idempotent"
            },
            {
              left: "PUT",
              right: "Full resource replacement; idempotent"
            },
            {
              left: "PATCH",
              right: "Partial resource modification"
            },
            {
              left: "DELETE",
              right: "Remove a resource; idempotent in final state"
            }
          ],
          explanation: "Correct method choice helps clients, infrastructure, and developers reason about API behavior."
        },
        {
          type: "ordering",
          prompt: "Order the reasoning process for choosing PUT versus PATCH.",
          items: [
            "Use PATCH if only specific fields are changing",
            "Use PUT if the request replaces the complete resource representation",
            "Identify whether the client is sending a full resource or a partial change",
            "Document the update behavior clearly so clients do not lose data"
          ],
          correctOrder: [
            "Identify whether the client is sending a full resource or a partial change",
            "Use PUT if the request replaces the complete resource representation",
            "Use PATCH if only specific fields are changing",
            "Document the update behavior clearly so clients do not lose data"
          ],
          explanation: "PUT and PATCH differ by replacement versus partial modification, so the first step is understanding the update intent."
        },
        {
          type: "scenario",
          prompt: "A payment API uses POST /payments. The client times out after sending a request and automatically retries. What production design feature best prevents double charging?",
          options: [
            "Use an idempotency key or duplicate request detection for payment creation",
            "Rename the endpoint to GET /payments/create",
            "Disable HTTPS so requests are faster",
            "Return XML instead of JSON"
          ],
          correctAnswerIndex: 0,
          explanation: "POST is typically non-idempotent. For payment creation, idempotency keys allow safe retries after timeouts."
        },
        {
          type: "scenario",
          prompt: "A public endpoint GET /articles returns the same data to many users. The backend database is under heavy read load. Which REST-friendly improvement should you consider first?",
          options: [
            "Add HTTP caching with headers such as Cache-Control and possibly use a CDN",
            "Convert GET to DELETE",
            "Require clients to use XML only",
            "Store client session state on every API server"
          ],
          correctAnswerIndex: 0,
          explanation: "Cacheable GET responses can reduce repeated backend reads and improve latency."
        }
      ],
      checkpoint: {
        summary: "HTTP method semantics are central to REST. Safe methods should not change state, idempotent methods support reliable retries, PUT and PATCH have distinct update meanings, and production APIs need security, caching, pagination, versioning, rate limiting, and compatibility planning.",
        learnerCanNow: [
          "Explain safe versus unsafe HTTP methods",
          "Explain idempotency and why it matters for retries",
          "Choose between PUT and PATCH",
          "Connect REST method semantics to caching, reliability, and tooling",
          "Identify production API concerns beyond endpoint naming"
        ],
        explainInYourOwnWords: "Explain why using POST for every endpoint may work technically but still create design, reliability, and operability problems."
      }
    }
  ],
  interviewPrep: {
    questions: [
      {
        question: "What is REST, and how does it differ from SOAP?",
        whatInterviewerLooksFor: "A clear distinction between REST as an architectural style and SOAP as a stricter protocol, plus practical trade-offs around payload format, performance, flexibility, and statefulness.",
        strongAnswer: "REST, or Representational State Transfer, is an architectural style for designing networked APIs around resources, stateless communication, standard HTTP methods, and a uniform interface. SOAP is a formal protocol with strict XML-based messaging and standards such as WS-Security. REST is usually lighter-weight, commonly uses JSON, works naturally with HTTP, and is easier for many web and mobile clients. SOAP can be useful in enterprise environments requiring strict contracts, formal validation, and advanced protocol-level standards.",
        answerStructure: [
          "Define REST and SOAP",
          "Compare architectural style versus protocol, data formats, performance, flexibility, and statefulness",
          "Mention when each might be appropriate"
        ],
        commonMistakes: [
          "Saying REST is a protocol exactly like SOAP",
          "Claiming REST always requires JSON",
          "Ignoring SOAP's enterprise use cases",
          "Only comparing syntax without mentioning architectural principles"
        ],
        followUps: [
          "When would SOAP still be a reasonable choice?",
          "Why is REST usually considered lighter-weight?",
          "Can REST use XML?"
        ]
      },
      {
        question: "What are the REST constraints?",
        whatInterviewerLooksFor: "Knowledge of the core REST constraints and the ability to explain why they matter for scalability and maintainability.",
        strongAnswer: "The REST constraints are client-server architecture, statelessness, cacheability, layered system, uniform interface, and optional code on demand. Client-server separation lets frontend and backend evolve independently. Statelessness means each request carries the context needed for processing, which helps scaling and load balancing. Cacheability reduces latency and backend load. Layered systems allow gateways, proxies, load balancers, and security layers. A uniform interface makes APIs predictable. Code on demand is optional and allows the server to provide executable code to clients.",
        answerStructure: [
          "List the constraints",
          "Explain each in one sentence",
          "Connect them to scale, reliability, and API simplicity"
        ],
        commonMistakes: [
          "Forgetting cacheability or layered systems",
          "Treating statelessness as meaning no database state",
          "Not knowing code on demand is optional",
          "Listing HTTP methods instead of REST constraints"
        ],
        followUps: [
          "Which constraint most helps horizontal scaling?",
          "How does cacheability improve performance?",
          "Why is the uniform interface important?"
        ]
      },
      {
        question: "What is the difference between a REST API and a RESTful API?",
        whatInterviewerLooksFor: "An understanding that RESTful implies stronger adherence to REST constraints, not merely using HTTP endpoints.",
        strongAnswer: "In casual use, REST API often means an HTTP API that follows some REST ideas. RESTful API usually means the API more completely follows REST principles: resource-oriented endpoints, proper HTTP method semantics, stateless interactions, cacheability where appropriate, a uniform interface, and consistent design. An HTTP API with endpoints like POST /doEverything is not very RESTful even if it is technically reachable over HTTP.",
        answerStructure: [
          "Define the informal distinction",
          "Give examples of RESTful properties",
          "Contrast with an HTTP API that is not very RESTful"
        ],
        commonMistakes: [
          "Saying they are always completely different technologies",
          "Saying every HTTP API is RESTful",
          "Ignoring statelessness and resource modeling"
        ],
        followUps: [
          "Can an API be partly RESTful?",
          "What makes an endpoint action-heavy?",
          "How would you improve a non-RESTful HTTP API?"
        ]
      },
      {
        question: "What is a resource in REST, and how is it represented?",
        whatInterviewerLooksFor: "Ability to model APIs around domain entities and explain URI-based resource identification.",
        strongAnswer: "A resource is a domain entity or concept that clients can interact with, such as a user, order, product, account, transaction, post, or comment. Resources are identified by URIs such as /users/42 or /products/99. The server returns a representation of the resource, commonly JSON, and clients use HTTP methods to retrieve, create, replace, partially update, or delete resources.",
        answerStructure: [
          "Define resource",
          "Mention URI identification",
          "Explain representation and method-based interaction"
        ],
        commonMistakes: [
          "Defining resources as database tables only",
          "Using action names as the main resource model",
          "Forgetting that representation format can vary"
        ],
        followUps: [
          "How would you model a blogging API?",
          "What is the difference between a resource and an endpoint?",
          "Should resource names be singular or plural?"
        ]
      },
      {
        question: "Explain GET, POST, PUT, PATCH, and DELETE.",
        whatInterviewerLooksFor: "Correct method semantics, including safety, idempotency, and update behavior.",
        strongAnswer: "GET retrieves data and should be safe and idempotent. POST usually creates a new resource or submits processing and is typically non-idempotent. PUT replaces an entire resource and is idempotent. PATCH partially updates a resource and may or may not be idempotent depending on the patch operation. DELETE removes a resource and is generally idempotent in final state because repeating it leaves the resource absent.",
        answerStructure: [
          "Describe each method's purpose",
          "Mention safe versus unsafe operations",
          "Mention idempotency and retry implications"
        ],
        commonMistakes: [
          "Saying GET can safely change data",
          "Treating PUT and PATCH as identical",
          "Assuming idempotent means identical response every time",
          "Claiming POST can never be made idempotent with idempotency keys"
        ],
        followUps: [
          "Why is idempotency useful in distributed systems?",
          "What can go wrong if GET changes server state?",
          "How would you design a safe payment creation endpoint?"
        ]
      },
      {
        question: "When would you use PUT versus PATCH?",
        whatInterviewerLooksFor: "Understanding of full replacement versus partial modification and the risk of accidental data loss.",
        strongAnswer: "Use PUT when the client is replacing the entire resource representation. Use PATCH when the client is modifying only selected fields. For example, PUT /users/42 might send the complete user object, while PATCH /users/42 might send only { \"email\": \"new@example.com\" }. This distinction prevents ambiguity and reduces the chance that omitted fields are accidentally cleared.",
        answerStructure: [
          "Define PUT as full replacement",
          "Define PATCH as partial update",
          "Give an example and mention data-loss risk"
        ],
        commonMistakes: [
          "Using PATCH for full replacement",
          "Using PUT as partial update without documenting behavior",
          "Not considering what happens to omitted fields"
        ],
        followUps: [
          "Is PATCH always idempotent?",
          "How should validation differ for PUT and PATCH?",
          "What response status would you return after a successful update?"
        ]
      },
      {
        question: "What are common HTTP status codes in REST APIs?",
        whatInterviewerLooksFor: "Practical knowledge of status code categories and common codes used in API design.",
        strongAnswer: "Common REST status codes include 200 OK for successful retrieval or update, 201 Created for successful creation, 204 No Content when the request succeeded but no body is returned, 400 Bad Request for malformed client input, 401 Unauthorized when authentication is required or invalid, 403 Forbidden when the authenticated client lacks permission, 404 Not Found when a resource does not exist, and 500 Internal Server Error for unexpected server failures.",
        answerStructure: [
          "Group by success and error categories",
          "Define the most common individual codes",
          "Connect codes to API client behavior"
        ],
        commonMistakes: [
          "Using 200 OK for every response",
          "Confusing 401 and 403",
          "Returning 500 for client validation errors",
          "Returning a success status when creation failed"
        ],
        followUps: [
          "When would you return 201 versus 200?",
          "When is 204 useful?",
          "How would you represent validation errors?"
        ]
      },
      {
        question: "What are best practices for designing RESTful APIs?",
        whatInterviewerLooksFor: "A broad but practical checklist covering resource design, method usage, consistency, status codes, versioning, pagination, security, and operational safeguards.",
        strongAnswer: "Best practices include modeling resources as nouns, using plural collection names like /users, applying HTTP methods correctly, returning meaningful status codes, keeping URL structures consistent, avoiding action-heavy endpoints where a resource state change is clearer, supporting versioning for breaking changes, paginating large collections, using caching where appropriate, applying authentication and authorization, validating inputs, rate limiting abusive clients, and documenting contracts clearly.",
        answerStructure: [
          "Start with resource and URL design",
          "Cover methods, status codes, and response formats",
          "Add production concerns such as security, pagination, caching, versioning, and rate limiting"
        ],
        commonMistakes: [
          "Only talking about endpoint naming",
          "Forgetting pagination for large datasets",
          "Ignoring authentication and authorization",
          "Not planning for backward compatibility"
        ],
        followUps: [
          "How would you version a REST API?",
          "How would you design pagination?",
          "How would you handle rate limiting?"
        ]
      },
      {
        question: "How does caching work in REST APIs?",
        whatInterviewerLooksFor: "Understanding that REST leverages HTTP caching semantics and that caching improves latency and reduces backend load.",
        strongAnswer: "REST APIs can use HTTP caching headers to tell clients and intermediaries whether responses can be reused. Cache-Control can define freshness, such as max-age=3600. ETag or Last-Modified can support validation so clients can ask whether a cached representation is still current. Caching is most useful for safe read endpoints like GET /products/123 and can be implemented in browsers, mobile clients, CDNs, gateways, reverse proxies, and application caches.",
        answerStructure: [
          "Explain cacheable responses",
          "Mention headers like Cache-Control and ETag",
          "Connect to latency, backend load, and read-heavy endpoints"
        ],
        commonMistakes: [
          "Thinking caching only happens in browsers",
          "Caching private user data publicly by mistake",
          "Trying to cache unsafe state-changing operations",
          "Ignoring invalidation and freshness"
        ],
        followUps: [
          "What is an ETag?",
          "How would you cache product data safely?",
          "What data should not be publicly cached?"
        ]
      },
      {
        question: "How do you implement pagination in REST APIs?",
        whatInterviewerLooksFor: "Awareness that large collections should not be returned all at once and familiarity with common pagination styles.",
        strongAnswer: "Pagination is usually implemented with query parameters such as GET /users?page=2&limit=10, offset and limit parameters, or cursor-based pagination such as GET /events?cursor=abc&limit=50. Page-based pagination is simple, while cursor-based pagination is often better for large or frequently changing datasets because it is more stable and efficient. Responses should include metadata or links that help clients fetch the next page.",
        answerStructure: [
          "Explain why pagination is needed",
          "Describe page/limit, offset/limit, and cursor styles",
          "Mention metadata or next-page links"
        ],
        commonMistakes: [
          "Returning unlimited collections",
          "Ignoring ordering consistency",
          "Using offset pagination for very large, high-change datasets without trade-off discussion",
          "Not documenting max page size"
        ],
        followUps: [
          "When is cursor pagination better than offset pagination?",
          "How do you choose a page size limit?",
          "What metadata should the response include?"
        ]
      },
      {
        question: "How does versioning work in REST APIs?",
        whatInterviewerLooksFor: "Ability to preserve backward compatibility while evolving API contracts.",
        strongAnswer: "Versioning lets an API introduce breaking changes without immediately breaking existing clients. Common approaches are URI versioning like /v1/users, header-based versioning such as Accept-Version: v1, and query-based versioning like ?version=1. URI versioning is explicit and easy to discover, while header-based versioning keeps URLs cleaner. The key is to version contracts carefully, avoid unnecessary breaking changes, and give clients migration time.",
        answerStructure: [
          "Explain why versioning exists",
          "Compare URI, header, and query approaches",
          "Mention backward compatibility and migration"
        ],
        commonMistakes: [
          "Versioning every minor non-breaking change",
          "Removing old versions without migration support",
          "Not documenting contract differences",
          "Assuming versioning eliminates compatibility responsibility"
        ],
        followUps: [
          "Which versioning style do you prefer and why?",
          "What counts as a breaking change?",
          "How long should old versions be supported?"
        ]
      },
      {
        question: "What is HATEOAS in REST?",
        whatInterviewerLooksFor: "Basic understanding of hypermedia-driven navigation and where it fits in REST maturity.",
        strongAnswer: "HATEOAS stands for Hypermedia as the Engine of Application State. It means API responses include links that tell clients what related actions or resources are available next. For example, a user response may include links for self, orders, or update. This reduces hardcoded client knowledge of every URL, although many practical REST APIs do not fully implement HATEOAS.",
        answerStructure: [
          "Define HATEOAS",
          "Give a response-link example",
          "Mention practical adoption trade-offs"
        ],
        commonMistakes: [
          "Confusing HATEOAS with authentication",
          "Saying every API must fully implement it to be useful",
          "Not being able to give a simple link example"
        ],
        followUps: [
          "Why is HATEOAS less common in many JSON APIs?",
          "How can links improve discoverability?",
          "What is a downside of adding hypermedia links?"
        ]
      },
      {
        question: "How do you handle authentication and authorization in REST APIs?",
        whatInterviewerLooksFor: "Clear separation of identity and permissions, plus practical mechanisms such as OAuth 2.0, JWT, API keys, and HTTPS.",
        strongAnswer: "Authentication verifies who the caller is, while authorization checks what the caller is allowed to do. REST APIs commonly use OAuth 2.0 for delegated access, JWTs or opaque bearer tokens for request authentication, and API keys for some third-party or service access scenarios. Every request should carry credentials because REST is stateless. APIs should use HTTPS, validate tokens, enforce permissions per resource, rotate secrets, and avoid exposing sensitive data.",
        answerStructure: [
          "Define authentication versus authorization",
          "Mention common mechanisms",
          "Connect to stateless requests and HTTPS"
        ],
        commonMistakes: [
          "Confusing authentication with authorization",
          "Sending tokens over plain HTTP",
          "Trusting client-provided user IDs without permission checks",
          "Using API keys as a complete user authorization model"
        ],
        followUps: [
          "Where should JWT validation happen?",
          "How do you revoke access?",
          "How would you secure partner APIs?"
        ]
      },
      {
        question: "How would you improve the performance of a REST API?",
        whatInterviewerLooksFor: "A practical performance mindset covering caching, compression, pagination, database optimization, async processing, and payload design.",
        strongAnswer: "I would start by measuring latency and bottlenecks. Common improvements include HTTP caching for read-heavy endpoints, gzip or Brotli compression, pagination and filtering to avoid huge responses, database indexing and query optimization, reducing over-fetching, using CDNs for public data, asynchronous processing for slow tasks, connection pooling, and careful payload design. I would also add observability to track p95 and p99 latency, error rates, and cache hit ratios.",
        answerStructure: [
          "Start with measurement",
          "Apply API-level optimizations",
          "Apply backend and infrastructure optimizations",
          "Monitor results"
        ],
        commonMistakes: [
          "Optimizing blindly without metrics",
          "Only scaling servers without reducing unnecessary work",
          "Ignoring database queries",
          "Returning huge unpaginated responses"
        ],
        followUps: [
          "How would caching affect consistency?",
          "What metrics would you monitor?",
          "How do compression and payload size affect latency?"
        ]
      },
      {
        question: "Can a REST API be stateful?",
        whatInterviewerLooksFor: "Understanding that REST should be stateless, while real systems may store application data and may sometimes use session mechanisms that reduce RESTfulness.",
        strongAnswer: "A RESTful API should be stateless from the perspective of client session context. Each request should carry enough information for the server to process it. The application can absolutely store durable state in databases or caches; statelessness does not mean no data. If the API depends on server-local session state, sticky sessions, or per-client memory, it becomes less RESTful and harder to scale. Some systems use shared sessions, but token-based stateless authentication is often preferred for REST APIs.",
        answerStructure: [
          "Clarify what stateless means",
          "Distinguish application data from client session context",
          "Explain scaling implications"
        ],
        commonMistakes: [
          "Saying REST systems cannot use databases",
          "Assuming any login feature violates REST",
          "Ignoring sticky-session scaling problems"
        ],
        followUps: [
          "How do JWTs help stateless authentication?",
          "When might server-side sessions still be used?",
          "What are sticky sessions?"
        ]
      },
      {
        question: "How does REST handle security vulnerabilities such as SQL injection and CSRF?",
        whatInterviewerLooksFor: "Recognition that REST itself is not a security solution; APIs require secure implementation practices.",
        strongAnswer: "REST does not automatically prevent vulnerabilities. SQL injection is prevented through parameterized queries, ORM safeguards, validation, least-privilege database accounts, and avoiding string-concatenated SQL. CSRF risk depends on authentication style; cookie-based browser APIs should use CSRF tokens, SameSite cookies, and proper CORS configuration. REST APIs should also use HTTPS, authentication, authorization, input validation, output filtering, rate limiting, logging, and secure error handling.",
        answerStructure: [
          "State that REST is not security by itself",
          "Address SQL injection controls",
          "Address CSRF controls",
          "Mention broader API security practices"
        ],
        commonMistakes: [
          "Claiming REST automatically prevents SQL injection",
          "Ignoring CSRF for cookie-authenticated APIs",
          "Confusing CORS with authentication",
          "Returning sensitive stack traces in errors"
        ],
        followUps: [
          "How does SameSite help with CSRF?",
          "Why is HTTPS required?",
          "What should be logged for security monitoring?"
        ]
      },
      {
        question: "Compare REST, GraphQL, and gRPC.",
        whatInterviewerLooksFor: "Ability to position REST relative to modern API protocols and choose based on use case rather than preference.",
        strongAnswer: "REST is resource-oriented, usually JSON over HTTP, and works well for general request-response APIs with strong web compatibility. GraphQL provides a flexible query layer where clients request exactly the fields they need, which helps reduce over-fetching and under-fetching for frontend-heavy applications. gRPC uses Protocol Buffers and HTTP/2, making it efficient for low-latency service-to-service communication and streaming. REST is simple and broadly compatible, GraphQL is flexible for client-driven data fetching, and gRPC is high-performance for internal microservices.",
        answerStructure: [
          "Define each approach",
          "Compare data format, flexibility, performance, and common use cases",
          "Explain that the best choice depends on requirements"
        ],
        commonMistakes: [
          "Saying one is always better",
          "Ignoring operational complexity",
          "Using GraphQL or gRPC where simple REST would be enough",
          "Not mentioning browser and ecosystem compatibility"
        ],
        followUps: [
          "When would you use gRPC over REST?",
          "What are GraphQL scaling challenges?",
          "Can a system use more than one API style?"
        ]
      }
    ]
  },
  revision: {
    flashcards: [
      {
        front: "What does REST stand for?",
        back: "Representational State Transfer.",
        category: "Definition"
      },
      {
        front: "Is REST a protocol?",
        back: "REST is an architectural style, not a strict protocol. It commonly uses HTTP.",
        category: "Definition"
      },
      {
        front: "What is a resource in REST?",
        back: "A domain entity or concept exposed by the API, such as a user, order, product, account, or post.",
        category: "Resource Design"
      },
      {
        front: "What is an endpoint?",
        back: "A specific URL where a client interacts with a resource, such as GET /users/42.",
        category: "Resource Design"
      },
      {
        front: "In REST, what should the URL represent?",
        back: "The resource being acted upon.",
        category: "Resource Design"
      },
      {
        front: "In REST, what should the HTTP method represent?",
        back: "The operation or intent, such as retrieve, create, replace, partially update, or delete.",
        category: "HTTP Semantics"
      },
      {
        front: "Why is statelessness important?",
        back: "It allows any server instance to process any request, simplifying load balancing, horizontal scaling, and failure recovery.",
        category: "Scalability"
      },
      {
        front: "Does stateless REST mean no database state?",
        back: "No. It means the server does not keep client session context between requests. Databases and application state still exist.",
        category: "Misconceptions"
      },
      {
        front: "Name the main REST constraints.",
        back: "Client-server, statelessness, cacheability, layered system, uniform interface, and optional code on demand.",
        category: "REST Constraints"
      },
      {
        front: "What is cacheability in REST?",
        back: "Responses can indicate whether and how long they may be cached, reducing latency and backend load.",
        category: "Performance"
      },
      {
        front: "What is the layered system constraint?",
        back: "Clients can interact with an API through intermediaries like gateways, proxies, load balancers, security layers, and caches.",
        category: "Architecture"
      },
      {
        front: "What is the uniform interface constraint?",
        back: "A consistent way to identify and manipulate resources using standard methods and representations.",
        category: "REST Constraints"
      },
      {
        front: "Which HTTP methods are safe?",
        back: "GET and HEAD are safe because they should only retrieve information and not change server state.",
        category: "HTTP Semantics"
      },
      {
        front: "What does idempotent mean?",
        back: "Running the same operation once or multiple times has the same intended final system state.",
        category: "Reliability"
      },
      {
        front: "Which common HTTP methods are generally idempotent?",
        back: "GET, PUT, and DELETE are generally idempotent. PATCH may or may not be. POST is typically not.",
        category: "HTTP Semantics"
      },
      {
        front: "What is the difference between PUT and PATCH?",
        back: "PUT replaces the full resource; PATCH modifies selected fields.",
        category: "HTTP Semantics"
      },
      {
        front: "Why is JSON usually preferred for modern REST APIs?",
        back: "It is lightweight, readable, easy to parse, and maps naturally to data structures in many programming languages.",
        category: "Data Formats"
      },
      {
        front: "When might XML still be used?",
        back: "For legacy enterprise integrations, strict validation needs, compliance, or document-oriented data structures.",
        category: "Data Formats"
      },
      {
        front: "Why does API versioning matter?",
        back: "It allows breaking contract changes while preserving backward compatibility for existing clients.",
        category: "API Evolution"
      },
      {
        front: "What is HATEOAS?",
        back: "Hypermedia as the Engine of Application State; responses include links to related resources or actions.",
        category: "Advanced REST"
      },
      {
        front: "What is the difference between authentication and authorization?",
        back: "Authentication verifies identity; authorization verifies what the identified caller is allowed to do.",
        category: "Security"
      },
      {
        front: "Why is pagination important?",
        back: "It prevents huge responses, reduces server load, improves latency, and makes large collections manageable.",
        category: "Performance"
      },
      {
        front: "Why should GET not modify data?",
        back: "Clients, crawlers, caches, and proxies may repeat or prefetch GET requests assuming they are safe.",
        category: "HTTP Semantics"
      },
      {
        front: "What is a common RESTful endpoint for creating an order?",
        back: "POST /orders.",
        category: "Endpoint Design"
      }
    ],
    glossary: [
      {
        term: "REST",
        definition: "Representational State Transfer, an architectural style for designing networked APIs around resources, stateless communication, and standard interface semantics.",
        relatedConcepts: [
          "HTTP",
          "Resource",
          "Statelessness",
          "Uniform Interface"
        ]
      },
      {
        term: "RESTful API",
        definition: "An API that follows REST constraints and design principles such as resource orientation, statelessness, proper HTTP semantics, cacheability, and consistency.",
        relatedConcepts: [
          "REST",
          "REST Constraints",
          "HTTP Methods"
        ]
      },
      {
        term: "Resource",
        definition: "A domain entity or concept exposed by an API, such as a user, order, product, account, transaction, post, or comment.",
        relatedConcepts: [
          "Endpoint",
          "URI",
          "Representation"
        ]
      },
      {
        term: "Endpoint",
        definition: "A URL address where a client interacts with a resource.",
        relatedConcepts: [
          "Resource",
          "URI",
          "HTTP Method"
        ]
      },
      {
        term: "URI",
        definition: "Uniform Resource Identifier, a string that identifies a resource such as /users/42.",
        relatedConcepts: [
          "Resource",
          "Endpoint",
          "URL"
        ]
      },
      {
        term: "Representation",
        definition: "The serialized form of a resource returned to or sent by a client, commonly JSON or XML.",
        relatedConcepts: [
          "JSON",
          "XML",
          "Resource"
        ]
      },
      {
        term: "Statelessness",
        definition: "A REST constraint where each request contains enough context for processing and the server does not rely on local client session memory between requests.",
        relatedConcepts: [
          "Scalability",
          "Load Balancing",
          "JWT"
        ]
      },
      {
        term: "Client-Server Architecture",
        definition: "A design constraint separating client presentation concerns from server-side business logic and data management.",
        relatedConcepts: [
          "REST Constraints",
          "Loose Coupling",
          "API Contract"
        ]
      },
      {
        term: "Cacheability",
        definition: "A REST constraint where responses can indicate whether they may be cached, improving latency and reducing backend load.",
        relatedConcepts: [
          "Cache-Control",
          "ETag",
          "CDN"
        ]
      },
      {
        term: "Layered System",
        definition: "A REST constraint that allows intermediaries such as proxies, gateways, load balancers, and caches between clients and backend services.",
        relatedConcepts: [
          "API Gateway",
          "Proxy",
          "Load Balancer"
        ]
      },
      {
        term: "Uniform Interface",
        definition: "A REST constraint requiring consistent resource identification, representations, method semantics, and interaction patterns.",
        relatedConcepts: [
          "HTTP Methods",
          "Resource Design",
          "RESTful API"
        ]
      },
      {
        term: "Code on Demand",
        definition: "An optional REST constraint where the server can send executable code, such as JavaScript, to extend client behavior.",
        relatedConcepts: [
          "REST Constraints",
          "Optional Constraint"
        ]
      },
      {
        term: "Safe Method",
        definition: "An HTTP method intended only for retrieval and not for changing server state, such as GET or HEAD.",
        relatedConcepts: [
          "GET",
          "HEAD",
          "HTTP Semantics"
        ]
      },
      {
        term: "Unsafe Method",
        definition: "An HTTP method that can modify server state, such as POST, PUT, PATCH, or DELETE.",
        relatedConcepts: [
          "POST",
          "PUT",
          "PATCH",
          "DELETE"
        ]
      },
      {
        term: "Idempotency",
        definition: "A property where executing the same operation once or multiple times results in the same intended final system state.",
        relatedConcepts: [
          "Retries",
          "Reliability",
          "PUT",
          "DELETE"
        ]
      },
      {
        term: "GET",
        definition: "An HTTP method used to retrieve a resource. It should be safe and idempotent.",
        relatedConcepts: [
          "Safe Method",
          "Idempotency",
          "Caching"
        ]
      },
      {
        term: "POST",
        definition: "An HTTP method commonly used to create resources or submit processing. It is typically non-idempotent.",
        relatedConcepts: [
          "Creation",
          "Non-Idempotent",
          "Idempotency Key"
        ]
      },
      {
        term: "PUT",
        definition: "An HTTP method used to fully replace a resource. It is generally idempotent.",
        relatedConcepts: [
          "Full Replacement",
          "Idempotency",
          "PATCH"
        ]
      },
      {
        term: "PATCH",
        definition: "An HTTP method used to partially modify a resource.",
        relatedConcepts: [
          "Partial Update",
          "PUT",
          "HTTP Semantics"
        ]
      },
      {
        term: "DELETE",
        definition: "An HTTP method used to remove a resource. It is unsafe but generally idempotent in final state.",
        relatedConcepts: [
          "Unsafe Method",
          "Idempotency",
          "HTTP Methods"
        ]
      },
      {
        term: "JSON",
        definition: "JavaScript Object Notation, a lightweight data format commonly used in modern REST APIs.",
        relatedConcepts: [
          "Representation",
          "Serialization",
          "Payload"
        ]
      },
      {
        term: "XML",
        definition: "Extensible Markup Language, a structured data format still used in some legacy, enterprise, validation-heavy, or document-oriented integrations.",
        relatedConcepts: [
          "Representation",
          "Legacy Systems",
          "Validation"
        ]
      },
      {
        term: "API Versioning",
        definition: "A strategy for evolving API contracts while preserving compatibility for existing clients.",
        relatedConcepts: [
          "Backward Compatibility",
          "URI Versioning",
          "Header Versioning"
        ]
      },
      {
        term: "HATEOAS",
        definition: "Hypermedia as the Engine of Application State, a REST principle where responses include links to related resources and possible next actions.",
        relatedConcepts: [
          "Hypermedia",
          "REST Maturity",
          "Discoverability"
        ]
      },
      {
        term: "Rate Limiting",
        definition: "A mechanism that restricts how many requests a client can make in a given time window to protect the API from abuse or overload.",
        relatedConcepts: [
          "Throttling",
          "API Gateway",
          "Reliability"
        ]
      },
      {
        term: "Pagination",
        definition: "A technique for splitting large result sets into smaller pages using parameters such as page, limit, offset, or cursor.",
        relatedConcepts: [
          "Large Datasets",
          "Performance",
          "Cursor Pagination"
        ]
      },
      {
        term: "OAuth 2.0",
        definition: "An authorization framework commonly used for delegated access to APIs.",
        relatedConcepts: [
          "Authentication",
          "Authorization",
          "Bearer Token"
        ]
      },
      {
        term: "JWT",
        definition: "JSON Web Token, a compact token format often used to carry claims for stateless authentication and authorization.",
        relatedConcepts: [
          "Stateless Authentication",
          "Bearer Token",
          "Claims"
        ]
      }
    ],
    finalQuiz: [
      {
        type: "mcq",
        prompt: "Which statement best describes REST?",
        options: [
          "An architectural style for resource-oriented, stateless APIs commonly built on HTTP",
          "A database protocol for synchronizing replicas",
          "A browser-only language for frontend rendering",
          "A strict XML messaging protocol identical to SOAP"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "REST is an architectural style that commonly uses HTTP, resources, statelessness, and uniform interface principles."
      },
      {
        type: "mcq",
        prompt: "Why is statelessness valuable in REST APIs?",
        options: [
          "It lets any server instance process any request because the request carries its needed context",
          "It removes the need for authentication",
          "It guarantees zero latency",
          "It means the application cannot store data in a database"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Statelessness simplifies load balancing, horizontal scaling, and failure recovery."
      },
      {
        type: "mcq",
        prompt: "Which endpoint is most RESTful for creating a new user?",
        options: [
          "POST /users",
          "GET /createUser",
          "POST /executeUserCreation",
          "PUT /actions/newUser"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "POST /users uses a collection resource URL and the POST method for creation."
      },
      {
        type: "mcq",
        prompt: "Which REST constraint allows an API request to pass through gateways, proxies, load balancers, and caches?",
        options: [
          "Layered system",
          "Binary serialization",
          "Sticky sessions",
          "Database indexing"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "The layered system constraint supports intermediaries between client and backend service."
      },
      {
        type: "mcq",
        prompt: "Which HTTP method should be used to retrieve data without changing server state?",
        options: [
          "GET",
          "POST",
          "PATCH",
          "DELETE"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "GET is used to retrieve resources and should be safe."
      },
      {
        type: "mcq",
        prompt: "What does idempotency mean?",
        options: [
          "Running the same operation once or many times has the same intended final state",
          "The operation always returns a JSON response",
          "The operation never requires authentication",
          "The operation is always faster than non-idempotent operations"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Idempotency is important for safe retries in distributed systems."
      },
      {
        type: "mcq",
        prompt: "Which method is most appropriate for partially updating a user's email address?",
        options: [
          "PATCH /users/42",
          "PUT /users/42 with only the email field and no documentation",
          "GET /users/42/changeEmail",
          "DELETE /users/42/email"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "PATCH is designed for partial updates to selected fields."
      },
      {
        type: "mcq",
        prompt: "What is the main difference between PUT and PATCH?",
        options: [
          "PUT replaces the full resource, while PATCH modifies part of the resource",
          "PUT retrieves resources, while PATCH deletes resources",
          "PUT is only for XML, while PATCH is only for JSON",
          "PUT is safe, while PATCH is safe"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "PUT and PATCH have different update semantics. PUT is full replacement; PATCH is partial modification."
      },
      {
        type: "mcq",
        prompt: "Why is JSON usually chosen for new REST APIs?",
        options: [
          "It is lightweight, easy to parse, readable, and widely supported",
          "REST requires JSON and forbids XML",
          "JSON automatically prevents all security vulnerabilities",
          "JSON is a transport protocol like TCP"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "JSON is popular because it is simple, compact, and maps well to programming language objects."
      },
      {
        type: "mcq",
        prompt: "When might XML be a reasonable REST API format?",
        options: [
          "When integrating with legacy enterprise systems or requiring strong document validation",
          "When the API must be stateless",
          "When using GET requests",
          "When the API is behind a load balancer"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "XML remains useful in some legacy, enterprise, regulated, and validation-heavy environments."
      },
      {
        type: "mcq",
        prompt: "Which status code commonly indicates a resource was successfully created?",
        options: [
          "201 Created",
          "400 Bad Request",
          "404 Not Found",
          "500 Internal Server Error"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "201 Created is commonly returned after successful resource creation."
      },
      {
        type: "mcq",
        prompt: "What is the difference between 401 Unauthorized and 403 Forbidden?",
        options: [
          "401 means authentication is missing or invalid; 403 means the caller is authenticated but lacks permission",
          "401 means the server crashed; 403 means the client should retry",
          "401 means resource created; 403 means resource deleted",
          "They are exact synonyms and should be used interchangeably"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "401 is about authentication; 403 is about authorization."
      },
      {
        type: "mcq",
        prompt: "Which design choice best supports backward compatibility when making breaking API changes?",
        options: [
          "Introduce a new API version such as /v2 while maintaining /v1 during migration",
          "Silently change the response shape of /v1",
          "Remove old fields without notice",
          "Return 500 for clients using old behavior"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Versioning allows clients to migrate without immediate breakage."
      },
      {
        type: "mcq",
        prompt: "What is HATEOAS?",
        options: [
          "A REST principle where responses include links to related resources or actions",
          "A compression algorithm for JSON payloads",
          "A database sharding technique",
          "A replacement for HTTPS"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "HATEOAS stands for Hypermedia as the Engine of Application State."
      },
      {
        type: "mcq",
        prompt: "A GET /products endpoint returns thousands of products and causes slow responses. What should you add?",
        options: [
          "Pagination, filtering, and possibly caching",
          "State-changing behavior in GET",
          "A rule that all clients must request all records",
          "A DELETE request before every GET"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Pagination and filtering reduce response size. Caching can help if product data is read often."
      },
      {
        type: "mcq",
        prompt: "Which statement about REST security is most accurate?",
        options: [
          "REST does not automatically secure an API; you still need HTTPS, authentication, authorization, validation, and other controls",
          "REST automatically prevents SQL injection",
          "REST APIs never need authorization",
          "Using JSON removes the need for HTTPS"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "REST is an architectural style, not a complete security solution."
      }
    ]
  }
};