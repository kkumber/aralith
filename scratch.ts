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
                            content: `Generate 5 quiz questions from this text: ${lesson}. Answer in json format like this:
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

/*         call(); */