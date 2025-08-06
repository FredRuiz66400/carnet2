--Carnet de plongee--

L'idee de faire ce site ,viens surtout de l'idee d'avoir une application mobile sur laquelle je pourrais apres chaque plongge pouvoir y noter tous les elements qui ont composes celle-ci.
Pourquoi refaire un carnet de plongee alors qu'il en existe deja ?? -Surtout pour avoir un outil qui ne depends d'une marque ,qui n'est pas orienté organisme de formations , simple et personnel tous en gardant la possibilite d'avoir tous les elements necessaires a portes de main.

Articulation du site :
-une page d'accueil ,avec une navigation , la possibilite de rajouter sa photo de profil , le moyen d'ajouter une plongee et de pouvoir visualiser d'un simple coup d'oeil le recapitulatif de l'ensemble de celle ci.

-une page recapiutlative des plongees , dans laquelle ou pourrait revenir sur certaine d'entre elles , avec un moyen de recherche et une visualisation de toutes celle enregistrees.

-une page permettant d'enregistrer tout les elements de sa nouvelles plongee, la date , l'heure , le lieu , le nom du site,la profondeur max et la duree , temperature de l'eau , la visibilite,les conditions du jour,le nom de son binome (un plongeur n'est jamais seul), la consommation d'air de la bouteille et toutes les notes pertinentes necessaires.
biensur un bouton permettant l'enregistrement dans une base de donnee.
      ___ A venir une localisation GPS pour avoir un apercu carte sur la page.

-une page pour les differentes statistiques de plongee , le nombre total,le temps sous la surface ,la profondeur max et la moyenne de la profondeur,la repartition par plongee et d'autres diffenrentes donnees.

-une derniere page que je vais appeler reglages , dans laquelle ont retrouvera le nom du plongeur , son niveau selon son type de formations, les unites de mesures .Le moyen d'importer ou d'exporter ces plongees pour enrichir ces donnees et /ou partager celle ci.
      __A venir le referencement du materiel utilise pour mettre en place un suivis pour la verification de celui-ci.

-le footer comportera la version du site ,un acces au reglages et l'acces au mentions legales.
     __Peut etre un acces au reseaux sociaux personnel (a voir).

A terme le basculement vers une version mobile.

ARCHITECTURE DU SITE :

-Carnet de plongee__ index.html
                  __ dives.html
                  __ add_dives.html
                  __ setting.html
                  __ stats.html
                  |__assets__CSS:
                           __main.css
                           __responsive.css

                           __JavaScript :
                           __main.js
                           --dive.js
                           __stats.js
                           __storage.js

                           __Images :
                           __ Illustration

_une base de donnee devra permettre l'enregistrement de toutes les donnees , l'affichage dans les differentes pages,la consultation l'ajout et la suppression si necessaires.
