export const lecture = {
  id: "lecture-17-tcp-udp",
  sectionId: "section-3-protocols",
  lectureNumber: 17,
  title: "TCP & UDP",
  slug: "tcp-udp",
  estimatedMinutes: 24,
  difficulty: "beginner",
  prerequisites: [
    "Basic understanding of clients and servers",
    "Basic understanding of networks and packets",
    "Familiarity with request-response communication"
  ],
  learningOutcomes: [
    "Explain what TCP and UDP are and how they differ",
    "Describe why TCP is reliable but has more overhead",
    "Describe why UDP is faster but provides fewer guarantees",
    "Choose TCP or UDP based on reliability, latency, and user experience requirements",
    "Apply TCP and UDP trade-offs to common system design examples",
    "Answer interview questions about TCP reliability, UDP packet loss, and protocol choice"
  ],
  sourceFiles: {
    transcript: "System Design/Section 3: Protocols/17. TCP & UDP",
    sectionSlides: "System Design/Section 3: Protocols/00-System+Design+-+updated+-+Section+3.txt",
    interviewQuestions: "System Design/Section 3: Protocols/17. Interview+questions+-+TCP+and+UDP.txt"
  },
  sourceSummary: {
    transcriptFocus: "The lecture explains TCP and UDP as the two major transport-layer protocols, emphasizing the trade-off between TCP reliability and UDP low latency. It covers TCP connection setup, acknowledgements, retransmission, ordering, UDP connectionless sending, real-time use cases, and how architects choose protocols based on correctness versus responsiveness.",
    interviewFocus: "The interview material focuses on comparing TCP and UDP, when to use each, TCP reliability mechanisms, why UDP is faster, disadvantages of each protocol, application-level reliability over UDP, combining TCP and UDP, DNS behavior, and firewall considerations.",
    slideFocus: "The relevant slides define TCP as connection-oriented, reliable, ordered, and error-checked; UDP as connectionless, faster, and without delivery guarantees; compare reliability, speed, and connection type; list use cases; and highlight system design interview trade-offs around speed versus reliability."
  },
  lessons: [
    {
      id: "lecture-17-tcp-udp-lesson-1",
      title: "TCP: Reliable Communication",
      goal: "Understand how TCP creates the feeling of a reliable communication channel over an unreliable network.",
      order: 1,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "TCP as a reliable transport protocol",
          explanation: "TCP, or Transmission Control Protocol, is a transport-layer protocol that sits between an application and the network. Networks can lose, delay, duplicate, or reorder packets. TCP hides much of that complexity by making communication appear reliable to the application.",
          whyItMatters: "Most business systems cannot tolerate missing or corrupted data. If a payment request, database update, file download, or email message is incomplete, correctness breaks.",
          systemDesignConnection: "When designing APIs, databases, payment systems, web applications, or file transfer systems, TCP is usually the default because correctness and consistency matter more than shaving off the last few milliseconds.",
          example: "When you download a PDF, TCP ensures the file arrives completely and in the right order before the application treats it as usable.",
          commonMisconception: "A common misconception is that networks naturally deliver packets reliably. In reality, the network is unpredictable; TCP adds reliability on top."
        },
        {
          name: "Connection-oriented communication",
          explanation: "TCP establishes a connection before data is exchanged. This setup is often explained with the three-way handshake, where both sides confirm they are ready to communicate.",
          whyItMatters: "The connection setup adds a small delay, but it provides the foundation for tracking data, acknowledging receipt, and managing reliable delivery.",
          systemDesignConnection: "At scale, many TCP connections can consume server resources such as memory, sockets, and CPU. Architects must consider connection pooling, keep-alives, load balancers, and timeouts.",
          example: "TCP is like a phone call: both sides agree to communicate before the conversation begins.",
          commonMisconception: "TCP is not just 'slower internet.' It deliberately spends extra work to provide stronger guarantees."
        },
        {
          name: "Acknowledgements, retransmission, and ordering",
          explanation: "TCP numbers segments, receives acknowledgements, retransmits missing data, checks for errors, and reassembles packets in the correct order before delivering data to the application.",
          whyItMatters: "Applications can work with a clean stream of data instead of handling every missing or out-of-order packet themselves.",
          systemDesignConnection: "TCP is valuable when application logic should focus on business behavior rather than rebuilding transport reliability. This is why many higher-level protocols, including HTTP and database protocols, commonly run over TCP.",
          example: "If packets for a web page arrive out of order, TCP reorders them before the browser receives the data.",
          commonMisconception: "TCP does not mean packets never get lost. Packets can still be lost; TCP detects the issue and retransmits them."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "TCP’s main promise",
          body: "TCP prioritizes reliable, ordered, error-checked delivery. It makes sure the application receives the data correctly, even if the underlying network is messy.",
          takeaway: "Use TCP when correctness matters."
        },
        {
          type: "analogy",
          title: "Phone call, not postcard",
          body: "TCP behaves more like a phone call than a postcard. Both sides establish communication first, then exchange data while tracking whether messages arrive.",
          takeaway: "TCP is connection-oriented."
        },
        {
          type: "tradeoff",
          title: "Reliability has a cost",
          body: "Connection setup, acknowledgements, retransmissions, and ordering all add overhead. That overhead is useful when lost data would be harmful.",
          takeaway: "TCP trades latency and overhead for correctness."
        },
        {
          type: "system_design",
          title: "Where TCP shines",
          body: "Web pages, payments, file transfers, email, APIs, and database communication usually need complete and accurate data.",
          takeaway: "TCP is the backbone of many business-critical systems."
        }
      ],
      visualModels: [
        {
          title: "TCP reliability flow",
          description: "TCP wraps unreliable packet delivery with reliability mechanisms before data reaches the application.",
          flow: [
            "Application wants to send data",
            "TCP establishes a connection",
            "TCP numbers segments and sends them",
            "Receiver sends acknowledgements",
            "Missing segments are retransmitted",
            "TCP reorders data and delivers a clean stream"
          ],
          learnerShouldNotice: "The application does not need to manually reorder every packet or request every missing segment; TCP handles that work."
        },
        {
          title: "TCP cost model",
          description: "Each reliability feature improves correctness but adds some latency or resource cost.",
          flow: [
            "Handshake adds setup latency",
            "ACKs add network chatter",
            "Retransmissions add delay when loss occurs",
            "Ordering requires buffering",
            "Reliability improves application correctness"
          ],
          learnerShouldNotice: "TCP is not accidentally slower; it is intentionally doing extra work."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "What is the main goal of TCP?",
          options: [
            "To guarantee low latency by ignoring packet loss",
            "To provide reliable, ordered, error-checked delivery",
            "To encrypt all internet traffic",
            "To replace application-level APIs"
          ],
          correctAnswerIndex: 1,
          explanation: "TCP’s main value is reliable, ordered communication with mechanisms such as acknowledgements, retransmission, and error checking."
        },
        {
          type: "true_false",
          prompt: "TCP establishes a connection before exchanging application data.",
          correctAnswer: true,
          explanation: "TCP is connection-oriented and uses connection setup before data transfer."
        },
        {
          type: "fill_blank",
          prompt: "TCP retransmits data when it detects that a segment is ____.",
          options: [
            "missing",
            "encrypted",
            "compressed",
            "cached"
          ],
          correctAnswerIndex: 0,
          explanation: "Retransmission of missing data is one of the key mechanisms TCP uses to provide reliability."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each TCP mechanism to its purpose.",
          pairs: [
            {
              left: "Three-way handshake",
              right: "Establishes a connection before data transfer"
            },
            {
              left: "Acknowledgement",
              right: "Confirms that data was received"
            },
            {
              left: "Retransmission",
              right: "Sends missing data again"
            },
            {
              left: "Ordering",
              right: "Reassembles segments in the correct sequence"
            }
          ],
          explanation: "TCP combines several mechanisms to make an unreliable network look reliable to applications."
        },
        {
          type: "ordering",
          prompt: "Put the simplified TCP communication flow in order.",
          items: [
            "Receiver acknowledges received segments",
            "TCP establishes a connection",
            "Application sends data through TCP",
            "TCP retransmits missing segments if needed",
            "Application receives ordered data"
          ],
          correctOrder: [
            "TCP establishes a connection",
            "Application sends data through TCP",
            "Receiver acknowledges received segments",
            "TCP retransmits missing segments if needed",
            "Application receives ordered data"
          ],
          explanation: "TCP first establishes a session, then transfers, tracks, retransmits if necessary, and delivers data in order."
        },
        {
          type: "scenario",
          prompt: "You are designing a payment processing service. A missing packet could cause an incomplete or incorrect transaction. Which protocol is the safer default?",
          options: [
            "TCP, because correctness and reliable delivery are critical",
            "UDP, because payments should always minimize latency",
            "UDP, because it automatically retries lost packets",
            "Neither, because transport protocols do not affect correctness"
          ],
          correctAnswerIndex: 0,
          explanation: "Payment systems require accurate, complete data. TCP’s reliability guarantees are worth the overhead."
        }
      ],
      checkpoint: {
        summary: "TCP creates reliable communication over unreliable networks using connection setup, acknowledgements, retransmission, error checking, and ordering.",
        learnerCanNow: [
          "Define TCP in system design terms",
          "Explain why TCP is connection-oriented",
          "Describe how TCP handles missing or out-of-order data",
          "Identify systems where TCP is the right default"
        ],
        explainInYourOwnWords: "Why is TCP a good fit for payment systems, file downloads, and database communication even though it has more overhead?"
      }
    },
    {
      id: "lecture-17-tcp-udp-lesson-2",
      title: "UDP: Fast, Lightweight Communication",
      goal: "Understand why UDP avoids reliability overhead and why that can be useful for real-time systems.",
      order: 2,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "UDP as a connectionless protocol",
          explanation: "UDP, or User Datagram Protocol, is a transport-layer protocol that sends packets without first establishing a connection. There is no handshake, no session setup, and no built-in continuous tracking of communication state.",
          whyItMatters: "Avoiding connection setup makes UDP lightweight and fast, especially for systems that send many small messages or care deeply about latency.",
          systemDesignConnection: "UDP can reduce overhead in high-frequency systems such as gaming, voice, real-time streaming, DNS, telemetry, and market data feeds.",
          example: "A game client can send frequent player position updates without waiting for a connection handshake or acknowledgement for each update.",
          commonMisconception: "UDP is not 'bad TCP.' It is designed for different requirements: speed and low overhead instead of guaranteed delivery."
        },
        {
          name: "UDP provides no delivery guarantees",
          explanation: "UDP does not guarantee that packets arrive, arrive once, arrive in order, or arrive quickly. It also does not automatically retransmit lost packets or reorder data.",
          whyItMatters: "If an application needs reliability while using UDP, the application must implement the recovery behavior itself.",
          systemDesignConnection: "Choosing UDP can move complexity from the transport layer into the application. At scale, this may be worthwhile for latency-sensitive systems but dangerous for correctness-sensitive systems.",
          example: "A voice call may tolerate a tiny missing audio packet because waiting to recover it would make the conversation feel delayed.",
          commonMisconception: "UDP does not mean data will always be lost. It means the protocol does not guarantee recovery if loss happens."
        },
        {
          name: "Freshness over completeness",
          explanation: "Many real-time systems value the newest information more than old information. A packet from two seconds ago may no longer be useful, even if it eventually arrives correctly.",
          whyItMatters: "This changes the design goal. Instead of asking, 'Did every packet arrive?' the system asks, 'Did the user receive the latest useful data quickly?'",
          systemDesignConnection: "In real-time products, user experience often depends more on responsiveness than perfect historical completeness. Architects should consider whether late data still has value.",
          example: "A voice packet from two seconds ago is outdated because the conversation has already moved on.",
          commonMisconception: "Reliability is not always better. In real-time systems, waiting for old data can harm the user experience more than dropping it."
        }
      ],
      teachingCards: [
        {
          type: "concept",
          title: "UDP’s main promise",
          body: "UDP minimizes protocol overhead. It sends data quickly without connection setup, acknowledgements, retransmission, or ordering.",
          takeaway: "Use UDP when low latency matters more than guaranteed delivery."
        },
        {
          type: "contrast",
          title: "TCP asks one question, UDP asks another",
          body: "TCP asks: did all the data arrive correctly? UDP asks: what is the fastest way to send this data?",
          takeaway: "The protocols optimize for different outcomes."
        },
        {
          type: "example",
          title: "Real-time data expires",
          body: "A bank transaction from two seconds ago is still important. A voice packet from two seconds ago is usually useless.",
          takeaway: "The value of data can decay over time."
        },
        {
          type: "system_design",
          title: "Application-level responsibility",
          body: "If reliability is required on top of UDP, the application must add sequence numbers, custom acknowledgements, retransmission, or error correction.",
          takeaway: "UDP can be fast, but the application may need more logic."
        }
      ],
      visualModels: [
        {
          title: "UDP send-and-move-on flow",
          description: "UDP avoids connection setup and reliability tracking.",
          flow: [
            "Application creates a packet",
            "UDP sends it immediately",
            "Sender does not wait for acknowledgement",
            "Packet may arrive, be delayed, be duplicated, or be lost",
            "Application decides how to handle missing or late data"
          ],
          learnerShouldNotice: "UDP’s speed comes from skipping reliability work, not from magic."
        },
        {
          title: "Real-time freshness model",
          description: "Some data loses value quickly, making retransmission less useful.",
          flow: [
            "Game position update at time T",
            "Newer position update at time T+1",
            "Old update arrives late",
            "System prefers the newest state",
            "Old packet is ignored or dropped"
          ],
          learnerShouldNotice: "In real-time systems, the latest state can be more valuable than complete history."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Why is UDP generally faster than TCP?",
          options: [
            "It encrypts data more efficiently",
            "It avoids connection setup, acknowledgements, retransmissions, and ordering",
            "It guarantees packets use shorter network paths",
            "It stores packets in a database before sending"
          ],
          correctAnswerIndex: 1,
          explanation: "UDP is lightweight because it skips many reliability mechanisms that TCP provides."
        },
        {
          type: "true_false",
          prompt: "UDP automatically retransmits lost packets.",
          correctAnswer: false,
          explanation: "UDP does not retransmit lost packets. If retransmission is needed, the application must implement it."
        },
        {
          type: "fill_blank",
          prompt: "UDP is best described as a ____ protocol.",
          options: [
            "connectionless",
            "connection-oriented",
            "stateful database",
            "file-system"
          ],
          correctAnswerIndex: 0,
          explanation: "UDP is connectionless because it sends packets without establishing a session first."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each UDP property to its system design effect.",
          pairs: [
            {
              left: "No handshake",
              right: "Lower setup latency"
            },
            {
              left: "No acknowledgements",
              right: "Less protocol chatter"
            },
            {
              left: "No retransmission",
              right: "Lost packets are not automatically recovered"
            },
            {
              left: "No ordering guarantee",
              right: "Application may receive packets out of sequence"
            }
          ],
          explanation: "UDP removes reliability features to reduce overhead, but the application must handle the consequences."
        },
        {
          type: "ordering",
          prompt: "Order the simplified UDP flow.",
          items: [
            "Application decides whether missing data matters",
            "Application creates a datagram",
            "UDP sends the datagram immediately",
            "Network may deliver, delay, duplicate, or drop it"
          ],
          correctOrder: [
            "Application creates a datagram",
            "UDP sends the datagram immediately",
            "Network may deliver, delay, duplicate, or drop it",
            "Application decides whether missing data matters"
          ],
          explanation: "UDP sends immediately and does not manage reliability after the datagram is handed to the network."
        },
        {
          type: "scenario",
          prompt: "You are building a live voice call feature. A packet that arrives two seconds late is no longer useful. Which protocol behavior is most aligned with this requirement?",
          options: [
            "UDP, because low latency is more valuable than recovering stale audio",
            "TCP, because every old packet must be played eventually",
            "TCP, because it never introduces retransmission delays",
            "UDP, because it guarantees ordered delivery"
          ],
          correctAnswerIndex: 0,
          explanation: "In voice calls, late audio can be worse than dropped audio. UDP is often preferred for low-latency real-time media."
        }
      ],
      checkpoint: {
        summary: "UDP is connectionless and lightweight. It sends data quickly but provides no built-in guarantees for delivery, ordering, or retransmission.",
        learnerCanNow: [
          "Define UDP and explain why it is lightweight",
          "Describe what guarantees UDP does not provide",
          "Explain why stale data can be less valuable in real-time systems",
          "Identify when application-level reliability may be needed"
        ],
        explainInYourOwnWords: "Why might a video call prefer dropping a packet instead of waiting for it to be retransmitted?"
      }
    },
    {
      id: "lecture-17-tcp-udp-lesson-3",
      title: "Choosing TCP vs UDP",
      goal: "Learn how to select the right protocol based on reliability, latency, and application requirements.",
      order: 3,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "Reliability versus latency",
          explanation: "TCP and UDP operate at the same transport layer, but they optimize for different goals. TCP prioritizes data integrity and correctness. UDP prioritizes low latency and low overhead.",
          whyItMatters: "Protocol choice affects user experience, correctness, infrastructure cost, and failure behavior.",
          systemDesignConnection: "In interviews and real designs, the best answer is rarely 'TCP is better' or 'UDP is better.' The strong answer explains which trade-off fits the product requirements.",
          example: "A banking API should usually use TCP. A multiplayer game’s position updates may use UDP.",
          commonMisconception: "The fastest protocol is not always the best protocol. The right choice depends on what failure mode the system can tolerate."
        },
        {
          name: "When to prefer TCP",
          explanation: "Prefer TCP when missing, corrupted, duplicated, or out-of-order data would cause a serious problem. TCP is common for web browsing, file transfers, email, API requests, and database communication.",
          whyItMatters: "Many systems need complete and accurate data more than they need ultra-low latency.",
          systemDesignConnection: "For business-critical workflows, TCP reduces application complexity because the transport layer handles reliable delivery. This is useful in payments, order processing, document storage, and databases.",
          example: "If a database write request loses part of its data, the system could corrupt state. TCP helps prevent this at the transport layer.",
          commonMisconception: "Using TCP does not remove the need for application-level correctness, idempotency, or transactions. It only provides reliable transport."
        },
        {
          name: "When to prefer UDP",
          explanation: "Prefer UDP when receiving the latest data quickly is more important than receiving every piece of data. UDP is common in online gaming, VoIP, live streaming, DNS lookups, and market data feeds.",
          whyItMatters: "For real-time user experiences, waiting for old data can be worse than losing it.",
          systemDesignConnection: "UDP is useful when the application can tolerate loss, recover at the application layer, or replace old data with newer state.",
          example: "In a multiplayer game, a lost position update may not matter if a newer position update arrives immediately after.",
          commonMisconception: "UDP is not only for media. It is also used for small low-latency queries such as DNS and for high-frequency feeds where timeliness is critical."
        }
      ],
      teachingCards: [
        {
          type: "decision_rule",
          title: "TCP decision rule",
          body: "If missing data would break correctness, choose TCP by default.",
          takeaway: "TCP is for integrity-critical communication."
        },
        {
          type: "decision_rule",
          title: "UDP decision rule",
          body: "If the latest data is more valuable than complete data, consider UDP.",
          takeaway: "UDP is for latency-sensitive communication."
        },
        {
          type: "interview_tip",
          title: "Do not memorize only features",
          body: "Interviewers want to hear the reasoning: reliability, overhead, latency, user experience, and failure tolerance.",
          takeaway: "Explain the trade-off, not just the definition."
        },
        {
          type: "scale",
          title: "At scale, overhead matters",
          body: "TCP’s connection state and retransmissions consume resources. UDP reduces protocol overhead but may require custom application logic and stronger abuse protections.",
          takeaway: "Protocol choice affects infrastructure and operational design."
        }
      ],
      visualModels: [
        {
          title: "Protocol choice decision tree",
          description: "A simplified way to reason about TCP versus UDP.",
          flow: [
            "Would missing or corrupted data break correctness?",
            "If yes, prefer TCP",
            "If no, ask whether low latency is more important",
            "If yes, consider UDP",
            "If using UDP, decide what reliability the application must add"
          ],
          learnerShouldNotice: "The decision begins with product requirements, not protocol popularity."
        },
        {
          title: "Data value over time",
          description: "Different data types age differently.",
          flow: [
            "Bank transaction: still valuable after delay",
            "Database update: still must arrive correctly",
            "Voice packet: loses value quickly",
            "Game position update: often replaced by newer state",
            "Protocol choice follows data value"
          ],
          learnerShouldNotice: "The same delay can be acceptable in one system and harmful in another."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which situation is the strongest reason to choose TCP?",
          options: [
            "A lost packet is acceptable if newer data arrives",
            "Every byte must arrive correctly and in order",
            "The application wants no connection state at all",
            "The data becomes useless after 100 milliseconds"
          ],
          correctAnswerIndex: 1,
          explanation: "TCP is the right choice when complete, ordered, reliable delivery is required."
        },
        {
          type: "true_false",
          prompt: "The choice between TCP and UDP is mainly a trade-off between reliability and latency.",
          correctAnswer: true,
          explanation: "TCP prioritizes reliability and correctness; UDP prioritizes speed and low latency."
        },
        {
          type: "fill_blank",
          prompt: "If receiving the most recent data quickly matters more than receiving every packet, ____ is often a better fit.",
          options: [
            "UDP",
            "TCP",
            "SMTP",
            "IMAP"
          ],
          correctAnswerIndex: 0,
          explanation: "UDP is often used where timeliness is more important than perfect delivery."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each application to the more typical protocol choice.",
          pairs: [
            {
              left: "File transfer",
              right: "TCP"
            },
            {
              left: "Database communication",
              right: "TCP"
            },
            {
              left: "Online game movement updates",
              right: "UDP"
            },
            {
              left: "DNS lookup",
              right: "UDP"
            }
          ],
          explanation: "File and database communication usually need reliable delivery. Game updates and DNS often prioritize low latency."
        },
        {
          type: "ordering",
          prompt: "Order this protocol selection reasoning process.",
          items: [
            "Identify whether missing data breaks correctness",
            "Estimate the cost of latency and retransmission",
            "Choose TCP if reliable delivery is required",
            "Choose or consider UDP if freshness matters more than completeness",
            "Add application-level recovery if UDP still needs partial reliability"
          ],
          correctOrder: [
            "Identify whether missing data breaks correctness",
            "Estimate the cost of latency and retransmission",
            "Choose TCP if reliable delivery is required",
            "Choose or consider UDP if freshness matters more than completeness",
            "Add application-level recovery if UDP still needs partial reliability"
          ],
          explanation: "Good protocol choice starts from requirements, then maps reliability and latency needs to protocol behavior."
        },
        {
          type: "scenario",
          prompt: "You are designing a stock market data feed where clients need the latest price immediately. An update from several seconds ago has little value. Which protocol is often appropriate?",
          options: [
            "UDP, because timeliness and low latency are central",
            "TCP, because every stale price must be delivered before newer prices",
            "TCP, because it is always faster for high-frequency data",
            "UDP, because it guarantees no packet loss"
          ],
          correctAnswerIndex: 0,
          explanation: "Market data feeds often care about low latency and freshness. UDP may be appropriate, sometimes with application-level sequencing or recovery."
        }
      ],
      checkpoint: {
        summary: "TCP and UDP are not ranked as good or bad. TCP fits correctness-sensitive systems; UDP fits latency-sensitive systems where occasional loss is acceptable or handled by the application.",
        learnerCanNow: [
          "Compare TCP and UDP across reliability, speed, and connection type",
          "Choose TCP for integrity-critical workflows",
          "Choose UDP for real-time or freshness-sensitive workflows",
          "Explain protocol choice as an architectural trade-off"
        ],
        explainInYourOwnWords: "How would you decide between TCP and UDP for a new feature if the product team says it must feel real-time?"
      }
    },
    {
      id: "lecture-17-tcp-udp-lesson-4",
      title: "Interview and Real-World Design Patterns",
      goal: "Practice applying TCP and UDP concepts to interview-style system design scenarios.",
      order: 4,
      estimatedMinutes: 6,
      concepts: [
        {
          name: "Explaining TCP reliability in interviews",
          explanation: "A strong interview answer explains that TCP uses a connection setup, acknowledgements, retransmission of lost packets, checksums for error detection, and ordered delivery.",
          whyItMatters: "Interviewers often ask why TCP is considered reliable, not just whether it is reliable.",
          systemDesignConnection: "When justifying TCP for a system, connect protocol mechanics to business impact: preventing corrupted downloads, incomplete transactions, or inconsistent database writes.",
          example: "For an API request that updates a user’s billing address, TCP helps ensure the full request arrives correctly.",
          commonMisconception: "Do not say TCP guarantees the application action succeeds. TCP only guarantees transport delivery; the application still needs validation, retries, idempotency, and business logic."
        },
        {
          name: "Handling reliability when using UDP",
          explanation: "Because UDP does not provide reliability, applications can add sequence numbers, custom acknowledgements, forward error correction, or application-level retransmission for important data.",
          whyItMatters: "UDP does not mean the design must accept all loss blindly. It means the application chooses which reliability mechanisms are worth the latency cost.",
          systemDesignConnection: "Real-time games may send frequent UDP state updates while using reliability for important events. Streaming systems may use buffering or error correction to smooth packet loss.",
          example: "An online game might send player movement over UDP but use more reliable delivery for purchases, chat messages, or match results.",
          commonMisconception: "Using UDP does not prevent all reliability. It simply means reliability is not provided automatically by the transport protocol."
        },
        {
          name: "Combining TCP and UDP",
          explanation: "Some systems use both protocols. They may use UDP for low-latency real-time data and TCP for control messages, login, chat, configuration, or non-time-sensitive operations.",
          whyItMatters: "Real systems often have multiple data types with different reliability and latency requirements.",
          systemDesignConnection: "A system design can split traffic by value: reliable paths for durable state and low-latency paths for ephemeral state.",
          example: "A multiplayer game can use UDP for player movement and TCP for account login, inventory updates, or chat.",
          commonMisconception: "You do not have to choose only one protocol for an entire product. Different parts of the system can use different protocols."
        },
        {
          name: "DNS and operational considerations",
          explanation: "DNS primarily uses UDP because queries and responses are usually small and need to be fast. DNS can use TCP for larger responses or zone transfers. Firewalls often track TCP more easily because it has a clear connection lifecycle, while UDP may require rate limiting and filtering.",
          whyItMatters: "Protocol choice affects operations, security, monitoring, and abuse prevention, not just application behavior.",
          systemDesignConnection: "At scale, UDP services may need careful rate limiting, DDoS protection, deep packet inspection, and timeout handling because connectionless traffic is harder to track.",
          example: "A DNS resolver usually sends a small UDP query and quickly retries if needed, rather than paying TCP connection setup cost for every lookup.",
          commonMisconception: "DNS is not exclusively UDP in every situation. UDP is primary, but TCP is used when responses are large or for zone transfers."
        }
      ],
      teachingCards: [
        {
          type: "interview_tip",
          title: "A strong TCP answer",
          body: "Mention connection setup, ACKs, retransmission, checksums, and ordered delivery. Then connect them to correctness-sensitive use cases.",
          takeaway: "Mechanism plus use case is better than definition alone."
        },
        {
          type: "interview_tip",
          title: "A strong UDP answer",
          body: "Mention no handshake, no ACKs, no retransmission, lower overhead, and suitability for real-time data where old packets lose value.",
          takeaway: "UDP is a deliberate latency trade-off."
        },
        {
          type: "design_pattern",
          title: "Mixed protocol systems",
          body: "Use UDP for frequent ephemeral updates and TCP for durable, important, or user-visible state changes.",
          takeaway: "Protocol selection can happen per data path."
        },
        {
          type: "operations",
          title: "Firewalls see TCP and UDP differently",
          body: "TCP has explicit connection setup and teardown, making it easier to track. UDP is connectionless, so operators often rely on rate limiting and filtering.",
          takeaway: "Transport protocol choice affects security and operations."
        }
      ],
      visualModels: [
        {
          title: "Mixed game networking model",
          description: "A multiplayer game may use different transport behavior for different data types.",
          flow: [
            "Login and account state use reliable communication",
            "Player movement uses low-latency UDP updates",
            "Important events may use acknowledgements or reliable paths",
            "Chat and purchases use reliable delivery",
            "System balances responsiveness and correctness"
          ],
          learnerShouldNotice: "Not all data in the same product has the same reliability requirement."
        },
        {
          title: "UDP reliability add-ons",
          description: "Applications can selectively add reliability on top of UDP.",
          flow: [
            "Add sequence numbers to detect missing or out-of-order packets",
            "Add custom ACKs for important messages",
            "Use forward error correction to recover some losses",
            "Retransmit only data that is still valuable",
            "Drop stale data when delay is worse than loss"
          ],
          learnerShouldNotice: "The application can choose a middle ground between pure speed and full reliability."
        }
      ],
      quickChecks: [
        {
          type: "mcq",
          prompt: "Which mechanism is NOT provided by UDP by default?",
          options: [
            "Sending datagrams",
            "Connectionless transport",
            "Automatic retransmission of lost packets",
            "Low protocol overhead"
          ],
          correctAnswerIndex: 2,
          explanation: "UDP does not automatically retransmit lost packets."
        },
        {
          type: "true_false",
          prompt: "A system can use TCP for some data and UDP for other data.",
          correctAnswer: true,
          explanation: "Many systems split traffic by requirement, using reliable delivery for important state and UDP for real-time updates."
        },
        {
          type: "fill_blank",
          prompt: "DNS primarily uses ____ because most lookups are small and latency-sensitive.",
          options: [
            "UDP",
            "SMTP",
            "FTP",
            "IMAP"
          ],
          correctAnswerIndex: 0,
          explanation: "DNS primarily uses UDP for fast, small request-response lookups, though TCP is used in some cases."
        }
      ],
      practice: [
        {
          type: "match",
          prompt: "Match each interview topic to the key point you should mention.",
          pairs: [
            {
              left: "Why TCP is reliable",
              right: "ACKs, retransmission, ordering, error checking"
            },
            {
              left: "Why UDP is fast",
              right: "No handshake, ACKs, retransmission, or ordering"
            },
            {
              left: "Reliability over UDP",
              right: "Sequence numbers, custom ACKs, FEC, selective retransmission"
            },
            {
              left: "DNS over UDP",
              right: "Small, fast lookups with low setup overhead"
            }
          ],
          explanation: "Interviewers expect both protocol properties and the reasoning behind their use cases."
        },
        {
          type: "ordering",
          prompt: "Order a strong interview answer for choosing UDP in an online game.",
          items: [
            "State the requirement: low latency for real-time movement",
            "Explain that old movement updates lose value quickly",
            "Explain UDP avoids connection and ACK overhead",
            "Mention that important data can use TCP or app-level reliability",
            "Summarize the trade-off: responsiveness over perfect delivery"
          ],
          correctOrder: [
            "State the requirement: low latency for real-time movement",
            "Explain that old movement updates lose value quickly",
            "Explain UDP avoids connection and ACK overhead",
            "Mention that important data can use TCP or app-level reliability",
            "Summarize the trade-off: responsiveness over perfect delivery"
          ],
          explanation: "A strong answer starts with requirements, explains protocol mechanics, and addresses reliability trade-offs."
        },
        {
          type: "scenario",
          prompt: "You are designing a multiplayer game. Player movement must be fast, but in-game purchases must never be lost. What is the best design choice?",
          options: [
            "Use UDP for movement and TCP or reliable application logic for purchases",
            "Use UDP for everything because games always use UDP",
            "Use TCP for movement and intentionally drop purchases",
            "Use neither protocol because mixed requirements are impossible"
          ],
          correctAnswerIndex: 0,
          explanation: "Different data paths have different requirements. Movement is latency-sensitive; purchases are correctness-sensitive."
        }
      ],
      checkpoint: {
        summary: "Interview-ready protocol selection means explaining mechanisms, trade-offs, use cases, and how real systems may combine TCP, UDP, and application-level reliability.",
        learnerCanNow: [
          "Answer why TCP is reliable",
          "Answer why UDP is faster",
          "Explain how applications add reliability over UDP",
          "Describe why DNS primarily uses UDP",
          "Design mixed-protocol systems based on data value"
        ],
        explainInYourOwnWords: "How would you explain to an interviewer why an online game might use both TCP and UDP?"
      }
    }
  ],
  interviewPrep: {
    questions: [
      {
        question: "What is the key difference between TCP and UDP?",
        whatInterviewerLooksFor: "A clear comparison across connection model, reliability, ordering, speed, and use cases.",
        strongAnswer: "TCP is connection-oriented and provides reliable, ordered, error-checked delivery using mechanisms like acknowledgements and retransmission. UDP is connectionless and sends datagrams without guaranteeing delivery, ordering, or retransmission. TCP is better when correctness matters, such as web browsing, file transfer, email, APIs, and databases. UDP is better when low latency matters more than perfect delivery, such as gaming, VoIP, live streaming, DNS, and market data.",
        answerStructure: [
          "Define TCP and UDP at the transport layer",
          "Compare reliability, ordering, connection setup, and speed",
          "Give examples where each protocol is appropriate"
        ],
        commonMistakes: [
          "Saying UDP is always bad because it is unreliable",
          "Saying TCP is always better because it is reliable",
          "Forgetting to mention ordering and retransmission",
          "Ignoring the application requirement behind the choice"
        ],
        followUps: [
          "When would you choose UDP over TCP?",
          "How does TCP provide reliability?",
          "Can an application add reliability on top of UDP?"
        ]
      },
      {
        question: "When should you use TCP over UDP?",
        whatInterviewerLooksFor: "Recognition that TCP is preferred when data integrity, completeness, and ordered delivery are required.",
        strongAnswer: "Use TCP when missing or corrupted data cannot be tolerated. Examples include HTTP and HTTPS web browsing, file transfers, email protocols, payment flows, API requests, and database communication. TCP’s overhead is justified because acknowledgements, retransmissions, and ordered delivery help ensure the receiver gets the correct data.",
        answerStructure: [
          "State that TCP fits correctness-critical communication",
          "Explain the reliability mechanisms that justify the choice",
          "Give concrete examples such as payments, files, and databases"
        ],
        commonMistakes: [
          "Choosing TCP only because it is common",
          "Ignoring latency cost",
          "Claiming TCP guarantees business-level success",
          "Not distinguishing transport reliability from application correctness"
        ],
        followUps: [
          "Would you use TCP for a video call?",
          "What overhead does TCP introduce?",
          "How do retries at the application layer differ from TCP retransmission?"
        ]
      },
      {
        question: "When should you use UDP over TCP?",
        whatInterviewerLooksFor: "Understanding that UDP is useful when low latency and freshness are more important than guaranteed delivery.",
        strongAnswer: "Use UDP when speed and low latency matter more than receiving every packet. It is a good fit for real-time or freshness-sensitive data such as online game movement, VoIP audio, live media, DNS lookups, and market data feeds. In these systems, old packets may have little value, and waiting for retransmission can harm user experience.",
        answerStructure: [
          "State the low-latency requirement",
          "Explain why old or missing data may be acceptable",
          "Give real-time examples and mention possible application-level recovery"
        ],
        commonMistakes: [
          "Saying UDP is only for streaming",
          "Not mentioning packet loss risk",
          "Assuming UDP guarantees faster end-to-end user experience in all systems",
          "Forgetting that important data may still need reliable handling"
        ],
        followUps: [
          "How would you handle packet loss with UDP?",
          "Why would a game use both UDP and TCP?",
          "Is a stale packet always worth retransmitting?"
        ]
      },
      {
        question: "How does TCP ensure reliable data transmission?",
        whatInterviewerLooksFor: "Specific mechanisms, not just the word reliable.",
        strongAnswer: "TCP ensures reliability through connection establishment, sequence numbers, acknowledgements, retransmission of lost data, checksums for error detection, and ordered delivery. If segments arrive out of order, TCP reassembles them before passing data to the application. If data is missing, TCP retransmits it.",
        answerStructure: [
          "List the core mechanisms: handshake, sequence numbers, ACKs, retransmission, checksums, ordering",
          "Explain how they work together",
          "Connect them to application-level correctness"
        ],
        commonMistakes: [
          "Only mentioning the three-way handshake",
          "Forgetting ordered delivery",
          "Saying TCP prevents all network loss",
          "Confusing TCP reliability with database transactions"
        ],
        followUps: [
          "What is the three-way handshake?",
          "What happens when packets arrive out of order?",
          "Why does reliability add latency?"
        ]
      },
      {
        question: "Why is UDP faster than TCP?",
        whatInterviewerLooksFor: "Understanding that UDP has less protocol overhead because it skips many reliability mechanisms.",
        strongAnswer: "UDP is faster because it does not establish a connection before sending, does not wait for acknowledgements, does not retransmit lost packets, and does not reorder packets. Its simpler behavior creates lower overhead and lower latency, but the trade-off is no built-in delivery guarantee.",
        answerStructure: [
          "Identify skipped mechanisms",
          "Explain how skipping them reduces overhead",
          "State the reliability trade-off"
        ],
        commonMistakes: [
          "Saying UDP is faster because it uses better network paths",
          "Ignoring the cost of application-level recovery",
          "Claiming UDP always improves user experience",
          "Not mentioning the loss of guarantees"
        ],
        followUps: [
          "What are the disadvantages of UDP?",
          "When can UDP be harmful?",
          "How can applications recover important lost data?"
        ]
      },
      {
        question: "What are the main disadvantages of TCP and UDP?",
        whatInterviewerLooksFor: "Balanced trade-off thinking.",
        strongAnswer: "TCP’s disadvantages are higher latency, more overhead, and more resource consumption due to connection management, acknowledgements, retransmissions, and ordering. It may be a poor fit for real-time media or game state updates. UDP’s disadvantages are no delivery guarantee, no built-in retransmission, no ordering guarantee, and more responsibility on the application to handle loss or corruption.",
        answerStructure: [
          "Describe TCP disadvantages",
          "Describe UDP disadvantages",
          "Tie each disadvantage to practical use cases"
        ],
        commonMistakes: [
          "Presenting one protocol as universally superior",
          "Ignoring resource cost at scale",
          "Forgetting that UDP can require custom reliability logic",
          "Not connecting disadvantages to user experience"
        ],
        followUps: [
          "How would you reduce TCP connection overhead?",
          "How would you make UDP more reliable?",
          "What happens to real-time UX when TCP retransmits old packets?"
        ]
      },
      {
        question: "How do applications handle reliability when using UDP?",
        whatInterviewerLooksFor: "Knowledge that reliability can be selectively implemented above UDP.",
        strongAnswer: "Applications can add sequence numbers to detect missing or out-of-order packets, custom acknowledgements for important messages, forward error correction to recover from some loss, and application-level retransmission when data is still valuable. The key is to add only the reliability needed so the system keeps UDP’s low-latency benefits.",
        answerStructure: [
          "State that UDP does not provide reliability itself",
          "List application-level mechanisms",
          "Explain selective reliability based on data value"
        ],
        commonMistakes: [
          "Saying reliability is impossible with UDP",
          "Adding full TCP-like behavior without considering latency",
          "Retransmitting stale real-time data",
          "Ignoring sequence numbers"
        ],
        followUps: [
          "What is forward error correction?",
          "When should an application not retransmit lost data?",
          "How would you handle out-of-order UDP packets?"
        ]
      },
      {
        question: "Can TCP and UDP be used together in the same system?",
        whatInterviewerLooksFor: "Understanding that different data flows can have different requirements.",
        strongAnswer: "Yes. A system can use UDP for latency-sensitive, ephemeral data and TCP for reliable, durable, or control data. For example, an online game may use UDP for player movement and TCP for login, chat, inventory, or purchases. This balances responsiveness with correctness.",
        answerStructure: [
          "Confirm that mixed usage is possible",
          "Separate data by reliability and latency needs",
          "Give an example such as games, VoIP, or streaming"
        ],
        commonMistakes: [
          "Assuming one product must use only one transport protocol",
          "Using UDP for critical durable operations without recovery",
          "Using TCP for all high-frequency state even when staleness matters",
          "Not explaining why different data types have different value"
        ],
        followUps: [
          "Which game messages should be reliable?",
          "How would you split traffic in a live streaming platform?",
          "What operational complexity does mixed transport introduce?"
        ]
      },
      {
        question: "Which protocol does DNS use, TCP or UDP?",
        whatInterviewerLooksFor: "The practical answer: DNS primarily uses UDP but can use TCP.",
        strongAnswer: "DNS primarily uses UDP because most DNS queries and responses are small and need to be fast. Avoiding TCP connection setup reduces latency. However, DNS can use TCP for larger responses and zone transfers.",
        answerStructure: [
          "State that DNS primarily uses UDP",
          "Explain speed and small message size",
          "Mention TCP for larger responses or zone transfers"
        ],
        commonMistakes: [
          "Saying DNS only ever uses UDP",
          "Ignoring why connection setup matters",
          "Saying UDP guarantees DNS delivery",
          "Forgetting that clients can retry failed lookups"
        ],
        followUps: [
          "What happens if a DNS UDP packet is lost?",
          "Why might DNS need TCP?",
          "How does DNS latency affect user experience?"
        ]
      },
      {
        question: "How do firewalls handle TCP vs UDP traffic differently?",
        whatInterviewerLooksFor: "Awareness that protocol choice affects operations and security.",
        strongAnswer: "TCP is easier for firewalls to track because it has an explicit connection setup and termination lifecycle. UDP is connectionless, so there is no built-in session state to observe. Firewalls often handle UDP with timeouts, filtering, rate limiting, and sometimes deep packet inspection. UDP services may need stronger DDoS protections.",
        answerStructure: [
          "Explain TCP connection tracking",
          "Explain why UDP is harder to track",
          "Mention operational controls such as filtering and rate limiting"
        ],
        commonMistakes: [
          "Ignoring operational concerns",
          "Assuming UDP traffic is automatically safe because it is simple",
          "Not mentioning DDoS or abuse risks",
          "Confusing firewalls with transport reliability"
        ],
        followUps: [
          "Why is UDP commonly abused in DDoS attacks?",
          "How would you protect a public UDP service?",
          "What monitoring would you add for UDP traffic?"
        ]
      }
    ]
  },
  revision: {
    flashcards: [
      {
        front: "What does TCP stand for?",
        back: "Transmission Control Protocol.",
        category: "definition"
      },
      {
        front: "What does UDP stand for?",
        back: "User Datagram Protocol.",
        category: "definition"
      },
      {
        front: "Is TCP connection-oriented or connectionless?",
        back: "TCP is connection-oriented. It establishes a connection before exchanging data.",
        category: "tcp"
      },
      {
        front: "Is UDP connection-oriented or connectionless?",
        back: "UDP is connectionless. It sends packets without a handshake or session setup.",
        category: "udp"
      },
      {
        front: "What is TCP’s main design goal?",
        back: "Reliable, ordered, error-checked delivery.",
        category: "tcp"
      },
      {
        front: "What is UDP’s main design goal?",
        back: "Low overhead and low latency.",
        category: "udp"
      },
      {
        front: "Name three mechanisms TCP uses for reliability.",
        back: "Acknowledgements, retransmissions, sequence numbers, checksums, ordered delivery, and connection setup.",
        category: "tcp"
      },
      {
        front: "Does UDP retransmit lost packets automatically?",
        back: "No. UDP does not automatically retransmit lost packets.",
        category: "udp"
      },
      {
        front: "When should you choose TCP?",
        back: "Choose TCP when missing, corrupted, or out-of-order data would break correctness.",
        category: "tradeoff"
      },
      {
        front: "When should you choose UDP?",
        back: "Choose UDP when low latency and data freshness matter more than guaranteed delivery.",
        category: "tradeoff"
      },
      {
        front: "Give examples of TCP use cases.",
        back: "Web browsing, file transfers, email, APIs, payments, and database communication.",
        category: "use_cases"
      },
      {
        front: "Give examples of UDP use cases.",
        back: "Online gaming, VoIP, live streaming, DNS lookups, and market data feeds.",
        category: "use_cases"
      },
      {
        front: "Why can retransmission hurt real-time applications?",
        back: "Retransmission can delay newer data, and old packets may be stale by the time they arrive.",
        category: "real_time"
      },
      {
        front: "Can applications add reliability on top of UDP?",
        back: "Yes. They can use sequence numbers, custom acknowledgements, forward error correction, and selective retransmission.",
        category: "udp"
      },
      {
        front: "Why does DNS primarily use UDP?",
        back: "DNS lookups are usually small and latency-sensitive, so UDP avoids connection setup overhead.",
        category: "use_cases"
      },
      {
        front: "Can one system use both TCP and UDP?",
        back: "Yes. For example, a game can use UDP for movement and TCP for login, purchases, or chat.",
        category: "system_design"
      }
    ],
    glossary: [
      {
        term: "TCP",
        definition: "Transmission Control Protocol, a connection-oriented transport protocol that provides reliable, ordered, error-checked communication.",
        relatedConcepts: [
          "Transport layer",
          "Acknowledgement",
          "Retransmission",
          "Three-way handshake"
        ]
      },
      {
        term: "UDP",
        definition: "User Datagram Protocol, a connectionless transport protocol that sends datagrams with low overhead but without delivery, ordering, or retransmission guarantees.",
        relatedConcepts: [
          "Transport layer",
          "Datagram",
          "Packet loss",
          "Low latency"
        ]
      },
      {
        term: "Transport layer",
        definition: "The networking layer responsible for end-to-end communication between applications, where protocols such as TCP and UDP operate.",
        relatedConcepts: [
          "TCP",
          "UDP",
          "Application protocol"
        ]
      },
      {
        term: "Three-way handshake",
        definition: "The TCP connection setup process where both sides establish that they are ready to communicate before data transfer begins.",
        relatedConcepts: [
          "TCP",
          "Connection-oriented",
          "Connection setup"
        ]
      },
      {
        term: "Acknowledgement",
        definition: "A signal, often called an ACK, that confirms data was received.",
        relatedConcepts: [
          "TCP",
          "Reliability",
          "Retransmission"
        ]
      },
      {
        term: "Retransmission",
        definition: "Sending data again after detecting that it was lost or not acknowledged.",
        relatedConcepts: [
          "TCP",
          "Packet loss",
          "Latency"
        ]
      },
      {
        term: "Packet loss",
        definition: "A condition where data packets fail to reach their destination.",
        relatedConcepts: [
          "UDP",
          "TCP",
          "Reliability"
        ]
      },
      {
        term: "Ordered delivery",
        definition: "The guarantee that data is delivered to the application in the same logical order in which it was sent.",
        relatedConcepts: [
          "TCP",
          "Sequence numbers",
          "Reassembly"
        ]
      },
      {
        term: "Connection-oriented",
        definition: "A communication style where endpoints establish a session before exchanging data.",
        relatedConcepts: [
          "TCP",
          "Handshake",
          "Session"
        ]
      },
      {
        term: "Connectionless",
        definition: "A communication style where data is sent without establishing a session first.",
        relatedConcepts: [
          "UDP",
          "Datagram",
          "Low overhead"
        ]
      },
      {
        term: "Low latency",
        definition: "A design goal that minimizes delay between sending and receiving data.",
        relatedConcepts: [
          "UDP",
          "Real-time systems",
          "Responsiveness"
        ]
      },
      {
        term: "Application-level reliability",
        definition: "Reliability mechanisms implemented by the application rather than provided automatically by the transport protocol.",
        relatedConcepts: [
          "UDP",
          "Sequence numbers",
          "Custom acknowledgements",
          "Forward error correction"
        ]
      },
      {
        term: "Forward Error Correction",
        definition: "A technique where extra data is sent so the receiver can recover from some packet loss without waiting for retransmission.",
        relatedConcepts: [
          "UDP",
          "Packet loss",
          "Real-time communication"
        ]
      },
      {
        term: "Freshness",
        definition: "The idea that newer data may be more valuable than older data, especially in real-time systems.",
        relatedConcepts: [
          "UDP",
          "Real-time systems",
          "Latency"
        ]
      }
    ],
    finalQuiz: [
      {
        type: "mcq",
        prompt: "Which statement best describes TCP?",
        options: [
          "A connectionless protocol that never tracks packets",
          "A reliable, ordered, connection-oriented transport protocol",
          "A protocol used only for video games",
          "A database replication algorithm"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "TCP is connection-oriented and provides reliable, ordered, error-checked delivery."
      },
      {
        type: "mcq",
        prompt: "Which statement best describes UDP?",
        options: [
          "A connectionless protocol with low overhead and no delivery guarantee",
          "A protocol that always retransmits lost packets",
          "A protocol that guarantees ordered delivery",
          "A secure version of TCP"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "UDP is connectionless and fast, but it does not guarantee delivery or ordering."
      },
      {
        type: "mcq",
        prompt: "You are designing a file upload service. Which protocol is usually the better fit?",
        options: [
          "UDP, because missing chunks are acceptable",
          "TCP, because complete and correct data matters",
          "UDP, because it reorders chunks automatically",
          "Neither, because file upload does not use transport protocols"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "File uploads require complete and correct data, making TCP the safer default."
      },
      {
        type: "mcq",
        prompt: "Why might an online game use UDP for player movement?",
        options: [
          "UDP guarantees movement updates arrive in order",
          "UDP prevents packet loss",
          "Newer movement updates are often more valuable than old ones",
          "TCP cannot transmit game data"
        ],
        correctAnswerIndex: 2,
        correctAnswer: null,
        explanation: "For real-time movement, stale updates may not be worth retransmitting. UDP supports lower-latency communication."
      },
      {
        type: "mcq",
        prompt: "Which TCP feature confirms that data was received?",
        options: [
          "Acknowledgement",
          "Datagram expiration",
          "Zone transfer",
          "Deep packet inspection"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "TCP uses acknowledgements to confirm receipt of data."
      },
      {
        type: "mcq",
        prompt: "What must an application do if it needs reliability while using UDP?",
        options: [
          "Assume UDP will handle it automatically",
          "Implement reliability mechanisms such as sequence numbers or custom ACKs",
          "Disable packet loss on the internet",
          "Use DNS for every packet"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "UDP does not provide built-in reliability, so the application must add any needed recovery behavior."
      },
      {
        type: "mcq",
        prompt: "Which pair is correctly matched?",
        options: [
          "TCP: no handshake; UDP: reliable ordering",
          "TCP: reliability; UDP: low overhead",
          "TCP: connectionless; UDP: connection-oriented",
          "TCP: only gaming; UDP: only email"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "TCP prioritizes reliability. UDP prioritizes low overhead and speed."
      },
      {
        type: "mcq",
        prompt: "Why does DNS primarily use UDP?",
        options: [
          "DNS responses never exceed one byte",
          "DNS queries are usually small and need quick responses",
          "UDP guarantees DNS responses are never lost",
          "TCP cannot be used for DNS"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "DNS primarily uses UDP because typical lookups are small and latency-sensitive. TCP can still be used for larger responses or zone transfers."
      },
      {
        type: "mcq",
        prompt: "A bank transaction from two seconds ago and a voice packet from two seconds ago should be treated differently because:",
        options: [
          "Financial data remains important, while old voice data is usually stale",
          "Voice packets always require database transactions",
          "Bank transactions should always use UDP",
          "TCP cannot send financial data"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Different data has different value over time. Financial data must arrive correctly; stale voice data may no longer be useful."
      },
      {
        type: "mcq",
        prompt: "Which is the best interview-style explanation for choosing TCP or UDP?",
        options: [
          "Always choose TCP because reliability is always better",
          "Always choose UDP because speed is always better",
          "Choose based on whether the system values correctness or low latency more",
          "Choose randomly because both protocols behave the same"
        ],
        correctAnswerIndex: 2,
        correctAnswer: null,
        explanation: "The architectural decision depends on the trade-off between reliability, latency, responsiveness, and user experience."
      },
      {
        type: "mcq",
        prompt: "Which operational concern is more associated with UDP services?",
        options: [
          "Connectionless traffic can be harder for firewalls to track and may need rate limiting",
          "UDP requires maintaining a handshake for every client",
          "UDP always uses more memory per connection than TCP",
          "UDP cannot be filtered by firewalls"
        ],
        correctAnswerIndex: 0,
        correctAnswer: null,
        explanation: "Because UDP is connectionless, firewalls and services often rely on filtering, rate limiting, and abuse protection."
      },
      {
        type: "mcq",
        prompt: "What is the best reason a system might use both TCP and UDP?",
        options: [
          "Because every packet must be sent twice",
          "Because different data paths have different reliability and latency requirements",
          "Because TCP only works on mobile networks",
          "Because UDP can turn into TCP automatically"
        ],
        correctAnswerIndex: 1,
        correctAnswer: null,
        explanation: "A product may have real-time ephemeral data and correctness-critical durable data, so using both protocols can be appropriate."
      }
    ]
  }
};