export const lecture = {
  id: "lecture-14-content-delivery-networks",
  sectionId: "section-2-networking-communications",
  lectureNumber: 14,
  title: "Content Delivery Networks",
  slug: "content-delivery-networks",
  estimatedMinutes: 32,
  difficulty: "beginner",
  prerequisites: [
    "Basic understanding of the client-server model",
    "Basic understanding of DNS resolution",
    "Basic understanding of latency and network distance",
    "Basic understanding of caching",
    "Basic understanding of load balancing and reverse proxies"
  ],
  learningOutcomes: [
    "Define what a CDN is and explain why CDNs are used in system design",
    "Describe the roles of origin servers, edge servers, PoPs, and request routing systems",
    "Walk through cache hits, cache misses, TTL, and cache invalidation strategies",
    "Compare geo-based, latency-based, and load-aware CDN routing",
    "Explain how CDNs improve performance, availability, bandwidth cost, and security",
    "Identify CDN use cases for static content, dynamic content, APIs, video streaming, and edge computing",
    "Answer common CDN system design interview questions with practical trade-offs"
  ],
  sourceFiles: {
    transcript: "System Design/Section 2: Networking & Communications/14-Content-Delivery-Networks-transcript.txt",
    sectionSlides: "System Design/Section 2: Networking & Communications/00-System+Design+-+Updated+-+Section+2-Slides.txt",
    interviewQuestions: "System Design/Section 2: Networking & Communications/14-CDN+System+Design+Interview+Questions+&+Answers.txt"
  },
  sourceSummary: {
    transcriptFocus: "The transcript explains why CDNs are needed, how they use globally distributed edge servers to reduce latency, how requests are routed, how cache hits and misses work, and how CDNs provide caching, load balancing, compression, optimization, security, API acceleration, and edge computing.",
    interviewFocus: "The interview guide focuses on CDN basics, architecture, origin versus edge servers, PoPs, request routing, cache hit and miss behavior, TTL, invalidation, load balancing, failover, optimization techniques, DDoS protection, SSL/TLS offloading, multi-CDN strategies, and video streaming design.",
    slideFocus: "The relevant slides are the Content Delivery Networks section covering CDN definition, why CDNs are needed, CDN architecture, request handling, performance and security features, use cases, interview questions, and key takeaways."
  },
  lessons: [
    {
      id: "lecture-14-content-delivery-networks-lesson-1",
      title: "Why CDNs Exist",
      goal: "Understand the problem CDNs solve and the basic CDN architecture.",
      order: 1,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "Content Delivery Network",
          explanation: "A Content Delivery Network, or CDN, is a globally distributed network of servers that work together to deliver content efficiently to users. Instead of every user fetching data from one distant origin server, the CDN serves content from locations closer to the user.",
          whyItMatters: "Network distance creates latency. At global scale, even a fast origin server can feel slow if every request must travel across continents.",
          systemDesignConnection: "CDNs are usually placed in front of web applications, media services, APIs, and static asset stores to improve response time, reduce origin load, and improve availability.",
          example: "A user in India loading a website hosted in New York may experience delays without a CDN. With a CDN, static assets such as images, JavaScript, and CSS can be served from an edge server closer to India.",
          commonMisconception: "A CDN is not just a cache. Modern CDNs also perform request routing, load balancing, compression, TLS termination, DDoS mitigation, bot filtering, and sometimes edge computing."
        },
        {
          name: "The problem without a CDN",
          explanation: "Without a CDN, user requests go directly to the origin server. This can cause high latency due to geographic distance, overloaded origin servers during traffic spikes, bandwidth bottlenecks, higher data transfer costs, and weaker protection against malicious traffic.",
          whyItMatters: "A single origin server may be correct functionally, but it often fails performance and reliability expectations at global scale.",
          systemDesignConnection: "In system design interviews, CDNs are often introduced when a system needs low-latency global delivery, reduced backend load, or high-volume static content distribution.",
          example: "An e-commerce site with one origin server may become slow during a sale because every product image request hits the origin. A CDN caches those images at edge locations and avoids repeatedly loading the origin.",
          commonMisconception: "Adding more application servers in one region does not fully solve global latency. A user far away still suffers from long network round trips."
        },
        {
          name: "Origin server",
          explanation: "The origin server is the source of truth where the original content is stored. It may run in a cloud provider, a data center, or an on-premises environment.",
          whyItMatters: "The CDN needs an authoritative place to fetch content when the edge does not already have a cached copy.",
          systemDesignConnection: "The origin should be protected from unnecessary traffic. CDNs reduce origin traffic by serving cacheable content at the edge.",
          example: "A cloud storage bucket containing product images can act as the origin for a CDN.",
          commonMisconception: "The origin is not eliminated by using a CDN. It still exists and is contacted on cache misses, purges, refreshes, or uncacheable requests."
        },
        {
          name: "Edge server and PoP",
          explanation: "An edge server is a CDN server located closer to users. A PoP, or Point of Presence, is a CDN location or data center containing edge servers that cache and serve content.",
          whyItMatters: "Serving from a nearby PoP reduces the physical and network distance between user and content.",
          systemDesignConnection: "PoP placement is central to CDN design. More strategically placed PoPs can improve latency and availability for a global user base.",
          example: "A user in São Paulo may receive a cached video segment from a CDN PoP in Brazil instead of from an origin server in Virginia.",
          commonMisconception: "Nearest by geography is not always fastest. A farther PoP may be better if network latency or current load is lower."
        },
        {
          name: "Request routing system",
          explanation: "The request routing system decides which CDN edge server should handle a user request. It considers factors such as geographic location, network latency, server health, and current load.",
          whyItMatters: "The value of a CDN depends not only on caching content, but also on sending each request to the right edge location.",
          systemDesignConnection: "CDN routing can integrate with DNS, Anycast, load-aware routing, and health checks to route traffic efficiently and recover from failures.",
          example: "If the closest PoP is overloaded, the routing system may send a user to a slightly farther but healthier PoP.",
          commonMisconception: "CDN routing is not always a static nearest-location lookup. It can be dynamic and based on real-time network and server conditions."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "CDN in one sentence",
          body: "A CDN brings content closer to users by storing and serving copies from globally distributed edge servers.",
          takeaway: "Closer content usually means lower latency and faster load times."
        },
        {
          type: "concept",
          title: "The origin is the source of truth",
          body: "The origin server stores the original content. Edge servers cache copies, but they do not replace the origin as the authoritative source.",
          takeaway: "Design CDNs as a layer in front of the origin, not as a replacement for all backend infrastructure."
        },
        {
          type: "concept",
          title: "PoPs are local distribution centers",
          body: "Think of an origin server as a main warehouse and CDN PoPs as local distribution centers. Users get popular content from the nearest local center instead of waiting for the main warehouse.",
          takeaway: "This analogy helps explain origin versus edge in interviews."
        },
        {
          type: "concept",
          title: "Why CDNs matter at scale",
          body: "At small scale, direct origin delivery may work. At global scale, distance, bandwidth, traffic spikes, and attacks make direct delivery slow and fragile.",
          takeaway: "CDNs improve performance, reliability, cost efficiency, and security."
        }
      ],
      visualModels: [
        {
          title: "Without CDN vs. With CDN",
          description: "A simple comparison of request paths.",
          flow: [
            "Without CDN: User sends request across the world to the origin server",
            "Origin handles every request, including repeated static assets",
            "With CDN: User is routed to a nearby edge server that serves cached content when possible"
          ],
          learnerShouldNotice: "The CDN shortens the common request path and reduces repeated load on the origin."
        },
        {
          title: "Core CDN Architecture",
          description: "The three main CDN components work together to serve content efficiently.",
          flow: [
            "Origin server stores the original content",
            "Edge servers in PoPs cache copies near users",
            "Request routing system selects the best edge server for each request"
          ],
          learnerShouldNotice: "A CDN is both storage distribution and intelligent traffic routing."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "What is the main purpose of a CDN?",
          options: [
            "To deliver content from servers closer to users",
            "To replace all databases in an application",
            "To make DNS unnecessary",
            "To force every request to use the origin server"
          ],
          correctAnswerIndex: 0,
          explanation: "A CDN improves delivery by serving content from distributed edge servers closer to users."
        },
        {
          type: "true_false",
          prompt: "A CDN can reduce origin server load by serving cached content from edge servers.",
          correctAnswer: true,
          explanation: "When content is cached at the edge, future requests can be served without contacting the origin."
        },
        {
          type: "fill_blank",
          prompt: "The original authoritative copy of content is stored on the ____ server.",
          options: [
            "origin",
            "browser",
            "recursive resolver",
            "client"
          ],
          correctAnswerIndex: 0,
          explanation: "The origin server stores the original content and is contacted when the CDN needs to fetch or refresh content."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each CDN component to its role.",
          pairs: [
            {
              left: "Origin server",
              right: "Stores the original source-of-truth content"
            },
            {
              left: "Edge server",
              right: "Caches and serves content closer to users"
            },
            {
              left: "PoP",
              right: "A CDN location containing edge servers"
            },
            {
              left: "Request routing system",
              right: "Chooses the best edge server for a request"
            }
          ],
          explanation: "A CDN combines authoritative origin storage, distributed edge caching, and smart request routing."
        },
        {
          type: "ordering",
          prompt: "Order the basic evolution from a slow global site to a CDN-backed site.",
          items: [
            "Users worldwide send requests to one origin server",
            "Latency and origin load become problems",
            "A CDN caches content at distributed edge servers",
            "Users receive content from nearby or optimal PoPs"
          ],
          correctOrder: [
            "Users worldwide send requests to one origin server",
            "Latency and origin load become problems",
            "A CDN caches content at distributed edge servers",
            "Users receive content from nearby or optimal PoPs"
          ],
          explanation: "CDNs are introduced when direct origin delivery creates latency, load, cost, or reliability problems."
        },
        {
          type: "scenario",
          prompt: "Your news website is hosted in one US region, but readers in Asia complain that images and scripts load slowly. What is the best first improvement?",
          options: [
            "Put static assets behind a CDN with edge locations near users",
            "Store all images in the users' browsers permanently with no expiry",
            "Move the database to the client device",
            "Disable HTTPS to reduce latency"
          ],
          correctAnswerIndex: 0,
          explanation: "A CDN can cache static assets closer to Asian readers and reduce long-distance round trips."
        }
      ],
      checkpoint: {
        summary: "A CDN is a globally distributed delivery layer that uses edge servers and request routing to serve content closer to users, reduce origin load, and improve performance and availability.",
        learnerCanNow: [
          "Define a CDN",
          "Explain why direct origin delivery can be slow at global scale",
          "Identify origin servers, edge servers, PoPs, and request routing systems",
          "Describe why geographic distance affects latency"
        ],
        explainInYourOwnWords: "Imagine a user far from the origin server. Explain how a CDN changes the path of the request and why that improves performance."
      }
    },
    {
      id: "lecture-14-content-delivery-networks-lesson-2",
      title: "Cache Hits, Misses, TTL, and Invalidation",
      goal: "Learn how CDNs cache content, keep it fresh, and handle cache updates.",
      order: 2,
      estimatedMinutes: 7,
      concepts: [
        {
          name: "CDN request lifecycle",
          explanation: "When a user requests content, the CDN routes the request to an edge server. If the edge has the content, it serves it immediately. If not, it fetches the content from the origin, returns it to the user, and stores a copy for future requests.",
          whyItMatters: "This lifecycle is the core mechanism behind CDN performance improvements.",
          systemDesignConnection: "In a system design interview, you should be able to walk through a CDN request step by step, including what happens on cache hits and cache misses.",
          example: "The first user requesting a new product image may trigger a cache miss. The CDN fetches it from the origin. The next user requesting the same image gets a fast cache hit from the edge.",
          commonMisconception: "A cache miss does not mean the CDN failed. It means the CDN did not yet have the object or the object expired, so it must fetch it from the origin."
        },
        {
          name: "Cache hit",
          explanation: "A cache hit occurs when the requested content is already available in the edge server cache. The edge server can return the content directly to the user.",
          whyItMatters: "Cache hits are what reduce latency, bandwidth usage, and origin server load.",
          systemDesignConnection: "High cache hit ratio is an important CDN performance metric. Better cacheability usually means better CDN effectiveness.",
          example: "A logo image requested by millions of users is likely to be served as a cache hit from many CDN PoPs.",
          commonMisconception: "A cache hit is not always correct if freshness rules are wrong. Serving stale or private data from cache can be dangerous."
        },
        {
          name: "Cache miss",
          explanation: "A cache miss occurs when the requested content is not available in the CDN edge cache. The CDN forwards the request to the origin server, retrieves the content, serves it to the user, and may cache it for future requests.",
          whyItMatters: "Cache misses are slower and increase origin load, but they are necessary for new, expired, or uncached content.",
          systemDesignConnection: "Systems with many unique URLs, personalized responses, or low reuse may have poor cache hit ratios unless caching strategy is carefully designed.",
          example: "A personalized account balance page should usually miss or bypass shared CDN caching because it is user-specific.",
          commonMisconception: "Caching everything aggressively is not always good. User-specific or frequently changing data can create correctness and privacy problems."
        },
        {
          name: "TTL",
          explanation: "TTL, or Time To Live, defines how long an object remains valid in the CDN cache before it must be refreshed or revalidated.",
          whyItMatters: "TTL balances freshness and performance. Longer TTL improves cache hits, while shorter TTL reduces the chance of stale content.",
          systemDesignConnection: "Choosing TTL is a design decision. Static assets can often use long TTLs, while dynamic responses need short TTLs or revalidation.",
          example: "A versioned JavaScript file can be cached for weeks. A stock price API response may need a TTL of seconds or no shared caching at all.",
          commonMisconception: "TTL is not the same for all content. Different content types should have different caching policies."
        },
        {
          name: "Cache invalidation",
          explanation: "Cache invalidation is the process of removing or refreshing cached content before or when it becomes outdated. Common approaches include manual purge, stale-while-revalidate, HTTP cache-control headers, and versioned asset URLs.",
          whyItMatters: "The hardest part of caching is not storing data; it is keeping cached data fresh enough for the product requirements.",
          systemDesignConnection: "Interviewers often test whether you can discuss stale data, freshness, purge delays, and cache-control trade-offs.",
          example: "If a company updates a product image before its TTL expires, it can manually purge that image or deploy it as image_v2.png so users fetch the new version.",
          commonMisconception: "Invalidation is instant everywhere in all cases. In real systems, global purges can take time and require careful design."
        },
        {
          name: "Stale-while-revalidate",
          explanation: "Stale-while-revalidate is a caching strategy where the CDN can serve an expired cached response immediately while it asynchronously checks the origin for a fresh version.",
          whyItMatters: "It improves perceived performance while still allowing the cache to refresh in the background.",
          systemDesignConnection: "This pattern is useful when slightly stale content is acceptable, such as news lists, catalog pages, or public metadata.",
          example: "A user gets the old homepage quickly, while the CDN fetches the updated homepage from the origin so the next user sees the fresh version.",
          commonMisconception: "Stale-while-revalidate is not appropriate for all data. It should not be used for highly sensitive or strongly consistent information like bank balances."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Cache hit = fast path",
          body: "If the edge server already has the requested object and it is valid, it responds directly without contacting the origin.",
          takeaway: "Cache hits are the main performance win."
        },
        {
          type: "concept",
          title: "Cache miss = origin fetch",
          body: "If the edge does not have the object, the CDN fetches it from the origin and may store it for future users.",
          takeaway: "The first request may be slower, but later repeated requests can be fast."
        },
        {
          type: "concept",
          title: "TTL is a freshness dial",
          body: "A long TTL gives more cache hits but risks stale content. A short TTL improves freshness but creates more origin traffic.",
          takeaway: "TTL is a trade-off, not a fixed rule."
        },
        {
          type: "concept",
          title: "Invalidate carefully",
          body: "Manual purges, cache-control headers, stale-while-revalidate, and versioned URLs all help update cached content.",
          takeaway: "Good CDN design includes a plan for content changes."
        }
      ],
      visualModels: [
        {
          title: "Cache Hit Path",
          description: "The fastest CDN path.",
          flow: [
            "User requests content",
            "CDN routes request to an edge server",
            "Edge cache contains valid content and returns it immediately"
          ],
          learnerShouldNotice: "The origin server is skipped, reducing latency and backend load."
        },
        {
          title: "Cache Miss Path",
          description: "The path when the edge server does not have the content.",
          flow: [
            "User requests content from CDN",
            "Edge cache does not contain the object or the object expired",
            "CDN fetches from origin, serves the user, and stores a copy at the edge"
          ],
          learnerShouldNotice: "A cache miss is slower, but it warms the cache for future requests."
        },
        {
          title: "Freshness Trade-off",
          description: "TTL controls the balance between speed and correctness.",
          flow: [
            "Long TTL: fewer origin requests and faster responses",
            "Short TTL: fresher content but more origin traffic",
            "Invalidation: refresh content before TTL expires when needed"
          ],
          learnerShouldNotice: "Caching is a product and correctness decision, not just an infrastructure choice."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "What happens during a CDN cache miss?",
          options: [
            "The CDN fetches the content from the origin server and may cache it",
            "The CDN deletes the origin server",
            "The browser must resolve DNS again forever",
            "The request is always rejected"
          ],
          correctAnswerIndex: 0,
          explanation: "On a cache miss, the edge server forwards the request to the origin, retrieves the content, and usually stores it for future requests."
        },
        {
          type: "true_false",
          prompt: "A longer TTL generally improves cache hit ratio but can increase the risk of stale content.",
          correctAnswer: true,
          explanation: "Long TTLs keep content cached longer, but updates at the origin may not appear until the cache refreshes or is invalidated."
        },
        {
          type: "fill_blank",
          prompt: "The strategy that serves expired cached content while refreshing it in the background is called ____.",
          options: [
            "stale-while-revalidate",
            "round-robin DNS",
            "SSL offloading",
            "bot mitigation"
          ],
          correctAnswerIndex: 0,
          explanation: "Stale-while-revalidate serves a stale response quickly while asynchronously checking for a fresh version."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each caching term to its meaning.",
          pairs: [
            {
              left: "Cache hit",
              right: "Requested content is found at the edge"
            },
            {
              left: "Cache miss",
              right: "Requested content must be fetched from the origin"
            },
            {
              left: "TTL",
              right: "How long cached content is considered valid"
            },
            {
              left: "Manual purge",
              right: "Explicitly removing outdated content from CDN cache"
            }
          ],
          explanation: "These terms describe the core CDN caching lifecycle and freshness controls."
        },
        {
          type: "ordering",
          prompt: "Order the cache miss flow.",
          items: [
            "User requests content",
            "Edge server checks its cache",
            "Content is missing or expired",
            "CDN fetches content from origin",
            "CDN serves the user and stores the content at the edge"
          ],
          correctOrder: [
            "User requests content",
            "Edge server checks its cache",
            "Content is missing or expired",
            "CDN fetches content from origin",
            "CDN serves the user and stores the content at the edge"
          ],
          explanation: "On a miss, the CDN goes to the origin and then uses the response to warm the edge cache."
        },
        {
          type: "scenario",
          prompt: "You deploy a new CSS file but users still receive the old version from the CDN. What is the best cache-safe strategy?",
          options: [
            "Use versioned asset filenames or purge the old cached file",
            "Disable all caching for the entire website forever",
            "Move CSS generation into the database",
            "Ask users to change their IP address"
          ],
          correctAnswerIndex: 0,
          explanation: "Versioning assets such as app.v2.css or purging old content forces the CDN to fetch the updated file."
        }
      ],
      checkpoint: {
        summary: "CDN caching works through cache hits and cache misses. TTL controls how long objects stay valid, while invalidation strategies keep cached content fresh when the origin changes.",
        learnerCanNow: [
          "Explain cache hit and cache miss behavior",
          "Describe how an edge server warms its cache",
          "Use TTL to reason about freshness and performance",
          "Compare manual purge, versioning, cache-control headers, and stale-while-revalidate"
        ],
        explainInYourOwnWords: "Explain why static assets can usually have longer TTLs than personalized API responses."
      }
    },
    {
      id: "lecture-14-content-delivery-networks-lesson-3",
      title: "Routing, Load Balancing, and Failover",
      goal: "Understand how CDNs choose the best edge location and keep traffic flowing during load spikes or failures.",
      order: 3,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "CDN load balancing",
          explanation: "CDN load balancing distributes requests across multiple edge servers or PoPs instead of overloading one location or sending everything to the origin.",
          whyItMatters: "High traffic can overload individual servers. Distributing load keeps response times stable and improves availability.",
          systemDesignConnection: "CDNs act as a global traffic management layer. They can balance load across PoPs and reduce pressure on backend services.",
          example: "During a product launch, requests for product images can be spread across several CDN PoPs rather than all hitting one origin server.",
          commonMisconception: "CDN load balancing is not only about application servers. It also balances traffic across edge locations and cache infrastructure."
        },
        {
          name: "Geo-based routing",
          explanation: "Geo-based routing directs users to a PoP based on their geographic location, often choosing the closest available CDN location.",
          whyItMatters: "Geographic closeness often reduces latency because packets travel a shorter physical distance.",
          systemDesignConnection: "Geo-based routing is easy to reason about and commonly used for global web delivery, but it should be combined with health and performance checks.",
          example: "A user in Germany may be routed to a Frankfurt or Amsterdam PoP instead of a US PoP.",
          commonMisconception: "Closest geography is not guaranteed to be fastest because internet routing, peering, congestion, and PoP health also matter."
        },
        {
          name: "Latency-based routing",
          explanation: "Latency-based routing sends users to the PoP with the fastest measured or estimated response time, based on current network conditions.",
          whyItMatters: "Real-time network performance can differ from geographic distance. Latency-based routing adapts to actual conditions.",
          systemDesignConnection: "This strategy is useful for global systems where user experience depends on low response time, such as streaming, gaming, and interactive APIs.",
          example: "A user in one city may be routed to a farther PoP because the closer PoP has poor network conditions at that moment.",
          commonMisconception: "Latency-based routing does not mean the CDN calculates a perfect route for every packet. It selects a better serving location based on measurements and routing policies."
        },
        {
          name: "Load-aware routing",
          explanation: "Load-aware routing considers current server or PoP load and sends traffic to less busy edge locations when needed.",
          whyItMatters: "The nearest or lowest-latency PoP can still become overloaded. Load-aware routing prevents hot spots.",
          systemDesignConnection: "For high-traffic systems, load-aware routing helps avoid cascading failures where one saturated PoP slows down and causes retries that create even more load.",
          example: "If a regional PoP is overloaded during a live sports event, some users may be routed to another nearby PoP with more capacity.",
          commonMisconception: "Load-aware routing may intentionally choose a not-nearest PoP. That can be correct if it provides better overall performance."
        },
        {
          name: "Failover handling",
          explanation: "Failover handling redirects traffic away from unhealthy or failed CDN servers to the next best available server or PoP.",
          whyItMatters: "Failures are inevitable. Automatic failover helps keep content available even when a PoP, edge server, or route has problems.",
          systemDesignConnection: "High availability requires health checks, redundant PoPs, and routing policies that avoid failed locations.",
          example: "If a PoP in one city goes down, the CDN can route users to another regional PoP with minimal disruption.",
          commonMisconception: "A CDN does not make failures impossible. It reduces user impact by rerouting and absorbing failures."
        },
        {
          name: "Anycast and global routing",
          explanation: "Many CDNs use network-level techniques such as Anycast, where the same IP address is advertised from multiple locations and users are routed to a nearby or network-preferred PoP.",
          whyItMatters: "Anycast can simplify global routing and help absorb traffic spikes or attacks across multiple PoPs.",
          systemDesignConnection: "Anycast is often discussed in advanced CDN, DNS, and DDoS mitigation conversations.",
          example: "A CDN may advertise the same IP from many locations so users naturally reach a close CDN edge via internet routing.",
          commonMisconception: "Anycast by itself is not the whole CDN. It is one routing technique combined with caching, health checks, and traffic management."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Routing is a performance feature",
          body: "A CDN does not only store content. It also decides where each request should go.",
          takeaway: "Good request routing can be as important as caching."
        },
        {
          type: "concept",
          title: "Three common routing strategies",
          body: "Geo-based routing uses location, latency-based routing uses measured speed, and load-aware routing uses current capacity.",
          takeaway: "Each strategy optimizes for a different signal."
        },
        {
          type: "concept",
          title: "Failover keeps service available",
          body: "If one PoP fails, the CDN can reroute users to another healthy PoP.",
          takeaway: "CDNs improve availability by avoiding unhealthy edge locations."
        },
        {
          type: "concept",
          title: "Nearest is not always best",
          body: "The closest PoP may be overloaded, unhealthy, or connected through a poor network path.",
          takeaway: "Modern CDNs often combine geography, latency, load, and health."
        }
      ],
      visualModels: [
        {
          title: "Request Routing Decision",
          description: "A CDN chooses an edge location using multiple signals.",
          flow: [
            "User makes a request to a CDN-backed domain",
            "CDN evaluates location, latency, PoP health, and server load",
            "Request is routed to the best available edge server"
          ],
          learnerShouldNotice: "The chosen edge server is the best according to routing policy, not always the geographically closest."
        },
        {
          title: "Failover Flow",
          description: "How traffic moves when a PoP is unhealthy.",
          flow: [
            "Health checks detect a failing or overloaded PoP",
            "Routing system removes or deprioritizes the unhealthy PoP",
            "Users are redirected to the next best healthy PoP"
          ],
          learnerShouldNotice: "Failover depends on monitoring and routing decisions, not manual intervention during every outage."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which routing strategy sends users to the PoP with the fastest response time based on current network conditions?",
          options: [
            "Latency-based routing",
            "Manual purge routing",
            "Version-based routing",
            "Database sharding"
          ],
          correctAnswerIndex: 0,
          explanation: "Latency-based routing uses actual or estimated response times to choose the best PoP."
        },
        {
          type: "true_false",
          prompt: "A CDN should always route a user to the geographically closest PoP, regardless of load or health.",
          correctAnswer: false,
          explanation: "The closest PoP may be overloaded or unhealthy. CDNs often consider latency, load, and health as well."
        },
        {
          type: "fill_blank",
          prompt: "When a CDN redirects traffic away from a failed PoP to another healthy PoP, this is called ____.",
          options: [
            "failover",
            "minification",
            "cache poisoning",
            "lazy loading"
          ],
          correctAnswerIndex: 0,
          explanation: "Failover keeps service available by routing around failed infrastructure."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each routing strategy to the signal it mainly uses.",
          pairs: [
            {
              left: "Geo-based routing",
              right: "User or region location"
            },
            {
              left: "Latency-based routing",
              right: "Fastest measured response time"
            },
            {
              left: "Load-aware routing",
              right: "Current traffic or server capacity"
            },
            {
              left: "Failover",
              right: "Health status of servers or PoPs"
            }
          ],
          explanation: "CDNs combine these signals to pick a reliable and fast edge server."
        },
        {
          type: "ordering",
          prompt: "Order the steps in CDN failover.",
          items: [
            "A PoP becomes unhealthy",
            "Health checks or monitoring detect the issue",
            "Routing system stops sending traffic to the bad PoP",
            "Users are routed to another healthy PoP"
          ],
          correctOrder: [
            "A PoP becomes unhealthy",
            "Health checks or monitoring detect the issue",
            "Routing system stops sending traffic to the bad PoP",
            "Users are routed to another healthy PoP"
          ],
          explanation: "Automatic failover depends on detecting problems and updating routing decisions."
        },
        {
          type: "scenario",
          prompt: "A CDN PoP closest to a city is healthy but overloaded during a live event. What routing strategy helps most?",
          options: [
            "Load-aware routing to shift some requests to less busy PoPs",
            "Longer database transactions",
            "Disabling cache headers",
            "Routing all users to the origin server"
          ],
          correctAnswerIndex: 0,
          explanation: "Load-aware routing prevents congestion by distributing traffic away from overloaded PoPs."
        }
      ],
      checkpoint: {
        summary: "CDNs use intelligent routing and load balancing to select the best edge location based on geography, latency, load, and health. Failover keeps content available when edge infrastructure fails.",
        learnerCanNow: [
          "Explain geo-based, latency-based, and load-aware routing",
          "Describe how CDN failover works",
          "Recognize why nearest is not always best",
          "Connect CDN routing to system availability"
        ],
        explainInYourOwnWords: "Explain why a CDN might route a user to a farther PoP even when a closer PoP exists."
      }
    },
    {
      id: "lecture-14-content-delivery-networks-lesson-4",
      title: "Optimization and Security at the Edge",
      goal: "Learn how CDNs improve payload efficiency and protect systems from attacks.",
      order: 4,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "Compression",
          explanation: "Compression reduces the size of text-based responses before they are sent to users. CDNs commonly support gzip and Brotli compression.",
          whyItMatters: "Smaller payloads download faster and consume less bandwidth.",
          systemDesignConnection: "Compression is especially valuable for HTML, CSS, JavaScript, JSON, and API responses because these formats often compress well.",
          example: "A 500 KB JavaScript file may be compressed to a much smaller transfer size before reaching the browser.",
          commonMisconception: "Compression does not help all data equally. Already-compressed formats such as many images and videos may not shrink much with gzip."
        },
        {
          name: "Minification and bundling",
          explanation: "Minification removes unnecessary characters such as whitespace and comments from CSS and JavaScript. Bundling combines files to reduce request overhead when appropriate.",
          whyItMatters: "Smaller and fewer assets can improve page load time, especially over high-latency networks.",
          systemDesignConnection: "CDNs and build pipelines often work together: applications generate optimized assets, and the CDN distributes them globally.",
          example: "A CDN can serve minified app.min.js instead of a larger development JavaScript file.",
          commonMisconception: "Bundling is always beneficial. With modern HTTP/2 and HTTP/3, too much bundling can reduce caching flexibility or delay loading critical code."
        },
        {
          name: "Image and video optimization",
          explanation: "CDNs can optimize media by converting images to efficient formats such as WebP or AVIF, resizing images for device needs, lazy loading assets, and supporting video delivery patterns such as segmented streaming.",
          whyItMatters: "Media files often dominate page weight. Optimizing them can drastically improve user experience and reduce bandwidth cost.",
          systemDesignConnection: "At scale, image and video optimization can save large amounts of traffic cost and improve performance across devices and networks.",
          example: "A mobile user can receive a smaller WebP version of a product image instead of a large desktop JPEG.",
          commonMisconception: "Serving the same full-resolution image to every device is efficient. In reality, device-aware optimization is usually better."
        },
        {
          name: "DDoS mitigation",
          explanation: "CDNs help protect applications from distributed denial-of-service attacks by absorbing traffic across many PoPs and applying rate limiting, traffic filtering, anomaly detection, and sometimes Anycast routing.",
          whyItMatters: "DDoS attacks try to overwhelm infrastructure. A CDN can block or absorb malicious traffic before it reaches the origin.",
          systemDesignConnection: "Placing a CDN in front of public endpoints can protect the origin from direct exposure and reduce attack impact.",
          example: "If a botnet sends millions of requests, the CDN can filter obvious malicious traffic and rate limit abusive sources.",
          commonMisconception: "A CDN makes DDoS risk disappear completely. It reduces risk, but configuration, origin shielding, WAF rules, and monitoring still matter."
        },
        {
          name: "SSL/TLS termination and offloading",
          explanation: "SSL/TLS termination means the CDN handles encrypted HTTPS connections at the edge. This can reduce cryptographic workload on the origin and secure traffic between user and edge.",
          whyItMatters: "Encryption protects sensitive data in transit, and offloading can improve origin efficiency.",
          systemDesignConnection: "Many production systems terminate TLS at a CDN or reverse proxy, then use secure connections from CDN to origin as well.",
          example: "A user submits login credentials over HTTPS to a CDN edge, which handles the TLS handshake and forwards the request securely to the backend.",
          commonMisconception: "TLS termination at the CDN means origin traffic can safely be unencrypted in every case. Sensitive systems should usually also encrypt CDN-to-origin traffic."
        },
        {
          name: "Bot mitigation and WAF",
          explanation: "CDNs may provide bot mitigation and Web Application Firewall features to detect suspicious clients, block malicious patterns, and enforce security policies at the edge.",
          whyItMatters: "Stopping bad traffic near the edge reduces risk and saves backend resources.",
          systemDesignConnection: "A CDN security layer can protect APIs and websites from scraping, credential stuffing, common web attacks, and abusive request patterns.",
          example: "A CDN can challenge suspicious login traffic or block known malicious IP ranges before requests hit the application.",
          commonMisconception: "A WAF replaces secure application code. It is a defense-in-depth layer, not a substitute for proper authentication, authorization, validation, and patching."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "CDNs shrink payloads",
          body: "Compression, minification, image conversion, and responsive media reduce the number of bytes sent to users.",
          takeaway: "Less data usually means faster delivery and lower cost."
        },
        {
          type: "concept",
          title: "Security starts at the edge",
          body: "CDNs can block, filter, rate limit, and absorb malicious traffic before it reaches the origin.",
          takeaway: "Edge security protects both users and backend infrastructure."
        },
        {
          type: "concept",
          title: "TLS offloading reduces origin work",
          body: "When the CDN handles TLS handshakes at the edge, origin servers can spend less CPU on encryption setup.",
          takeaway: "TLS offloading improves efficiency while preserving encrypted user connections."
        },
        {
          type: "concept",
          title: "Optimization has trade-offs",
          body: "Aggressive bundling, compression, or caching can sometimes hurt freshness, debugging, or device-specific behavior.",
          takeaway: "Optimize based on measurement and product requirements."
        }
      ],
      visualModels: [
        {
          title: "Edge Optimization Pipeline",
          description: "A CDN can transform content before delivery.",
          flow: [
            "Origin provides HTML, CSS, JavaScript, images, or API responses",
            "CDN compresses, minifies, resizes, or converts content when configured",
            "User receives a smaller or better-suited response"
          ],
          learnerShouldNotice: "The CDN can improve delivery without every optimization happening in the origin application."
        },
        {
          title: "Edge Security Shield",
          description: "The CDN acts as a protective layer in front of the origin.",
          flow: [
            "User and attacker traffic reaches CDN edge first",
            "CDN applies TLS, rate limits, WAF rules, bot checks, and filtering",
            "Only allowed traffic continues to the origin"
          ],
          learnerShouldNotice: "The origin should not be directly exposed when edge protection is part of the design."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which CDN feature reduces the size of text-based files such as HTML, CSS, JavaScript, and JSON?",
          options: [
            "Gzip or Brotli compression",
            "Manual DNS registration",
            "Database replication",
            "Cache poisoning"
          ],
          correctAnswerIndex: 0,
          explanation: "Gzip and Brotli are common compression algorithms used to reduce text payload sizes."
        },
        {
          type: "true_false",
          prompt: "CDNs can help mitigate DDoS attacks by rate limiting, filtering traffic, and absorbing traffic across multiple PoPs.",
          correctAnswer: true,
          explanation: "CDNs are often used as an edge defense layer for DDoS mitigation."
        },
        {
          type: "fill_blank",
          prompt: "When the CDN handles HTTPS encryption work at the edge, this is often called SSL/TLS ____.",
          options: [
            "offloading",
            "sharding",
            "pagination",
            "normalization"
          ],
          correctAnswerIndex: 0,
          explanation: "SSL/TLS offloading means the CDN or proxy handles encryption and decryption work instead of placing all of that burden on the origin."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each CDN capability to its benefit.",
          pairs: [
            {
              left: "Gzip/Brotli",
              right: "Reduce text payload size"
            },
            {
              left: "WebP/AVIF conversion",
              right: "Improve image delivery efficiency"
            },
            {
              left: "Rate limiting",
              right: "Reduce abusive request volume"
            },
            {
              left: "TLS termination",
              right: "Handle encrypted connections at the edge"
            }
          ],
          explanation: "CDNs combine performance optimization and security controls at the edge."
        },
        {
          type: "ordering",
          prompt: "Order the edge security flow.",
          items: [
            "Client request reaches CDN edge",
            "CDN evaluates TLS, WAF, bot, and rate-limit rules",
            "Malicious or abusive traffic is blocked or challenged",
            "Allowed traffic is forwarded to the origin or served from cache"
          ],
          correctOrder: [
            "Client request reaches CDN edge",
            "CDN evaluates TLS, WAF, bot, and rate-limit rules",
            "Malicious or abusive traffic is blocked or challenged",
            "Allowed traffic is forwarded to the origin or served from cache"
          ],
          explanation: "A CDN security layer filters traffic before it consumes origin resources."
        },
        {
          type: "scenario",
          prompt: "Your image-heavy marketplace has high bandwidth costs and slow mobile page loads. Which CDN feature is most directly helpful?",
          options: [
            "Image resizing and conversion to efficient formats like WebP or AVIF",
            "Longer database locks",
            "Removing all cache headers",
            "Routing every image request to the origin"
          ],
          correctAnswerIndex: 0,
          explanation: "Media optimization can reduce payload size and improve performance, especially for mobile users."
        }
      ],
      checkpoint: {
        summary: "CDNs improve performance through compression, minification, and media optimization, and they improve security through DDoS mitigation, TLS offloading, WAF rules, traffic filtering, and bot mitigation.",
        learnerCanNow: [
          "Name common CDN optimization techniques",
          "Explain how compression and media optimization reduce bandwidth",
          "Describe DDoS mitigation at the CDN layer",
          "Explain SSL/TLS offloading and its trade-offs",
          "Understand CDN security as defense in depth"
        ],
        explainInYourOwnWords: "Explain how a CDN can both speed up a website and protect its origin server at the same time."
      }
    },
    {
      id: "lecture-14-content-delivery-networks-lesson-5",
      title: "Use Cases, Trade-offs, and Interview Thinking",
      goal: "Apply CDNs to real system design scenarios and prepare for interview questions.",
      order: 5,
      estimatedMinutes: 7,
      concepts: [
        {
          name: "Static content delivery",
          explanation: "Static content includes files that do not change often, such as images, videos, CSS, JavaScript, fonts, and HTML files. These are usually excellent CDN candidates.",
          whyItMatters: "Static assets are often requested repeatedly by many users, so caching them at the edge creates high cache hit rates.",
          systemDesignConnection: "For most web systems, the first CDN use case is static asset delivery because it is simple, safe, and high impact.",
          example: "An e-commerce site can cache product images at the CDN because product images usually change less frequently than inventory or pricing data.",
          commonMisconception: "Static content never changes. It can change, but usually less often, and versioning or purge strategies can handle updates."
        },
        {
          name: "Dynamic content and API acceleration",
          explanation: "Dynamic content includes personalized pages and API responses that may change frequently or vary by user. CDNs can still help by compressing responses, routing requests efficiently, caching carefully selected responses, and keeping connections optimized.",
          whyItMatters: "Modern applications rely heavily on APIs, and API latency directly affects user experience.",
          systemDesignConnection: "For dynamic content, cache keys, authorization, privacy, TTL, and invalidation must be designed carefully.",
          example: "A banking app should not cache private account balances in a shared CDN cache, but it may use the CDN for TLS termination, fastest-path routing, rate limiting, and static assets.",
          commonMisconception: "CDNs are useless for dynamic content. Even when caching is limited, CDNs can still optimize routing, compression, connection reuse, and security."
        },
        {
          name: "Edge computing",
          explanation: "Edge computing moves lightweight processing closer to users, often at CDN edge locations. Instead of sending every request to the origin, some logic can run near the user.",
          whyItMatters: "Processing at the edge can reduce latency and offload work from centralized infrastructure.",
          systemDesignConnection: "Edge computing is useful for personalization, authentication checks, redirects, A/B testing, request transformation, image resizing, and some media processing.",
          example: "A video platform might use edge servers to perform lightweight real-time video transformations or select the best stream variant for a user device.",
          commonMisconception: "Edge computing means moving the entire backend to the CDN. In practice, edge logic is usually lightweight and latency-sensitive."
        },
        {
          name: "Video streaming with CDNs",
          explanation: "Video streaming platforms use CDNs to cache video chunks near users, support adaptive bitrate streaming, and distribute massive viewer load across edge locations.",
          whyItMatters: "Video is bandwidth-heavy. Without CDN caching and distribution, origin servers and networks can be overwhelmed.",
          systemDesignConnection: "A large-scale video design should mention segmented caching, adaptive bitrate streaming, load balancing, origin shielding, and regional PoP capacity.",
          example: "A streaming service stores popular video segments at PoPs so millions of viewers do not all fetch the same chunks from origin storage.",
          commonMisconception: "A video is always served as one giant file. Modern streaming usually uses many small chunks at different bitrates."
        },
        {
          name: "Multi-CDN architecture",
          explanation: "A multi-CDN architecture uses more than one CDN provider to improve redundancy, performance, bargaining power, or regional coverage.",
          whyItMatters: "A single CDN provider can suffer outages or poor performance in specific regions.",
          systemDesignConnection: "Multi-CDN designs can use DNS, traffic managers, real-time monitoring, or application logic to shift traffic between providers.",
          example: "A global streaming company may route North America through one CDN and parts of Asia through another based on performance and cost.",
          commonMisconception: "Multi-CDN is always necessary. It adds complexity and is usually justified only at larger scale or higher availability requirements."
        },
        {
          name: "CDN trade-offs and challenges",
          explanation: "CDNs introduce trade-offs around cache invalidation, stale content, privacy, cost, debugging complexity, vendor lock-in, and configuration mistakes.",
          whyItMatters: "CDNs improve many systems, but incorrect caching rules can serve outdated, incorrect, or private data.",
          systemDesignConnection: "Strong system design answers mention both benefits and risks, including how to mitigate them with cache-control, versioning, observability, origin shielding, and security policies.",
          example: "A misconfigured CDN that caches authenticated API responses without varying by user can leak private data.",
          commonMisconception: "A CDN is a simple on/off performance switch. It is a powerful layer that must be configured and monitored carefully."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "Best first CDN use case",
          body: "Static assets such as images, CSS, JavaScript, videos, and fonts are usually the safest and highest-impact CDN candidates.",
          takeaway: "Start with highly reusable, low-risk content."
        },
        {
          type: "concept",
          title: "Dynamic content needs care",
          body: "APIs and personalized pages may still benefit from CDNs, but cache rules must consider user identity, freshness, and privacy.",
          takeaway: "Never blindly cache user-specific data."
        },
        {
          type: "concept",
          title: "Edge computing brings logic closer",
          body: "Modern CDNs can run lightweight functions at the edge, reducing round trips to the origin.",
          takeaway: "Edge computing is useful for small, latency-sensitive tasks."
        },
        {
          type: "concept",
          title: "Interview mindset",
          body: "When discussing CDNs, cover latency, origin load, caching strategy, routing, failover, security, costs, and invalidation.",
          takeaway: "A strong CDN answer includes both benefits and trade-offs."
        }
      ],
      visualModels: [
        {
          title: "CDN Use Case Spectrum",
          description: "Different content types require different CDN strategies.",
          flow: [
            "Static assets: cache aggressively with long TTL and versioning",
            "Public dynamic data: cache carefully with short TTL or stale-while-revalidate",
            "Private dynamic data: avoid shared caching; use routing, compression, TLS, and security features"
          ],
          learnerShouldNotice: "The more personalized or frequently changing the content is, the more careful the caching strategy must be."
        },
        {
          title: "Video CDN Model",
          description: "A high-level video streaming delivery path.",
          flow: [
            "Origin stores video files split into chunks and bitrate variants",
            "Popular chunks are cached in CDN PoPs",
            "Players request chunks from nearby edge servers and switch quality based on bandwidth"
          ],
          learnerShouldNotice: "CDNs are essential for bandwidth-heavy, globally distributed video workloads."
        },
        {
          title: "Multi-CDN Decision Model",
          description: "How large systems may choose between multiple CDN providers.",
          flow: [
            "Monitor CDN performance, cost, and availability by region",
            "Route traffic to the best provider for each region or condition",
            "Fail over to another CDN during provider outages"
          ],
          learnerShouldNotice: "Multi-CDN improves resilience but adds operational complexity."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which content type is usually the easiest and safest to cache aggressively on a CDN?",
          options: [
            "Versioned static assets like images, CSS, and JavaScript",
            "Private bank account balances",
            "One-time password generation responses",
            "Highly personalized checkout sessions"
          ],
          correctAnswerIndex: 0,
          explanation: "Versioned static assets are reusable and less likely to create privacy or correctness issues."
        },
        {
          type: "true_false",
          prompt: "CDNs can help APIs even when the API response itself cannot be cached.",
          correctAnswer: true,
          explanation: "CDNs can still provide optimized routing, TLS termination, compression, rate limiting, and security filtering."
        },
        {
          type: "fill_blank",
          prompt: "Running lightweight logic closer to users at CDN locations is commonly called ____ computing.",
          options: [
            "edge",
            "batch",
            "offline",
            "relational"
          ],
          correctAnswerIndex: 0,
          explanation: "Edge computing processes some work near the user instead of sending every request to the origin."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each use case to a CDN design consideration.",
          pairs: [
            {
              left: "Static assets",
              right: "Long TTL and versioned filenames"
            },
            {
              left: "Personalized API response",
              right: "Avoid shared caching unless carefully keyed and authorized"
            },
            {
              left: "Video streaming",
              right: "Segmented caching and adaptive bitrate delivery"
            },
            {
              left: "Multi-CDN",
              right: "Provider failover and regional traffic steering"
            }
          ],
          explanation: "Different workloads use CDNs differently. The cache and routing strategy should match the content type."
        },
        {
          type: "ordering",
          prompt: "Order a practical CDN rollout for an existing web app.",
          items: [
            "Identify cacheable static assets",
            "Configure CDN distribution and origin",
            "Set cache-control headers, TTLs, and versioning",
            "Add monitoring for cache hit ratio, latency, errors, and origin load",
            "Expand carefully to APIs or dynamic content if appropriate"
          ],
          correctOrder: [
            "Identify cacheable static assets",
            "Configure CDN distribution and origin",
            "Set cache-control headers, TTLs, and versioning",
            "Add monitoring for cache hit ratio, latency, errors, and origin load",
            "Expand carefully to APIs or dynamic content if appropriate"
          ],
          explanation: "A safe rollout starts with low-risk cacheable assets, then adds observability and expands carefully."
        },
        {
          type: "scenario",
          prompt: "You are designing a global video streaming platform. Which CDN strategy is most important?",
          options: [
            "Cache video chunks at edge PoPs and use adaptive bitrate streaming",
            "Serve every full video file from a single origin server",
            "Disable compression and caching for all media",
            "Store user passwords inside video chunks"
          ],
          correctAnswerIndex: 0,
          explanation: "Video streaming needs edge caching, chunked delivery, adaptive bitrate, and load distribution to handle scale and network variation."
        }
      ],
      checkpoint: {
        summary: "CDNs are used for static assets, dynamic content optimization, API acceleration, edge computing, and video streaming. They introduce trade-offs around freshness, privacy, cost, observability, and operational complexity.",
        learnerCanNow: [
          "Choose good CDN candidates in a system design",
          "Explain how CDNs help APIs and dynamic content",
          "Describe edge computing at a high level",
          "Discuss CDN trade-offs and risks",
          "Frame CDN decisions in an interview-ready way"
        ],
        explainInYourOwnWords: "Explain how you would use a CDN differently for product images, public API responses, private user data, and video streaming."
      }
    }
  ],
  interviewPrep: {
    questions: [
      {
        question: "What is a CDN, and how does it work?",
        whatInterviewerLooksFor: "A clear definition, mention of edge servers or PoPs, request routing, cache hit and cache miss behavior, and why this reduces latency and origin load.",
        strongAnswer: "A CDN is a globally distributed network of servers that delivers content from locations closer to users. When a user requests content, the CDN routes the request to an appropriate edge server based on factors such as geography, latency, server health, and load. If the content is cached at the edge, it is served immediately as a cache hit. If it is not cached, the edge fetches it from the origin server, serves it to the user, and may store it for future requests. This reduces latency, lowers origin load, improves availability, and can add security controls.",
        answerStructure: [
          "Define CDN as a distributed edge delivery network",
          "Explain request routing to a PoP and cache hit versus miss",
          "Conclude with benefits: lower latency, lower origin load, availability, and security"
        ],
        commonMistakes: [
          "Saying a CDN is only a cache",
          "Ignoring the origin server",
          "Not explaining cache misses",
          "Assuming the geographically closest server is always selected"
        ],
        followUps: [
          "What is a PoP?",
          "What happens on a cache miss?",
          "How does the CDN decide which edge server to use?"
        ]
      },
      {
        question: "Why do we need CDNs in system design?",
        whatInterviewerLooksFor: "Awareness of global latency, origin overload, bandwidth cost, availability, and security concerns.",
        strongAnswer: "Without a CDN, every user request goes to the origin server. For global users, this creates high latency because data travels long distances. At high traffic, the origin can become overloaded, bandwidth costs increase, and failures or attacks have a larger impact. A CDN solves this by caching frequently requested content at edge locations, distributing traffic across PoPs, routing users intelligently, and adding security features like DDoS mitigation and TLS termination.",
        answerStructure: [
          "Describe the problems without CDN",
          "Map CDN features to those problems",
          "Mention scale, cost, and security implications"
        ],
        commonMistakes: [
          "Only mentioning faster images",
          "Forgetting origin load and bandwidth cost",
          "Ignoring availability and DDoS protection",
          "Claiming CDNs are only needed for very large companies"
        ],
        followUps: [
          "When would you not use a CDN?",
          "How does a CDN reduce bandwidth cost?",
          "Can a CDN help APIs?"
        ]
      },
      {
        question: "Explain the difference between an origin server and an edge server.",
        whatInterviewerLooksFor: "Correct distinction between source-of-truth content and cached distributed copies.",
        strongAnswer: "The origin server stores the original source-of-truth content. It is contacted when the CDN needs to fetch new, missing, expired, or uncacheable content. An edge server is part of a CDN PoP located closer to users. It stores cached copies of content and serves requests directly when possible. The origin is like a central warehouse, while edge servers are local distribution centers.",
        answerStructure: [
          "Define origin server",
          "Define edge server or PoP",
          "Explain their interaction on cache hits and misses"
        ],
        commonMistakes: [
          "Saying edge servers are the authoritative source",
          "Forgetting that the origin still exists",
          "Not mentioning cache miss behavior"
        ],
        followUps: [
          "What happens if the origin is down?",
          "What is origin shielding?",
          "How do you protect the origin from direct access?"
        ]
      },
      {
        question: "What is a cache hit versus a cache miss in a CDN?",
        whatInterviewerLooksFor: "Clear lifecycle explanation and performance implications.",
        strongAnswer: "A cache hit occurs when the requested content is already present and valid in the edge server cache, so the CDN serves it directly. A cache miss occurs when the content is absent, expired, or not cacheable, so the CDN fetches it from the origin server, returns it to the user, and may store it at the edge. Cache hits reduce latency and origin load; cache misses are slower but can warm the cache for future requests.",
        answerStructure: [
          "Define cache hit",
          "Define cache miss",
          "Explain latency and origin-load implications"
        ],
        commonMistakes: [
          "Treating cache misses as errors",
          "Not mentioning TTL or expiration",
          "Ignoring whether content is safe to cache"
        ],
        followUps: [
          "How do you improve cache hit ratio?",
          "What content should not be cached?",
          "How does TTL affect cache behavior?"
        ]
      },
      {
        question: "Explain TTL and cache invalidation in a CDN.",
        whatInterviewerLooksFor: "Understanding freshness versus performance trade-offs and common invalidation strategies.",
        strongAnswer: "TTL, or Time To Live, controls how long an object is considered valid in the CDN cache. A longer TTL improves cache hit ratio and reduces origin traffic, but it increases the risk of stale content. A shorter TTL improves freshness but sends more traffic to the origin. Cache invalidation strategies include manual purge, cache-control headers, stale-while-revalidate, and versioned filenames such as app.v2.js. The right choice depends on how often the content changes and how harmful stale content would be.",
        answerStructure: [
          "Define TTL",
          "Explain long TTL versus short TTL trade-off",
          "List invalidation techniques and when to use them"
        ],
        commonMistakes: [
          "Using one TTL for all content",
          "Forgetting stale content risk",
          "Ignoring versioning for static assets",
          "Caching private data without proper controls"
        ],
        followUps: [
          "What is stale-while-revalidate?",
          "How would you cache product images?",
          "How would you cache a stock price API?"
        ]
      },
      {
        question: "How does request routing work in a CDN?",
        whatInterviewerLooksFor: "Mention of geo-based, latency-based, load-aware routing, and health/failover behavior.",
        strongAnswer: "CDN request routing chooses the best edge location for a user request. It can use geo-based routing to choose a nearby PoP, latency-based routing to choose the fastest responding PoP, and load-aware routing to avoid overloaded servers. It also considers health checks and can fail over from an unhealthy PoP to another available one. Some CDNs use DNS-based routing, Anycast, or a combination of techniques.",
        answerStructure: [
          "Define request routing as edge selection",
          "Compare geo, latency, and load-aware strategies",
          "Mention health checks and failover"
        ],
        commonMistakes: [
          "Saying routing is purely geographic",
          "Ignoring overloaded or unhealthy PoPs",
          "Confusing DNS resolution with the entire CDN routing system"
        ],
        followUps: [
          "What happens if the nearest PoP is overloaded?",
          "What is Anycast?",
          "How does CDN failover work?"
        ]
      },
      {
        question: "How do CDNs use load balancing and failover to improve reliability?",
        whatInterviewerLooksFor: "Understanding distribution across PoPs, avoiding overload, and rerouting during failures.",
        strongAnswer: "CDNs distribute traffic across multiple edge servers and PoPs so no single location becomes a bottleneck. They use routing strategies such as geo-based, latency-based, load-aware, or round-robin-like policies depending on the provider. Health checks detect failed or degraded PoPs, and the routing system redirects users to the next best healthy location. This improves availability and reduces the impact of localized failures.",
        answerStructure: [
          "Explain traffic distribution",
          "Explain health checks and failure detection",
          "Explain rerouting to healthy PoPs"
        ],
        commonMistakes: [
          "Only discussing backend application load balancers",
          "Not mentioning health checks",
          "Assuming CDN failover is always instant and perfect"
        ],
        followUps: [
          "How would retries affect a failing PoP?",
          "What metrics would you monitor?",
          "How does multi-CDN improve failover?"
        ]
      },
      {
        question: "What optimization techniques do CDNs use?",
        whatInterviewerLooksFor: "Mention of compression, minification, image optimization, video optimization, and bandwidth savings.",
        strongAnswer: "CDNs optimize delivery by reducing payload size and adapting content to users. Common techniques include gzip and Brotli compression for text, CSS and JavaScript minification, image optimization with WebP or AVIF conversion, resizing images for device dimensions, lazy loading support, and video chunk delivery with adaptive bitrate streaming. These techniques improve load time and reduce bandwidth cost.",
        answerStructure: [
          "Start with payload-size reduction",
          "List text, asset, image, and video techniques",
          "Connect optimizations to latency and cost"
        ],
        commonMistakes: [
          "Assuming compression works equally well for all content",
          "Ignoring image and video optimization",
          "Overlooking trade-offs like cache fragmentation by device"
        ],
        followUps: [
          "What is Brotli?",
          "When can bundling hurt?",
          "How does adaptive bitrate streaming work?"
        ]
      },
      {
        question: "How does a CDN protect against DDoS attacks?",
        whatInterviewerLooksFor: "Knowledge of edge absorption, rate limiting, traffic filtering, anomaly detection, Anycast, and origin protection.",
        strongAnswer: "A CDN protects against DDoS by placing a large distributed edge network in front of the origin. Attack traffic can be absorbed across many PoPs instead of hitting one origin. The CDN can apply rate limiting, traffic filtering, anomaly detection, bot mitigation, and WAF rules. Anycast routing can also spread attack traffic across multiple locations. For best protection, the origin should not be directly reachable except by the CDN.",
        answerStructure: [
          "Explain CDN as an edge shield",
          "List mitigation mechanisms",
          "Mention origin protection and limitations"
        ],
        commonMistakes: [
          "Saying a CDN eliminates all DDoS risk",
          "Forgetting origin direct-exposure risk",
          "Not mentioning rate limiting or filtering"
        ],
        followUps: [
          "What is origin shielding?",
          "How do WAF rules help?",
          "What if attackers discover the origin IP?"
        ]
      },
      {
        question: "What is SSL/TLS offloading in a CDN, and why is it useful?",
        whatInterviewerLooksFor: "Correct explanation of TLS termination at the edge, reduced origin work, and security considerations.",
        strongAnswer: "SSL/TLS offloading means the CDN handles HTTPS encryption and decryption at the edge. This reduces CPU work and connection overhead on the origin server and allows users to establish secure connections with nearby CDN edges. It can also centralize certificate management. However, traffic from CDN to origin should also be protected for sensitive systems, and origin access should be restricted.",
        answerStructure: [
          "Define TLS offloading",
          "Explain performance and operational benefits",
          "Mention secure CDN-to-origin communication"
        ],
        commonMistakes: [
          "Assuming encryption is unnecessary after the CDN",
          "Ignoring certificate management",
          "Confusing TLS offloading with removing security"
        ],
        followUps: [
          "Should CDN-to-origin traffic be encrypted?",
          "What is certificate rotation?",
          "How does TLS offloading relate to reverse proxies?"
        ]
      },
      {
        question: "How can a CDN help with APIs and dynamic content?",
        whatInterviewerLooksFor: "Nuanced answer that CDNs can cache some API responses but must handle privacy and freshness carefully; also mention non-cache benefits.",
        strongAnswer: "For APIs and dynamic content, a CDN can cache public or frequently accessed responses when it is safe, using short TTLs, cache keys, revalidation, and invalidation rules. It can also improve performance without caching by using better routing, persistent connections, compression, TLS termination, rate limiting, and edge security. For personalized or sensitive data, shared caching must be avoided or carefully keyed by authorization and user context.",
        answerStructure: [
          "Separate cacheable public API data from private data",
          "Mention careful TTL, cache keys, and invalidation",
          "List non-cache benefits for dynamic traffic"
        ],
        commonMistakes: [
          "Saying APIs cannot benefit from CDNs",
          "Blindly caching personalized responses",
          "Ignoring authorization headers and cache keys"
        ],
        followUps: [
          "How would you cache a public product catalog API?",
          "Why should bank balances not be shared-cacheable?",
          "What is cache key design?"
        ]
      },
      {
        question: "How would you design CDN usage for a large-scale video streaming platform?",
        whatInterviewerLooksFor: "Mention of segmented video chunks, adaptive bitrate, edge caching, load balancing, origin storage, and regional capacity.",
        strongAnswer: "I would store original videos in durable origin storage and process them into multiple bitrate variants split into small chunks. A CDN would cache popular chunks at PoPs close to viewers. The video player would use adaptive bitrate streaming to select chunk quality based on current bandwidth and device capability. The CDN routing layer would distribute viewers across healthy PoPs, use load-aware routing during traffic spikes, and fail over if a PoP fails. I would monitor cache hit ratio, startup latency, rebuffering, origin load, and regional bandwidth cost.",
        answerStructure: [
          "Describe origin storage and video chunking",
          "Explain edge caching and adaptive bitrate",
          "Discuss routing, failover, monitoring, and cost"
        ],
        commonMistakes: [
          "Serving one giant video file from one origin",
          "Ignoring bitrate adaptation",
          "Forgetting cache hot spots during popular events",
          "Not mentioning monitoring or regional capacity"
        ],
        followUps: [
          "How would you handle a live sports event?",
          "How do you reduce rebuffering?",
          "When would multi-CDN be useful?"
        ]
      },
      {
        question: "What are common CDN implementation challenges?",
        whatInterviewerLooksFor: "Balanced discussion of trade-offs, not just benefits.",
        strongAnswer: "Common challenges include stale content due to incorrect TTLs, difficult cache invalidation, accidental caching of private data, cache fragmentation from too many cache-key variations, vendor lock-in, cost surprises from traffic patterns, debugging complexity, and origin exposure. Mitigations include clear cache-control policies, versioned assets, purging workflows, careful cache-key design, observability for cache hit ratio and latency, origin access restrictions, WAF rules, and testing changes before global rollout.",
        answerStructure: [
          "List correctness and security risks",
          "List operational and cost risks",
          "Explain mitigations"
        ],
        commonMistakes: [
          "Presenting CDN as risk-free",
          "Ignoring private-data caching risks",
          "Not discussing observability",
          "Forgetting cost and vendor trade-offs"
        ],
        followUps: [
          "What metrics would you monitor?",
          "How do you debug a stale cache issue?",
          "How do you avoid vendor lock-in?"
        ]
      }
    ]
  },
  revision: {
    flashcards: [
      {
        front: "What is a CDN?",
        back: "A globally distributed network of servers that delivers content efficiently by serving users from nearby or optimal edge locations.",
        category: "Basics"
      },
      {
        front: "What problem does a CDN primarily solve?",
        back: "It reduces latency, origin load, bandwidth cost, and availability risks by caching and routing content through distributed edge servers.",
        category: "Basics"
      },
      {
        front: "What is an origin server?",
        back: "The source-of-truth server that stores the original content and is contacted on cache misses, refreshes, or uncacheable requests.",
        category: "Architecture"
      },
      {
        front: "What is an edge server?",
        back: "A CDN server located closer to users that caches and serves content.",
        category: "Architecture"
      },
      {
        front: "What is a PoP?",
        back: "A Point of Presence: a CDN location or data center containing edge servers.",
        category: "Architecture"
      },
      {
        front: "What is a cache hit?",
        back: "A request where the content is found in the CDN edge cache and served directly.",
        category: "Caching"
      },
      {
        front: "What is a cache miss?",
        back: "A request where the content is not found or not valid in the edge cache, so the CDN fetches it from the origin.",
        category: "Caching"
      },
      {
        front: "What does TTL mean in CDN caching?",
        back: "Time To Live: how long cached content remains valid before it should be refreshed or revalidated.",
        category: "Caching"
      },
      {
        front: "Name three cache invalidation strategies.",
        back: "Manual purge, stale-while-revalidate, cache-control headers, and versioned filenames are common strategies.",
        category: "Caching"
      },
      {
        front: "What is stale-while-revalidate?",
        back: "A strategy where the CDN serves stale cached content quickly while refreshing it from the origin in the background.",
        category: "Caching"
      },
      {
        front: "What is geo-based routing?",
        back: "Routing users to a CDN PoP based on geographic location, often the nearest region.",
        category: "Routing"
      },
      {
        front: "What is latency-based routing?",
        back: "Routing users to the PoP with the fastest measured or estimated response time.",
        category: "Routing"
      },
      {
        front: "What is load-aware routing?",
        back: "Routing traffic based on current server or PoP load to avoid overload.",
        category: "Routing"
      },
      {
        front: "What happens if a CDN PoP fails?",
        back: "The CDN can fail over by routing traffic to another healthy PoP.",
        category: "Reliability"
      },
      {
        front: "How do CDNs reduce bandwidth usage?",
        back: "They serve cached content from edge servers and can compress, minify, and optimize content before delivery.",
        category: "Optimization"
      },
      {
        front: "Name common CDN compression methods.",
        back: "Gzip and Brotli are common for text-based content.",
        category: "Optimization"
      },
      {
        front: "How do CDNs optimize images?",
        back: "They may resize images, convert formats to WebP or AVIF, and serve device-appropriate versions.",
        category: "Optimization"
      },
      {
        front: "How do CDNs help with DDoS protection?",
        back: "They absorb traffic across PoPs and apply rate limiting, traffic filtering, anomaly detection, WAF rules, and bot mitigation.",
        category: "Security"
      },
      {
        front: "What is SSL/TLS offloading?",
        back: "The CDN handles HTTPS encryption and decryption at the edge, reducing work for the origin and securing user connections.",
        category: "Security"
      },
      {
        front: "Can CDNs help dynamic APIs?",
        back: "Yes. They can cache safe responses and also provide routing, compression, TLS termination, rate limiting, and security even when caching is limited.",
        category: "Use Cases"
      },
      {
        front: "What is edge computing?",
        back: "Running lightweight processing closer to users at edge locations instead of sending every request to the origin.",
        category: "Advanced"
      },
      {
        front: "What is a multi-CDN architecture?",
        back: "A design that uses multiple CDN providers for redundancy, better regional performance, failover, or cost optimization.",
        category: "Advanced"
      }
    ],
    glossary: [
      {
        term: "CDN",
        definition: "Content Delivery Network, a distributed network of servers that delivers content from edge locations closer to users.",
        relatedConcepts: [
          "Edge server",
          "PoP",
          "Caching",
          "Request routing"
        ]
      },
      {
        term: "Origin server",
        definition: "The authoritative server or storage system where the original content is stored.",
        relatedConcepts: [
          "Cache miss",
          "Source of truth",
          "Origin shielding"
        ]
      },
      {
        term: "Edge server",
        definition: "A CDN server located near users that caches and serves content.",
        relatedConcepts: [
          "PoP",
          "Cache hit",
          "Latency"
        ]
      },
      {
        term: "PoP",
        definition: "Point of Presence, a CDN data center or location containing edge servers.",
        relatedConcepts: [
          "Edge server",
          "Geo-based routing",
          "Failover"
        ]
      },
      {
        term: "Request routing",
        definition: "The process of choosing which CDN edge location should handle a user request.",
        relatedConcepts: [
          "Geo-based routing",
          "Latency-based routing",
          "Load-aware routing"
        ]
      },
      {
        term: "Cache hit",
        definition: "A request served directly from the CDN cache because the object is present and valid.",
        relatedConcepts: [
          "Caching",
          "Edge server",
          "Cache hit ratio"
        ]
      },
      {
        term: "Cache miss",
        definition: "A request where the CDN does not have a valid cached object and must fetch it from the origin.",
        relatedConcepts: [
          "Origin server",
          "Cache warming",
          "TTL"
        ]
      },
      {
        term: "TTL",
        definition: "Time To Live, the period for which cached content is considered valid.",
        relatedConcepts: [
          "Cache expiration",
          "Freshness",
          "Invalidation"
        ]
      },
      {
        term: "Cache invalidation",
        definition: "The process of removing, refreshing, or bypassing cached content when it becomes outdated.",
        relatedConcepts: [
          "Manual purge",
          "Versioning",
          "Cache-control headers"
        ]
      },
      {
        term: "Stale-while-revalidate",
        definition: "A caching strategy that serves stale content while refreshing it from the origin in the background.",
        relatedConcepts: [
          "TTL",
          "Freshness",
          "Asynchronous refresh"
        ]
      },
      {
        term: "Geo-based routing",
        definition: "Routing users to a CDN PoP based mainly on geographic location.",
        relatedConcepts: [
          "Request routing",
          "PoP",
          "Latency"
        ]
      },
      {
        term: "Latency-based routing",
        definition: "Routing users to the PoP with the best measured or estimated response time.",
        relatedConcepts: [
          "Network latency",
          "Request routing",
          "Performance"
        ]
      },
      {
        term: "Load-aware routing",
        definition: "Routing that considers current server or PoP load to avoid congestion.",
        relatedConcepts: [
          "Load balancing",
          "Failover",
          "Hot spots"
        ]
      },
      {
        term: "Failover",
        definition: "Automatic rerouting away from unhealthy infrastructure to a healthy alternative.",
        relatedConcepts: [
          "Health checks",
          "Availability",
          "PoP failure"
        ]
      },
      {
        term: "Gzip",
        definition: "A common compression method used to reduce text-based response sizes.",
        relatedConcepts: [
          "Compression",
          "Brotli",
          "Bandwidth"
        ]
      },
      {
        term: "Brotli",
        definition: "A modern compression algorithm often used by CDNs for efficient text compression.",
        relatedConcepts: [
          "Compression",
          "Gzip",
          "Web performance"
        ]
      },
      {
        term: "Minification",
        definition: "Removing unnecessary characters from code files to reduce size.",
        relatedConcepts: [
          "JavaScript",
          "CSS",
          "Optimization"
        ]
      },
      {
        term: "DDoS mitigation",
        definition: "Techniques used to reduce the impact of distributed denial-of-service attacks, such as rate limiting and traffic filtering.",
        relatedConcepts: [
          "Rate limiting",
          "Anycast",
          "WAF"
        ]
      },
      {
        term: "SSL/TLS offloading",
        definition: "Handling HTTPS encryption and decryption at the CDN edge instead of placing all work on the origin.",
        relatedConcepts: [
          "TLS termination",
          "HTTPS",
          "Origin security"
        ]
      },
      {
        term: "WAF",
        definition: "Web Application Firewall, a security layer that filters malicious web traffic and enforces rules.",
        relatedConcepts: [
          "Bot mitigation",
          "DDoS protection",
          "Edge security"
        ]
      },
      {
        term: "API acceleration",
        definition: "Using CDN features such as caching, routing, compression, and connection optimization to reduce API latency.",
        relatedConcepts: [
          "Dynamic content",
          "Edge caching",
          "Rate limiting"
        ]
      },
      {
        term: "Edge computing",
        definition: "Running lightweight compute logic at edge locations closer to users.",
        relatedConcepts: [
          "CDN functions",
          "Latency",
          "Request transformation"
        ]
      },
      {
        term: "Multi-CDN",
        definition: "Using multiple CDN providers for redundancy, regional performance, failover, or cost control.",
        relatedConcepts: [
          "Traffic steering",
          "Availability",
          "Vendor redundancy"
        ]
      }
    ],
    finalQuiz: [
      {
        type: "mcq",
        prompt: "A user in India is loading a site whose origin server is in New York. Which CDN benefit directly addresses the long-distance delay?",
        options: [
          "Serving cached content from a closer edge location",
          "Using a larger database primary key",
          "Disabling HTTP caching",
          "Sending all traffic through the origin"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "A CDN reduces latency by serving content from edge servers closer to the user."
      },
      {
        type: "mcq",
        prompt: "Which component stores the original source-of-truth content in a CDN architecture?",
        options: [
          "Origin server",
          "Edge cache",
          "Browser tab",
          "Bot filter"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "The origin server stores the original content and is contacted when the CDN needs to fetch or refresh content."
      },
      {
        type: "mcq",
        prompt: "What happens during a cache hit?",
        options: [
          "The edge server serves the content directly from cache",
          "The CDN must always call the origin",
          "The request is rejected as stale",
          "The user must upload the content again"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "A cache hit means the content is already available and valid at the edge."
      },
      {
        type: "mcq",
        prompt: "What does TTL control in CDN caching?",
        options: [
          "How long cached content is considered valid",
          "How many databases the origin has",
          "The number of users allowed on the internet",
          "The encryption algorithm used by JavaScript"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "TTL, or Time To Live, defines how long an object remains valid in cache before refresh or revalidation."
      },
      {
        type: "mcq",
        prompt: "Which strategy is best for forcing users to get a newly deployed static file while still allowing long cache lifetimes?",
        options: [
          "Use versioned filenames such as app.v2.js",
          "Cache private API responses globally",
          "Remove all edge servers",
          "Increase origin CPU only"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Versioned filenames create a new URL, so the CDN fetches the new asset while old files can remain safely cached."
      },
      {
        type: "mcq",
        prompt: "Which routing strategy chooses a PoP based on current response time rather than only geography?",
        options: [
          "Latency-based routing",
          "Manual purge",
          "Image minification",
          "Schema normalization"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Latency-based routing sends users to the PoP with the best current or estimated network response time."
      },
      {
        type: "mcq",
        prompt: "If the closest CDN PoP is overloaded, what should a well-designed CDN do?",
        options: [
          "Route some traffic to a less busy healthy PoP",
          "Send all traffic to the overloaded PoP anyway",
          "Disable TLS for all users",
          "Delete cached content globally"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Load-aware routing avoids congestion by considering current PoP load."
      },
      {
        type: "mcq",
        prompt: "Which CDN feature helps reduce the size of HTML, CSS, JavaScript, and JSON responses?",
        options: [
          "Gzip or Brotli compression",
          "Origin exposure",
          "Cache poisoning",
          "Database locking"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Gzip and Brotli are common compression methods for text-based content."
      },
      {
        type: "mcq",
        prompt: "How can a CDN help protect against DDoS attacks?",
        options: [
          "By absorbing traffic across PoPs and applying rate limiting and filtering",
          "By making every request bypass the edge",
          "By storing passwords in cache headers",
          "By removing all monitoring"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "CDNs can mitigate DDoS attacks using distributed capacity, rate limiting, traffic filtering, anomaly detection, and WAF rules."
      },
      {
        type: "mcq",
        prompt: "Which statement about dynamic API responses is most accurate?",
        options: [
          "Some public API responses can be cached carefully, while private responses require strict controls or no shared caching",
          "All API responses should be cached globally forever",
          "CDNs cannot help APIs in any way",
          "API responses become static just because a CDN is used"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Dynamic content requires careful cache keys, TTLs, authorization awareness, and privacy controls."
      },
      {
        type: "mcq",
        prompt: "What is edge computing in the context of CDNs?",
        options: [
          "Running lightweight processing near users at CDN edge locations",
          "Moving every database table into browser local storage",
          "Disabling all origin servers permanently",
          "Using only one server for the whole world"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Edge computing allows small, latency-sensitive logic to run closer to users."
      },
      {
        type: "mcq",
        prompt: "Which is a strong CDN design consideration for video streaming?",
        options: [
          "Cache segmented video chunks at PoPs and support adaptive bitrate streaming",
          "Serve one giant file from one origin to every viewer",
          "Disable all load balancing",
          "Use no monitoring during live events"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Large-scale video streaming depends on chunked delivery, edge caching, adaptive bitrate, and traffic distribution."
      },
      {
        type: "mcq",
        prompt: "What is a major risk of incorrect CDN configuration?",
        options: [
          "Serving stale or private content incorrectly",
          "Making network latency physically impossible",
          "Removing the need for all application security",
          "Guaranteeing zero cost"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Incorrect TTLs, cache keys, or headers can lead to stale content or private data leakage."
      },
      {
        type: "mcq",
        prompt: "Why might a large company use a multi-CDN architecture?",
        options: [
          "To improve redundancy, regional performance, and failover options",
          "To guarantee that cache invalidation is never needed",
          "To make all content uncacheable",
          "To remove the origin server from the system entirely"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Multi-CDN can improve availability and regional performance, but it adds operational complexity."
      }
    ]
  }
};