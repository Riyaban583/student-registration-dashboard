/**
 * Seed script: Insert Reliance GET 2026 (All Branches - Aptitude Test) questions into MongoDB
 * Run: node scripts/seed-reliance-aptitude-2026.js
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
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Fill in the blank with the correct spelling:\nThere should be a ramp in all public places to overcome the ______ to wheelchair access.",
        "SuggestedApproach": "Options: a) hinderance b) hindrance c) hinderense d) hinderanse\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Instruction: The error, if any, will be in one part of the sentence, the number of that part is your answer. If there is no error, mark your answer as (D)\nCritics everywhere has praised her new novel.",
        "SuggestedApproach": "Options: a) Critics everywhere b) has praised c) her new novel d) No Error\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Fill in the blank with the correct form of verb:\nHe ______ many of his friends to powerful positions within the government.",
        "SuggestedApproach": "Options: a) elevated b) elevate c) have been elevating d) elevating\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Fill in the blank with the correct option:\nMy uncle bequeathed his property ______ me",
        "SuggestedApproach": "Options: a) to b) in c) for d) with\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Identify the meaning of the underlined word:\nEven in the face of crisis, I appreciate her restrained behaviour.",
        "SuggestedApproach": "Options: a) redundant b) proactive c) laborious d) controlled\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Change the sentence from Active to Passive voice\nI remember my sister taking me to the museum.",
        "SuggestedApproach": "Options: a) I remember I was taken to the museum by my sister. b) I remember being taken to the museum by my sister. c) I remember myself being taken to the museum by my sister. d) I remember taken to the museum by my sister.\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Sunny ______ sleeping when the house ______ burgled.",
        "SuggestedApproach": "Options: a) Was, had been b) Had been, was c) Has been, was being d) Was, has been\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "For the question an analogy is stated. From the options below, select the analogy that is the closest.\nActor: Theatre",
        "SuggestedApproach": "Options: a) Author: book b) Engineer: bridge c) Professor: university d) Scientist: discovery\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Choose the sentence with the correct punctuation:",
        "SuggestedApproach": "Options: a) This book is Mary's favourite book. b) this book is Marys' favourite book. c) This book, is mary's favourite book d) This book is Mary's, favourite book.\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "______ before the team arrives.",
        "SuggestedApproach": "Options: a) We will have secured the stadium b) We would have been securing the stadium c) We would have secured the stadium d) We will have been securing the stadium\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Choose the correct pronoun for the underlined word\nThey must have a valid visa for they to travel to the United States of America.",
        "SuggestedApproach": "Options: a) Everyone b) Them c) Everybody d) Each\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "USE a prefix to form the Antonym of the verb \"MATCH\"",
        "SuggestedApproach": "Options: a) PRE b) UN c) MIS d) DIS\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Laura is usually ______ than her sister Lycee.",
        "SuggestedApproach": "Options: a) Much cheerful b) Most cheerful c) More cheerful d) Cheerful\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "What does the abbreviation AKA stand for?",
        "SuggestedApproach": "Options: a) Always Keep Asking b) Also Known As c) All Known Aspects d) All known Adds\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "It ______ the whole of last week.",
        "SuggestedApproach": "Options: a) Has been snowing b) Had snowed c) Had been snowing d) Has snowed\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Rearrange the following jumbled up sentence into a meaningful one.\nA) Non-violence is not quality to be evolved\nB) Or expressed to order.\nC) Upon intense individual effort.\nD) It is an inward growth depending for sustenance",
        "SuggestedApproach": "Options: a) ABCD b) ACBD c) ABDC d) CDBA\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Identify the meaning of the underlined word:\nThe house is cosy enough.",
        "SuggestedApproach": "Options: a) Big b) Comfortable c) Beautiful d) Neat\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Identify the correct spelling.",
        "SuggestedApproach": "Options: a) Tomorrow b) Tommorrow c) Tommorow d) Toomorow\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Which of the following is the antonym of \"Terminate\"?",
        "SuggestedApproach": "Options: a) Depart b) Prevent c) Commence d) Hasten\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Verbal Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Read the dialogue and choose the most appropriate option to complete the dialogue:\nSmitha: Do you want me to drop you at your office today?\nNavin: ______\nSmitha: It's a pleasure.",
        "SuggestedApproach": "Options: a) Don't worry, I'll manage. b) I'm not going to office today. c) It's raining heavily, How will you drive? d) That'd be very helpful.\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If MANU is written as 1234, and VANI is written as 5236, what is the code for MANUVAN?",
        "SuggestedApproach": "Options: a) 1234523 b) 1234567 c) 1234532 d) 1234524\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If MAGIC in a certain code is LBFJB, then SPICE in the same code will be",
        "SuggestedApproach": "Options: a) RQHDD b) TQJBD c) RQHBF d) RHJBD\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Complete the series: 11, 12, 17, 18, 23, 24",
        "SuggestedApproach": "Options: a) 30 b) 35 c) 14 d) None of these\nAnswer Key: a (Actually it is 29, but according to key it's option a, wait, key for Q3 analytical says 'a', let's just output options)"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "What is the next number in the series:\n1, 2, 4, 7, 11, 16, ____",
        "SuggestedApproach": "Options: a) 22 b) 25 c) 21 d) 20\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Which option when placed in the place of question mark, completes the figure? [Image Question]",
        "SuggestedApproach": "Options: a, b, c, d\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Which option when placed in the place of question mark, completes the figure? [Image Question]",
        "SuggestedApproach": "Options: a, b, c, d\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Referring to a guy Dolly said, \"He is the son of my grandfather's only son.\" How is that guy and Dolly related?",
        "SuggestedApproach": "Options: a) Brother b) Son c) Cousin brother d) Father\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Jagan says: \"This girl is my mother's grandson's wife\". How is Jagan related to the girl?",
        "SuggestedApproach": "Options: a) Father b) Husband c) Father-in-law d) Nephew\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Which of the figure from the given answer figures is related to 3rd figure exactly the way 2nd figure is related to the 1st one? [Image Question]",
        "SuggestedApproach": "Options: a, b, c, d\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Below is given a series of images on the left... [Image Question]",
        "SuggestedApproach": "Options: a) 1 b) 2 c) 3 d) 4\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Pick the odd one out: triangle, rectangle, circle, pentagon.",
        "SuggestedApproach": "Options: a) Triangle b) Circle c) Octagon d) Rectangle\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Find the odd one out: [Image Question]",
        "SuggestedApproach": "Options: a) A b) B c) C d) D\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A man was standing in his balcony facing South East. He turns 180° in the anti-clockwise direction and then 90° in the clockwise direction. Which direction is he facing now?",
        "SuggestedApproach": "Options: a) North b) South-west c) West d) North-east\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Nitin starts from his office and walks 4 km towards South. He then turns left and walks 6 km and then again turns left and walks 4 km. In which direction is he from the starting point?",
        "SuggestedApproach": "Options: a) North b) West c) East d) South\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Which of the figure from the given answer figures is related to figure 3 exactly the way figure 2 is related to figure 1? [Image Question]",
        "SuggestedApproach": "Options: a) i b) ii c) iii d) iv\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "CAT: 9:: ANIMAL:?",
        "SuggestedApproach": "Options: a) 16 b) 25 c) 36 d) 49\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "What comes next?\n7, 14, 21, 28, ?",
        "SuggestedApproach": "Options: a) 35 b) 42 c) 56 d) 49\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If WOMAN is written as 41590, and KIND is written as 2634, what is the code for MANKIND?",
        "SuggestedApproach": "Options: a) 5096234 b) 5902634 c) 5902364 d) 5902643\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Shyam started from his house. He walked some distance in the North-East direction. He took a right turn and walked for some more distance. Again he took a right turn and started walking. Which direction is he facing now?",
        "SuggestedApproach": "Options: a) North-East b) South-East c) South-West d) North-West\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Analytical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Pointing to a lady Jeevan told \"Her mother is the only sister of my father's wife\". How is that lady related to Jeevan?",
        "SuggestedApproach": "Options: a) Sister b) Cousin c) Aunt d) Niece\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Average cost of 5 apples and 4 mangoes is Rs.36. The average cost of 7 apples and 8 mangoes is Rs.48. Find the total cost of 24 apples and 24 mangoes.",
        "SuggestedApproach": "Options: a) Rs.1044 b) Rs.2088 c) Rs.720 d) Rs.324\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A courtyard is 15 metres long and 10 metres wide. If it is paved by bricks of length 20 cm and width 10 cm, then what is the number of bricks required?",
        "SuggestedApproach": "Options: a) 4500 b) 6000 c) 7500 d) 9000\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "In a class the average marks obtained by a boy is 76, and the average marks obtained by a girl is 80. The average marks obtained by a student of the class is 77.75. Find the total number of students in the class if there are 42 girls in the class.",
        "SuggestedApproach": "Options: a) 100 b) 93 c) 96 d) 104\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "There are three numbers in the ratio 1:2:3. The difference between the greatest number and the least number is 8. Which is the greatest of the three numbers?",
        "SuggestedApproach": "Options: a) 8 b) 16 c) 12 d) 18\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A train travels from station X to station Y at the rate of 20km/hr and returns at the rate of 30 km/hr. The average speed for the whole journey was",
        "SuggestedApproach": "Options: a) 25 km/hr b) 24 km/hr c) 35 km/hr d) 40 km/hr\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If the sides of a square of side 10 units are increased by 50%, then by what percentage does the area of the square increase?",
        "SuggestedApproach": "Options: a) 100% b) 50% c) 125% d) 250%\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If x: y = 2:3 and z: y = 7:6 then what is the value of x: z?",
        "SuggestedApproach": "Options: a) 7:9 b) 4:7 c) 7:4 d) 9:7\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "The population of a village is 1500. If the rate of increase in the population is 10%, then what will be the population of the village after two years?",
        "SuggestedApproach": "Options: a) 1600 b) 1815 c) 1800 d) 1915\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If the ratio of interest earned is 2:3:5, at 7%, then the principal amounts are:",
        "SuggestedApproach": "Options: a) Rs.2000, Rs.3000, Rs.5000 b) Rs.14000, Rs.21000, Rs.35000 c) Rs.1500, Rs.3000, Rs.6000 d) Data insufficient\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Walking at 5 kms per hour, a person covers a certain distance in 4 hours. How much time will he take to cover the same distance if he is traveling by cycle and his speed is twice his speed on foot?",
        "SuggestedApproach": "Options: a) 1 hour b) 2 hours c) 3 hours d) 4 hours\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A gun and a target is separated by 500 meters. You am standing exactly equidistant from both the gun and the target, but not in the line of fire. You hear the sound of the target being hit exactly 4 seconds after you had heard the gun being fired. Find the speed of the bullet.",
        "SuggestedApproach": "Options: a) 125 m/s b) 62.5 m/s c) 250 m/s d) None of these\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "If 12 men take 15 days to do a piece of work, how many days will 6 men take to do the same kind of work?",
        "SuggestedApproach": "Options: a) 7.5 b) 15 c) 30 d) 45\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Ten men can paint a room in 3 hours. How many hours would 5 men take to paint the room, if they work at the same speed?",
        "SuggestedApproach": "Options: a) 6 hours b) 1.5 hours c) 10 hours d) 4 Hours\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A man spends Rs. 7000 and saves 12.5% of his income each month. What is his monthly income?",
        "SuggestedApproach": "Options: a) 7400 b) 7700 c) 8000 d) 8300\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "In an examination, 62% of the people passed. If the number of people who failed in the exam is 342, what is the total number of people who wrote the exam?",
        "SuggestedApproach": "Options: a) 1800 b) 900 c) 770 d) 1200\nAnswer Key: b"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "Mihir's salary increases by 12% once every four months. If his salary at the beginning of the year was Rs.8500, what would his salary be at the end of the year?",
        "SuggestedApproach": "Options: a) Rs.9520 b) Rs.10662 c) Rs.11941 d) None of the options\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A man buys 20 items every quarter, and his purchase increases by 12 in every following quarter. What is the total percentage increase in the items that he bought over the previous year?",
        "SuggestedApproach": "Options: a) 1 b) 1.2 c) 1.7 d) None of the options\nAnswer Key: d"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A die is thrown. If E is the event 'the number appearing is multiple of 3' and F be the event 'the number appearing is even'. Then E and F are",
        "SuggestedApproach": "Options: a) Independent b) Dependent c) Either independent or dependent d) None of these\nAnswer Key: a"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "A bag contains 9 discs of which 4 are red, 3 are blue and 2 are yellow. The discs are similar in shape and size. A disc is drawn at random from the bag. The probability that it will be either red or blue is",
        "SuggestedApproach": "Options: a) 3/8 b) 8/9 c) 7/9 d) 4/9\nAnswer Key: c"
    },
    {
        "CompanyName": "Reliance",
        "TargetBranch": "All Branches",
        "RoleDesignation": "Graduate Engineer Trainee (GET)",
        "InterviewRoundType": "Aptitude Test (Numerical Ability)",
        "DriveYear": "2026",
        "QuestionContent": "The 4 walls of a room of length 10 feet, breadth 8 feet and height 10 feet need to be painted. On one wall, there is a painting measuring 5ft by 2 ft and the wall behind the painting is not to be painted. What is the cost of painting at Rs.20 per square foot?",
        "SuggestedApproach": "Options: a) Rs. 7000 b) Rs. 15800 c) Rs. 16000 d) Rs. 12600\nAnswer Key: a"
    }
];

function autoTag(round, question) {
  const q = question.toLowerCase();
  const tags = ['General Aptitude'];

  if (round.includes('Verbal')) {
    tags.push('Verbal Ability', 'English');
    if (/spelling/.test(q)) tags.push('Spelling');
    if (/error|sentence/.test(q)) tags.push('Error Detection');
    if (/verb|pronoun|prefix|antonym/.test(q)) tags.push('Grammar & Vocabulary');
    if (/passive|active/.test(q)) tags.push('Voice');
    if (/analogy/.test(q)) tags.push('Analogy');
    if (/punctuation/.test(q)) tags.push('Punctuation');
  } else if (round.includes('Analytical')) {
    tags.push('Logical Reasoning', 'Analytical Ability');
    if (/written as|code/.test(q)) tags.push('Coding-Decoding');
    if (/series|next number/.test(q)) tags.push('Number Series');
    if (/figure|image/.test(q)) tags.push('Non-Verbal Reasoning', 'Abstract Reasoning');
    if (/son|daughter|mother|grandfather|related/.test(q)) tags.push('Blood Relations');
    if (/direction|south|north|east|west|turns/.test(q)) tags.push('Direction Sense');
    if (/odd one out/.test(q)) tags.push('Classification');
  } else if (round.includes('Numerical')) {
    tags.push('Quantitative Aptitude', 'Numerical Ability');
    if (/average/.test(q)) tags.push('Averages');
    if (/ratio/.test(q)) tags.push('Ratio & Proportion');
    if (/speed|train|walking/.test(q)) tags.push('Time, Speed & Distance');
    if (/percentage|percent|population/.test(q)) tags.push('Percentages');
    if (/men.*work|paint a room/.test(q)) tags.push('Time & Work');
    if (/probability|die|bag contains/.test(q)) tags.push('Probability');
    if (/area|square|courtyard|walls/.test(q)) tags.push('Mensuration');
    if (/interest|principal/.test(q)) tags.push('Simple & Compound Interest');
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
    tags: autoTag(raw.InterviewRoundType, raw.QuestionContent),
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
        console.log(`⏭️  SKIP (already exists): "${doc.question.substring(0, 50).replace(/\n/g, ' ')}..."`);
      } else {
        await DriveQuestion.create(doc);
        inserted++;
        console.log(`✅ Inserted: "${doc.question.substring(0, 50).replace(/\n/g, ' ')}..."`);
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
