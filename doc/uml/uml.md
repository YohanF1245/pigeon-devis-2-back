# Diagrammes UML

## Diagramme de Classes
Représente la structure du système de gestion de devis, avec les entités principales pour gérer les utilisateurs, entreprises, clients, devis et factures. Le tableau de bord est implémenté comme un service sans stockage.

![Diagramme de Classes](../../assets/img/class-diagram.png)

### Modifications pour la gestion des rôles
Le diagramme de classes doit être mis à jour pour inclure :

1. Nouvelle entité `Role` :
   - `role_id: Long (PK)`
   - `name: RoleType (ENUM)`

2. Énumération `RoleType` :
   - `ROLE_USER`
   - `ROLE_ADMIN`

3. Relation One-to-One entre `User` et `Role` :
   - Un utilisateur a exactement un rôle
   - Un rôle peut être attribué à plusieurs utilisateurs
   - Table de liaison : `user_roles` avec contrainte d'unicité sur user_id

## Diagramme de Cas d'Utilisation
Montre les fonctionnalités accessibles aux utilisateurs de Pigeon Devis, avec une séparation claire entre la gestion de compte, la gestion administrative et la gestion commerciale.

![Diagramme de Cas d'Utilisation](../../assets/img/use-case.png)

## Diagrammes de Séquence

### Inscription
Processus d'inscription avec validation des données et création du compte utilisateur. L'email doit être unique dans le système.

![Diagramme de Séquence - Inscription](../../assets/img/sequence-inscription.png)

### Connexion
Authentification de l'utilisateur avec génération d'un JWT pour les requêtes futures. Vérifie aussi que le compte est bien validé.

![Diagramme de Séquence - Connexion](../../assets/img/sequence-login.png)

### Création d'Entreprise
Création d'une entreprise avec validation basique du SIRET (format 14 chiffres). Nécessite une authentification valide.

