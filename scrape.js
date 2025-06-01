const https = require('https');
const fs = require('fs');

const url = 'https://www.moddb.com/mods/solo-fortress-2/reviews/980518';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // fake browser
  }
}, (res) => {
  let html = '';

  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // DEBUG: Show first 500 characters of the HTML to check if it's working
    console.log("🔍 First 500 characters of ModDB response:");
    console.log(html.slice(0, 500));

    // Try to scrape username and review date
    const userMatch = html.match(/<span class="heading">(.*?) says<\/span>/i);
    const dateMatch = html.match(/<span class="reviewdate">(.*?)<\/span>/i);

    const username = userMatch ? userMatch[1] : 'Unknown';
    const rawDate = dateMatch ? dateMatch[1] : 'Unknown';

    // Format the date to Europe/Berlin
    let europeanTime = 'Unavailable';
    try {
      const date = new Date(rawDate + ' UTC');
      europeanTime = date.toLocaleString('en-GB', {
        timeZone: 'Europe/Berlin',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('⚠️ Date parse error:', e.message);
    }

    // Final output HTML
    const output = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ModDB Scraper</title>
  <style>
    body {
      background: #111;
      color: #0ff;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 100px;
    }
    h1 {
      font-size: 3rem;
    }
    .date {
      font-size: 1.2rem;
      color: #ccc;
      margin-top: 1em;
    }
  </style>
</head>
<body>
  <h1>${username}</h1>
  <div class="date">Updated: ${europeanTime}</div>
</body>
</html>
`;

    fs.writeFileSync('index.html', output);
    console.log(`✅ Done. Saved username "${username}" and time "${europeanTime}" to index.html`);
  });
}).on('error', err => {
  console.error('❌ Fetch error:', err.message);
});
