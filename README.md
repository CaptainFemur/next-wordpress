### Installation

`docker compose up --build` 

Les différents containers devraient se lancer.

### Structure

#### NextJS 

Tout se passe dans le dossier cms-wordpress-app, qui a été fait selon le nouveau [App Router](https://nextjs.org/docs/app) de NextJS. (dossier app)
Dans le dossier lib, vous trouverez le fichier api.ts qui communique avec Wordpress via WPGraphQL

À partir de là, le front du site est géré ici, selon la structure habituelle de NextJS. 

#### Wordpress

Un thème a été fait et intégré dans le dossier next-presso.
Il ne sert pas à grand chose pour le moment, bien que l'on peut s'en servir pour rajouter toutes les fonctionnalités nécessaires dans le backend (ACF, éventuellement, ou encore des Custom Post Types, etc...)

### Volumes

Mailhog est utilisé pour envoyer les mails et pour les intercepter (pas testé).
WPGraphQL étant essentiel pour le bon fonctionnement du dépôt, il est intégré dans les volumes (à mettre à jour ?)
