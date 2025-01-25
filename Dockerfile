FROM node:20-alpine

# Installation des dépendances
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copie des sources
COPY . .

# Création des dossiers avec les bonnes permissions
RUN mkdir -p /app/uploads /app/dist \
    && chown -R node:node /app \
    && chmod -R 755 /app/dist \
    && chmod -R 755 /app/uploads

# Changement d'utilisateur pour plus de sécurité
USER node

# Variables d'environnement par défaut
ENV NODE_ENV=development \
    PORT=3000

# Exposition du port
EXPOSE $PORT

# Démarrage de l'application en mode développement
CMD ["npm", "run", "start:dev"] 