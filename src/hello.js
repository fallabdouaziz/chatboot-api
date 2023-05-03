const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.post('/api/', (req, res) => {
   const message = req.body.message;
   console.log(req.body.message)
   if (message === 'Salut ça va ?') {
       res.send('Très bien et toi ?')
   } else {
       res.send('Je n’ai pas compris !')
   }

});
// starting the server
app.listen(3000, () => {
    console.log('listening on port 3000');
});

