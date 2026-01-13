
import { MissionData } from "./types";

const questionBank: Record<string, MissionData> = {
  // --- LLM INTERNALS -> GLEAN INTERNALS (THE ULTIMATE BRIDGE) ---
  "llm-internals_glean-internals_master-enterprise-search-architecture": {
    "briefing": {
      "title": "Operation: Glean Sentinel",
      "scenario": "You are a lead AI architect tasked with scaling RAG to an enterprise of 10,000 users. Pure vector retrieval is failing; permissions are leaking; content is drifting. You must rebuild the 'Enterprise Brain' using Glean's architecture.",
      "objective": "Reverse-engineer Glean's internal operational philosophy by bridging your LLM expertise."
    },
    "modules": [
      {
        "id": "glean_set1",
        "conceptName": "Retrieval Foundations",
        "bridgeKeywords": {
          "familiar": ["Vector", "Chunk", "Similarity"],
          "complex": ["Inverted Index", "Hybrid", "Segmentation"]
        },
        "prime": {
          "question": "In a standard RAG system, what typically causes answers to drift or become inaccurate even when embeddings are mathematically strong?",
          "options": ["Model temperature is too high", "Vector space density leads to 'semantic soup' and imprecise chunk retrieval", "The tokenizer is using the wrong character set", "The prompt length exceeds 4k tokens"],
          "correctAnswer": "Vector space density leads to 'semantic soup' and imprecise chunk retrieval",
          "explanation": "Semantic similarity is 'fuzzy'; for enterprise search, we often need exactness.",
          "known_concept": "Vector Similarity",
          "learning_intent": "Activate intuition about the limitations of pure dense retrieval."
        },
        "bridge": {
          "question": "If an LLM needs chunking strategies to stay relevant, what would the equivalent be for enterprise documents that change daily?",
          "options": ["Hard-coding the context window", "Semantic document segmentation based on page structure and headers", "Deleting old vectors every 24 hours", "Using a larger embedding dimension"],
          "correctAnswer": "Semantic document segmentation based on page structure and headers",
          "explanation": "Glean doesn't just chunk by token count; it understands the structure of the document to index relevant segments.",
          "known_concept": "Chunking",
          "learning_intent": "Bridge chunking to structural segmentation."
        },
        "infer": {
          "question": "How does Glean ensure that a search for a specific project code (e.g., 'PX-901') never returns a 'semantically similar' but wrong project?",
          "options": ["By using only vectors", "By maintaining a Hybrid Index that combines Vector (Dense) and Keyword (Sparse) retrieval", "By asking the user for a hint", "By increasing the temperature"],
          "correctAnswer": "By maintaining a Hybrid Index that combines Vector (Dense) and Keyword (Sparse) retrieval",
          "explanation": "Hybrid indexing is the core of Glean, ensuring both exact matches and semantic discovery.",
          "glean_concept": "Hybrid Indexing",
          "learning_intent": "Infer the existence of keyword+vector hybrid models."
        },
        "reinforce": {
          "question": "What would break in an Enterprise Search system if it relied *only* on the Inverted Index (keywords)?",
          "options": ["Users couldn't search for acronyms", "Users couldn't find concepts when they don't know the exact terminology", "The database would crash", "The results would be too fast"],
          "correctAnswer": "Users couldn't find concepts when they don't know the exact terminology",
          "explanation": "Keywords fail at synonyms and conceptual search—the exact place where LLM-style vectors excel.",
          "glean_concept": "Dense vs Sparse Retrieval",
          "learning_intent": "Solidify the 'Why' behind hybrid search."
        },
        "capstone": {
          "question": "A developer searches for 'How do I reset my environment?'. Why is this fundamentally different from a search for 'Project Phoenix Roadmap' in Glean's indexing model?",
          "options": ["One is a keyword search, the other is a question", "One requires high semantic context (roadmap), while the other requires specific documentation segments", "Glean treats them the same", "One is a Slack message, the other is a Jira"],
          "correctAnswer": "One requires high semantic context (roadmap), while the other requires specific documentation segments",
          "explanation": "Retrieval foundations require different segmentation strategies based on document type—Glean optimizes per source.",
          "glean_concept": "Segmentation Strategies",
          "learning_intent": "Reasoning about document-aware retrieval."
        },
        "synthesis": "Retrieval is a Hybrid Act: Exact tokens provide the 'What', and Semantic vectors provide the 'Why'."
      },
      {
        "id": "glean_set2",
        "conceptName": "Freshness & Drift",
        "bridgeKeywords": {
          "familiar": ["Staleness", "Context", "Drift"],
          "complex": ["Recrawl", "Webhooks", "Latency"]
        },
        "prime": {
          "question": "When building a RAG bot, what is the most common reason for a 'Hallucination' regarding current company policy?",
          "options": ["The model is too small", "The vector index is stale and contains outdated policy docs", "The user asked a bad question", "The embedding model is biased"],
          "correctAnswer": "The vector index is stale and contains outdated policy docs",
          "explanation": "Outdated context leads to 'logical' hallucinations based on old data.",
          "known_concept": "Context Staleness",
          "learning_intent": "Establish that data drift is the primary driver of failure."
        },
        "bridge": {
          "question": "If an LLM context is only as good as the prompt, how must Glean ensure the 'Enterprise Context' is always up to date?",
          "options": ["Manual re-indexing by admins", "Dynamic recrawl strategies based on source volatility", "Real-time training of the LLM", "Asking users to upload the latest files"],
          "correctAnswer": "Dynamic recrawl strategies based on source volatility",
          "explanation": "Glean recrawls high-activity sources (Slack) differently than stable ones (Policies).",
          "known_concept": "Prompt Drift",
          "learning_intent": "Bridge prompt context to index freshness."
        },
        "infer": {
          "question": "A search for a Slack message created 3 seconds ago works, but a new Google Doc takes 10 minutes to appear. Why?",
          "options": ["Slack is easier to read", "Slack uses event-driven Webhooks for instant push, while the Doc source relies on a polling crawl", "The Google Doc is too large", "The user is searching wrong"],
          "correctAnswer": "Slack uses event-driven Webhooks for instant push, while the Doc source relies on a polling crawl",
          "explanation": "Freshness signals vary by source protocol (Webhooks vs. Crawling).",
          "glean_concept": "Freshness Signals",
          "learning_intent": "Infer the mechanics of recrawl/push protocols."
        },
        "reinforce": {
          "question": "What is the primary operational metric to monitor to ensure Glean doesn't 'drift' from the ground truth?",
          "options": ["Total document count", "Mean Age of Result (Freshness Latency)", "Number of active users", "CPU usage"],
          "correctAnswer": "Mean Age of Result (Freshness Latency)",
          "explanation": "Freshness latency tells you how 'far behind' the search index is from reality.",
          "glean_concept": "Drift Monitoring",
          "learning_intent": "Identify the signal for system health."
        },
        "capstone": {
          "question": "A team complains that Glean is 'hallucinating' outdated project goals. You find the index is fresh. What is the most likely cause?",
          "options": ["The LLM is biased", "The 'Source of Truth' documents themselves are unmanaged and contradictory", "The vector DB is broken", "The user is on a slow internet connection"],
          "correctAnswer": "The 'Source of Truth' documents themselves are unmanaged and contradictory",
          "explanation": "Glean is a mirror. If the sources (Wiki vs Slack) contain conflicting fresh info, the 'hallucination' is actually a governance failure.",
          "glean_concept": "Source Governance",
          "learning_intent": "Combine freshness and source authority concepts."
        },
        "synthesis": "Freshness is a mirror of Governance: Glean can find truth, but only if the sources are maintained."
      },
      {
        "id": "glean_set3",
        "conceptName": "Authority & Trust",
        "bridgeKeywords": {
          "familiar": ["Ground Truth", "Confidence", "Weight"],
          "complex": ["Boosting", "Ranking", "Verification"]
        },
        "prime": {
          "question": "In a RAG system, how do you handle multiple documents that provide conflicting answers to the same query?",
          "options": ["Take the longest one", "Use a re-ranker to prioritize 'Higher Confidence' or authoritative sources", "Average the vectors", "Let the LLM guess"],
          "correctAnswer": "Use a re-ranker to prioritize 'Higher Confidence' or authoritative sources",
          "explanation": "Source weighting is essential for multi-source retrieval.",
          "known_concept": "Retrieval Confidence",
          "learning_intent": "Activate the concept of source-based re-ranking."
        },
        "bridge": {
          "question": "If an LLM weights some tokens more than others via 'Attention', how does Glean weight certain corporate apps over others?",
          "options": ["It doesn't", "Configurable Source Boosting and Global Authority signals", "It deletes low-authority apps", "It hides them behind a 'More' button"],
          "correctAnswer": "Configurable Source Boosting and Global Authority signals",
          "explanation": "Glean allows admins to 'boost' verified Wikis over informal Slack channels.",
          "known_concept": "Attention Weights",
          "learning_intent": "Bridge model attention to source boosting."
        },
        "infer": {
          "question": "Why would a search for 'Policy' return a verified Wiki page before a private Slack DM discussing the same policy?",
          "options": ["Slack is encrypted", "Glean identifies the Wiki as a 'High Authority' Source of Truth", "The Wiki has more words", "The Slack message is too old"],
          "correctAnswer": "Glean identifies the Wiki as a 'High Authority' Source of Truth",
          "explanation": "Authority signals shape the ranking to ensure 'Ground Truth' surface first.",
          "glean_concept": "Source of Truth",
          "learning_intent": "Infer the presence of global authority signals."
        },
        "reinforce": {
          "question": "Which signal would most likely 'downrank' a search result in Glean?",
          "options": ["High word count", "Frequent user 'bounce' (clicking then immediately returning)", "The document being too new", "Being stored in a PDF"],
          "correctAnswer": "Frequent user 'bounce' (clicking then immediately returning)",
          "explanation": "Behavioral signals (clicks/bounces) are powerful trust indicators in Glean.",
          "glean_concept": "Downranking Signals",
          "learning_intent": "Identify behavioral signals."
        },
        "capstone": {
          "question": "A CEO's search for 'Strategy' is dominated by old Jira tickets rather than her latest Keynote. How should you tune Glean?",
          "options": ["Delete Jira", "Boost the 'Keynote' file type and the 'Strategy' folder in Drive for 'Strategy' queries", "Re-train the LLM", "Tell the CEO to use more keywords"],
          "correctAnswer": "Boost the 'Keynote' file type and the 'Strategy' folder in Drive for 'Strategy' queries",
          "explanation": "Tuning is about aligning ranking weights with intent—Glean allows precise source/folder boosting.",
          "glean_concept": "Search Tuning",
          "learning_intent": "Reasoning about ranking alignment."
        },
        "synthesis": "Trust is Weighted: High authority sources and positive behavioral signals define the 'Truth'."
      },
      {
        "id": "glean_set4",
        "conceptName": "Permissions as a Constraint",
        "bridgeKeywords": {
          "familiar": ["Leaking", "Filtering", "Masking"],
          "complex": ["ACL", "Enforcement", "Identity"]
        },
        "prime": {
          "question": "In a RAG pipeline, what is 'Data Leakage' during retrieval?",
          "options": ["The model sharing its weights", "A user retrieving context from documents they shouldn't have access to", "The server crashing", "The prompt being too short"],
          "correctAnswer": "A user retrieving context from documents they shouldn't have access to",
          "explanation": "Without permission-aware retrieval, the vector DB is a security risk.",
          "known_concept": "Data Leakage",
          "learning_intent": "Define the security problem in retrieval systems."
        },
        "bridge": {
          "question": "If RAG needs 'Context Window Filtering', what must Glean do to ensure the CEO and an Intern see different search results?",
          "options": ["Ask for a password", "Enforce per-user ACLs (Access Control Lists) at the retrieval level", "Show the same results but hide the content", "Separate the physical servers"],
          "correctAnswer": "Enforce per-user ACLs (Access Control Lists) at the retrieval level",
          "explanation": "Glean respects the permissions of every source system in real-time.",
          "known_concept": "Context Filtering",
          "learning_intent": "Bridge filtering to ACL enforcement."
        },
        "infer": {
          "question": "How does Glean ensure that 'Salary_2024.xlsx' never appears in an Intern's search results, even as a snippet?",
          "options": ["By checking the file name", "By mirroring the source system's identity permissions in the index", "By using AI to detect 'Salary' keywords", "By blocking all Excel files for interns"],
          "correctAnswer": "By mirroring the source system's identity permissions in the index",
          "explanation": "Permissions are 'baked in' to the retrieval path—if you can't see the doc, it doesn't exist for you.",
          "glean_concept": "ACL Enforcement",
          "learning_intent": "Infer the 'Security-first' retrieval logic."
        },
        "reinforce": {
          "question": "What would happen if a search engine 'crawled' documents but ignored ACLs?",
          "options": ["Search would be faster", "It would create a massive security breach where all private data becomes public", "The results would be more accurate", "The model would get smarter"],
          "correctAnswer": "It would create a massive security breach where all private data becomes public",
          "explanation": "Enterprise search is impossible without per-user result shaping.",
          "glean_concept": "Identity Mapping",
          "learning_intent": "Solidify the mission-critical nature of ACLs."
        },
        "capstone": {
          "question": "An employee gains access to a folder at 9:00 AM but can't find it in Glean at 9:05 AM. What is the most likely cause?",
          "options": ["The user is typing wrong", "ACL Sync Latency: Glean hasn't yet updated the permission bridge for that user/document", "Glean blocked the user", "The document was deleted"],
          "correctAnswer": "ACL Sync Latency: Glean hasn't yet updated the permission bridge for that user/document",
          "explanation": "Permission syncing is a continuous process—temporary 'Permission Drift' can occur during sync intervals.",
          "glean_concept": "ACL Sync Latency",
          "learning_intent": "Reasoning about permission drift and sync."
        },
        "synthesis": "Security is a Filter: If the synapse isn't authorized, the signal is never sent."
      },
      {
        "id": "glean_set5",
        "conceptName": "Ranking & Feedback",
        "bridgeKeywords": {
          "familiar": ["Re-ranking", "Tuning", "Metrics"],
          "complex": ["Signals", "Analytics", "Behavioral"]
        },
        "prime": {
          "question": "In advanced RAG, what is the role of a 'Cross-Encoder' or 'Re-ranker'?",
          "options": ["To compress the vectors", "To take the top 50 fuzzy results and perform a deep comparison to find the top 5", "To translate the text", "To generate more tokens"],
          "correctAnswer": "To take the top 50 fuzzy results and perform a deep comparison to find the top 5",
          "explanation": "Re-ranking is the 'Second Pass' that ensures precision after the 'First Pass' retrieval.",
          "known_concept": "Re-ranking Models",
          "learning_intent": "Activate the concept of multi-pass ranking."
        },
        "bridge": {
          "question": "If RAG uses ML metrics to tune a re-ranker, how does Glean improve its ranking over time for a specific company?",
          "options": ["By guessing", "By capturing Behavioral Signals (clicks, likes, copy-pastes) to create a feedback loop", "By asking admins to rate results", "By increasing CPU"],
          "correctAnswer": "By capturing Behavioral Signals (clicks, likes, copy-pastes) to create a feedback loop",
          "explanation": "User interaction is the ultimate signal for relevance.",
          "known_concept": "Human-in-the-loop",
          "learning_intent": "Bridge model tuning to behavioral feedback loops."
        },
        "infer": {
          "question": "A search result for 'Benefits' moves from position #4 to position #1 over a month. Why?",
          "options": ["The word 'Benefits' was typed more", "Glean observed high click-through and dwell time on that specific result compared to others", "The server got faster", "The document got older"],
          "correctAnswer": "Glean observed high click-through and dwell time on that specific result compared to others",
          "explanation": "Aggregated user signals inform the 'Global Ranking' of documents.",
          "glean_concept": "Behavioral Signals",
          "learning_intent": "Infer how signal aggregation works."
        },
        "reinforce": {
          "question": "Which Glean metric would best indicate that users are 'finding' what they need effectively?",
          "options": ["Queries per user", "Answer Rate / Click-through on top results", "Storage usage", "Login frequency"],
          "correctAnswer": "Answer Rate / Click-through on top results",
          "explanation": "If users find the answer in the first few results, the ranking is healthy.",
          "glean_concept": "Search Analytics",
          "learning_intent": "Identify the success metric for ranking."
        },
        "capstone": {
          "question": "Glean ranking is optimized for 'Freshness' and 'Authority', but a user complains that a 5-year-old doc is ranking too high. Why?",
          "options": ["Glean is broken", "That doc has massive 'Authority' (thousands of clicks) that is overriding its age penalty", "Glean hates new docs", "The user is on the wrong team"],
          "correctAnswer": "That doc has massive 'Authority' (thousands of clicks) that is overriding its age penalty",
          "explanation": "Ranking is an emergent property of multiple signals—sometimes historical authority outweighs recency.",
          "glean_concept": "Signal Interplay",
          "learning_intent": "Reasoning about competing signals in ranking."
        },
        "synthesis": "Ranking is Emergent: It's the balance of Authority, Freshness, and user Wisdom."
      },
      {
        "id": "glean_set6",
        "conceptName": "Operational Excellence",
        "bridgeKeywords": {
          "familiar": ["Observability", "Curation", "Loops"],
          "complex": ["Governance", "Adoption", "Ownership"]
        },
        "prime": {
          "question": "What is the primary danger of an 'Unobserved' ML model in production?",
          "options": ["It uses too much power", "It can drift into bias or hallucination without the developer knowing", "It gets bored", "It deletes itself"],
          "correctAnswer": "It can drift into bias or hallucination without the developer knowing",
          "explanation": "Observability is the key to maintaining long-term quality.",
          "known_concept": "ML Observability",
          "learning_intent": "Establish the need for continuous monitoring."
        },
        "bridge": {
          "question": "If RAG performance relies on data curation, what does Glean performance rely on in an enterprise setting?",
          "options": ["Faster hardware", "Organizational 'Hygiene' and Governance of source systems", "More users", "Less data"],
          "correctAnswer": "Organizational 'Hygiene' and Governance of source systems",
          "explanation": "Search cannot fix messy data; it can only surface it better.",
          "known_concept": "Dataset Curation",
          "learning_intent": "Bridge curation to enterprise governance."
        },
        "infer": {
          "question": "Why does Glean 'feel magical' in Orgs with a culture of documented Wikis, and 'useless' in Orgs where everything happens in private DMs?",
          "options": ["The algorithm likes Wikis better", "Search can only index what is shared; private silos are 'Dark Data' that search can't reach", "DMs are too short", "Wikis have better fonts"],
          "correctAnswer": "Search can only index what is shared; private silos are 'Dark Data' that search can't reach",
          "explanation": "Search quality is limited by the transparency and permissions of the culture.",
          "glean_concept": "Dark Data Silos",
          "learning_intent": "Infer the dependency of search on transparency."
        },
        "reinforce": {
          "question": "What is the best way to 'fix' a Glean deployment where users can't find the 'latest' plans?",
          "options": ["Buy more Glean licenses", "Audit the source systems (Drive/Wiki) to ensure old docs are archived and new ones are correctly permissioned", "Increase the LLM temperature", "Change the company logo"],
          "correctAnswer": "Audit the source systems (Drive/Wiki) to ensure old docs are archived and new ones are correctly permissioned",
          "explanation": "Operational excellence is about fixing the 'roots' (source docs).",
          "glean_concept": "Glean Strategy",
          "learning_intent": "Identify correct remediation actions."
        },
        "capstone": {
          "question": "A CEO asks: 'Why did we buy Glean if I still have to ask my assistant for some files?'. Based on your knowledge, what is the most likely reason?",
          "options": ["The assistant is faster than the model", "The files are in a source not connected to Glean, or they are locked in a 'private' silo where Glean's ACL-aware index can't see them", "The CEO forgot the name of the file", "The assistant deleted the files"],
          "correctAnswer": "The files are in a source not connected to Glean, or they are locked in a 'private' silo where Glean's ACL-aware index can't see them",
          "explanation": "Search is a window, not a master key. If the data is hidden or not mapped, it doesn't exist to the engine.",
          "glean_concept": "Operational Reality",
          "learning_intent": "Capstone: Reason about search as an emergent property of culture + habits + signals."
        },
        "synthesis": "Search is an Ecosystem: It succeeds when tech, permissions, and human habits are in sync."
      }
    ],
    "finalChallenge": {
      "question": "You are tasked with a Glean rollout. Which strategy ensures the highest 'Search Utility' on day one?",
      "options": ["Indexing every single file since 1990", "Connecting only 'High-Trust' sources first (Wikis/Jira), enforcing strict doc ownership, and mapping identity early to prevent permission drift", "Tuning the model to be more creative", "Blocking Slack so users write more docs"],
      "correctAnswer": "Connecting only 'High-Trust' sources first (Wikis/Jira), enforcing strict doc ownership, and mapping identity early to prevent permission drift",
      "explanation": "Success depends on high-signal data. By starting with authoritative sources and solid identity mapping, you build trust immediately.",
      "glean_concept": "Implementation Strategy",
      "learning_intent": "Synthesize all concepts into a strategic decision."
    }
  },

  // --- EXISTING COOKING MISSION ---
  "cooking_crm-tools_understand-the-sales-funnel": {
    "briefing": {
      "title": "The Master Chef's Pipeline",
      "scenario": "You are running a Michelin-star kitchen. You need to turn raw ingredients (Leads) into a perfectly plated meal (Closed Sale).",
      "objective": "Map CRM workflow using kitchen stations."
    },
    "modules": [
      {
        "id": "cook_crm_m1",
        "conceptName": "Prep Station Qualification",
        "bridgeKeywords": {
          "familiar": ["Peeling", "Sorting", "Mise-en-place"],
          "complex": ["Lead", "Qualification", "MQL"]
        },
        "prime": {
          "question": "If you are 'sorting' through a bag of potatoes to find the ones fresh enough to bake, what action are you performing?",
          "options": ["Plating", "Ingredient Qualification", "Sautéing", "Deglazing"],
          "correctAnswer": "Ingredient Qualification",
          "explanation": "Qualification is checking if the raw material is worth the effort."
        },
        "bridge": {
          "question": "In a Sales Funnel, what is an MQL?",
          "options": ["A paid customer", "An ingredient that passed the 'prep check' and is ready to be cooked", "The trash", "The chef"],
          "correctAnswer": "An ingredient that passed the 'prep check' and is ready to be cooked",
          "explanation": "An MQL is ready for the next stage of the pipeline."
        },
        "infer": {
          "question": "If a customer is looking at the menu, but hasn't ordered, they are a:",
          "options": ["Lead", "Deal", "Closed Sale", "Vendor"],
          "correctAnswer": "Lead",
          "explanation": "They are a lead until they place an order."
        },
        "reinforce": {
          "question": "Throwing away a rotten tomato is like:",
          "options": ["Closing a deal", "Disqualifying a lead", "Marketing", "Siring"],
          "correctAnswer": "Disqualifying a lead",
          "explanation": "Saves time for the sales team."
        },
        "capstone": {
          "question": "When does an ingredient become revenue?",
          "options": ["When it's bought", "When it's prepped", "When the bill is paid (Conversion)", "When it's cooked"],
          "correctAnswer": "When the bill is paid (Conversion)",
          "explanation": "Revenue only counts when the deal is closed."
        },
        "synthesis": "Leads are groceries; don't cook what you haven't qualified."
      }
    ],
    "finalChallenge": {
      "question": "A customer orders but cancels. In CRM this is:",
      "options": ["Lost Deal", "New Lead", "MQL", "SQL"],
      "correctAnswer": "Lost Deal",
      "explanation": "The order was in progress but didn't convert."
    }
  }
};

export default questionBank;
