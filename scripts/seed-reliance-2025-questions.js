/**
 * Seed script: Insert Reliance GET 2025 (Chemical Engineering) past drive questions into MongoDB
 * Run: node scripts/seed-reliance-2025-questions.js
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

const rawQuestions = [
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The absorption factor in counter-current operation is defined as the ratio of:",
        "SuggestedApproach": "Options: a) L/V b) V/L c) mV/L d) L/mV"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Mach number is the ratio of:",
        "SuggestedApproach": "Options: a) Inlet velocity / Exit velocity b) Fluid velocity / Sound velocity c) Pressure / Density d) Flow energy / Kinetic energy"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Schedule number of a pipe indicates:",
        "SuggestedApproach": "Options: a) Material composition b) Wall thickness c) Inside diameter d) Pipe length"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Optimum reflux ratio is approximately:",
        "SuggestedApproach": "Options: a) 1.2 Rm to 1.5 Rm b) 2 Rm c) 3 Rm d) Equal to Rm"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The volute in a centrifugal pump is provided to:",
        "SuggestedApproach": "Options: a) Increase discharge b) Convert velocity head into pressure head c) Reduce friction d) Balance radial thrust"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The Virial equation of state is:",
        "SuggestedApproach": "Options: a) PV=RT b) PV=aT+bT^2+cT^3 c) (PV=RT(1+B/V+C/V^2+...)) d) (P-a)(V-b^2)=RT"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Which pump is used against a pressure of 1500 kg/cm2?",
        "SuggestedApproach": "Options: a) Centrifugal b) Gear c) Plunger d) Jet"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Thiele-Gedde model is used for:",
        "SuggestedApproach": "Options: a) Diffusion-controlled reactions b) Catalytic reactions c) Adsorption d) Thermal cracking"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In Orsat analysis, nitrogen (N2) is absorbed using:",
        "SuggestedApproach": "Options: a) KOH b) Cuprous chloride c) Pyrogallol d) None of the above"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The Carnot cycle represents:",
        "SuggestedApproach": "Options: a) A reversible cycle of maximum efficiency b) A real gas cycle c) Refrigeration cycle only d) A constant volume cycle"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Transformation of solid directly to gas is called:",
        "SuggestedApproach": "Options: a) Evaporation b) Sublimation c) Condensation d) Fusion"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Equation for relative volatility is:",
        "SuggestedApproach": "Options: a) a=(yA/xA)/(yB/xB) b) a=(xA/yA)/(xB/yB) c) a=yA/yB d) a=xA/xB"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Equivalent weight of Na2CO3 is:",
        "SuggestedApproach": "Options: a) 53 b) 106 c) 26.5 d) 53.5"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Which has higher boiling point?",
        "SuggestedApproach": "Options: a) Solvent b) Solution c) Both equal d) Depends on temperature"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Effect of temperature on specific heat (Cp):",
        "SuggestedApproach": "Options: a) Decreases with increase in T b) Increases with increase in T c) Remains constant d) Decreases exponentially"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Effect of temperature on conversion in exothermic reaction:",
        "SuggestedApproach": "Options: a) Increases b) Decreases c) Independent d) First increases then decreases"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "For adiabatic compression (first cycle), work done is:",
        "SuggestedApproach": "Options: a) Minimum b) Maximum c) Zero d) Constant"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In which reactor are exit and reactor compositions same?",
        "SuggestedApproach": "Options: a) PFR b) CSTR c) Batch d) Semi-batch"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "WHSV (Weight Hourly Space Velocity) is related to:",
        "SuggestedApproach": "Options: a) Catalysis b) Fluidization c) Sedimentation d) Heat transfer"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Equivalent diameter for non-spherical particles is based on:",
        "SuggestedApproach": "Options: a) Same volume b) Same surface area c) Both (a) and (b)"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Poiseuille's equation relates to:",
        "SuggestedApproach": "Options: a) Laminar flow in a pipe b) Turbulent flow c) Compressible flow d) Boundary layer"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Pump efficiency vs. Head curve gives:",
        "SuggestedApproach": "Options: a) Constant head b) Maximum at optimum discharge c) Linear relation d) No relation"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "High air flow rates are not allowed in furnaces because:",
        "SuggestedApproach": "Options: a) Reduces temperature b) Causes heat loss c) Leads to incomplete combustion d) Decreases efficiency"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Incomplete combustion is indicated by emission of:",
        "SuggestedApproach": "Options: a) CO b) CO2 c) SO2 d) NOx"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Unit of heat transfer coefficient is:",
        "SuggestedApproach": "Options: a) W/m2.K b) W/m.K c) J/kg K d) None"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Proportionality constant in Fourier's law represents:",
        "SuggestedApproach": "Options: a) Thermal conductivity b) Diffusivity c) Emissivity d) Viscosity"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Corrosive fluids are generally passed through:",
        "SuggestedApproach": "Options: a) Tube side b) Shell side c) Baffles d) Headers"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Floating head in a heat exchanger is used for:",
        "SuggestedApproach": "Options: a) Pressure control b) Cleaning and expansion c) Increasing turbulence d) Reducing cost"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Overall heat transfer coefficient is influenced by:",
        "SuggestedApproach": "Options: a) Inside film coefficient (hi) b) Outside film coefficient (ho) c) Fouling factor d) All of the above"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Feed-forward controller parameters are adjusted based on:",
        "SuggestedApproach": "Options: a) Load changes b) Error signal c) Time lag d) Dead time"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Which controller ensures stability in settings?",
        "SuggestedApproach": "Options: a) P b) I c) D d) PID"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "An extensive property among the following is:",
        "SuggestedApproach": "Options: a) Pressure b) Density c) Volume d) Viscosity"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "LPG mainly consists of:",
        "SuggestedApproach": "Options: a) Propane & Butane b) Methane & Ethane c) Hydrogen & CO d) Benzene & Toluene"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Permanent hardness of water is due to:",
        "SuggestedApproach": "Options: a) Carbonates b) Sulphates c) Bicarbonates d) None"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "One ton of refrigeration equals:",
        "SuggestedApproach": "Options: a) 1200 kW b) 12000 kW c) 3.516 kW d) 1000 BTU/hr"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "An area meter is:",
        "SuggestedApproach": "Options: a) Pitot tube b) Orifice meter c) Venturi meter d) Rotameter"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Pitot tube measures:",
        "SuggestedApproach": "Options: a) Static pressure b) Velocity head c) Total head d) Static + dynamic head"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Reynold's number is the ratio of:",
        "SuggestedApproach": "Options: a) Inertial forces to viscous forces b) Viscous forces to inertial forces c) Pressure forces to surface tension forces d) Gravitational forces to viscous forces"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In a double pipe heat exchanger, the overall heat transfer coefficient is controlled primarily by:",
        "SuggestedApproach": "Options: a) Inner fluid resistance b) Outer fluid resistance c) The smaller of the two film coefficients d) Wall conductivity only"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The Schmidt number is defined as:",
        "SuggestedApproach": "Options: a) u/(p D) b) v/a c) a/v d) k/u"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The main purpose of baffles in a shell-and-tube heat exchanger is to:",
        "SuggestedApproach": "Options: a) Support the tubes b) Increase turbulence and heat transfer c) Reduce shell-side pressure drop d) Prevent scaling"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The critical radius of insulation is significant for:",
        "SuggestedApproach": "Options: a) Cylindrical and spherical surfaces b) Plane walls c) Thin films d) All surfaces"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In distillation, \"minimum reflux ratio\" corresponds to:",
        "SuggestedApproach": "Options: a) Infinite number of plates b) Minimum number of plates c) Maximum efficiency d) Constant pressure"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The main assumption in Fick's law of diffusion is:",
        "SuggestedApproach": "Options: a) Steady-state diffusion b) Unsteady diffusion c) Diffusion with chemical reaction d) Multicomponent mass transfer"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In fluidized bed operation, if gas velocity is increased beyond terminal velocity:",
        "SuggestedApproach": "Options: a) Particles settle down b) Bed becomes stationary c) Particles are carried away d) Bed defluidizes"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The main purpose of a reflux drum in a distillation column is to:",
        "SuggestedApproach": "Options: a) Control column pressure b) Separate vapor and liquid phases c) Increase tray efficiency d) Reduce condenser load"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The effectiveness of a heat exchanger is defined as the ratio of:",
        "SuggestedApproach": "Options: a) Actual heat transfer / Maximum possible heat transfer b) Outlet temperature / Inlet temperature c) Qmax/Qactual d) Counterflow / Parallel flow"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In a CSTR, if the feed concentration doubles, conversion (for first-order reaction) will:",
        "SuggestedApproach": "Options: a) Remain same b) Increase c) Decrease d) Be independent of concentration"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In a packed bed reactor, pressure drop is proportional to:",
        "SuggestedApproach": "Options: a) Velocity b) Velocity^2 c) 1/Velocity d) Constant"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The Lewis number (Le=Sc/Pr) equals unity for:",
        "SuggestedApproach": "Options: a) Air-water vapor systems b) Liquid metals c) Hydrocarbons d) Gases at high pressure"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Fox belongs to the family of:",
        "SuggestedApproach": "Options: a) Wolf b) Tiger c) Cat d) Dog"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Accident: Carefulness :: Disease :",
        "SuggestedApproach": "Options: a) Doctor b) Medicine c) Sanitation d) Hospital"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "In a party, there are husband and wife, their two sons with their wives, and each son has 4 children. How many members are present in the party?",
        "SuggestedApproach": "Options: a) 12 b) 14 c) 16"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "1 yard of cloth costs 90 cents. What is the cost of 2.5 yards?",
        "SuggestedApproach": "Options: a) $1.80 b) $2.25 c) $2.10 d) $1.50"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "10 boxes of apples weigh 400 pounds. Each empty box weighs 4 pounds. Find the total weight of apples.",
        "SuggestedApproach": "Options: a) 360 lbs b) 380 lbs c) 400 lbs d) 340 lbs"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Husbands are ____ shorter than wives.",
        "SuggestedApproach": "Options: a) Never b) Usually c) Rarely d) Seldom"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Fathers are ____ wiser than sons.",
        "SuggestedApproach": "Options: a) Never b) Usually c) Rarely d) Always"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Mothers are ____ older than daughters.",
        "SuggestedApproach": "Options: a) Never b) Usually c) Always d) Frequently"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Find the odd number: 0, 1, 3, 6, 10, 15, 21, 28, 34",
        "SuggestedApproach": "Options: a) 15 b) 21 d) 28 (options as given)"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "If you interchange 1st-2nd, 3rd-4th, 5th-6th letters in the word CONSTITUTIONAL, what will be the 12th letter in the new word?",
        "SuggestedApproach": "Options: a) N b) T c) O d) A"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Opposite of Love is:",
        "SuggestedApproach": "Options: a) Hate b) Extravagant c) Disgrace d) Despair"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Circle: Sphere :: Square :",
        "SuggestedApproach": "Options: a) Cube b) Hexagon c) Triangle d) Rectangle"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Light: Candela :: Temperature :",
        "SuggestedApproach": "Options: a) Kelvin b) Thermometer c) Pressure d) Scale"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Quiet: Noise :: Sunlight :",
        "SuggestedApproach": "Options: a) Darkness b) Brightness c) Light d) Shadow"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Find the odd word:",
        "SuggestedApproach": "Options: a) Shear b) (missing) d) Chop"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Find the odd word:",
        "SuggestedApproach": "Options: a) Good b) Red c) Walk d) Thick"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Meaning of the proverb \"Early bird catches the worm\":",
        "SuggestedApproach": "Options: a) Success comes to those who act early b) Birds eat worms c) Morning work is good d) Delay causes failure"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "All birds have ____:",
        "SuggestedApproach": "Options: a) Nest b) Wings c) Bill d) Beak"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "All club members are Republicans. Smith is not a Republican. Therefore, Smith is a club member - this statement is:",
        "SuggestedApproach": "Options: a) True b) False c) Undefined d) Cannot say"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A 20-inch pipe is cut into two pieces such that one piece is 2/3 longer than the other. What is the smaller piece's length?",
        "SuggestedApproach": "Options: a) 6 inches b) 8 inches c) 7.5 inches d) 12 inches"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Meaning of the proverb \"Dinner is judged by desserts\":",
        "SuggestedApproach": "Options: a) Final results determine the value b) Dessert is more important than food d) People like desserts"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Moon: Earth :: Earth:",
        "SuggestedApproach": "Options: a) Sun b) Universe c) Star d) Jupiter"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Trees always have:",
        "SuggestedApproach": "Options: a) Leaves b) Branches c) Roots d) All of these"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Opposite of Graceful is:",
        "SuggestedApproach": "Options: a) Awkward b) Elegant c) Polite d) Gentle"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Opposite of Honour is:",
        "SuggestedApproach": "Options: a) Disgrace b) Pride c) Fame d) Integrity"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "1, 4, 9, 25, 36, Which number does not fit the series?",
        "SuggestedApproach": "Options: a) 9 b) 25 c) 36 d) 108"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "5 cents = 3 pencils. How many pencils can be bought for 50 cents?",
        "SuggestedApproach": "Options: a) 20 b) 25 c) 30 d) 35"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Temperature is measured using:",
        "SuggestedApproach": "Options: a) Thermometer b) Hygrometer c) Barometer d) Anemometer"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Find the next term: 14, 25, 36, 47, 59, 69",
        "SuggestedApproach": "Options: a) 47 b) 69 c) 59 d) 81"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Series: L, M, N, O, P, Q, R, S, T. The middle term is:",
        "SuggestedApproach": "Options: a) N b) O c) P d) Q"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Proverb: \"A child burnt by milk shuns even curd.\" means",
        "SuggestedApproach": "Options: a) Once hurt, always cautious b) Milk is dangerous c) Children are careless d) Fear is temporary"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Series: 1, 3, 6, 10, 15, 21, 28, ____",
        "SuggestedApproach": "Options: a) 34 b) 35 c) 36 d) 38"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Two statements joined together using and, but, or or are connected by:",
        "SuggestedApproach": "Options: a) Conjunction b) Preposition c) Adjective d) Pronoun"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Mirror image of the word OTTO will appear as:",
        "SuggestedApproach": "Options: a) OTTO b) TOOT c) OOTT d) TOTO"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Series: 1, 3, 9, 27, 81 Find the wrong number.",
        "SuggestedApproach": "Options: a) 9 b) 27 c) 81 d) None"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Cream is made from milk in the ratio 2:3. How much cream can be made from 15 parts of milk?",
        "SuggestedApproach": "Options: a) 8 b) 10 c) 12 d) 9"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "24 inches shrink to 20 inches. Then 36 inches will shrink to:",
        "SuggestedApproach": "Options: a) 30 inches b) 28 inches c) 26 inches d) 32 inches"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "If 1 sec = 6 feet, distance covered in 10 sec = ?",
        "SuggestedApproach": "Options: a) 240 ft b) 300 ft c) 120 ft d) 150 ft"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Opposite of Economical is:",
        "SuggestedApproach": "Options: a) Extravagant b) Miser c) Thrifty d) Greedy"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Opposite of Loyal is:",
        "SuggestedApproach": "Options: a) Treacherous b) Faithful c) Honest d) Friendly"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Why is silver costlier than iron?",
        "SuggestedApproach": "Options: a) It is rarer b) It is lighter c) It is more reactive d) It is softer"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Meaning of \"When the cat's away, the mice will play\":",
        "SuggestedApproach": "Options: a) Subordinates enjoy freedom when superior is absent b) Cats eat mice c) Mice fear cats d) People like fun"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "2 parts of cream are made from 3 parts of milk. From 15 parts of milk, cream obtained =",
        "SuggestedApproach": "Options: a) 10 b) 8 c) 6 d) 9"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Find the missing number in series: 4, 2, 5, 3, 6, 4, 7, 5, _, 6, 9",
        "SuggestedApproach": "Options: a) 7 b) 8 c) 9 d) 10"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Identify the first number that repeats twice in the series: 2, 5, 4, 3, 9, 0, 5, 9",
        "SuggestedApproach": "Options: a) 2 b) 5 c) 3 d) 9"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "If a meal should always involve",
        "SuggestedApproach": "Options: a) Food b) Drink c) Dessert d) Nap"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "How do people recognize a person?",
        "SuggestedApproach": "Options: a) By characteristics b) By clothes c) By speech d) By work"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Rotation: Whirlpool :: Flying :",
        "SuggestedApproach": "Options: a) Wings b) Air c) Birds d) Movement"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Ordinary: Excellent :: Few :",
        "SuggestedApproach": "Options: a) Many b) Some c) Most d) Less"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "13, 24, 35, 46 -> Find the next term.",
        "SuggestedApproach": "Options: a) 57 b) 58 c) 59"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Given PB = 60%, 70%, 80%, 90%. Which one is most sensitive?",
        "SuggestedApproach": "Options: a) 60% b) 70% c) 80% d) 90%"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "If 12 men can do a work in 6 days, how many men are required to do it in 4 days?",
        "SuggestedApproach": "Options: a) 8 b) 9 c) 12 d) 18"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A train 180 m long passes a pole in 12 sec. Find its speed (km/hr).",
        "SuggestedApproach": "Options: a) 45 b) 50 c) 54 d) 60"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A sum of ₹5000 becomes ₹6000 in 2 years at simple interest. Find the rate of interest.",
        "SuggestedApproach": "Options: a) 5% b) 8% c) 10% d) 12%"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "Ratio of ages of A and B is 3:4. After 6 years, ratio becomes 4:5. Find A's present age.",
        "SuggestedApproach": "Options: a) 12 b) 18 c) 24 d) 30"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A car covers 240 km in 4 hours. What is its average speed?",
        "SuggestedApproach": "Options: a) 50 km/h b) 55 km/h c) 60 km/h d) 65 km/h"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The average of 10 numbers is 25. If each number is increased by 5, the new average = ?",
        "SuggestedApproach": "Options: a) 25 b) 28 c) 30 d) 36"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A man buys an article for ₹800 and sells it for ₹1000. Find profit %.",
        "SuggestedApproach": "Options: a) 15% b) 20% c) 25% d) 30%"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The simple interest on ₹4000 at 5% for 3 years = ?",
        "SuggestedApproach": "Options: a) ₹400 b) ₹500 c) ₹600 d) ₹700"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "A pipe fills a tank in 6 hrs and another empties it in 9 hrs. Time to fill together = ?",
        "SuggestedApproach": "Options: a) 10 hr b) 12 hr c) 18 hr d) 18/5 hr"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "If 20% of a number is 40, the number is:",
        "SuggestedApproach": "Options: a) 100 b) 150 c) 200 d) 250"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "Chemical Engineering",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Online Test",
        "DriveYear": "2025",
        "QuestionContent": "The perimeter of a square is 40 cm. Find its area.",
        "SuggestedApproach": "Options: a) 80 b) 100 c) 120 d) 160"
    }
];

// Helper: auto-tag questions based on content
function autoTag(question) {
  const q = question.toLowerCase();
  const tags = ['Chemical Engineering'];

  // Chemical Engineering Subjects
  if (/absorption|reflux|distillation|relative volatility|orsat|fick|schmidt|mass transfer|lewis number/.test(q)) {
    tags.push('Mass Transfer');
  }
  if (/mach number|pipe|pump|volute|poiseuille|reynold|pitot|rotameter|area meter|fluidize|pressure drop/.test(q)) {
    tags.push('Fluid Mechanics');
  }
  if (/virial|carnot|adiabatic|thermodynamic|cp|specific heat|boiling point|extensive property|refrigeration/.test(q)) {
    tags.push('Thermodynamics');
  }
  if (/reactor|cstr|pfr|whsv|exothermic|conversion|cataly|thiele/.test(q)) {
    tags.push('Chemical Reaction Engineering');
  }
  if (/heat transfer|fourier|insulation|baffle|heat exchanger|floating head|effectiveness|furnace/.test(q)) {
    tags.push('Heat Transfer');
  }
  if (/feed-forward|controller|pid|proportional|stability|pb =/.test(q)) {
    tags.push('Process Dynamics & Control');
  }
  if (/equivalent weight|hardness|lpg|combustion|sublimation|na2co3/.test(q)) {
    tags.push('Chemical Technology', 'Applied Chemistry');
  }

  // Aptitude & Reasoning
  if (/proverb|opposite|meaning of|mirror image|conjunction|fox|birds|trees|fathers|mothers|husbands|accident/.test(q)) {
    tags.push('Verbal Ability', 'Logical Reasoning');
  }
  if (/series|odd number|odd word|middle term|fits the series|missing number/.test(q)) {
    tags.push('Number Series', 'Logical Reasoning');
  }
  if (/train|speed|car|men.*work|simple interest|profit|pipe.*tank|percentage|20% of|perimeter|ratio|yards|cents|apples|pounds|cream.*milk/.test(q)) {
    tags.push('Quantitative Aptitude');
  }

  return [...new Set(tags)];
}

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

async function main() {
  try {
    console.log(`\n🔌 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log(`✅ Connected to MongoDB\n`);

    const documents = rawQuestions.map(mapToSchema);
    console.log(`📋 Total questions to process: ${documents.length}\n`);

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
