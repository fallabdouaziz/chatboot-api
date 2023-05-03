const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json);
app.use(cors);
app.get('api/', (req, res) => {
    res.send("coucou")
});
// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});

