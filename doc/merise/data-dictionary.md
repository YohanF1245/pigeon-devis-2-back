# Dictionnaire de Données

## Utilisateur (User)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| user_id | UUID | 36 | Identifiant unique | Clé primaire |
| email | VARCHAR | 255 | Adresse email | Unique, Required (B.R. 2, 3) |
| password | VARCHAR | 255 | Mot de passe hashé | Required (B.R. 4) |
| first_name | VARCHAR | 50 | Prénom | Required (B.R. 14) |
| last_name | VARCHAR | 50 | Nom | Required (B.R. 15) |
| phone | VARCHAR | 15 | Numéro de téléphone | Optional (B.R. 17) |
| signature_path | VARCHAR | 255 | Chemin du fichier signature | Optional (B.R. 20) |
| is_verified | BOOLEAN | - | Compte vérifié | Default false (B.R. 5) |
| role_id | INTEGER | - | ID du rôle | FK Role, Required (B.R. 7) |

## Rôle (Role)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| role_id | SERIAL | - | Identifiant unique | Clé primaire |
| name | ENUM | - | Type de rôle (USER/ADMIN) | Unique, Required |

## Réinitialisation de mot de passe (PasswordResetLink)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| reset_link_id | UUID | 36 | Identifiant unique | Clé primaire |
| user_id | UUID | 36 | ID de l'utilisateur | FK User, Required |
| unique_link | UUID | 36 | Lien unique de réinitialisation | Required, Auto |
| expires_at | TIMESTAMPTZ | - | Date d'expiration | Required, Default +1h |
| created_at | TIMESTAMPTZ | - | Date de création | Auto |

## Adresse (Address)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| address_id | UUID | 36 | Identifiant unique | Clé primaire |
| street_number | VARCHAR | 10 | Numéro de rue | Required (B.R. 21) |
| street_name | VARCHAR | 255 | Nom de rue | Required (B.R. 22) |
| zip_code | VARCHAR | 10 | Code postal | Required (B.R. 23) |
| city | VARCHAR | 100 | Ville | Required (B.R. 24) |
| complement | VARCHAR | 255 | Complément d'adresse | Optional (B.R. 25) |

## Entreprise (Business)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| business_id | UUID | 36 | Identifiant unique | Clé primaire |
| owner_id | UUID | 36 | ID du propriétaire | FK User (B.R. 27) |
| siret | VARCHAR | 14 | Numéro SIRET | Required, Unique (B.R. 28) |
| ape_code | VARCHAR | 5 | Code APE | Required (B.R. 29) |
| tax_code | VARCHAR | 50 | Code fiscal | Required (B.R. 30) |
| logo_path | VARCHAR | 255 | Chemin du fichier logo | Optional (B.R. 31) |
| address_id | UUID | 36 | Adresse de l'entreprise | FK Address |

## Prestation (Performance)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| performance_id | UUID | 36 | Identifiant unique | Clé primaire |
| business_id | UUID | 36 | ID de l'entreprise | FK Business (B.R. 34) |
| name | VARCHAR | 255 | Nom de la prestation | Required |
| description | TEXT | - | Description | Optional |
| price | DECIMAL | 10,2 | Prix HT | Required (B.R. 35) |
| tax_rate | DECIMAL | 5,2 | Taux de TVA | Required (B.R. 37) |
| type | ENUM | - | Type de prestation (SERVICE/PRODUIT) | Required (B.R. 33) |

## Client (Customer)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| customer_id | UUID | 36 | Identifiant unique | Clé primaire |
| business_id | UUID | 36 | ID de l'entreprise | FK Business |
| type | ENUM | - | Professionnel/Particulier | Required (B.R. 48) |
| business_name | VARCHAR | 255 | Nom de l'entreprise | Required if Pro (B.R. 49) |
| first_name | VARCHAR | 50 | Prénom | Required if Particulier (B.R. 50) |
| last_name | VARCHAR | 50 | Nom | Required if Particulier (B.R. 51) |
| email | VARCHAR | 255 | Email | Optional (B.R. 52) |
| phone | VARCHAR | 15 | Téléphone | Optional (B.R. 53) |
| address_id | UUID | 36 | Adresse | FK Address, Optional (B.R. 54) |

## Devis (Estimate)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| estimate_id | UUID | 36 | Identifiant unique | Clé primaire |
| business_id | UUID | 36 | ID de l'entreprise | FK Business |
| customer_id | UUID | 36 | ID du client | FK Customer (B.R. 41) |
| status | ENUM | - | Émis/Accepté | Required (B.R. 44) |
| discount | DECIMAL | 5,2 | Remise en % | Optional (B.R. 43) |
| expiration_date | DATE | - | Date d'expiration | Required (B.R. 45) |
| delivery_time | INTEGER | - | Délai de livraison en jours | Required (B.R. 46) |
| created_at | TIMESTAMPTZ | - | Date de création | Required (B.R. 42) |
| updated_at | TIMESTAMPTZ | - | Date de modification | Auto |

## Ligne de Devis (EstimateLine)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| estimate_line_id | UUID | 36 | Identifiant unique | Clé primaire |
| estimate_id | UUID | 36 | ID du devis | FK Estimate |
| performance_id | UUID | 36 | ID de la prestation | FK Performance (B.R. 39) |
| quantity | INTEGER | - | Quantité | Required |
| unit_price | DECIMAL | 10,2 | Prix unitaire | Required |
| tax_rate | DECIMAL | 5,2 | Taux de TVA | Required |

## Facture (Invoice)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| invoice_id | UUID | 36 | Identifiant unique | Clé primaire |
| estimate_id | UUID | 36 | ID du devis | FK Estimate (B.R. 56) |
| status | ENUM | - | Émise/Payée | Required (B.R. 57) |
| surcharge | DECIMAL | 10,2 | Majoration | Default 0 (B.R. 58) |
| payment_limit | DATE | - | Date limite de paiement | Required (B.R. 59) |
| payment_date | DATE | - | Date de paiement | Optional (B.R. 60) |
| created_at | TIMESTAMPTZ | - | Date de création | Required (B.R. 61) |
| updated_at | TIMESTAMPTZ | - | Date de modification | Auto |

## Dépense (Expense)
| Champ | Type | Taille | Description | Règle |
|-------|------|---------|-------------|--------|
| expense_id | UUID | 36 | Identifiant unique | Clé primaire |
| business_id | UUID | 36 | ID de l'entreprise | FK Business |
| title | VARCHAR | 255 | Titre | Required (B.R. 63) |
| amount | DECIMAL | 10,2 | Montant | Required (B.R. 64) |
| expense_date | DATE | - | Date de la dépense | Required (B.R. 65) |
| created_at | TIMESTAMPTZ | - | Date de création | Auto |
| updated_at | TIMESTAMPTZ | - | Date de modification | Auto |

## Notes
- Tous les identifiants sont des UUID pour garantir l'unicité globale
- Les timestamps created_at et updated_at sont automatiquement gérés
- Les clés étrangères (FK) assurent l'intégrité référentielle
- Les montants sont stockés avec 2 décimales pour la précision
- Les taux (TVA, remise) sont stockés avec 2 décimales
- Les énumérations sont utilisées pour les statuts et types fixes

## Notes sur la législation française
- SIRET : Numéro d'identification unique à 14 chiffres attribué par l'INSEE à chaque entreprise française
- Code APE (NAF) : Code à 5 caractères attribué par l'INSEE qui identifie le secteur d'activité principal de l'entreprise
- TVA : Taxe sur la Valeur Ajoutée, plusieurs taux possibles en France (20% standard, 10%, 5.5%, 2.1%)
- Mentions légales obligatoires sur les devis :
  - Date d'expiration (validité de l'offre)
  - Délai de livraison/exécution
  - Conditions de paiement
- Mentions légales obligatoires sur les factures :
  - Numéro unique et séquentiel
  - Date limite de paiement
  - Coordonnées complètes (SIRET, TVA, etc.)
  - Pénalités de retard
