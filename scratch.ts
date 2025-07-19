async function call() {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer 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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'google/gemma-3n-e2b-it:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Generate random questions in this format. only return like this.
                            {
                            question: '',
                            type: mcq,
                            answer: '',
                            }
                            `,
                        },
                    ],
                }),
            });

            const data = await res.json();
            console.log(data);
        }

// call(); 

curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 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" \
  -d '{
  "model": "google/gemma-3n-e2b-it:free",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
  
}'


{"status": "normal_generation", "message": "Lesson supports only X questions. Generated maximum possible.",
"requested_count": {"easy": 0, "medium": 0, "hard": 0}, "generated_count": {3: ["A"], 4: [null], 5: [null]},
"reason": "insufficient_content|too_short|limited_concepts", "questions": [{ "type": "Fill in the blank",
"question_text": "Paris is a city in \n", "explanation": "An African capital with historical significance. What
city is this?", "options": ["A", "B", "C"], "correct_answer": "A" }, { "type": "True/False", "question_text": "Is
Paris a city in Africa? \n", "explanation": "Yes, Paris is one of the largest cities in France and also an
important historical and cultural center. What is this question asking about?", "options": ["True", "False"],
"correct_answer": "True" }, { "type": "Multiple Choice", "question_text": "Which of these is a famous place found
in Africa? \nA) The Great pyramid of Giza  B) The Great Wall of China  C) The Great Barrier Reef  D) The Great
Wall of China", "explanation": "This question asks about famous places found in Africa. What is this lesson
discussing?", "options": ["A", "B", "C", "D"], "correct_answer": "C" }, { "type": "Fill in the blank",
"question_text": "Which of these is a true statement about Africa? \n1) The Great Pyramid of Giza was built before
3000 BCE. 2) The Great Barrier Reef is an international biodiversity hotspot. 3) The Great Wall of China is the
longest natural barrier in the world. 4) All of the above.", "explanation": "This question asks about true
statements related to Africa. What statement is correct?", "options": ["1", "2", "3", "4"], "correct_answer": "All
of the above" }]