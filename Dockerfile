FROM node:20-alpine AS builder

# Installation des dépendances de build
WORKDIR /build
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copie des sources et build
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Installation des dépendances de production
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps \
    && npm cache clean --force

# Copie des fichiers buildés et des templates
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/src/modules/mail/templates ./dist/modules/mail/templates

# Création des dossiers avec les bonnes permissions
RUN mkdir -p /app/uploads \
    && chown -R node:node /app

# Changement d'utilisateur pour plus de sécurité
USER node

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Exposition du port
EXPOSE $PORT

# Démarrage de l'application
CMD ["node", "dist/main"] 