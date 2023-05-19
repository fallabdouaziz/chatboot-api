const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
const axios = require('axios');

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
            private_key: '',
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
  const intent = result.intent.displayName;
  const parameter = result.parameters.fields;
  const responseMessage = result.fulfillmentText;

  let address = "";
  if (intent.includes('restaurant - select.name')) {
    let name_rest = result.parameters.fields.Restaurants_Lyon1.stringValue;
    address = await getAddressFromRestaurantName(name_rest);
  }




  // res.send(`{\n IntentName : "${intent}", \n patameters :"${parameter}", \n output :"${responseMessage}", \n address :"${address}"}`);
  if(address == ''){
    res.json({
      output: responseMessage
    });
  }else{
    res.json({
      output: responseMessage,
      address: address
    });
  }

});


async function getAddressFromRestaurantName(restaurantName) {
  const apiKey = 'clé de l'api';

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${restaurantName}&inputtype=textquery&fields=formatted_address&key=${apiKey}`);
    const result = response.data;
    console.log(result);
    if (result.status === 'OK' && result.candidates.length > 0) {
      const address = result.candidates[0].formatted_address;
      return address;
    } else {
      throw new Error('Failed to retrieve address from Google Maps API');
    }
  } catch (error) {
    console.error('Error:', error.message);
    return "";
  }
}

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
