// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');  // CORS 추가
require('dotenv').config();  // 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());  // CORS 미들웨어 사용

app.post('/recommend', async (req, res) => {
    const { inputText, lang } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', 
                messages: [
                    {
                        role: 'system',
                        content: `You are an assistant that suggests good variable names for different programming languages.`
                    },
                    {
                        role: 'user',
                        content: `Suggest three variable names for the following input in ${lang}: ${inputText}`
                    }
                ],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 환경 변수에서 API 키 로드
                    'Content-Type': 'application/json'
                }
            }
        );

        const gptOutput = response.data.choices[0].message.content
            .split("\n")
            .filter(name => name.trim() !== "");
        
        if (gptOutput.length === 0) {
            return res.status(404).send('No variable names found');
        }
        
        res.json({ names: gptOutput });
    } catch (error) {
        console.error('Error fetching variable names:', error.message);
        res.status(500).send('Error fetching variable names');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
