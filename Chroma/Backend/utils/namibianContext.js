// Namibian context - makes AI responses relevant to local students

class NamibianContext {
    constructor() {
        // Local data and examples
        this.localData = {
            currency: 'N$',
            capital: 'Windhoek',
            president: 'Hage Geingob',
            independenceDay: 'March 21, 1990',
            population: '2.5 million',
            languages: ['English', 'Afrikaans', 'Oshiwambo', 'Otjiherero', 'German'],
            
            cities: [
                'Windhoek', 'Walvis Bay', 'Swakopmund', 'Oshakati', 'Rundu',
                'Katima Mulilo', 'Otjiwarongo', 'Ondangwa', 'Okahandja'
            ],
            
            landmarks: [
                'Fish River Canyon', 'Sossusvlei', 'Etosha National Park',
                'Skeleton Coast', 'Namib Desert', 'Caprivi Strip'
            ],
            
            universities: {
                'NUST': 'Namibia University of Science and Technology',
                'UNAM': 'University of Namibia',
                'IUM': 'International University of Management'
            },
            
            companies: [
                'MTC', 'FNB Namibia', 'Bank Windhoek', 'Nampower', 'TransNamib',
                'Air Namibia', 'Telecom Namibia', 'Namdeb', 'Rossing Uranium'
            ]
        };

        // Subject-specific local examples
        this.subjectExamples = {
            mathematics: {
                money: "A bread costs N$15 at Shoprite",
                distance: "The distance from Windhoek to Swakopmund is 360km",
                measurement: "A standard classroom at NUST is 8m x 6m"
            },
            science: {
                ecosystem: "The Namib Desert is one of the oldest deserts",
                animals: "Oryx are adapted to survive without water for weeks",
                weather: "Windhoek gets most rainfall between December and March"
            },
            history: {
                events: "The Herero and Nama genocide (1904-1908)",
                leaders: "Sam Nujoma led the independence struggle",
                dates: "German colonization began in 1884"
            },
            geography: {
                features: "The Namib Desert meets the Atlantic Ocean",
                climate: "Namibia has over 300 days of sunshine per year",
                regions: "Namibia has 14 regions including Khomas and Erongo"
            },
            career: {
                sectors: "Mining contributes 12% to Namibia's GDP",
                jobs: "Tourism employs over 100,000 Namibians",
                salaries: "Entry-level teachers earn around N$10,000-15,000/month"
            }
        };
    }

    /**
     * Get relevant context for a question
     */
    getRelevantContext(question, subject) {
        const q = question.toLowerCase();
        let context = [];

        // Check for city mentions
        for (const city of this.localData.cities) {
            if (q.includes(city.toLowerCase())) {
                context.push(`Reference to ${city}`);
            }
        }

        // Check for university mentions
        for (const [abbr, full] of Object.entries(this.localData.universities)) {
            if (q.includes(abbr.toLowerCase()) || q.includes(full.toLowerCase())) {
                context.push(`${abbr}: ${full}`);
            }
        }

        // Add subject-specific examples
        if (this.subjectExamples[subject]) {
            const examples = Object.values(this.subjectExamples[subject]);
            const randomExample = examples[Math.floor(Math.random() * examples.length)];
            context.push(randomExample);
        }

        return context.join('. ');
    }

    /**
     * Convert to local context
     */
    localizeExample(text, subject) {
        // Replace generic currency with N$
        text = text.replace(/\$|USD|dollars/g, 'N$');
        
        // Replace generic cities with Namibian ones
        const genericCities = ['New York', 'London', 'Paris'];
        const namibianCities = ['Windhoek', 'Swakopmund', 'Walvis Bay'];
        
        genericCities.forEach((generic, index) => {
            text = text.replace(new RegExp(generic, 'gi'), namibianCities[index]);
        });
        
        return text;
    }

    /**
     * Get local study resources
     */
    getLocalStudyResources(subject) {
        const resources = {
            mathematics: [
                "NAMCOL past papers",
                "NUST Mathematics Support Centre",
                "Ministry of Education textbooks"
            ],
            science: [
                "National Museum of Namibia",
                "NUST Science Labs",
                "Gobabeb Research Centre"
            ],
            history: [
                "National Archives of Namibia",
                "Independence Memorial Museum",
                "UNAM History Department resources"
            ],
            language: [
                "Namibian Broadcasting Corporation (NBC)",
                "Local language centres",
                "UNAM Language Centre"
            ],
            career: [
                "Ministry of Labour career guidance",
                "NSFAF (Student Financial Assistance)",
                "Job portals: MyJobsNamibia"
            ]
        };
        
        return resources[subject] || ["Check your school library", "Ask your teacher"];
    }

    /**
     * Add cultural sensitivity
     */
    getCulturalContext(topic) {
        const culturalNotes = {
            greetings: "In Namibia, it's polite to greet before asking questions",
            respect: "Show respect to elders and teachers",
            languages: "Many Namibians speak multiple languages",
            education: "Education is highly valued in Namibian society"
        };
        
        return culturalNotes[topic] || "";
    }

    /**
     * Get exam-specific information
     */
    getExamInfo(examType) {
        const exams = {
            'NSSC': 'Namibia Senior Secondary Certificate (Grade 12)',
            'JSC': 'Junior Secondary Certificate (Grade 10)',
            'NAMCOL': 'Namibian College of Open Learning',
            'Cambridge': 'Cambridge International Examinations'
        };
        
        return exams[examType] || "National examination";
    }
}

module.exports = NamibianContext;