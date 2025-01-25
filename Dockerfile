FROM node:20-alpine
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des sources
COPY . .

# Création des dossiers avec les bonnes permissions
RUN mkdir -p /app/dist \
    && mkdir -p /app/uploads \
    && chown -R node:node /app

# Changement d'utilisateur pour plus de sécurité
USER node

# Démarrage de l'application
CMD ["npm", "run", "start:dev"] 