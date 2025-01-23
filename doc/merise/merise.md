# Modélisation Merise

## Modèle Conceptuel de Données (MCD)

Le MCD représente la structure logique des données, indépendamment des contraintes techniques.

![Modèle Conceptuel de Données](../../assets/img/mcd-pigeon-devis-2.jpg)

## Modèle Logique de Données (MLD)

Le MLD est la traduction du MCD en tenant compte des contraintes techniques de la base de données relationnelle.

![Modèle Logique de Données](../../assets/img/mld-pigeon-devis-2.jpg)

## Modèle Physique de Données (MPD)

Le MPD est l'implémentation concrète du MLD pour notre SGBD PostgreSQL.

![Modèle Physique de Données](../../assets/img/mpd-pigeon-devis-2.jpg)

## Source

Le fichier source `pigeon-devis-2.loo` a été créé avec l'outil [Looping](http://www.looping-mcd.fr/), un outil de modélisation Merise. 