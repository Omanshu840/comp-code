export const lecture = {
  id: "lecture-9-how-dns-works",
  sectionId: "section-2-networking-communications",
  lectureNumber: 9,
  title: "How DNS Works",
  slug: "how-dns-works",
  estimatedMinutes: 18,
  difficulty: "beginner",
  prerequisites: [
    "Basic understanding of IP addresses",
    "Basic understanding of clients and servers",
    "Awareness that computers communicate using network addresses"
  ],
  learningOutcomes: [
    "Explain why DNS is needed and how it acts as a stable abstraction over changing infrastructure",
    "Describe the roles of recursive resolvers, root name servers, TLD servers, and authoritative name servers",
    "Walk through the DNS resolution process step by step",
    "Explain how DNS caching and TTL affect performance, freshness, and operational flexibility",
    "Describe how DNS supports large-scale systems through traffic routing, failover, CDNs, and security practices",
    "Answer common DNS system design interview questions clearly and practically"
  ],
  sourceFiles: {
    transcript: "System Design/Section 2: Networking & Communications/9. How DNS Works",
    sectionSlides: "System Design/Section 2: Networking & Communications/00-System+Design+-+Updated+-+Section+2-Slides.txt",
    interviewQuestions: "System Design/Section 2: Networking & Communications/9. DNS+Interview+Questions+&+Answers.txt"
  },
  sourceSummary: {
    transcriptFocus: "Explains DNS as the first distributed system involved in many user requests, covering DNS hierarchy, caching, TTL, resolution flow, large-scale traffic routing, failover, CDN integration, and security risks.",
    interviewFocus: "Provides expected answers for DNS resolution, recursive versus authoritative servers, caching locations, TTL trade-offs, DNS-based load balancing, and DNS security threats such as cache poisoning and DDoS.",
    slideFocus: "Relevant slides are the 'How DNS Works' slides, including DNS introduction, server types, caching, resolution process, large-scale importance, security risks, interview questions, and key takeaways."
  },
  lessons: [
    {
      id: "lecture-9-how-dns-works-lesson-1",
      title: "DNS as the Internet Addressing System",
      goal: "Understand why DNS exists and how its distributed hierarchy makes the internet scalable.",
      order: 1,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "DNS",
          explanation: "DNS, or Domain Name System, translates human-readable domain names like google.com into IP addresses that computers use to communicate. Without DNS, users would need to remember changing numeric addresses for every service.",
          whyItMatters: "DNS makes the internet usable for humans and manageable for operators. It lets users rely on stable names while infrastructure can move between servers, data centers, and cloud regions.",
          systemDesignConnection: "In system design, DNS is often the first step before a browser, mobile app, or service can connect to your system. If DNS fails, the application may be unreachable even if the application servers are healthy.",
          example: "A user enters example.com. DNS resolves that name to an IP address such as 93.184.216.34, allowing the browser to connect to the correct server.",
          commonMisconception: "A common misconception is that DNS is just a small local lookup table. In reality, DNS is a global distributed system with delegation, caching, hierarchy, and operational trade-offs."
        },
        {
          name: "Stable Abstraction Over Infrastructure",
          explanation: "DNS provides a stable domain name while the underlying infrastructure can change. Servers can be replaced, IP addresses can change, and traffic can move between regions without users changing the URL they use.",
          whyItMatters: "Modern systems are dynamic. Applications may run across multiple data centers, cloud regions, Kubernetes clusters, load balancers, and CDN edges. DNS hides much of that complexity from users.",
          systemDesignConnection: "DNS allows architects to migrate infrastructure, perform failovers, and route traffic globally while preserving the same external name for clients.",
          example: "A company can move api.company.com from one cloud load balancer to another by updating DNS records instead of asking every client to use a new address.",
          commonMisconception: "Some learners think a domain name permanently maps to one server. In large-scale systems, a domain can map to different endpoints over time or even return different answers depending on location or policy."
        },
        {
          name: "Distributed DNS Hierarchy",
          explanation: "DNS is not a single centralized database. It is a distributed hierarchy where each layer knows enough to direct the query closer to the final answer.",
          whyItMatters: "No single server can store or answer every DNS record for the entire internet. Delegation allows the system to scale to billions of lookups per day.",
          systemDesignConnection: "DNS is a classic example of scalable distributed design: divide responsibility, delegate authority, cache aggressively, and avoid central bottlenecks.",
          example: "A root server does not know the IP for shop.example.com, but it knows where to find the .com TLD servers. The .com TLD server then points to the authoritative server for example.com.",
          commonMisconception: "A common misconception is that the root server returns the website IP address. Usually, it only points the resolver toward the correct TLD server."
        },
        {
          name: "Recursive Resolver",
          explanation: "A recursive resolver is the DNS component that works on behalf of the client. If it does not already have the answer cached, it queries the DNS hierarchy to find the answer.",
          whyItMatters: "Clients do not need to know how to contact root, TLD, and authoritative servers directly. The resolver handles that complexity.",
          systemDesignConnection: "Recursive resolvers are commonly provided by ISPs, public DNS providers such as Google Public DNS or Cloudflare DNS, enterprises, or local networks. Their caching behavior greatly affects DNS performance.",
          example: "Your laptop asks its configured resolver, 'What is the IP for www.example.com?' The resolver then does the work required to find the answer.",
          commonMisconception: "Recursive resolvers usually do not own the domain records. They fetch and cache answers; authoritative servers store the definitive records."
        },
        {
          name: "Authoritative Name Server",
          explanation: "An authoritative name server is the source of truth for a domain's DNS records. It stores records such as A, AAAA, CNAME, MX, and others.",
          whyItMatters: "The authoritative server provides the final DNS answer during resolution.",
          systemDesignConnection: "For production systems, authoritative DNS should be reliable, redundant, monitored, and often hosted across multiple providers or regions.",
          example: "The authoritative server for example.com may return an A record saying www.example.com maps to 93.184.216.34.",
          commonMisconception: "Authoritative does not mean it recursively searches the whole internet. It is authoritative only for the zones it manages."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "DNS turns names into addresses",
          body: "Humans prefer names like google.com. Computers need IP addresses. DNS bridges that gap by translating domain names into network addresses.",
          takeaway: "DNS is the internet's addressing service."
        },
        {
          type: "concept",
          title: "DNS is an abstraction layer",
          body: "A domain name stays stable even when backend servers, load balancers, data centers, or cloud regions change.",
          takeaway: "DNS decouples user-facing names from changing infrastructure."
        },
        {
          type: "concept",
          title: "DNS scales through delegation",
          body: "Root servers point to TLD servers. TLD servers point to authoritative servers. Authoritative servers provide the final records.",
          takeaway: "Each DNS layer knows just enough to move the request forward."
        },
        {
          type: "concept",
          title: "Recursive versus authoritative",
          body: "A recursive resolver searches on behalf of the client. An authoritative server stores the final records for a domain.",
          takeaway: "Resolvers fetch answers; authoritative servers own answers."
        }
      ],
      visualModels: [
        {
          title: "DNS Hierarchy",
          description: "DNS resolution moves through a delegated hierarchy rather than one global database.",
          flow: [
            "Client asks recursive resolver",
            "Resolver asks root server for the right TLD direction",
            "Resolver asks TLD server for the domain's authoritative server",
            "Resolver asks authoritative server for the final record"
          ],
          learnerShouldNotice: "Each layer has limited responsibility, which prevents one central service from needing to know every domain."
        },
        {
          title: "Stable Domain, Changing Infrastructure",
          description: "The user sees a stable name, while operators can change the underlying target.",
          flow: [
            "User enters app.example.com",
            "DNS returns an address for the current production endpoint",
            "Infrastructure can later move to another load balancer or region",
            "Users continue using app.example.com"
          ],
          learnerShouldNotice: "DNS helps separate external identity from internal deployment details."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "What is the primary purpose of DNS?",
          options: [
            "To translate human-readable domain names into IP addresses",
            "To encrypt all web traffic between browsers and servers",
            "To store website HTML files at edge locations",
            "To decide which database query should run"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS maps names like example.com to IP addresses that computers use to establish network connections."
        },
        {
          type: "true_false",
          prompt: "DNS is designed as a distributed hierarchy rather than one centralized database.",
          correctAnswer: true,
          explanation: "DNS scales by delegating responsibility across root, TLD, and authoritative name servers, with recursive resolvers doing lookups on behalf of clients."
        },
        {
          type: "fill_blank",
          prompt: "A recursive resolver works on behalf of the ____.",
          options: [
            "client",
            "authoritative zone owner",
            "database engine",
            "CDN cache only"
          ],
          correctAnswerIndex: 0,
          explanation: "The recursive resolver accepts a client's DNS query and navigates the DNS hierarchy to find the answer."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each DNS component to its role.",
          pairs: [
            {
              left: "Recursive resolver",
              right: "Performs lookups on behalf of the client"
            },
            {
              left: "Root name server",
              right: "Points toward the correct top-level domain servers"
            },
            {
              left: "TLD server",
              right: "Points toward the authoritative server for a domain"
            },
            {
              left: "Authoritative name server",
              right: "Stores the definitive DNS records for a domain"
            }
          ],
          explanation: "DNS uses delegation: each component either forwards the resolver to the next layer or returns the final record."
        },
        {
          type: "ordering",
          prompt: "Order the high-level DNS hierarchy traversal after a cache miss.",
          items: [
            "Ask the authoritative name server",
            "Ask the root name server",
            "Ask the TLD name server",
            "Recursive resolver receives the client query"
          ],
          correctOrder: [
            "Recursive resolver receives the client query",
            "Ask the root name server",
            "Ask the TLD name server",
            "Ask the authoritative name server"
          ],
          explanation: "The resolver starts with the client query, then follows delegation from root to TLD to authoritative server."
        },
        {
          type: "scenario",
          prompt: "Your company is moving its web application from one cloud load balancer to another. You want users to keep using the same URL. Which DNS benefit are you relying on?",
          options: [
            "DNS provides a stable abstraction over changing infrastructure",
            "DNS stores all user session data",
            "DNS guarantees zero latency for every request",
            "DNS replaces the need for IP networking"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS lets the domain name remain stable while the underlying IP address or endpoint changes."
        }
      ],
      checkpoint: {
        summary: "DNS translates domain names into IP addresses and uses a distributed hierarchy to scale globally. Recursive resolvers search on behalf of clients, while authoritative servers store final DNS records.",
        learnerCanNow: [
          "Define DNS and explain why it exists",
          "Explain why DNS is distributed instead of centralized",
          "Differentiate recursive resolvers from authoritative servers",
          "Describe how DNS hides infrastructure changes from users"
        ],
        explainInYourOwnWords: "Why is DNS more than just a phonebook, and how does its hierarchy help it scale?"
      }
    },
    {
      id: "lecture-9-how-dns-works-lesson-2",
      title: "Resolution, Caching, and TTL",
      goal: "Learn the full DNS lookup flow and understand the performance versus freshness trade-off of caching.",
      order: 2,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "DNS Resolution Process",
          explanation: "DNS resolution is the process of converting a domain name into an IP address. It begins locally with browser and operating system caches. If the answer is missing, the query goes to a recursive resolver, which may contact root, TLD, and authoritative servers.",
          whyItMatters: "Understanding the resolution process explains why DNS is fast despite involving multiple distributed systems.",
          systemDesignConnection: "When debugging latency, outages, or migration issues, architects must know where DNS answers can come from: local cache, OS cache, resolver cache, or authoritative DNS.",
          example: "When a user types www.example.com, the browser may already know the IP. If not, the OS checks its cache. If still missing, the recursive resolver performs the external lookup.",
          commonMisconception: "A common misconception is that every browser request performs a full DNS lookup. In practice, many lookups are answered from cache."
        },
        {
          name: "Browser and OS DNS Caches",
          explanation: "Browsers and operating systems cache DNS answers locally so repeat visits can avoid external network lookups.",
          whyItMatters: "Local caching can make DNS resolution nearly instant for recently visited domains.",
          systemDesignConnection: "Local caches improve user experience, but they can also make DNS changes appear inconsistent during migrations because some clients still have old answers.",
          example: "If you visited example.com moments ago, your browser or operating system may reuse the cached IP instead of asking a resolver again.",
          commonMisconception: "Some learners assume only DNS servers cache results. Browsers and operating systems also maintain DNS caches."
        },
        {
          name: "Recursive Resolver Cache",
          explanation: "Recursive resolvers cache DNS answers and serve them to many users. This reduces repeated upstream queries to root, TLD, and authoritative servers.",
          whyItMatters: "Resolver caching significantly reduces global DNS traffic and improves performance for large groups of users.",
          systemDesignConnection: "Popular domains benefit heavily from resolver caches because one cached answer can serve many users behind the same ISP or public resolver.",
          example: "If many users on the same ISP visit a popular website, the ISP resolver may already have the IP cached and can answer quickly.",
          commonMisconception: "Caching at the resolver does not mean the record is permanent. Cached records expire based on TTL."
        },
        {
          name: "TTL",
          explanation: "TTL, or Time-to-Live, defines how long a DNS record may be cached before it must be refreshed.",
          whyItMatters: "TTL controls the trade-off between fast cached responses and how quickly DNS changes propagate.",
          systemDesignConnection: "TTL is an operational decision. Short TTLs help during migrations, failovers, and traffic rerouting. Long TTLs reduce DNS query load and improve cache hit rates.",
          example: "A TTL of 60 seconds allows DNS changes to take effect relatively quickly but increases query volume. A TTL of 24 hours reduces DNS traffic but can delay changes.",
          commonMisconception: "A common misconception is that DNS changes update everywhere instantly. Cached records may remain valid until their TTL expires."
        },
        {
          name: "Freshness versus Performance",
          explanation: "DNS caching improves speed and reduces load, but cached data can become stale until TTL expires. This creates a trade-off between performance and update flexibility.",
          whyItMatters: "At global scale, the wrong TTL can slow incident response, increase resolver traffic, or make traffic migration unpredictable.",
          systemDesignConnection: "Before planned failovers or cloud migrations, teams often lower TTLs in advance so clients and resolvers refresh DNS records more frequently.",
          example: "Before moving traffic from Region A to Region B, an operations team may reduce TTL from 1 hour to 60 seconds. After the migration, they may raise it again.",
          commonMisconception: "Short TTLs are not always better. They improve agility but can increase DNS load and dependency on upstream DNS availability."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "DNS starts locally",
          body: "Before contacting external DNS infrastructure, the browser and operating system check whether they already have a valid cached answer.",
          takeaway: "Many DNS lookups never leave the local machine."
        },
        {
          type: "concept",
          title: "The resolver does the hard work",
          body: "If local caches miss, the recursive resolver navigates root, TLD, and authoritative servers to find the answer.",
          takeaway: "Clients delegate DNS lookup complexity to resolvers."
        },
        {
          type: "concept",
          title: "Caching makes DNS fast",
          body: "DNS would be much slower if every query traversed the full hierarchy. Caching at browsers, operating systems, and resolvers avoids repeated network calls.",
          takeaway: "Caching is central to DNS performance."
        },
        {
          type: "concept",
          title: "TTL is a system design lever",
          body: "Long TTLs improve cache efficiency. Short TTLs make changes propagate faster. Choosing TTL affects reliability, migration speed, and DNS load.",
          takeaway: "TTL is a trade-off, not just a setting."
        }
      ],
      visualModels: [
        {
          title: "DNS Lookup Flow",
          description: "A user's DNS request moves from local checks to distributed DNS only when needed.",
          flow: [
            "User types domain in browser",
            "Browser cache is checked",
            "Operating system cache is checked",
            "Recursive resolver is queried",
            "Root server directs to TLD server",
            "TLD server directs to authoritative server",
            "Authoritative server returns the DNS record",
            "Resolver caches and returns the answer to the client"
          ],
          learnerShouldNotice: "The full hierarchy is only needed on cache misses. Caching short-circuits much of the process."
        },
        {
          title: "Caching Levels",
          description: "DNS answers can be reused at multiple layers.",
          flow: [
            "Browser cache",
            "Operating system cache",
            "Recursive resolver cache",
            "Authoritative DNS when cache misses occur"
          ],
          learnerShouldNotice: "Caching happens close to the user and at shared resolver infrastructure, reducing latency and global DNS load."
        },
        {
          title: "TTL Trade-off",
          description: "TTL determines how long DNS answers remain cacheable.",
          flow: [
            "Long TTL: fewer DNS queries and better cache performance",
            "Trade-off: slower propagation of DNS changes",
            "Short TTL: faster migrations and failover",
            "Trade-off: more DNS queries and higher dependency on DNS infrastructure"
          ],
          learnerShouldNotice: "TTL affects both performance and operations."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Where can DNS caching occur?",
          options: [
            "Browser, operating system, and recursive resolver",
            "Only inside the authoritative name server",
            "Only inside the web application's database",
            "Only inside the root name servers"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS responses can be cached by browsers, operating systems, and recursive resolvers."
        },
        {
          type: "true_false",
          prompt: "A longer DNS TTL usually reduces DNS query volume but can delay propagation of changes.",
          correctAnswer: true,
          explanation: "Longer TTLs keep records cached for longer, which improves cache efficiency but means old answers may persist longer."
        },
        {
          type: "fill_blank",
          prompt: "TTL stands for ____.",
          options: [
            "Time-to-Live",
            "Traffic Transfer Layer",
            "Trusted Transport Link",
            "Total Throughput Limit"
          ],
          correctAnswerIndex: 0,
          explanation: "TTL means Time-to-Live. It controls how long a DNS record can remain cached."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match the caching layer to its impact.",
          pairs: [
            {
              left: "Browser cache",
              right: "Can answer repeat lookups for recently visited domains"
            },
            {
              left: "Operating system cache",
              right: "Stores DNS answers for local applications"
            },
            {
              left: "Recursive resolver cache",
              right: "Serves cached answers to many users"
            },
            {
              left: "TTL",
              right: "Controls how long cached DNS records remain valid"
            }
          ],
          explanation: "DNS performance comes from multiple cache layers plus TTL-based expiration."
        },
        {
          type: "ordering",
          prompt: "Order the DNS resolution steps for a cold lookup.",
          items: [
            "Authoritative server returns the DNS record",
            "Browser checks its cache",
            "Resolver asks root and TLD servers for delegation",
            "Operating system cache is checked",
            "Recursive resolver receives the query"
          ],
          correctOrder: [
            "Browser checks its cache",
            "Operating system cache is checked",
            "Recursive resolver receives the query",
            "Resolver asks root and TLD servers for delegation",
            "Authoritative server returns the DNS record"
          ],
          explanation: "DNS starts locally. Only after local cache misses does the recursive resolver traverse the hierarchy."
        },
        {
          type: "scenario",
          prompt: "You are planning a production migration tomorrow and want DNS changes to take effect quickly during the cutover. What should you usually do ahead of time?",
          options: [
            "Lower the TTL before the migration window",
            "Increase TTL to several days immediately before cutover",
            "Disable all recursive resolver caching globally",
            "Move all records to root DNS servers"
          ],
          correctAnswerIndex: 0,
          explanation: "Lowering TTL in advance encourages resolvers to refresh records more often, making the migration more flexible."
        }
      ],
      checkpoint: {
        summary: "DNS resolution starts with local caches and only traverses the hierarchy on cache misses. Caching improves speed and reduces load, while TTL controls how long answers remain valid.",
        learnerCanNow: [
          "Walk through a DNS lookup step by step",
          "Identify where DNS caching occurs",
          "Explain how caching reduces latency and infrastructure load",
          "Discuss the TTL trade-off between freshness and performance"
        ],
        explainInYourOwnWords: "If DNS caching is so useful, why would an operations team ever choose a short TTL?"
      }
    },
    {
      id: "lecture-9-how-dns-works-lesson-3",
      title: "DNS in Large-Scale Architecture",
      goal: "See how DNS becomes a design tool for availability, routing, failover, CDN integration, and security.",
      order: 3,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "DNS as an Architectural Component",
          explanation: "At internet scale, DNS is not merely a naming system. It influences availability, performance, resilience, and user routing before a request reaches the application.",
          whyItMatters: "Users experience DNS decisions as application behavior. If DNS routes them to a nearby or healthy endpoint, the app feels fast and reliable. If DNS fails, the app may appear down.",
          systemDesignConnection: "System designers use DNS to control global traffic entry points, regional routing, disaster recovery, and CDN selection.",
          example: "A global application may use DNS policies to send European users to a European region and North American users to a North American region.",
          commonMisconception: "A common misconception is that load balancing only happens after traffic reaches a load balancer. DNS can influence routing before any HTTP request is sent."
        },
        {
          name: "DNS-Based Traffic Distribution",
          explanation: "DNS can return different endpoints for the same domain based on round-robin rotation, geography, latency, capacity, or failover policy.",
          whyItMatters: "Traffic distribution helps avoid overloading a single server or data center and can reduce user latency.",
          systemDesignConnection: "DNS-based load balancing is commonly used with regional load balancers, multi-region architectures, and disaster recovery plans.",
          example: "api.example.com may return one IP for users in India and another IP for users in the United States, routing users closer to healthy infrastructure.",
          commonMisconception: "DNS-based load balancing is not the same as per-request application load balancing. DNS answers may be cached, so traffic shifts are not always instant or perfectly even."
        },
        {
          name: "Anycast DNS",
          explanation: "Anycast allows the same IP address to be announced from multiple locations. Network routing sends users to a nearby or best available instance.",
          whyItMatters: "Anycast reduces DNS lookup latency and improves resilience because traffic can be served from many global locations.",
          systemDesignConnection: "Large DNS providers use anycast networks so recursive resolvers and authoritative DNS services can survive regional failures and absorb high traffic.",
          example: "A public DNS service can advertise the same resolver IP from dozens of cities, allowing users to reach a nearby instance automatically.",
          commonMisconception: "Anycast does not mean one physical server exists everywhere. It means multiple locations advertise the same IP prefix, and routing selects a path."
        },
        {
          name: "DNS Failover",
          explanation: "DNS failover redirects traffic away from unhealthy infrastructure toward a healthy region, backup environment, or secondary provider.",
          whyItMatters: "DNS is often part of disaster recovery because it can change the destination users receive before they connect to the application.",
          systemDesignConnection: "Failover planning must account for health checks, TTL, cached records, secondary DNS providers, and whether clients honor DNS updates correctly.",
          example: "If the primary data center fails, DNS can start returning the IP address of a standby region.",
          commonMisconception: "DNS failover is not always immediate. Cached DNS records may continue pointing to the failed endpoint until TTL expires."
        },
        {
          name: "DNS and CDNs",
          explanation: "DNS helps route users to an appropriate CDN edge location, allowing content to be served from a nearby point of presence instead of a distant origin server.",
          whyItMatters: "This reduces latency, lowers origin load, and improves user experience for static content, media, and sometimes API acceleration.",
          systemDesignConnection: "CDNs often rely on DNS-based request routing to select the edge server based on geography, network latency, load, or availability.",
          example: "When a user requests images.example.com, DNS may direct the request to a CDN edge close to that user.",
          commonMisconception: "DNS itself does not store the website's images or videos. It helps direct the user toward infrastructure, such as a CDN edge, that can serve them."
        },
        {
          name: "DNS Security",
          explanation: "Because DNS is the gateway to many internet applications, attackers target it through cache poisoning, spoofing, DDoS attacks, man-in-the-middle attacks, and floods of invalid queries.",
          whyItMatters: "DNS attacks can make a healthy application unreachable or redirect users to malicious destinations.",
          systemDesignConnection: "Modern architectures protect DNS using DNSSEC, redundant DNS providers, anycast, rate limiting, traffic filtering, DNS firewalls, monitoring, and encrypted DNS protocols such as DoH or DoT.",
          example: "In a cache poisoning attack, an attacker tries to inject a fake DNS answer so users are sent to a malicious IP instead of the real service.",
          commonMisconception: "Securing the application server is not enough. If DNS is compromised or unavailable, users may never reach the server safely."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "DNS routes before the app sees traffic",
          body: "DNS decisions happen before TCP connections, TLS handshakes, HTTP requests, or application logic.",
          takeaway: "DNS is part of the request path and architecture."
        },
        {
          type: "concept",
          title: "DNS can distribute traffic globally",
          body: "DNS can return different endpoints based on geography, latency, capacity, or failover policy.",
          takeaway: "DNS can act as a global traffic steering layer."
        },
        {
          type: "concept",
          title: "Failover starts early",
          body: "If a region fails, DNS can redirect users to a healthy region, but TTL and caching determine how fast that change is observed.",
          takeaway: "DNS failover depends on both policy and cache behavior."
        },
        {
          type: "concept",
          title: "DNS is a security boundary",
          body: "DNS poisoning, spoofing, and DDoS can disrupt access even when application servers are healthy.",
          takeaway: "DNS needs redundancy, monitoring, and security controls."
        }
      ],
      visualModels: [
        {
          title: "DNS-Based Global Routing",
          description: "DNS can choose different application entry points for different users.",
          flow: [
            "User in Europe queries app.example.com",
            "DNS policy selects European endpoint",
            "User in Asia queries the same domain",
            "DNS policy selects Asian endpoint"
          ],
          learnerShouldNotice: "The same domain can produce different answers depending on routing policy and user context."
        },
        {
          title: "DNS Failover Flow",
          description: "DNS can shift users away from failed infrastructure.",
          flow: [
            "Health check detects primary region failure",
            "DNS stops returning primary endpoint",
            "DNS begins returning backup endpoint",
            "Clients refresh DNS records as cached entries expire"
          ],
          learnerShouldNotice: "Failover speed depends heavily on TTL, resolver behavior, and cache expiration."
        },
        {
          title: "DNS and CDN Request Path",
          description: "DNS helps select where content should be served from.",
          flow: [
            "User requests static.example.com",
            "DNS/CDN routing chooses a nearby edge location",
            "Edge serves cached content if available",
            "If needed, edge fetches from origin and caches for future requests"
          ],
          learnerShouldNotice: "DNS is often the first step in CDN acceleration."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "How can DNS help with large-scale traffic distribution?",
          options: [
            "By returning different endpoints based on policy such as geography, latency, capacity, or failover",
            "By executing application business logic closer to the user",
            "By storing all application data in browser memory",
            "By replacing the need for load balancers entirely in every system"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS can steer users toward different servers, regions, load balancers, or CDN edges before application requests are sent."
        },
        {
          type: "true_false",
          prompt: "DNS security matters because DNS attacks can disrupt access even if the application itself is healthy.",
          correctAnswer: true,
          explanation: "DNS is often required before users can reach the application. Attacks like cache poisoning or DDoS can break or redirect access."
        },
        {
          type: "fill_blank",
          prompt: "In CDN architectures, DNS often helps direct users to a nearby ____ location.",
          options: [
            "edge",
            "compiler",
            "transaction log",
            "primary key"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS can help route users to nearby CDN edge locations for faster content delivery."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match the large-scale DNS feature to its use case.",
          pairs: [
            {
              left: "Geolocation routing",
              right: "Send users to a nearby regional endpoint"
            },
            {
              left: "Failover DNS",
              right: "Redirect traffic away from unhealthy infrastructure"
            },
            {
              left: "Anycast DNS",
              right: "Route users to a nearby instance advertising the same IP"
            },
            {
              left: "DNSSEC",
              right: "Help verify DNS responses and reduce spoofing risk"
            }
          ],
          explanation: "At scale, DNS supports routing, resilience, performance, and security."
        },
        {
          type: "ordering",
          prompt: "Order a simplified DNS failover sequence.",
          items: [
            "Clients begin receiving the backup endpoint after cache expiration",
            "Health checks detect the primary endpoint is unavailable",
            "DNS provider updates responses to prefer the backup endpoint",
            "Users continue querying the same domain name"
          ],
          correctOrder: [
            "Health checks detect the primary endpoint is unavailable",
            "DNS provider updates responses to prefer the backup endpoint",
            "Users continue querying the same domain name",
            "Clients begin receiving the backup endpoint after cache expiration"
          ],
          explanation: "DNS failover changes what endpoint the domain resolves to, but clients and resolvers may continue using cached records until TTL expiration."
        },
        {
          type: "scenario",
          prompt: "A healthy application suddenly becomes unreachable worldwide because attackers are overwhelming the authoritative DNS provider. Which mitigation is most relevant?",
          options: [
            "Use redundant DNS providers, anycast DNS, rate limiting, and traffic filtering",
            "Add another database read replica only",
            "Increase CSS minification",
            "Switch from HTTP GET to HTTP POST"
          ],
          correctAnswerIndex: 0,
          explanation: "The problem is DNS availability, so DNS-layer resilience and DDoS protection are the relevant mitigations."
        }
      ],
      checkpoint: {
        summary: "In large-scale systems, DNS supports global routing, load distribution, failover, CDN integration, and security. DNS decisions affect user experience before requests reach application servers.",
        learnerCanNow: [
          "Explain how DNS participates in traffic distribution",
          "Describe DNS failover and its TTL limitations",
          "Explain how DNS helps CDNs route users to edge locations",
          "Identify major DNS security risks and mitigations"
        ],
        explainInYourOwnWords: "Why should system designers treat DNS as part of application architecture rather than just a naming utility?"
      }
    }
  ],
  interviewPrep: {
    questions: [
      {
        question: "Explain the DNS resolution process step by step.",
        whatInterviewerLooksFor: "A clear sequence from local caches to recursive resolver, root server, TLD server, authoritative server, caching, and final browser connection.",
        strongAnswer: "When a user enters a domain, the browser first checks its DNS cache. If it does not have the answer, the operating system cache is checked. If there is still no answer, the query goes to a recursive resolver, often from an ISP or public DNS provider. The resolver checks its cache. On a cache miss, it asks a root name server, which points it to the correct TLD server such as .com. The TLD server points it to the authoritative name server for the domain. The authoritative server returns the requested DNS record, such as an A or AAAA record. The resolver caches the response according to its TTL and returns it to the client. The browser can then use the IP address to connect to the web server.",
        answerStructure: [
          "Start with local browser and OS cache checks",
          "Describe recursive resolver traversal through root, TLD, and authoritative servers",
          "End with response caching and connection to the target server"
        ],
        commonMistakes: [
          "Skipping browser and OS caches",
          "Saying the root server returns the final website IP",
          "Confusing recursive resolvers with authoritative servers",
          "Forgetting that the resolver caches the answer"
        ],
        followUps: [
          "What happens if the resolver already has the answer cached?",
          "Why does DNS use a hierarchy instead of one central database?",
          "How does TTL affect this process?"
        ]
      },
      {
        question: "What is the difference between authoritative and recursive DNS servers?",
        whatInterviewerLooksFor: "Understanding that recursive resolvers perform lookups on behalf of clients, while authoritative servers store final DNS records for domains.",
        strongAnswer: "A recursive DNS server acts as an intermediary for the client. It receives a DNS query and performs the lookup process, using caches and contacting root, TLD, and authoritative servers if needed. An authoritative DNS server is the source of truth for a DNS zone. It stores the actual records for a domain, such as A, AAAA, CNAME, MX, and TXT records, and provides the final answer. In short, recursive servers fetch and cache answers; authoritative servers own and serve definitive records.",
        answerStructure: [
          "Define recursive resolver as client-facing lookup agent",
          "Define authoritative server as source of truth for domain records",
          "Contrast fetch/cache behavior with record ownership"
        ],
        commonMistakes: [
          "Saying recursive resolvers permanently own domain records",
          "Saying authoritative servers perform full internet-wide searches",
          "Ignoring caching in recursive resolvers"
        ],
        followUps: [
          "Who usually operates recursive resolvers?",
          "Who manages authoritative DNS for a domain?",
          "Which server returns the final DNS record?"
        ]
      },
      {
        question: "How does DNS caching improve performance? Where does it occur?",
        whatInterviewerLooksFor: "Explanation of latency reduction, upstream load reduction, and the major cache locations: browser, OS, and recursive resolver.",
        strongAnswer: "DNS caching improves performance by storing previous DNS answers so future lookups do not need to traverse the full DNS hierarchy. This reduces latency for users and lowers load on root, TLD, and authoritative DNS servers. Caching occurs at multiple levels: the browser may cache recently resolved domains, the operating system maintains a DNS cache for local applications, and recursive resolvers cache responses for many users. Cached records remain valid only until their TTL expires.",
        answerStructure: [
          "Explain that caching avoids repeated network lookups",
          "List browser, OS, and recursive resolver caches",
          "Mention TTL as the expiration control"
        ],
        commonMistakes: [
          "Saying caching only happens at DNS servers",
          "Forgetting the latency benefit",
          "Ignoring TTL and stale record behavior"
        ],
        followUps: [
          "What is the downside of caching?",
          "How can caching affect DNS migrations?",
          "Why is resolver caching especially useful for popular domains?"
        ]
      },
      {
        question: "What is TTL in DNS, and why is it important?",
        whatInterviewerLooksFor: "Recognition that TTL controls cache lifetime and creates a trade-off between performance and freshness.",
        strongAnswer: "TTL, or Time-to-Live, is a value on DNS records that tells caches how long the answer can be considered valid before it must be refreshed. A long TTL improves cache hit rates, reduces DNS query volume, and improves performance, but it slows down propagation when DNS records change. A short TTL allows faster migrations, failovers, and routing changes, but it increases DNS traffic and dependency on DNS infrastructure. At scale, TTL is an operational decision that affects performance, reliability, and recovery speed.",
        answerStructure: [
          "Define TTL as cache validity duration",
          "Explain long TTL benefits and downsides",
          "Explain short TTL benefits and downsides"
        ],
        commonMistakes: [
          "Claiming DNS changes are instant everywhere",
          "Assuming shorter TTL is always better",
          "Ignoring increased DNS traffic from short TTLs"
        ],
        followUps: [
          "What TTL might you use before a migration?",
          "Why might you raise TTL after a stable cutover?",
          "How does TTL affect DNS failover?"
        ]
      },
      {
        question: "How does DNS-based load balancing work in large-scale systems?",
        whatInterviewerLooksFor: "Understanding that DNS can return different IPs or endpoints using round-robin, geolocation, failover, or anycast, while recognizing caching limitations.",
        strongAnswer: "DNS-based load balancing distributes users by returning different IP addresses or endpoints for the same domain. With round-robin DNS, responses rotate among several server IPs. With geolocation or latency-based routing, users are directed to a nearby or better-performing region. With failover DNS, unhealthy endpoints are removed or deprioritized so traffic goes to healthy ones. Anycast can advertise the same IP from multiple locations and let network routing send users to a nearby instance. This improves performance and availability, but DNS caching and TTL mean traffic shifts may not be immediate or perfectly balanced.",
        answerStructure: [
          "Describe returning different endpoints for the same domain",
          "Give examples such as round-robin, geolocation, failover, and anycast",
          "Mention benefits and limitations due to caching"
        ],
        commonMistakes: [
          "Treating DNS load balancing as perfect per-request balancing",
          "Forgetting that resolvers cache answers",
          "Ignoring health checks and failover behavior"
        ],
        followUps: [
          "How is DNS load balancing different from a layer 7 load balancer?",
          "What happens if a DNS answer is cached during a failover?",
          "When would you use geolocation-based DNS routing?"
        ]
      },
      {
        question: "What are common DNS-related security threats, and how can they be mitigated?",
        whatInterviewerLooksFor: "Awareness of DNS spoofing, cache poisoning, DDoS, man-in-the-middle attacks, NXDOMAIN floods, and mitigations such as DNSSEC, anycast, rate limiting, filtering, and encrypted DNS.",
        strongAnswer: "Common DNS threats include DNS spoofing or cache poisoning, where attackers inject false records and redirect users to malicious destinations; DDoS attacks, where DNS infrastructure is overwhelmed; man-in-the-middle attacks, where DNS responses are intercepted or modified; and NXDOMAIN-style attacks, where resolvers are flooded with queries for nonexistent domains. Mitigations include DNSSEC to validate records, redundant DNS providers, anycast networks, rate limiting, DNS firewalls, traffic filtering, monitoring, and encrypted DNS protocols such as DNS-over-HTTPS or DNS-over-TLS.",
        answerStructure: [
          "Name major DNS attack types",
          "Explain the impact on users and availability",
          "Map each threat to practical mitigations"
        ],
        commonMistakes: [
          "Only discussing application-layer security",
          "Ignoring DNS availability as a reliability concern",
          "Mentioning DNSSEC without explaining what risk it reduces"
        ],
        followUps: [
          "How does DNSSEC help?",
          "Why does anycast help with DNS DDoS resilience?",
          "What is the difference between DNSSEC and encrypted DNS?"
        ]
      }
    ]
  },
  revision: {
    flashcards: [
      {
        front: "What problem does DNS solve?",
        back: "DNS translates human-readable domain names into IP addresses so users can access services by stable names instead of numeric addresses.",
        category: "Core concept"
      },
      {
        front: "Why is DNS important in system design?",
        back: "DNS is often the first step in a request and affects reachability, performance, routing, failover, and security.",
        category: "System design"
      },
      {
        front: "What does a recursive resolver do?",
        back: "It performs DNS lookups on behalf of a client, using caches and querying root, TLD, and authoritative servers when needed.",
        category: "DNS servers"
      },
      {
        front: "What does an authoritative DNS server do?",
        back: "It stores and returns the definitive DNS records for a domain or zone.",
        category: "DNS servers"
      },
      {
        front: "What is a root name server's role?",
        back: "It directs resolvers toward the correct top-level domain servers, such as those for .com or .org.",
        category: "DNS hierarchy"
      },
      {
        front: "What is a TLD server's role?",
        back: "It points the resolver to the authoritative name server responsible for a domain under that top-level domain.",
        category: "DNS hierarchy"
      },
      {
        front: "Where does DNS caching occur?",
        back: "DNS caching can occur in the browser, operating system, and recursive resolver.",
        category: "Caching"
      },
      {
        front: "What is TTL?",
        back: "TTL, or Time-to-Live, defines how long a DNS record can remain cached before it must be refreshed.",
        category: "Caching"
      },
      {
        front: "What is the trade-off of a long TTL?",
        back: "A long TTL reduces DNS query load and improves cache performance, but slows propagation of DNS changes.",
        category: "Trade-offs"
      },
      {
        front: "What is the trade-off of a short TTL?",
        back: "A short TTL allows faster migrations and failover, but increases DNS query volume and reliance on DNS infrastructure.",
        category: "Trade-offs"
      },
      {
        front: "How can DNS support failover?",
        back: "DNS can stop returning unhealthy endpoints and return healthy backup regions or environments instead, subject to caching and TTL behavior.",
        category: "Reliability"
      },
      {
        front: "How does DNS help CDNs?",
        back: "DNS helps route users to an appropriate CDN edge location, often based on geography, latency, load, or availability.",
        category: "CDN"
      },
      {
        front: "What is DNS cache poisoning?",
        back: "An attack where false DNS records are injected into a cache, potentially redirecting users to malicious destinations.",
        category: "Security"
      },
      {
        front: "Name common DNS security mitigations.",
        back: "DNSSEC, redundant DNS providers, anycast, rate limiting, DNS firewalls, traffic filtering, monitoring, DoH, and DoT.",
        category: "Security"
      }
    ],
    glossary: [
      {
        term: "DNS",
        definition: "The Domain Name System, a distributed system that translates domain names into IP addresses and other records.",
        relatedConcepts: [
          "Domain name",
          "IP address",
          "DNS resolution"
        ]
      },
      {
        term: "Domain name",
        definition: "A human-readable name such as example.com that identifies an internet resource.",
        relatedConcepts: [
          "DNS",
          "IP address"
        ]
      },
      {
        term: "DNS resolution",
        definition: "The process of converting a domain name into the DNS record needed to connect to a service, commonly an IP address.",
        relatedConcepts: [
          "Recursive resolver",
          "Authoritative server",
          "Caching"
        ]
      },
      {
        term: "Recursive resolver",
        definition: "A DNS server that receives client queries and performs the lookup process on the client's behalf.",
        relatedConcepts: [
          "Browser cache",
          "Root server",
          "TLD server",
          "Resolver cache"
        ]
      },
      {
        term: "Root name server",
        definition: "A DNS server layer that directs resolvers to the appropriate top-level domain server.",
        relatedConcepts: [
          "DNS hierarchy",
          "TLD server"
        ]
      },
      {
        term: "TLD server",
        definition: "A top-level domain server responsible for domains under a suffix such as .com, .net, or .org and for directing resolvers to authoritative servers.",
        relatedConcepts: [
          "Root server",
          "Authoritative server"
        ]
      },
      {
        term: "Authoritative name server",
        definition: "The source of truth for DNS records in a domain or zone.",
        relatedConcepts: [
          "A record",
          "CNAME record",
          "DNS zone"
        ]
      },
      {
        term: "A record",
        definition: "A DNS record that maps a domain name to an IPv4 address.",
        relatedConcepts: [
          "AAAA record",
          "IP address"
        ]
      },
      {
        term: "AAAA record",
        definition: "A DNS record that maps a domain name to an IPv6 address.",
        relatedConcepts: [
          "A record",
          "IPv6"
        ]
      },
      {
        term: "CNAME record",
        definition: "A DNS record that aliases one domain name to another domain name.",
        relatedConcepts: [
          "Authoritative name server",
          "DNS record"
        ]
      },
      {
        term: "TTL",
        definition: "Time-to-Live, the duration for which a DNS response can be cached before it must be refreshed.",
        relatedConcepts: [
          "Caching",
          "Propagation",
          "Failover"
        ]
      },
      {
        term: "DNS caching",
        definition: "The practice of storing DNS responses temporarily to reduce lookup latency and upstream DNS load.",
        relatedConcepts: [
          "Browser cache",
          "OS cache",
          "Resolver cache",
          "TTL"
        ]
      },
      {
        term: "DNS propagation",
        definition: "The process by which updated DNS records become visible as caches expire and resolvers fetch fresh data.",
        relatedConcepts: [
          "TTL",
          "Caching",
          "Migration"
        ]
      },
      {
        term: "DNS-based load balancing",
        definition: "A technique where DNS returns different endpoints for the same domain to distribute traffic across servers, regions, or data centers.",
        relatedConcepts: [
          "Round-robin DNS",
          "Geolocation routing",
          "Failover DNS"
        ]
      },
      {
        term: "Anycast DNS",
        definition: "A routing technique where the same IP address is advertised from multiple locations so users reach a nearby or best available instance.",
        relatedConcepts: [
          "Global routing",
          "Availability",
          "DDoS resilience"
        ]
      },
      {
        term: "DNS failover",
        definition: "A strategy that redirects DNS responses from unhealthy infrastructure to healthy backup endpoints.",
        relatedConcepts: [
          "Health checks",
          "TTL",
          "Disaster recovery"
        ]
      },
      {
        term: "DNSSEC",
        definition: "Domain Name System Security Extensions, a set of mechanisms that help validate DNS responses and reduce spoofing or cache poisoning risk.",
        relatedConcepts: [
          "DNS security",
          "Cache poisoning"
        ]
      },
      {
        term: "DNS cache poisoning",
        definition: "An attack where a DNS cache is polluted with incorrect records, potentially redirecting users to malicious destinations.",
        relatedConcepts: [
          "DNS spoofing",
          "DNSSEC",
          "Security"
        ]
      },
      {
        term: "DoH",
        definition: "DNS-over-HTTPS, a protocol for sending DNS queries over encrypted HTTPS connections.",
        relatedConcepts: [
          "Encrypted DNS",
          "Privacy",
          "DoT"
        ]
      },
      {
        term: "DoT",
        definition: "DNS-over-TLS, a protocol for sending DNS queries over encrypted TLS connections.",
        relatedConcepts: [
          "Encrypted DNS",
          "Privacy",
          "DoH"
        ]
      }
    ],
    finalQuiz: [
      {
        type: "mcq",
        prompt: "Why does DNS exist?",
        options: [
          "To translate human-friendly domain names into addresses computers can use",
          "To render HTML pages inside the browser",
          "To replace TCP and UDP in network communication",
          "To store user passwords for websites"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS maps names like example.com to IP addresses and other records required for network communication."
      },
      {
        type: "mcq",
        prompt: "Which DNS component usually works on behalf of the user to find DNS answers?",
        options: [
          "Recursive resolver",
          "Authoritative name server only",
          "Web application server",
          "Database replica"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "The recursive resolver receives the client's query and performs the lookup process if the answer is not cached."
      },
      {
        type: "mcq",
        prompt: "Which DNS server is the source of truth for a domain's records?",
        options: [
          "Authoritative name server",
          "Browser cache",
          "Root name server",
          "Client-side load balancer"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "The authoritative name server stores and returns the definitive DNS records for a domain."
      },
      {
        type: "mcq",
        prompt: "What usually happens first when a user types a domain into a browser?",
        options: [
          "The browser checks whether it already has a cached DNS answer",
          "The authoritative DNS server directly sends HTML to the browser",
          "The root server immediately returns the final website IP",
          "The database opens a session with the client"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS resolution starts locally with browser and operating system cache checks before external lookup."
      },
      {
        type: "mcq",
        prompt: "What is the main benefit of DNS caching?",
        options: [
          "It reduces lookup latency and lowers load on DNS infrastructure",
          "It permanently prevents all DNS record changes",
          "It encrypts every DNS response automatically",
          "It removes the need for authoritative name servers"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Caching lets DNS answers be reused, avoiding repeated traversal of the DNS hierarchy."
      },
      {
        type: "mcq",
        prompt: "What does a long TTL generally do?",
        options: [
          "Improves cache efficiency but slows propagation of DNS changes",
          "Forces every lookup to contact the authoritative server",
          "Disables DNS caching in browsers",
          "Guarantees instant failover"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Long TTLs reduce query volume and improve performance, but old cached answers may persist longer."
      },
      {
        type: "mcq",
        prompt: "A team wants faster DNS failover during an incident. Which TTL strategy is usually helpful before the incident or migration window?",
        options: [
          "Use a shorter TTL",
          "Use a very long TTL",
          "Remove the authoritative name server",
          "Disable all DNS records"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Shorter TTLs cause caches to refresh more frequently, helping DNS changes take effect faster."
      },
      {
        type: "mcq",
        prompt: "How can DNS help a CDN?",
        options: [
          "By directing users to an appropriate nearby edge location",
          "By storing all CDN files inside root DNS servers",
          "By replacing the origin server's storage layer",
          "By executing JavaScript in the user's browser"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS-based routing can help select a CDN edge location based on geography, latency, load, or availability."
      },
      {
        type: "mcq",
        prompt: "Which statement about DNS-based load balancing is most accurate?",
        options: [
          "It can distribute users across endpoints, but caching means traffic shifts may not be instant or perfectly even",
          "It performs perfect per-request balancing with no caching effects",
          "It only works for databases and never for web services",
          "It eliminates the need for disaster recovery planning"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS can steer traffic, but cached DNS answers and TTL influence how quickly and evenly changes take effect."
      },
      {
        type: "mcq",
        prompt: "Which threat involves injecting false DNS records so users may be redirected to malicious destinations?",
        options: [
          "DNS cache poisoning",
          "Image compression",
          "HTTP keep-alive",
          "Database sharding"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS cache poisoning attempts to corrupt DNS caches with incorrect records."
      },
      {
        type: "mcq",
        prompt: "Which set of techniques is most relevant for protecting DNS availability and integrity?",
        options: [
          "DNSSEC, redundant DNS providers, anycast, rate limiting, and traffic filtering",
          "Only database indexing and query optimization",
          "Only CSS minification and image resizing",
          "Only increasing application server RAM"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS security and reliability require DNS-layer controls, redundancy, validation, filtering, and monitoring."
      },
      {
        type: "mcq",
        prompt: "What is the key architectural lesson from DNS?",
        options: [
          "Caching, delegation, and hierarchy can create a scalable global system",
          "Every global system should be one centralized database",
          "Caching should always be avoided because it introduces trade-offs",
          "Domain names should be hardcoded directly into application binaries only"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "DNS scales globally through delegation, hierarchy, and caching, while managing trade-offs like freshness and performance."
      }
    ]
  }
};