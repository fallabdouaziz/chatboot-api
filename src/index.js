const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/chatbot/:message', async (req, res) => {
  const message = req.params.message;

  const projectId = 'test-1-yqqw';
  const sessionId = '1234567890';
  const languageCode = 'fr';

  const sessionClient = new dialogflow.SessionsClient(
/*    credentials: {
      private_key: '5678d6588c8f80492b097663569fac22da0b6c1f',
      client_email: 'medi-726@test-1-yqqw.iam.gserviceaccount.com'
    }*/
  );


  const sessionPath = sessionClient.sessionPath(projectId, sessionId);


  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode
      }
    }
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  const responseMessage = result.fulfillmentText;

  res.send(`<p>${responseMessage}</p>`);
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
