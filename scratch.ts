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