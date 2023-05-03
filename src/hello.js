const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.send("coucou")
});
// starting the server
app.listen(3000, () => {
    console.log('listening on port 3000');
});

