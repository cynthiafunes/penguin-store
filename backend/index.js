const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Panel de administracion');
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});