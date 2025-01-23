# Politique de Mots de Passe

## Exigences Minimales

### Longueur
- **Minimum :** 8 caractères
- **Recommandé :** 12 caractères ou plus
- **Maximum :** Pas de limite supérieure

### Composition
Le mot de passe DOIT contenir :
- Au moins 1 lettre majuscule (A-Z)
- Au moins 1 lettre minuscule (a-z)
- Au moins 1 chiffre (0-9)
- Au moins 1 caractère spécial (@#$%^&+=!)

### Restrictions
Le mot de passe NE DOIT PAS contenir :
- Des espaces au début ou à la fin
- Le nom d'utilisateur ou l'email
- Des mots courants ou facilement devinables
- Des séquences répétitives (ex: 111111, abcdef)

## Sécurité

### Stockage
- Les mots de passe sont hashés avec BCrypt
- Le sel (salt) est généré automatiquement pour chaque mot de passe
- Les mots de passe en clair ne sont jamais stockés

### Validation
Les mots de passe sont validés :
- À l'inscription
- À la modification du mot de passe
- À la réinitialisation du mot de passe

### Messages d'Erreur
Des messages clairs sont fournis pour guider l'utilisateur :
- "Le mot de passe doit contenir au moins 8 caractères"
- "Le mot de passe doit contenir au moins une lettre majuscule"
- "Le mot de passe doit contenir au moins une lettre minuscule"
- "Le mot de passe doit contenir au moins un chiffre"
- "Le mot de passe doit contenir au moins un caractère spécial"

## Recommandations aux Utilisateurs

### Bonnes Pratiques
- Utiliser un mot de passe unique pour chaque compte
- Éviter les informations personnelles
- Privilégier les phrases de passe longues
- Utiliser un gestionnaire de mots de passe

### Exemples
✅ Bons exemples :
- "MonChat@Dort2024!"
- "J'aime&LeCafe123"
- "Dev@Spring2024!"

❌ Mauvais exemples :
- "password123"
- "12345678"
- "azerty"
- "qwerty123" 