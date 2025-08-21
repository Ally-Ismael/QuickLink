// test/testEducation.js
// Test file to verify all components work together

require('dotenv').config();
const AIEducationService = require('../utils/aiService');

async function runTests() {
    console.log('🧪 Testing QuickLink AI Education System\n');
    console.log('=' .repeat(50));
    
    // Initialize service
    const aiService = new AIEducationService(process.env.OPENAI_API_KEY || 'test-key');
    
    // Test questions for each subject
    const testCases = [
        {
            question: "How do I calculate 15% of N$200?",
            expected: "mathematics",
            grade: "grade10"
        },
        {
            question: "Explain photosynthesis in simple terms",
            expected: "science",
            grade: "grade9"
        },
        {
            question: "When did Namibia gain independence?",
            expected: "history",
            grade: "grade8"
        },
        {
            question: "What careers can I pursue with mathematics?",
            expected: "career",
            grade: "grade11-12"
        },
        {
            question: "How do you say 'thank you' in Afrikaans?",
            expected: "language",
            grade: "grade7-9"
        }
    ];
    
    // Run tests
    for (const test of testCases) {
        console.log(`\n📝 Question: "${test.question}"`);
        console.log(`Expected Subject: ${test.expected}`);
        console.log(`Grade Level: ${test.grade}`);
        
        try {
            // Test without API (using fallback)
            const response = await aiService.getEducationalResponse(
                test.question,
                {
                    grade: test.grade,
                    language: 'english',
                    voice: false,
                    responseType: 'ussd'
                }
            );
            
            console.log(`✅ Detected Subject: ${response.subject}`);
            console.log(`📱 Response: ${response.response}`);
            console.log(`❓ Follow-up: ${response.followUp}`);
            
            // Verify subject detection
            if (response.subject === test.expected) {
                console.log('✓ Subject detection correct!');
            } else {
                console.log(`✗ Subject detection failed. Got: ${response.subject}`);
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('-'.repeat(50));
    }
    
    // Test other features
    console.log('\n📚 Testing Additional Features:\n');
    
    // Test quiz generation
    const quiz = aiService.getQuizQuestion('mathematics', 'medium');
    console.log('Quiz Question:', quiz);
    
    // Test study tips
    const tips = aiService.getStudyTips('science');
    console.log('\nStudy Tips:', tips);
    
    console.log('\n✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error);