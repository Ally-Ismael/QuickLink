// This is the main AI logic - the brain of the educational system

const prompts = require('./prompts');
const SubjectDetector = require('./subjectDetector');
const NamibianContext = require('./namibianContext');
const ResponseFormatter = require('./responseFormatter');

class AIEducationService {
    constructor(openaiApiKey) {
        this.apiKey = openaiApiKey;
        this.subjectDetector = new SubjectDetector();
        this.namibianContext = new NamibianContext();
        this.formatter = new ResponseFormatter();
    }

    /**
     * Main method to get educational response
     * @param {string} question - Student's question
     * @param {object} options - Additional options (grade, language, etc.)
     */
    async getEducationalResponse(question, options = {}) {
        try {
            // Step 1: Detect subject
            const subject = this.subjectDetector.detect(question);
            console.log(`Detected subject: ${subject}`);

            // Step 2: Get Namibian context if relevant
            const localContext = this.namibianContext.getRelevantContext(question, subject);

            // Step 3: Build the perfect prompt
            const prompt = prompts.buildEducationalPrompt({
                question,
                subject,
                grade: options.grade || 'grade10',
                language: options.language || 'english',
                localContext
            });

            // Step 4: Call AI (OpenAI or fallback)
            const aiResponse = await this.callOpenAI(prompt);

            // Step 5: Format response for USSD/Voice
            const formatted = this.formatter.format(aiResponse, {
                type: options.responseType || 'ussd',
                includeVoice: options.voice || false
            });

            return {
                success: true,
                response: formatted.text,
                voice: formatted.voice,
                subject: subject,
                followUp: prompts.getFollowUpQuestion(subject)
            };

        } catch (error) {
            console.error('AI Service Error:', error);
            return this.getFallbackResponse(question, options);
        }
    }

    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt) {
        const { Configuration, OpenAIApi } = require('openai');
        
        const configuration = new Configuration({
            apiKey: this.apiKey,
        });
        
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt.system },
                { role: "user", content: prompt.user }
            ],
            temperature: prompt.temperature || 0.5,
            max_tokens: 160, // USSD limit
        });

        return completion.data.choices[0].message.content;
    }

    /**
     * Fallback when API fails
     */
    getFallbackResponse(question, options) {
        const subject = this.subjectDetector.detect(question);
        const fallback = prompts.getFallbackResponse(subject, question);
        
        return {
            success: true,
            response: this.formatter.format(fallback, options).text,
            subject: subject,
            isOffline: true
        };
    }

    /**
     * Get quiz question for practice
     */
    getQuizQuestion(subject, difficulty = 'medium') {
        const quiz = prompts.getQuizQuestion(subject, difficulty);
        return this.formatter.format(quiz, { type: 'quiz' });
    }

    /**
     * Get study tips
     */
    getStudyTips(subject) {
        const tips = prompts.getStudyTips(subject);
        const localTips = this.namibianContext.getLocalStudyResources(subject);
        
        return {
            general: tips,
            local: localTips
        };
    }
}

module.exports = AIEducationService;