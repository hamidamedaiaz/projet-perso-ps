# Livrable Temps Plein - PS6

## Equipe Octave

AMEDIAZ Hamid
GROS Nathan
MESKINI Driss
ROUILLON Cyril

## Explication des tests réalisés

### Test "User Management Test" - Nathan GROS

Ce test avait pour but de tester l'adaptabilité du site, en particulier l'ajout, la modification et la supression des profils des accueillis.
Le scénario correspondant est donc le suivant: l'intervenant cherche à ajouter un accueilli nommé "John Smith", puis modifie sa configuration, et enfin le supprimme.
Voici les étapes de test.

#### Etape 1: Aller dans l'espace intervenant

On arrive sur le site, on entre dans l'espace intervenant en rentrant le code administrateur.

#### Etape 2: Aller dans la configuration des joueurs

On va dans la section accueilli et on vérifie que tout se passe comme prévu.

#### Etape 3: Ajouter un accueilli

On ajoute un accueilli en cliquant sur le bouton prévu à cet effet, puis on créé l'accueilli "John Smith" en vérifiant pendant toute cette étape que tout se passe bien.

#### Etape 4: Accéder à la configuration de l'accueilli

On clique sur le nouvel accueilli "John Smith" puis on vérifie que la page de configuration est présente à l'écran.

#### Etape 5: Modifier la configuration de l'accueilli

On change le nom de l'accueilli en "Neil Smith", on change toutes les configurations de timer et de gameplay de l'accueilli, sa taille de police d'écriture, puis on enregistre la configuration.

#### Etape 6: Verification des modification

On retourne dans la configuration de "Neil Smith" et on vérifie que toutes les configurations ont bien été changées.

#### Etape 7: Supression de l'accueilli

On supprimme "Neil Smith" puis on vérifie que tout s'est bien passé comme prévu

### Test "Multiplayer Game Monitoring" - Driss MESKINI

L'objectif de ce test est de tester la jouabilité du mode "En groupe". Pour se faire nous avons du simuler les actions qui mène à la gestion d'une partie multijoueur. Nous avons utitliser le principe de contexte dans Playwright pour simuler deux navigateurs. Nous diposons donc d'une session Intervenant et d'une session Accueilli.

#### Etape 1: Connexion Intervenant

Session Intervenant : Entrer dans l'espace intervenant en rentrant le code administrateur 1234.

#### Etape 2: Selection du quiz

Session Intervenant : Aller dans la section quiz et selectionner et cliquer sur "Lancer en groupe" sur un des quiz disponibles.

#### Etape 3: Connexion Accueilli

Session Accueilli : Selectionner un accueilli et choisir le mode de jeu "En groupe".

#### Etape 4: Ajout de l'accueilli dans une partie

// Nous allons tester les deux manières de faire rejoindre un joueur dans une partie.

Session Intervenant : Cliquer sur le bouton "Ajouter +" pour déplacer le joueur dans la partie.

S'assurer que le joueur à bien rejoint la partie.

Session Accueilli : S'assurer que l'on a bien été déplacé dans la partie.

Session Intervenant : Cliquer sur le bouton "Retirer" pour retirer le joueur de la partie.

Session Accueilli : S'assurer que l'on a bien été retiré de la partie.

Dans la page le login, rentrer un code vide et cliquer sur le bouton "Rejoindre la partie". 

S'assurer que l'on affiche bien "Code Invalide". Rentrer le code de la session et cliquer sur le bouton "Rejoindre la partie".

S'assurer que l'on a bien rejoint la partie.

#### Etape 5: Démarrage de la partie

Session Intervenant : Cliquer sur le bouton "Démarrer la partie"

S'assurer que la première question est affichée correctment.

Session Accueilli : S'assurer que la question est affichée correctement.

#### Etape 6: Simulation de partie

Session Accueilli : Cliquer la réponse "Queen". S'assurer que l'on a bien été dans la page "answer-submitted" et que le message affiché est "Bonne réponse !".

Session Intervenant : S'assurer que la liste des joueurs qui ont répondu s'est bien mise à jour.
S'assurer que la répartition des réponses s'est bien mise à jour. Passer à la question suivante

S'assurer que la question a été changée chez du point de vue intervenant et accueilli. 

Cliquer sur le bouton "Afficher les indices".

S'assurer que les indices se sont affichés.

Cliquer sur le bouton "Masquer les indices".

S'assurer que les indices sont masqués.

Session Accueilli : Cliquer sur la réponse "The Wall". 

S'assurer que l'on a bien été dans la page "answer-submitted" et que le message affiché est "Dommage, bien essayé !". 

#### Etape 7: Terminer la partie

Session Intervenant : Passer à la question suivante 2 fois pour obtenir l'affichage de fin.

S'assurer à chaque fois que l'on est bien passé à la question d'après.

S'assurer que l'on affiche bien la liste des questions ainsi que le message de félicitation de fin de partie.

Session Accueilli : S'assuer que l'on obtient bien l'affichage de fin avec le message de félicitation.

Session Intervenant : cliquer sur "Afficher le classement"

S'assurer que le classement s'affiche bien et que le message de félicitation est masqué.

Cliquer sur une question et s'assurer que la bonne question est affichée.

#### Etape 8: Deconnection

Session Intervenant : Cliquer sur le bouton "Quitter".

S'assurer que l'on est bien revenue sur la page "/admin"

Session Accueilli : S'assurer que l'on a bien été redirigé vers la page de login.

## Documetation OPS
