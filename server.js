const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

// Finnhub API 키 설정
const FINNHUB_API_KEY = '여기에_너의_API_KEY_넣기';

// 주가 가격 가져오는 API
app.post('/prices', async (req, res) => {
  const symbols = req.body.symbols;
  const results = [];

  for (const symbol of symbols) {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      const response = await axios.get(url);
      const price = response.data.c;

      results.push({ symbol, price });
    } catch (err) {
      console.error(`❌ ${symbol} 에러:`, err.message);
      results.push({ symbol, price: null });
    }
  }

  res.json(results);
});

// 404를 index.html로 처리 (SPA 호환)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
