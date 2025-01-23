# Tests API Pigeon Devis

## Tests Unitaires

### Validation Mot de Passe
- Test validité : vérifie mot de passe valide
- Test invalidité : vérifie critères non respectés
- Test acceptation : vérifie formats acceptables

### Authentification (Service)
- Test login : vérifie connexion réussie
- Test register : vérifie inscription réussie
- Test email existant : vérifie rejet doublon

### Création Entreprise (Controller)
- Test création : vérifie création réussie
- Test SIRET existant : vérifie rejet doublon
- Test SIRET invalide : vérifie format invalide
- Test code APE invalide : vérifie format invalide
- Test adresse invalide : vérifie champs requis
- Test utilisateur invalide : vérifie authentification requise

## Tests Intégration

### Authentification
- Test register succès : vérifie inscription et JWT
- Test register email existant : vérifie rejet doublon
- Test register email invalide : vérifie format email
- Test register mot de passe faible : vérifie critères
- Test register prénom manquant : vérifie champ requis
- Test register nom manquant : vérifie champ requis
- Test register téléphone invalide : vérifie format
- Test register champs trop longs : vérifie limites
- Test login succès : vérifie connexion et format JWT
- Test login email invalide : vérifie rejet
- Test login mot de passe incorrect : vérifie rejet
- Test login champs vides : vérifie validation

### Création Entreprise
- Test création : vérifie création complète
- Test SIRET existant : vérifie gestion doublon
- Test validation : vérifie rejet données invalides
- Test authentification : vérifie accès sécurisé

### Configuration JWT
- Test secret JWT : vérifie présence et longueur minimale
- Test validité token : vérifie génération et validation
- Test expiration : vérifie gestion durée validité

### Sécurité
- Test requête non authentifiée : vérifie statut 401
- Test token invalide : vérifie rejet
- Test token expiré : vérifie rejet
- Test accès ressources protégées : vérifie autorisation requise 