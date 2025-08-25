// Response formatter - makes responses look good on phones and voice

class ResponseFormatter {
    constructor() {
        this.maxUSSDLength = 160;
        this.maxSMSLength = 160;
        this.maxVoiceLength = 200;
    }

    /**
     * Main formatting method
     */
    format(text, options = {}) {
        const { type, includeVoice } = options;
        
        let formatted = {
            text: text,
            voice: null,
            segments: []
        };

        // Clean up text first
        formatted.text = this.cleanText(formatted.text);

        // Format based on type
        switch(type) {
            case 'ussd':
                formatted.text = this.formatForUSSD(formatted.text);
                break;
            case 'sms':
                formatted.text = this.formatForSMS(formatted.text);
                break;
            case 'voice':
                formatted = this.formatForVoice(formatted.text);
                break;
            case 'quiz':
                formatted.text = this.formatQuiz(formatted.text);
                break;
            default:
                formatted.text = this.formatGeneral(formatted.text);
        }

        // Add voice markers if needed
        if (includeVoice) {
            formatted.voice = this.addVoiceMarkers(formatted.text);
        }

        return formatted;
    }

    /**
     * Clean up text
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')           // Multiple spaces to single
            .replace(/\n\n+/g, '\n')        // Multiple newlines to single
            .trim();                        // Remove leading/trailing space
    }

    /**
     * Format for USSD display
     */
    formatForUSSD(text) {
        // USSD has strict character limits
        if (text.length <= this.maxUSSDLength) {
            return text;
        }

        // Smart truncation - try to end at sentence
        let truncated = text.substring(0, this.maxUSSDLength - 3);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastPeriod > 100) {
            truncated = truncated.substring(0, lastPeriod + 1);
        } else if (lastSpace > 100) {
            truncated = truncated.substring(0, lastSpace) + '...';
        } else {
            truncated = truncated + '...';
        }
        
        return truncated;
    }

    /**
     * Format for SMS
     */
    formatForSMS(text) {
        // SMS can be multi-part, so we segment
        const segments = [];
        let remaining = text;
        
        while (remaining.length > 0) {
            if (remaining.length <= this.maxSMSLength) {
                segments.push(remaining);
                break;
            }
            
            // Find good break point
            let breakPoint = remaining.lastIndexOf('.', this.maxSMSLength);
            if (breakPoint < 100) {
                breakPoint = remaining.lastIndexOf(' ', this.maxSMSLength);
            }
            if (breakPoint < 100) {
                breakPoint = this.maxSMSLength;
            }
            
            segments.push(remaining.substring(0, breakPoint));
            remaining = remaining.substring(breakPoint).trim();
        }
        
        // Add segment indicators
        if (segments.length > 1) {
            return segments.map((seg, i) => 
                `(${i+1}/${segments.length}) ${seg}`
            ).join('\n---\n');
        }
        
        return segments[0];
    }

    /**
     * Format for voice output
     */
    formatForVoice(text) {
        // Make text more natural for speech
        let voiceText = text
            .replace(/N\$/g, 'Namibian dollars')  // Currency
            .replace(/\(/g, ', ')                  // Parentheses
            .replace(/\)/g, ', ')
            .replace(/\//g, ' or ')                // Slashes
            .replace(/&/g, ' and ')                // Ampersands
            .replace(/\d+/g, (match) => {          // Numbers to words (simple)
                if (match.length <= 2) return match;
                return match.split('').join(' ');  // Spell out long numbers
            });

        return {
            text: text,  // Keep original for display
            voice: voiceText
        };
    }

    /**
     * Format quiz questions
     */
    formatQuiz(text) {
        // Add clear structure to quiz
        const lines = text.split('\n');
        let formatted = '';
        
        lines.forEach((line, index) => {
            if (line.startsWith('Q:') || line.startsWith('Question:')) {
                formatted += `❓ ${line}\n`;
            } else if (line.match(/^[A-D]\)/)) {
                formatted += `  ${line}\n`;
            } else if (line.startsWith('Answer:')) {
                formatted += `\n✅ ${line}\n`;
            } else {
                formatted += `${line}\n`;
            }
        });
        
        return formatted.trim();
    }

    /**
     * General formatting
     */
    formatGeneral(text) {
        // Add emoji for better readability
        return text
            .replace(/Step \d:/g, (match) => `📍 ${match}`)
            .replace(/Example:/gi, '💡 Example:')
            .replace(/Note:/gi, '📝 Note:')
            .replace(/Important:/gi, '⚠️ Important:')
            .replace(/Answer:/gi, '✅ Answer:');
    }

    /**
     * Add voice markers for text-to-speech
     */
    addVoiceMarkers(text) {
        return text
            .replace(/\./g, '.<break time="500ms"/>')
            .replace(/\?/g, '?<break time="500ms"/>')
            .replace(/!/g, '!<break time="300ms"/>')
            .replace(/:/g, ':<break time="200ms"/>')
            .replace(/,/g, ',<break time="100ms"/>')
            .replace(/\n/g, '<break time="300ms"/>');
    }

    /**
     * Format numbers for display
     */
    formatNumber(num, type = 'general') {
        if (type === 'currency') {
            return `N$${num.toLocaleString()}`;
        }
        if (type === 'percentage') {
            return `${num}%`;
        }
        return num.toLocaleString();
    }

    /**
     * Add menu formatting
     */
    formatMenu(options) {
        return options.map((opt, index) => 
            `${index + 1}. ${opt}`
        ).join('\n');
    }

    /**
     * Create progress indicator
     */
    formatProgress(current, total) {
        const percentage = Math.round((current / total) * 100);
        const filled = Math.floor(percentage / 10);
        const empty = 10 - filled;
        
        return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
    }
}

module.exports = ResponseFormatter;