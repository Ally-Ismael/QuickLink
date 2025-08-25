// All teaching prompts - the instructions that make AI a great teacher

const promptTemplates = require('./promptTemplates');

class EducationalPrompts {
    constructor() {
        // Subject-specific teaching styles
        this.teachingStyles = {
            mathematics: {
                approach: "step-by-step problem solving",
                tone: "patient and logical",
                examples: "use visual representations and real-world applications"
            },
            science: {
                approach: "inquiry-based learning",
                tone: "curious and exploratory",
                examples: "use experiments and observations from nature"
            },
            history: {
                approach: "storytelling and cause-effect",
                tone: "engaging narrator",
                examples: "connect past events to present day"
            },
            language: {
                approach: "practice and repetition",
                tone: "encouraging and supportive",
                examples: "use everyday conversations"
            },
            career: {
                approach: "practical guidance",
                tone: "mentor-like and realistic",
                examples: "real job market insights"
            }
        };
    }

    /**
     * Build the main educational prompt
     */
    buildEducationalPrompt({ question, subject, grade, language, localContext }) {
        const style = this.teachingStyles[subject] || this.teachingStyles.science;
        const gradePrompt = promptTemplates.getGradeLevel(grade);
        
        return {
            system: `You are an excellent Namibian teacher specializing in ${subject}.

YOUR TEACHING APPROACH:
- Use ${style.approach}
- Maintain a ${style.tone} tone
- ${style.examples}

STUDENT CONTEXT:
- ${gradePrompt}
- Teaching in ${language === 'english' ? 'English' : 'simple English with some Afrikaans terms'}
- Student is in Namibia (use local examples when relevant)

LOCAL CONTEXT:
${localContext || 'General Namibian school setting'}

CRITICAL RULES:
1. Keep responses under 160 characters for phone display
2. Use simple, clear language
3. Be encouraging and positive
4. Include one concrete example
5. End with a check for understanding
6. If math/science, show the work step-by-step
7. Reference Namibian context when possible (N$ for money, local geography, etc.)

Remember: Many students have limited internet. Make every word count!`,
            
            user: `Student Question: ${question}`,
            temperature: this.getOptimalTemperature(subject)
        };
    }

    /**
     * Get optimal temperature for each subject
     */
    getOptimalTemperature(subject) {
        const temps = {
            mathematics: 0.2,  // Very precise
            science: 0.4,      // Mostly factual
            history: 0.5,      // Some interpretation
            language: 0.6,     // Creative examples
            career: 0.5        // Balanced advice
        };
        return temps[subject] || 0.5;
    }

    /**
     * Get follow-up questions
     */
    getFollowUpQuestion(subject) {
        const followUps = {
            mathematics: [
                "Should I show another example?",
                "Do you want to try a practice problem?",
                "Is the formula clear?"
            ],
            science: [
                "Would you like to know why this happens?",
                "Can I explain the science behind it?",
                "Want to learn a related concept?"
            ],
            history: [
                "Should I explain what happened next?",
                "Want to know the impact of this?",
                "Interested in similar events?"
            ],
            language: [
                "Want more examples?",
                "Should we practice this?",
                "Need help with pronunciation?"
            ],
            career: [
                "Need specific requirements?",
                "Want to know about salaries?",
                "Should I suggest study paths?"
            ]
        };
        
        const options = followUps[subject] || ["Would you like to know more?"];
        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Get quiz questions
     */
    getQuizQuestion(subject, difficulty) {
        const quizBank = {
            mathematics: {
                easy: "What is 10 + 15?",
                medium: "Calculate 25% of 80",
                hard: "Solve: 2x + 7 = 19"
            },
            science: {
                easy: "What gas do we breathe?",
                medium: "What causes day and night?",
                hard: "Explain photosynthesis"
            },
            history: {
                easy: "When is Namibia's Independence Day?",
                medium: "Who was Namibia's first president?",
                hard: "Explain the impact of colonialism"
            }
        };
        
        return quizBank[subject]?.[difficulty] || "Tell me what you know about " + subject;
    }

    /**
     * Get study tips
     */
    getStudyTips(subject) {
        const tips = {
            mathematics: "Practice 3 problems daily. Start easy, increase difficulty. Always show your work!",
            science: "Observe the world around you. Ask 'why' and 'how'. Try simple experiments.",
            history: "Create timelines. Understand cause and effect. Connect past to present.",
            language: "Read 15 minutes daily. Keep a vocabulary notebook. Practice speaking aloud.",
            career: "Research jobs online. Talk to professionals. Consider both passion and opportunity."
        };
        
        return tips[subject] || "Study regularly, ask questions, and believe in yourself!";
    }

    /**
     * Fallback responses when API is down
     */
    getFallbackResponse(subject, question) {
        const fallbacks = {
            mathematics: "Let's solve this step-by-step. First, identify what we need to find. Then apply the right formula.",
            science: "Great science question! Think about cause and effect. What forces or processes are involved?",
            history: "History helps us understand today. Consider when, where, who, what, and why this happened.",
            language: "Language learning takes practice. Try using new words in sentences to remember them.",
            career: "Career planning is important! Consider your interests, skills, and local opportunities.",
            general: "That's a good question! Let me help you understand. Can you tell me more specifically what you'd like to know?"
        };
        
        return fallbacks[subject] || fallbacks.general;
    }
}

module.exports = new EducationalPrompts();