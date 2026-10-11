/**
 * Seed script: Insert Reliance GET 2026 past drive questions into MongoDB
 * Run: node scripts/seed-reliance-questions.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ptp';

const DriveQuestionSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, index: true },
    branch: { type: String, required: true, trim: true, index: true },
    role: { type: String, trim: true, default: 'General / SDE' },
    round: { type: String, trim: true, default: 'Technical Interview', index: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: new Date().getFullYear().toString() },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, strict: false }
);

const DriveQuestion = mongoose.model('DriveQuestion', DriveQuestionSchema);

// ── All 90 questions from the Reliance GET 2026 past drive ──
const rawQuestions = [
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What does Young's modulus measure in a material?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What type of filter allows frequencies below a certain cutoff frequency to pass through?",
    SuggestedApproach: "Options: High-pass filter, Low-pass filter, Band-pass filter, Band-stop filter"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the basic unit of a digital circuit that stores binary data?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the primary cause of eutrophication in water bodies?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Eutrophication in aquatic systems can lead to:",
    SuggestedApproach: "Options: Increased oxygen levels, Decreased aquatic life diversity, Increased water clarity, Lower water temperatures"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which of these is NOT a basis of safety valve design?",
    SuggestedApproach: "Option: Control valve failure"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In a chemical reactor, what does the term 'space time' refer to?",
    SuggestedApproach: "Options: duration of reaction at maximum reaction rate, average time a molecule spends, time required to process one reactor volume of feed"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Azeotropic distillation is used to separate",
    SuggestedApproach: "Options: Components with significantly different boiling points, Components that form an azeotrope, Solid and liquid mixtures, Liquids and gases"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In rotary drum dryers, what does the term 'flights' refer to?",
    SuggestedApproach: "Options: The rotation speed of the drum, Internal fins that lift and cascade the material, The air flow direction, The heating elements"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Why is the choice of impeller type critical in the mixing process?",
    SuggestedApproach: "Options: It influences the mixing efficiency and pattern, It specifies the amount of heat generated"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A system undergoes a phase transition at constant temperature. If the system absorbs heat during this process, what can be said about the change in entropy?",
    SuggestedApproach: "Option: Decrease initially than increases"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If humidity of air increases, wet bulb temperature of air will increase.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is adsorption isotherm?",
    SuggestedApproach: "Options: Equilibrium relationship between actual concentration and maximum possible concentration in adsorbent particles..."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What are the parameters affecting Approach in a Cooling tower?",
    SuggestedApproach: "Options: Dry bulb temperature, Cooling tower pump design, Wet bulb temperature, Weight of Cooling tower, Process Inlet temperature"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Why does adsorption sometimes increase with an increase in pressure?",
    SuggestedApproach: "Options: Because it leads to more collisions, Due to the decrease in kinetic energy, It decreases the diffusion rate, Pressure has no effect"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In the context of reaction mechanisms, what is an 'intermediate'?",
    SuggestedApproach: "Options: The initial reactant in the slowest step, A substance that increases the reaction rate without being consumed"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Chiral resolution in crystallization is a technique used to:",
    SuggestedApproach: "Option: Alter the chemical structure of crystals"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In steam distillation, the total pressure of the system is equal to the sum of the partial pressures of",
    SuggestedApproach: "Options: Only the most volatile component, Only the water vapor, The water vapor and the organic component, All components, regardless of their states"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In fluid dynamics, the Darcy-Weisbach equation is used to calculate head loss due to friction in a pipe. What does the 'f' parameter represent in this equation?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In laminar flow through a circular pipe, the velocity profile is parabolic, with the maximum velocity occurring at the center. According to the Hagen-Poiseuille equation, how does the flow rate relate to the pipe radius?",
    SuggestedApproach: "Options: Directly proportional to the radius, Inversely proportional to the radius, Directly proportional to the radius squared, Directly proportional to the fourth power of the radius"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which type of control system is characterized by feedback loops to maintain desired outputs?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the purpose of a multiplexer in an instrumentation system?",
    SuggestedApproach: "Options: To amplify signals, To select one of several input channels, To convert analog signals to digital, To control digital outputs"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In a homogenous gas phase reacction A+2B->R+S what is the relationhip between rA and rB.",
    SuggestedApproach: "Option: rA=rB"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "For stripping of a gas in a counter current stripper, the operating line",
    SuggestedApproach: "Options: Lies above equilibrium curve, Lies below the equilibrium curve, Can lie above or below the equilibrium curve, Is always parallel to equilibrium curve"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Packed towers are preferred for gas-liquid mass transfer operations with foaming liquids because",
    SuggestedApproach: "Options: in packed towers, high liquid to gas ratios are best handled, in packed towers, continuous contact of gas and liquid takes place, packed towers are packed with random packings, in packed towers, the gas is not bubbled through the liquid pool"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In distillation processes, what is the purpose of using a 'fractionating column'?",
    SuggestedApproach: "Options: To increase pressure, To improve separation, To decrease temperature, To reduce energy consumption"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Taking the acceleration due to gravity to be 10 m/s2, the separation factor of a cyclone 0.5 m in diameter and having a tangential velocity of 20 m/s near the wall is",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "For a vertical plate experiencing free convection, the Nusselt number is a function of:",
    SuggestedApproach: "Options: Prandtl number only, Grashof and Prandtl numbers, Reynolds and Prandtl numbers, Schmidt number only"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the equation that describes the relationship between pressure drop, flow rate, viscosity, and pipe diameter in laminar flow?",
    SuggestedApproach: "Options: Hagen-Poiseuille equation, Bernoulli's principle, Newton's law of viscosity, Stokes' law"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which factor affects the buoyant force exerted on an object submerged in a fluid?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Pure O2 Is mixed with air to produce an enriched air containing 50% volumne of 02. The ratio of mole sof air to O2 is",
    SuggestedApproach: "Option: 1.72"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the purpose of adding desiccants in the drying process?",
    SuggestedApproach: "Options: To increase the temperature, To reduce the drying time, To absorb moisture from the air, To increase atmospheric pressure"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "In the context of chemical mixing, what does 'immiscible' mean?",
    SuggestedApproach: "Options: Liquids that mix at high temperatures only, Liquids that do not mix, Liquids that mix under pressure, Liquids that mix in any condition"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Catalyst is a substance that",
    SuggestedApproach: "Options: Increases the rate of reaction, Decreases rate of reaction, Both A and B"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Pool boiling equipment operating above ambient temperature is usually designed to operate",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What term describes the process of increasing the concentration of adsorbate on the surface of adsorbent with time?",
    SuggestedApproach: "Option: Adsorption equilibrium"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Transform the following direct speech into indirect speech. \"We are going to win the championship!\" they exclaimed.",
    SuggestedApproach: "Options: They exclaimed that they were going to win the championship., They exclaimed that they had won the championship."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Identify the error in the sentence. \"She had been working tirelessly for weeks, but her efforts hadn't produced any positive results.\"",
    SuggestedApproach: "Options: She had been working tirelessly for weeks, but her efforts, hadn't produced any positive results, error"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Identify the error in the sentence. \"She is too tired to not go to the party tonight.\"",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Transform the following direct speech into indirect speech\"I must go now,\" she said reluctantly.",
    SuggestedApproach: "Options: She reluctantly said that she must go now., She reluctantly said that she had to go then., She said reluctantly that she must go now., She said reluctantly that she must go then."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Transform the following direct speech into indirect speech. \"If I were you, I would go,\" she advised.",
    SuggestedApproach: "Option: She advised to go if she was you."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "\"His reckless behavior left him in hot water.\" What does the idiom \"in hot water\" mean in the given context?",
    SuggestedApproach: "Options: boiling in the pot, in trouble or difficulty, swimming in a river, enjoying a warm bath"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Choose the correct tense in the following sentence. Every year, the company _______ millions of dollars on research and development.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Identify the error in the sentence. \"The committee members, along with their advisors, is scheduled to meet tomorrow.\"",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Choose the correct tense in the following sentence. By 2030, they _______ in the same town for 15 years.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "\"The company's success was a result of the CEO's ability to think outside the _______\" Which idiom completes the sentence?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Preet is the father of Atul. Vanshika and Muskan are the daughters of Manshi, who is the only sister of Atul. Rohan is the son of Atul and Arushi. How is Preet is related to Muskan?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If the word 'HIBISCUS' is coded as 'UVOVFPHF', what will be 'HIPPOPOTAMUS'?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A boat can travel with a speed of 14 km/hr in still water. If the speed of the stream is 6 km/hr, find the time the boat takes to go 74 km downstream.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If \"GARDEN\" is coded as \"NGARDE\", how is \"PLANTS\" coded?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If the ratio of the speeds of the boat upstream and downstream is 4:3. What will be the ratio of speeds of the boat and stream?",
    SuggestedApproach: "Option: 1:7"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Find the missing term in the given series: 182,188,194, 206",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Chintu has only two children. Jatin is the brother of Jyoti. Jyoti is the daughter of Sonal. Kriti is the granddaughter of Sonal. Chintu is the father of Jatin. Shubham is the father of Kriti. How is Shubham is related to Jatin?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Referring to the woman, Sonu said \"The son of her daughter is the brother of my wife's daughter.\" How is the lady related to Sonu?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the average age of the class? I. The ratio of boys to girls in the class is 2:3. II. The average age of boys is 21, and number of girls are 30.",
    SuggestedApproach: "Options: The question can be answered using one of the statements alone..."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Does the given transaction result in loss or gain? I. Selling price of an article is Rs. 120. II. Selling price of 18 articles is equal to the cost price of 20 articles.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If \"WATER\" is coded as \"ATEWR\", how is \"MOUNT\" coded?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Akash is the son of Akshay's father's sister. Sonu is the son of Ritu, who is the mother of Karan and grandmother of Akshay. Shivam is the father of Akshita and the grandfather of Akash. Ritu is the wife of Shivam. How is the wife of Karan related to Akshita?",
    SuggestedApproach: "Option: Sister in law"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "At 9:45 AM, Seated in an enigmatic arrangement, Anjali and Saurabh find themselves in a face-off. Intriguingly, Saurabh's shadow mysteriously extends towards the left of Anjali. Amidst this curious scenario, deduce: What cardinal direction is Saurabh unequivocally oriented towards?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "The 15th term of an arithmetic progression is 37, and the common difference is -2. What is the first term?",
    SuggestedApproach: "Option: 45"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A man starts at point O and walks 3 km north. He then turns right and walks 4 km. He then turns right and walks 5 km. He then turns right and walks 3 km. In which direction is he now from point O?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Find the distance covered by boat in 3 hours in downstream direction, if the speed of boat in still water is 15 kmph and speed of stream is 5 kmph.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Two numbers are multiplied, and they give their products as 14700. When the larger number is divided by a smaller number, the quotient is 3. What would be the difference between the larger and the smaller number?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A man walks 100 m towards the east, then turns 90 degrees clockwise and walks 50 m. Finally, he turns 90 degrees clockwise and walks 20 m. In which direction is he now from the starting point?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "The ratio of the ages of two boys, A and B, is 5:3. If the age of A is 15 years, what is the age of B?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the sixth term of an AP? I. First term I=6.11. Common difference = 3",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If the 6th term of a geometric progression is 81 and the common ratio is 3, what is the first term?",
    SuggestedApproach: "Options: 1/3, 3/6"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Find the missing term in the given series: 5,12,13,10,26",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A boat moves 2 km upstream in 40 minutes and 2 km downstream in 20 minutes. The speed of the current is?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What role do grain boundaries play in the diffusion process within metals?",
    SuggestedApproach: "Options: Slow down diffusion significantly, Act as barriers to dislocation movement, Provide paths of high diffusivity, Increase the metal's electrical resistance"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which advanced manufacturing process uses a high-powered laser to fuse small particles of materials into a solid?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "An equipment costs Rs.170000 and will have a scrap value of Rs 25000 at the end of its useful life of 10 years. If the interest is compounded at 10% per year, what is the capitalised cost of equipment to nearest value",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which dimensionless number shows the tendency of axial mixing in a reactor?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which of the laws is followed by the Ideal solutions",
    SuggestedApproach: "Option: Fick's law"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the term for the process of reducing the grain size of a material to enhance its mechanical properties?",
    SuggestedApproach: "Option: Grain refinement"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the Dittus-Boelter equation commonly used for?",
    SuggestedApproach: "Options: Calculating pressure drop in pipe flow, Calculating heat transfer coefficients in turbulent flow inside tubes, Calculating drag force on spheres, Calculating boundary layer thickness"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Which alloying element is commonly added to steel to enhance its resistance to corrosion?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is the full form of LEL?",
    SuggestedApproach: "Option: None of the above"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "The conversion of a reactant undergoing a first order reaction at a time equal to three times the half life of the reaction is",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A 4% solution of salt in water is required in a continuous process. For this purpose, a part off the water is bypassed through a saturator from which a 25% solution is produced. If this stream is mixed with the main water stream to produce the 4% solution, what percentage of water must be bypassed.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What is meant by the Fouling factor?",
    SuggestedApproach: "Options: Resistance to heat transfer due to the build-up of foulant layer, A factor to be multiplied with the heat duty to evaluate heat exchanger performance, A measure to determine thickness of tubes..., A factor to evaluate resistance to fluid flow..."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Bhuvan's house has a south-facing front. He departs from the rear gate of his house and proceeds to walk 18 km. Afterward, he makes a right turn, covering 28 km. Following this, he makes another right turn and advances 35 km. A left turn guides him for 12 km, and another left turn leads to a 17 km journey. Determine Bhuvan's distance and direction from his initial location.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "What should come next? 11 31 41 51 66 96 1717",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Commencing her journey from the office, Jhanvi initially walks 50 meters westward. Subsequently, she takes a left turn and covers a distance of 90 meters. Another left turn guides her for 30 meters, followed by yet another left turn and a 120-meter advancement. Concluding her path, she executes a right turn, traveling 20 meters to reach her destination. Determine her current distance and directional orientation relative to the office.",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Priya is the sister of Pankaj. Saurabh's mother is married to Pankaj. Akshita has one son and one daughter. Muskan is the sister of Saurabh, who is the paternal grandson of Akshita. Muskan is the daughter of Rinki. How is Priya related to Rinki?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A+B means 'A is the father of B'; A-B means 'A is the wife of B', AxB means 'A is the daughter of B', A/B means 'A is the son of B'. If JxK+L+M, then how is M related to J?",
    SuggestedApproach: "Option: Father"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A+B' means 'A is the daughter of B'. 'A S B' means 'A is the husband of B'. A@B' means 'A is the brother of B'. 'A & B' means 'A is the mother of B'. 'A % B' means 'A is the son of B'. If 'W @ S% KSG&U&T@R + C, then which of the following statements is correct?",
    SuggestedApproach: "Options: G is the father of W., G is the maternal grandmother of R., C is the father-in-law of K., C is the wife of U."
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "If \"ELEVATOR\" is coded as \"VOVEZGLI\", how is \"ELEVATION\" coded?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Doug McMillon Initially heads eastward on a sunny morning, enjoying the fresh air, and covers a distance of 69.7 meters. He then decides to explore a little more and makes a left turn, walking 36.9 meters in a straight path. Feeling curious about his surroundings, he takes another left turn and continues forward for 45.8 meters, taking in the sights along the way. Suddenly, he spots a colorful bird and makes one more left turn and cover a distance of 36.9m to get a better view. What is the current distance between Arjun and his initial starting point?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Harper is the daughter of Avery. Avery has a twin brother, Jordan. What is Harper's relation to Jordan?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Harshit is husband of Preeti who is sister of Aarti. Aarti is the daughter of Chintu. Sheetal is the mother-in-law of Shubham. Shivam is the father of Harshit and Sheetal is the wife of Chintu. Chintu and Sheetal have only two daughters. How is Shubham related to Chintu?",
    SuggestedApproach: "Option: Son in law"
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A person walks 15 km towards the east, then turns 60 degrees clockwise and walks 10 km, then turns 210 degrees clockwise and walks 40 km. In which direction is the person from the starting point?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "A group of alphabets are given with each being assigned a number, these have to be unscrambled into a meaningful word and correct order of letters may be indicated from the given responses. TMHREO:543210",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Beginning her journey at the office, Akshita initially advances a certain distance towards the east. From this point, she turns right and covers 100 meters, followed by a left turn and 30 meters of walking. Concluding her route, she makes another left turn and advances 40 meters to reach the shopping mall. Given that the direct distance between her office and the shopping mall is 100 meters, what is the initial eastward distance that Akshita covered starting from her office?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Disha is the granddaughter of Aarav who is married to Jhanvi. Nitin is the brother-in-law of Aarav who has two daughters but no son. Ashutosh is the cousin of Kamalesh and brother of Disha. Daksh and Virat are the sons-in-law of Jhanvi. Virat is married to Kajal and they have two daughters and one son. Daksh has one son and one daughter. Tanvi and Priya are the daughters of Kajal. Nitin is unmarried. How is Kajal related to Ashutosh ?",
    SuggestedApproach: ""
  },
  {
    CompanyName: "Reliance",
    TargetBranch: "Chemical, Mechanical, Electrical, Instrumentation Engineering",
    RoleDesignation: "Graduate Engineer Trainee (GET)",
    InterviewRoundType: "Online Test",
    DriveYear: "2026",
    QuestionContent: "Amelia is the wife of Leo. Max is the brother of Leo. How is Max related to Amelia?",
    SuggestedApproach: ""
  }
];

// ── Helper: auto-tag questions based on content ──
function autoTag(question) {
  const q = question.toLowerCase();
  const tags = [];
  
  // Technical categories
  if (/young.s modulus|stress|strain|material|mechanical propert|tensile|compressive/.test(q)) tags.push('Mechanical Engineering', 'Material Science');
  if (/filter|low.pass|high.pass|band.pass|band.stop|cutoff/.test(q)) tags.push('Electronics', 'Signal Processing');
  if (/digital circuit|binary|flip.flop|gate/.test(q)) tags.push('Digital Electronics');
  if (/eutrophication|water bod|aquatic/.test(q)) tags.push('Environmental Engineering');
  if (/safety valve|control valve/.test(q)) tags.push('Process Safety');
  if (/reactor|space time|conversion|first order|intermediate|catalyst/.test(q)) tags.push('Chemical Reaction Engineering');
  if (/distillation|azeotrop|fractionating|steam distillation/.test(q)) tags.push('Mass Transfer', 'Distillation');
  if (/dryer|drum dryer|flight|drying|desiccant/.test(q)) tags.push('Drying Operations');
  if (/impeller|mixing|immiscible/.test(q)) tags.push('Mixing Operations');
  if (/entropy|phase transition|thermodynamic/.test(q)) tags.push('Thermodynamics');
  if (/humidity|wet bulb|cooling tower/.test(q)) tags.push('Humidification');
  if (/adsorption|adsorbate|adsorbent/.test(q)) tags.push('Mass Transfer', 'Adsorption');
  if (/darcy.weisbach|hagen.poiseuille|laminar flow|pipe|fluid|buoyant|viscosity|pressure drop/.test(q)) tags.push('Fluid Mechanics');
  if (/heat transfer|nusselt|convection|boiling|fouling|dittus.boelter/.test(q)) tags.push('Heat Transfer');
  if (/control system|feedback|multiplexer|instrument/.test(q)) tags.push('Instrumentation & Control');
  if (/stripping|packed tower|mass transfer/.test(q)) tags.push('Mass Transfer');
  if (/cyclone|separation factor/.test(q)) tags.push('Mechanical Operations');
  if (/mole|enriched air|material balance|bypass|salt|solution/.test(q)) tags.push('Material & Energy Balance');
  if (/grain boundar|diffusion|corrosion|alloy|grain refine/.test(q)) tags.push('Material Science');
  if (/laser|manufacturing|SLS|additive/.test(q)) tags.push('Manufacturing');
  if (/capitalised cost|scrap value|equipment cost/.test(q)) tags.push('Process Economics');
  if (/peclet|dimensionless|axial mixing/.test(q)) tags.push('Chemical Reaction Engineering');
  if (/raoult|ideal solution|fick/.test(q)) tags.push('Thermodynamics');
  if (/LEL|lower explosive/.test(q)) tags.push('Process Safety');
  if (/chiral|crystallization/.test(q)) tags.push('Crystallization');

  // Verbal / English
  if (/direct speech|indirect speech|tense|error in the sentence|idiom|grammar/.test(q)) tags.push('Verbal Ability', 'English');

  // Aptitude / Reasoning
  if (/father|mother|brother|sister|son|daughter|grandfather|grandmother|wife|husband|related/.test(q)) tags.push('Blood Relations', 'Logical Reasoning');
  if (/coded|coding|decod/.test(q)) tags.push('Coding-Decoding', 'Logical Reasoning');
  if (/boat|upstream|downstream|stream|speed/.test(q)) tags.push('Boats & Streams', 'Quantitative Aptitude');
  if (/series|missing term|sequence/.test(q)) tags.push('Number Series', 'Quantitative Aptitude');
  if (/direction|north|south|east|west|clockwise|shadow|cardinal/.test(q)) tags.push('Direction Sense', 'Logical Reasoning');
  if (/arithmetic progression|AP|geometric progression|GP|common difference|common ratio/.test(q)) tags.push('Progressions', 'Quantitative Aptitude');
  if (/ratio|age|proportion/.test(q)) tags.push('Ratio & Proportion', 'Quantitative Aptitude');
  if (/profit|loss|selling price|cost price|gain/.test(q)) tags.push('Profit & Loss', 'Quantitative Aptitude');
  if (/data sufficiency|statement/.test(q)) tags.push('Data Sufficiency', 'Logical Reasoning');
  if (/unscrambled|meaningful word/.test(q)) tags.push('Word Formation', 'Logical Reasoning');

  // Deduplicate
  return [...new Set(tags)];
}

// ── Map raw JSON → DriveQuestion schema ──
function mapToSchema(raw) {
  return {
    company: raw.CompanyName.trim(),
    branch: raw.TargetBranch.trim(),
    role: raw.RoleDesignation.trim(),
    round: raw.InterviewRoundType.trim(),
    question: raw.QuestionContent.trim(),
    answer: raw.SuggestedApproach ? raw.SuggestedApproach.trim() : '',
    year: raw.DriveYear.trim(),
    difficulty: 'Medium',
    tags: autoTag(raw.QuestionContent),
  };
}

// ── Main ──
async function main() {
  try {
    console.log(`\n🔌 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log(`✅ Connected to MongoDB\n`);

    const documents = rawQuestions.map(mapToSchema);
    console.log(`📋 Total questions to insert: ${documents.length}\n`);

    // Check for duplicates before inserting
    let skipped = 0;
    let inserted = 0;
    for (const doc of documents) {
      const exists = await DriveQuestion.findOne({
        company: doc.company,
        question: doc.question,
        year: doc.year,
      });

      if (exists) {
        skipped++;
        console.log(`⏭️  SKIP (already exists): "${doc.question.substring(0, 60)}..."`);
      } else {
        await DriveQuestion.create(doc);
        inserted++;
        console.log(`✅ Inserted: "${doc.question.substring(0, 60)}..."`);
      }
    }

    console.log(`\n========================================`);
    console.log(`📊 Summary:`);
    console.log(`   Total questions:  ${documents.length}`);
    console.log(`   Inserted:         ${inserted}`);
    console.log(`   Skipped (dupes):  ${skipped}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();
