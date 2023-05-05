const dialogflow = require('dialogflow');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

// Configuration des clés d'authentification pour Dialogflow
const projectId = 'test-1-yqqw'; // Remplacez YOUR_PROJECT_ID par l'ID de votre projet Dialogflow
const sessionId = uuid.v4();
const credentials = {
  client_email: 'medi-726@test-1-yqqw.iam.gserviceaccount.com', // Remplacez YOUR_CLIENT_EMAIL par l'adresse e-mail du compte de service Dialogflow
  private_key: '21ce762d0c944307f57027c117c617288239e056' // Remplacez YOUR_PRIVATE_KEY par la clé privée du compte de service Dialogflow
};

// Configuration de la connexion au client Dialogflow
const sessionClient = new dialogflow.SessionsClient({
  projectId: projectId,
  credentials: credentials
});

// Configuration du middleware body-parser pour récupérer les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration de la route pour gérer les requêtes POST
app.post('/api/chatbot', async (req, res) => {
  // Récupération du texte de la requête POST
  const text = "bonjour";
  res.json({
        message: responseMessage
      });
  // Configuration de la requête pour Dialogflow
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'fr-FR' // Remplacez fr-FR par le code de langue de votre choix
      }
    }
  };

  try {
    // Envoi de la requête à Dialogflow
    const responses = await sessionClient.detectIntent(request);

    // Récupération de la réponse de Dialogflow
    const result = responses[0].queryResult;
    const responseText = result.fulfillmentText;

    // Envoi de la réponse de Dialogflow au client
    res.json({ text: responseText });
  } catch (err) {
    console.error('Erreur lors de la requête à Dialogflow:', err);
    res.json({ text: 'Désolé, je n\'ai pas compris.' });
  }
});

// Démarrage du serveur Express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
