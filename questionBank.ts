
import { MissionData } from "./types";

const questionBank: Record<string, MissionData> = {
  "tic-tac-toe_economics_market-volatility-explained": {
    "briefing": {
      "title": "Operation: The Perfect Board",
      "scenario": "You're playing Tic-Tac-Toe, but every X and O is a stock buy or sell. One wrong move doesn't just lose the game; it crashes the market.",
      "objective": "Understand market decision-making using grid-based strategy logic."
    },
    "modules": [
      {
        "id": "ttt_fin_1",
        "conceptName": "Board Patterns",
        "bridgeKeywords": { "familiar": ["Grid", "X/O", "Draw"], "complex": ["Portfolio", "Asset", "Equilibrium"] },
        "prime": {
          "question": "If you have two Xs in a row and the opponent doesn't block, what is the 'Expected Value' of your next turn?",
          "options": ["High (Guaranteed Win)", "Low (Likely Loss)", "Zero (It's a draw)", "Undefined"],
          "correctAnswer": "High (Guaranteed Win)",
          "explanation": "A winning pattern in a game is a signal that your strategy is paying off.",
          "tip": "Always go for the corner! It's the most powerful spot."
        },
        "bridge": {
          "question": "In Finance, a 'Stable Market' is like a Tic-Tac-Toe 'Draw'. Why?",
          "options": ["Because both sides have equal pressure", "Because everyone stops playing", "Because the grid gets larger", "Because the Xs disappear"],
          "correctAnswer": "Because both sides have equal pressure",
          "explanation": "Market equilibrium occurs when buying and selling force are balanced, much like a perfect draw.",
          "tip": "Draws aren't boring; they mean both players played perfectly!"
        },
        "infer": {
          "question": "If a market suddenly becomes 'Volatile', what changed in our Tic-Tac-Toe game?",
          "options": ["Players are making fast, unpredictable moves", "The board is frozen", "The referee left", "We ran out of chalk"],
          "correctAnswer": "Players are making fast, unpredictable moves",
          "explanation": "Volatility is the rapid shift in positions before a pattern (or trend) is established.",
          "tip": "Panic moves lead to losing the middle square!"
        },
        "reinforce": {
          "question": "What is the primary risk of 'Chasing a Trend' in a volatile market?",
          "options": ["Getting trapped in a losing pattern", "Winning too fast", "Running out of energy", "The grid changing shape"],
          "correctAnswer": "Getting trapped in a losing pattern",
          "explanation": "Just like placing an X blindly to block one row while losing another, reactive trading is risky.",
          "tip": "Look at the whole board, not just the square you're on."
        },
        "capstone": {
          "question": "Why is a long-term strategy better than reacting to every 'O' placed by the opponent?",
          "options": ["It reduces emotional errors", "It makes the game shorter", "It lets you cheat", "It changes the rules"],
          "correctAnswer": "It reduces emotional errors",
          "explanation": "Sticking to a proven strategy (like corner control) prevents the panic that causes market losses.",
          "tip": "The best players play the math, not the person."
        },
        "synthesis": "Investing is just a game of Tic-Tac-Toe where the grid is the world economy."
      }
    ],
    "finalChallenge": {
      "question": "A 'Market Correction' is most like which Tic-Tac-Toe event?",
      "options": ["Clearing the board for a new game", "Winning in three moves", "Running out of ink", "Adding a 4th row"],
      "correctAnswer": "Clearing the board for a new game",
      "explanation": "A correction resets expectations and prices to a balanced state.",
      "tip": "Sometimes you have to restart to win big!"
    }
  },
  "rock-paper-scissors_quantum-physics_explain-superposition": {
    "briefing": {
      "title": "Operation: The Hidden Hand",
      "scenario": "In a regular game, you choose one. In a Quantum game, your hand is a blur of all three until the count of 'Shoot!'.",
      "objective": "Understand Superposition through the logic of unrevealed choices."
    },
    "modules": [
      {
        "id": "rps_q_1",
        "conceptName": "The Closed Fist",
        "bridgeKeywords": { "familiar": ["Hidden", "Reveal", "Choice"], "complex": ["State", "Measurement", "Probability"] },
        "prime": {
          "question": "Before you reveal your hand, what is your opponent's 'certainty' about what you chose?",
          "options": ["Zero - it could be any of the three", "100% - they can see it", "They know you chose Rock", "They are sleeping"],
          "correctAnswer": "Zero - it could be any of the three",
          "explanation": "Unrevealed information exists as a range of possibilities.",
          "tip": "Don't blink! The reveal is the most important part."
        },
        "bridge": {
          "question": "In Quantum terms, your hand *before* the reveal is in 'Superposition'. What does this mean?",
          "options": ["It is effectively all three possibilities at once", "It is only paper", "It is invisible", "It is frozen"],
          "correctAnswer": "It is effectively all three possibilities at once",
          "explanation": "A quantum state is a mixture of all possible outcomes until observed.",
          "tip": "Imagine your hand is a spinning wheel of Rock, Paper, and Scissors!"
        },
        "infer": {
          "question": "If you 'Reveal' your hand, what happens to the Superposition?",
          "options": ["It collapses into one single choice", "It gets faster", "It doubles", "It turns into gold"],
          "correctAnswer": "It collapses into one single choice",
          "explanation": "The act of looking (measurement) forces the quantum state to pick a single reality.",
          "tip": "Once you show it, there's no going back to the blur!"
        },
        "reinforce": {
          "question": "What is a 'Qubit' compared to a regular RPS game?",
          "options": ["A hand that can be Rock and Scissors simultaneously", "A heavy stone", "A piece of paper", "A pair of scissors"],
          "correctAnswer": "A hand that can be Rock and Scissors simultaneously",
          "explanation": "A Qubit holds both 0 and 1 (or Rock and Scissors) in a weighted mixture.",
          "tip": "It's like playing a move that beats both Rock and Paper!"
        },
        "capstone": {
          "question": "Why is a Quantum computer faster at solving 'Guess the Hand' than a human?",
          "options": ["It tests all combinations in one go", "It has more fingers", "It never gets tired", "It cheats"],
          "correctAnswer": "It tests all combinations in one go",
          "explanation": "Superposition allows it to explore every possible 'RPS move' at the same time.",
          "tip": "Why guess one at a time when you can be everywhere at once?"
        },
        "synthesis": "Quantum reality is just a high-stakes game of RPS where nobody has shown their hand yet."
      }
    ],
    "finalChallenge": {
      "question": "In Schrodinger's Cat, the 'Cat' is like an RPS hand that is:",
      "options": ["Both Rock and Paper until the box is opened", "Only Scissors", "A real cat", "A drawing"],
      "correctAnswer": "Both Rock and Paper until the box is opened",
      "explanation": "The cat exists in a superposition of 'Alive' and 'Dead' until observed.",
      "tip": "Poor cat! But great science."
    }
  },
  "video-games_economics_market-volatility-explained": {
    "briefing": {
      "title": "Operation: Mana Market",
      "scenario": "A major game patch just dropped. The price of 'Fire Mana' is swinging wildly as players panic-buy. This is exactly how the stock market feels.",
      "objective": "Understand market volatility through RPG balance patches."
    },
    "modules": [
      {
        "id": "vol_1",
        "conceptName": "The Patch Note Hype",
        "bridgeKeywords": { "familiar": ["Buff", "Nerf", "Patch"], "complex": ["Bull", "Bear", "Volatility"] },
        "prime": {
          "question": "If a developer 'buffs' a character class, what happens to its items in the auction house?",
          "options": ["Prices spike due to high demand", "Prices drop as people sell gear", "Nothing happens", "The gear is deleted"],
          "correctAnswer": "Prices spike due to high demand",
          "explanation": "New positive information (a buff) creates high demand instantly.",
          "tip": "Think about that one legendary sword everyone wanted after the update!"
        },
        "bridge": {
          "question": "What is 'Market Volatility' compared to an RPG patch?",
          "options": ["Rapid, unpredictable price swings based on news", "A slow, steady level-up grind", "Buying a physical copy of the game", "A permanent ban from the server"],
          "correctAnswer": "Rapid, unpredictable price swings based on news",
          "explanation": "Volatility is the drama of the market reacting to 'real-world patch notes'.",
          "tip": "Volatility is basically the 'Speedometer' of price drama!"
        },
        "infer": {
          "question": "If a stock has 'High Volatility', what kind of RPG item is it most like?",
          "options": ["A cursed item with random stat rolls", "A starter wood shield", "A health potion", "A quest map"],
          "correctAnswer": "A cursed item with random stat rolls",
          "explanation": "It's unpredictable—it could make you a god or destroy your gold pile in minutes.",
          "tip": "High risk, high reward! Just like rolling for that rare crit!"
        },
        "reinforce": {
          "question": "What usually causes a market 'crash' after high volatility?",
          "options": ["Panic-selling based on fear", "Everyone leveling up at once", "A server maintenance window", "Buying more gold"],
          "correctAnswer": "Panic-selling based on fear",
          "explanation": "Just like players dumping a class that just got 'nerfed', investors dump stocks when they're scared.",
          "tip": "Paper hands! Don't delete your character just because of one patch."
        },
        "capstone": {
          "question": "Why do smart investors 'Hold' (HODL) during high volatility?",
          "options": ["They trust the long-term 'stats' of the asset", "They forgot their password", "They are waiting for a server reboot", "They don't have enough mana"],
          "correctAnswer": "They trust the long-term 'stats' of the asset",
          "explanation": "Short-term swings (volatility) don't change the long-term value of a solid company.",
          "tip": "Legendary gear is still legendary, even if the current meta is weird."
        },
        "synthesis": "Volatility is just the 'Patch Note Drama' of the finance world."
      }
    ],
    "finalChallenge": {
      "question": "If a tech CEO tweets something controversial, the resulting price swing is:",
      "options": ["Volatility", "A permanent dividend", "A stock split", "A hardware upgrade"],
      "correctAnswer": "Volatility",
      "explanation": "News triggers rapid reactions, which is the definition of volatility.",
      "tip": "One tweet to rule the market... and one tweet to crash it!"
    }
  }
};

export default questionBank;
