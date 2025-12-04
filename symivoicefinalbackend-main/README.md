SYMI - Réceptionniste (Démo voix)

Démarrage

1) Créez un fichier .env à la racine avec vos clés:

PORT=3000
ELEVENLABS_API_KEY=REPLACE_WITH_KEY
ELEVENLABS_VOICE_ID_SIMON=REPLACE_WITH_ID
ELEVENLABS_VOICE_ID_LENA=REPLACE_WITH_ID

2) Installez et lancez:

npm install
npm run start

3) Ouvrez http://localhost:3000/receptionniste.html

Le bouton "Voix de démo" joue la présentation avec la voix sélectionnée (Simon/Léna) via l'API ElevenLabs, tout en gardant le design.

