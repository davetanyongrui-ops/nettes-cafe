import https from 'https';
import fs from 'fs';

const url = 'https://online-restaurant.ichefpos.com/api/v1/stores/JO16XDsl/menus';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('ichef_api_response.json', data);
    console.log('Saved to ichef_api_response.json');
  });
}).on('error', (err) => console.log('Error: ', err.message));
