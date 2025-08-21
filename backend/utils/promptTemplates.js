// Reusable prompt templates - building blocks for prompts

class PromptTemplates {
    /**
     * Grade level instructions
     */
    static getGradeLevel(grade) {
        const levels = {
            'grade1-3': 'Student is 6-9 years old. Use very simple words, short sentences, and fun examples.',
            'grade4-6': 'Student is 10-12 years old. Use clear simple language with basic vocabulary.',
            'grade7-9': 'Student is 13-15 years old. Can understand more complex ideas but keep it clear.',
            'grade10': 'Student is 16 years old, preparing for JSC. Focus on exam preparation.',
            'grade11-12': 'Student is 17-18 years old, preparing for NSSC. Use more advanced concepts.',
            'university': 'Student is at tertiary level. Can handle complex academic language.'
        };
        
        return levels[grade] || levels['grade10'];
    }

    /**
     * Response tone templates
     */
    static getTone(type) {
        const tones = {
            encouraging: "Be very encouraging and positive. Celebrate small victories.",
            // utils/promptTemplates.js (continued)

           patient: "Be extremely patient. It's okay if they don't understand immediately.",
           challenging: "Push them to think deeper, but remain supportive.",
           friendly: "Be warm and approachable, like a helpful friend.",
           professional: "Maintain academic standards while being helpful."
       };
       
       return tones[type] || tones.friendly;
   }

   /**
    * Common prompt beginnings
    */
   static getIntroduction(context) {
       const intros = {
           question: "Thank you for your question! Let me explain this clearly.",
           problem: "Let's solve this step by step together.",
           confusion: "I understand this can be confusing. Let me break it down.",
           revision: "Good job reviewing! Here's what you need to know.",
           exam: "This is important for your exam. Pay attention to these key points."
       };
       
       return intros[context] || intros.question;
   }

   /**
    * Error handling templates
    */
   static getErrorResponse(errorType) {
       const errors = {
           unclear: "I want to help, but I need more details. Can you be more specific?",
           offTopic: "That's interesting! But let's focus on your studies. What subject do you need help with?",
           inappropriate: "Let's keep our discussion educational. What would you like to learn?",
           tooComplex: "That's a big topic! Let me start with the basics.",
           noConnection: "I'm having trouble connecting. But here's what I know about your topic..."
       };
       
       return errors[errorType] || errors.unclear;
   }

   /**
    * Encouragement templates
    */
   static getEncouragement() {
       const phrases = [
           "Great question! 🌟",
           "You're thinking like a scientist! 🔬",
           "Excellent curiosity! 📚",
           "That's a smart observation! 💡",
           "You're on the right track! ✅",
           "Good thinking! 🎯",
           "I like how you're approaching this! 👏"
       ];
       
       return phrases[Math.floor(Math.random() * phrases.length)];
   }

   /**
    * Closing templates
    */
   static getClosing(type) {
       const closings = {
           checkUnderstanding: "Does this make sense to you?",
           offerMore: "Would you like another example?",
           practice: "Ready to try a practice problem?",
           encourage: "Keep up the great work!",
           nextSteps: "What would you like to learn next?"
       };
       
       return closings[type] || closings.checkUnderstanding;
   }

   /**
    * Build complete learning objective
    */
   static getLearningObjective(subject, topic) {
       return `By the end of this explanation, you should understand:
       1. The basic concept of ${topic}
       2. How to apply it in ${subject}
       3. Common examples and uses`;
   }

   /**
    * Create structured explanation template
    */
   static getExplanationStructure() {
       return {
           opening: "Let me explain this concept:",
           definition: "Definition: [WHAT IT IS]",
           explanation: "How it works: [SIMPLE EXPLANATION]",
           example: "Example: [CONCRETE EXAMPLE]",
           application: "You use this when: [REAL-WORLD USE]",
           check: "Try this: [SIMPLE QUESTION]"
       };
   }

   /**
    * Math problem-solving template
    */
   static getMathTemplate() {
       return `
       Given: [STATE WHAT WE KNOW]
       Find: [WHAT WE NEED TO FIND]
       Formula: [RELEVANT FORMULA]
       Solution:
       Step 1: [FIRST STEP]
       Step 2: [SECOND STEP]
       Answer: [FINAL ANSWER WITH UNITS]
       Check: [VERIFY THE ANSWER]`;
   }

   /**
    * Science explanation template
    */
   static getScienceTemplate() {
       return `
       Phenomenon: [WHAT WE'RE EXPLAINING]
       Cause: [WHY IT HAPPENS]
       Process: [HOW IT HAPPENS]
       Effect: [WHAT RESULTS]
       Real Example: [WHERE WE SEE THIS]
       Fun Fact: [INTERESTING DETAIL]`;
   }

   /**
    * Language learning template
    */
   static getLanguageTemplate() {
       return `
       Word/Phrase: [TARGET LANGUAGE]
       Translation: [MEANING]
       Pronunciation: [HOW TO SAY IT]
       Usage: [WHEN TO USE IT]
       Example Sentence: [IN CONTEXT]
       Similar Words: [RELATED VOCABULARY]`;
   }

   /**
    * Get subject-specific tips
    */
   static getSubjectTips(subject) {
       const tips = {
           mathematics: {
               solving: "Always show your work step by step",
               checking: "Substitute your answer back to verify",
               practice: "Do at least 3 problems daily"
           },
           science: {
               understanding: "Ask 'why' and 'how' for everything",
               memorizing: "Use diagrams and drawings",
               experimenting: "Try safe experiments at home"
           },
           history: {
               dates: "Create a timeline to remember events",
               connections: "Understand cause and effect",
               retention: "Tell the story to someone else"
           },
           language: {
               vocabulary: "Use new words in sentences",
               grammar: "Read a lot to see patterns",
               speaking: "Practice speaking out loud daily"
           }
       };
       
       return tips[subject] || { general: "Practice regularly and ask questions" };
   }

   /**
    * Create adaptive difficulty
    */
   static getAdaptiveDifficulty(performance) {
       if (performance < 0.5) {
           return "Let's go back to basics. No problem - everyone learns at their own pace!";
       } else if (performance < 0.7) {
           return "You're getting there! Let's practice a bit more.";
       } else if (performance < 0.9) {
           return "Great work! Ready for something more challenging?";
       } else {
           return "Excellent! You've mastered this. Let's move to advanced topics!";
       }
   }

   /**
    * Exam preparation templates
    */
   static getExamPrep(examType) {
       const prep = {
           JSC: {
               focus: "Focus on fundamentals and past papers",
               time: "Spend 2 hours daily on revision",
               strategy: "Master the basics before moving to complex topics"
           },
           NSSC: {
               focus: "Practice analysis and application questions",
               time: "Create a 3-month study schedule",
               strategy: "Do timed practice papers weekly"
           },
           general: {
               focus: "Review notes and practice problems",
               time: "Study in 45-minute focused sessions",
               strategy: "Teach concepts to others to test understanding"
           }
       };
       
       return prep[examType] || prep.general;
   }

   /**
    * Create multi-language support
    */
   static getMultilingualPrompt(language) {
       const prompts = {
           english: "Respond in clear, simple English.",
           afrikaans: "Include Afrikaans translations for key terms.",
           oshiwambo: "Use simple English with Oshiwambo terms where helpful.",
           mixed: "Use primarily English but include local language terms for clarity."
       };
       
       return prompts[language] || prompts.english;
   }

   /**
    * Build a complete prompt from templates
    */
   static buildCompletePrompt(options) {
       const {
           subject,
           grade,
           tone,
           language,
           context,
           includeExamples = true,
           includeEncouragement = true
       } = options;

       let prompt = "";
       
       // Add role
       prompt += `You are an expert ${subject} teacher in Namibia.\n\n`;
       
       // Add grade level
       prompt += `STUDENT LEVEL: ${this.getGradeLevel(grade)}\n`;
       
       // Add tone
       prompt += `TONE: ${this.getTone(tone)}\n`;
       
       // Add language
       prompt += `LANGUAGE: ${this.getMultilingualPrompt(language)}\n`;
       
       // Add context
       if (context) {
           prompt += `CONTEXT: ${context}\n`;
       }
       
       // Add rules
       prompt += `
RULES:
1. Keep response under 160 characters for USSD
2. ${includeExamples ? 'Include one clear example' : 'Focus on explanation'}
3. ${includeEncouragement ? 'Be encouraging' : 'Be direct'}
4. Use Namibian context when possible
5. End with a comprehension check
`;
       
       return prompt;
   }
}

module.exports = PromptTemplates;