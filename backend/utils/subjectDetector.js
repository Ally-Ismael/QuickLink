// Smart subject detection - figures out what subject a question is about

class SubjectDetector {
    constructor() {
        // Keywords for each subject
        this.subjectKeywords = {
            mathematics: [
                'calculate', 'solve', 'equation', 'formula', 'number', 'math',
                'add', 'subtract', 'multiply', 'divide', 'fraction', 'decimal',
                'percentage', 'algebra', 'geometry', 'angle', 'triangle', 'circle',
                'area', 'volume', 'perimeter', 'graph', 'function', 'polynomial'
            ],
            science: [
                'experiment', 'hypothesis', 'energy', 'force', 'gravity', 'motion',
                'atom', 'molecule', 'chemical', 'reaction', 'photosynthesis', 'cell',
                'organism', 'ecosystem', 'evolution', 'physics', 'chemistry', 'biology',
                'electricity', 'magnetism', 'light', 'sound', 'heat', 'temperature'
            ],
            history: [
                'year', 'century', 'war', 'independence', 'colonial', 'president',
                'kingdom', 'empire', 'revolution', 'historical', 'ancient', 'modern',
                'namibia', 'africa', 'european', 'tradition', 'culture', 'heritage',
                'SWAPO', 'apartheid', 'liberation', 'treaty', 'constitution'
            ],
            language: [
                'word', 'meaning', 'grammar', 'sentence', 'pronunciation', 'spell',
                'vocabulary', 'translate', 'english', 'afrikaans', 'oshiwambo', 'german',
                'verb', 'noun', 'adjective', 'tense', 'plural', 'synonym', 'antonym',
                'paragraph', 'essay', 'letter', 'punctuation', 'reading', 'writing'
            ],
            career: [
                'job', 'career', 'profession', 'salary', 'university', 'NUST', 'UNAM',
                'qualification', 'degree', 'diploma', 'certificate', 'skills', 'interview',
                'CV', 'resume', 'application', 'scholarship', 'bursary', 'study',
                'engineer', 'doctor', 'teacher', 'nurse', 'accountant', 'lawyer'
            ],
            geography: [
                'map', 'location', 'country', 'continent', 'ocean', 'river', 'mountain',
                'desert', 'climate', 'weather', 'population', 'city', 'capital',
                'namibia', 'windhoek', 'namib', 'kalahari', 'atlantic', 'angola', 'botswana'
            ]
        };

        // Subject patterns (more complex detection)
        this.patterns = {
            mathematics: /\d+[\+\-\*\/]\d+|solve for [xyz]|what is \d+|calculate/i,
            science: /how does .* work|why does|what causes|explain how/i,
            history: /when did|who was|what happened in|describe the .* period/i,
            language: /how do you say|what does .* mean|translate/i,
            career: /how to become|what qualifications|career in|study .* at university/i
        };
    }

    /**
     * Detect subject from question
     */
    detect(question) {
        if (!question) return 'general';
        
        const q = question.toLowerCase();
        let scores = {};
        
        // Check keywords
        for (const [subject, keywords] of Object.entries(this.subjectKeywords)) {
            scores[subject] = 0;
            for (const keyword of keywords) {
                if (q.includes(keyword)) {
                    scores[subject] += keyword.length; // Longer matches score higher
                }
            }
        }
        
        // Check patterns
        for (const [subject, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(question)) {
                scores[subject] = (scores[subject] || 0) + 50; // Pattern match bonus
            }
        }
        
        // Find highest scoring subject
        let maxScore = 0;
        let detectedSubject = 'general';
        
        for (const [subject, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                detectedSubject = subject;
            }
        }
        
        // Confidence threshold
        if (maxScore < 5) {
            return 'general';
        }
        
        return detectedSubject;
    }

    /**
     * Get confidence level of detection
     */
    getConfidence(question, detectedSubject) {
        const q = question.toLowerCase();
        let matches = 0;
        const keywords = this.subjectKeywords[detectedSubject] || [];
        
        for (const keyword of keywords) {
            if (q.includes(keyword)) matches++;
        }
        
        if (matches >= 3) return 'high';
        if (matches >= 2) return 'medium';
        return 'low';
    }

    /**
     * Detect multiple subjects (for complex questions)
     */
    detectMultiple(question) {
        const q = question.toLowerCase();
        const subjects = [];
        
        for (const [subject, keywords] of Object.entries(this.subjectKeywords)) {
            for (const keyword of keywords) {
                if (q.includes(keyword)) {
                    subjects.push(subject);
                    break;
                }
            }
        }
        
        return [...new Set(subjects)]; // Remove duplicates
    }
}

module.exports = SubjectDetector;