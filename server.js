const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const FINNHUB_API_KEY = 'd1c0df1r01qre5aitfvgd1c0df1r01qre5aitg00';

app.post('/prices', async (req, res) => {
    const symbols = req.body.symbols;
    const results = [];

    for (const symbol of symbols) {
        try {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
            const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
            
            const [quoteRes, profileRes] = await Promise.all([
                axios.get(url),
                axios.get(profileUrl)
            ]);

            results.push({
                symbol,
                name: profileRes.data.name ?? symbol,
                price: quoteRes.data.c ?? null
            });
        } catch (err) {
            results.push({ symbol, name: symbol, price: null });
        }
    }

    res.json(results);
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`);
        const matches = response.data.result
            .filter(item => item.type === 'Common Stock')
            .slice(0, 10)
            .map(item => ({ symbol: item.symbol, description: item.description }));
        res.json(matches);
    } catch (error) {
        res.status(500).send('검색 실패');
    }
});

app.listen(3000, () => {
    console.log('✅ 서버 실행 중: http://localhost:3000');
});