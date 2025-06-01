const https = require('https');
const fs = require('fs');

const url = 'https://www.moddb.com/mods/solo-fortress-2/reviews/980518';

https.get(url, (res) => {
  let html = '';

  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const userMatch = html.match(/<span class="heading">(.*?) says<\/span>/i);
    const dateMatch = html.match(/<span class="reviewdate">(.*?)<\/span>/i);

    const username = userMatch ? userMatch[1] : 'Unknown';
    const rawDate = dateMatch ? dateMatch[1] : 'Unknown';

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
    } catch (e) {}

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
    console.log(`✅ index.html updated with username "${username}"`);
  });
}).on('error', err => {
  console.error('Fetch error:', err.message);
});