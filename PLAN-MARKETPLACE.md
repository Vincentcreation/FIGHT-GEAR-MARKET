# Marketplace d’équipement de combat thaïlandais

Le projet réunit des fournisseurs thaïlandais dans une seule boutique accessible aux acheteurs internationaux. Chaque fournisseur vend sous sa propre marque, fixe ses prix, gère son stock et prépare ses colis. La marketplace présente les produits, apporte des acheteurs, suit les commandes et gagne une commission sur les ventes qu’elle génère.

## 1. Périmètre du pilote

| Décision | Proposition de départ |
| --- | --- |
| Catalogue | Équipement de Muay Thai, avec des gants, des shorts et des bandes. Environ 15 à 20 modèles entre les marques, plus leurs variantes. |
| Fournisseurs | Deux ou trois marques pilotes qui peuvent fournir leurs photos, confirmer leur stock et expédier avec suivi depuis la Thaïlande. |
| Acheteurs | Vitrine en anglais. Canada comme premier marché à chiffrer, puis États-Unis et autres destinations selon le coût livré et la demande. |
| Commandes | Un fournisseur par commande. Un acheteur qui choisit deux marques passe deux commandes, chacune avec son prix d’expédition. |
| Paiement | Chaque fournisseur encaisse sur sa propre page de paiement et expédie. La plateforme suit la référence de commande et facture la commission selon l’entente du pilote. |
| Devise | USD pour la démo. Pour le pilote, convenir d’une devise de facturation par commande et l’afficher clairement avant le paiement. |

Ce sont des hypothèses de départ. Le premier marché et les produits retenus se décident après avoir chiffré quelques colis réels.

## 2. Parcours d’une vente pilote

1. Le fournisseur soumet sa page de marque et ses fiches produits, avec photos autorisées, variantes, prix, stock et guide de tailles. L’administrateur approuve la publication.
2. L’acheteur filtre par catégorie ou par marque, choisit une taille ou un poids de gants, puis demande un devis pour sa destination.
3. Le fournisseur confirme la disponibilité, le prix total, le délai estimé et la responsabilité des frais d’importation. L’acheteur paie via le lien de paiement du fournisseur associé à la référence de commande.
4. Le fournisseur confirme le paiement, expédie et ajoute le numéro de suivi. La commande passe de demandée à confirmée, payée, expédiée, puis livrée, avec des statuts pour les annulations et les remboursements.
5. La marketplace rapproche les commandes payées avec le relevé du fournisseur, comptabilise les commissions et ajuste le relevé en cas de remboursement.

Pour chaque destination envisagée, demande un devis pour des colis représentatifs avec poids et dimensions emballés. Compare le **prix livré** du même panier, le délai, le suivi et le coût d’un retour. Présente les frais connus avant paiement et indique clairement qui règle les frais d’importation éventuellement perçus à la livraison. [DHL Thaïlande – droits et taxes](https://www.dhl.com/th-en/home/express/shipping-and-tracking/customs/customs-clearance/customs-duties-and-taxes.html)

## 3. Commission et rentabilité

**Règle proposée** — Appliquer le taux au sous-total des articles après remises, hors port, taxes et droits. Comptabiliser la commission sur une vente payée. En cas de retour, calculer l’ajustement sur le montant des articles effectivement remboursé. Enregistrer le taux et le montant de chaque commande pour conserver l’historique quand le taux change.

| Taux | Commission sur 100 USD d’articles | Reste après 3 USD de frais de paiement assumés par la plateforme* |
| --- | ---: | ---: |
| 1 % | 1 USD | −2 USD |
| 2 % | 2 USD | −1 USD |
| 5 % | 5 USD | 2 USD |

\* Les 3 USD sont un exemple de calcul. Le résultat exclut notamment les dépenses de change, de soutien et d’acquisition. Dans le pilote, la répartition des frais est définie dans l’entente avec le fournisseur.

Mets **5 % comme valeur de démo**, configurable à 1 %, 2 % ou 5 %. Pour le taux commercial, compare les coûts réellement assumés par la plateforme et ce que les fournisseurs sont prêts à payer pour une vente supplémentaire.

## 4. Ordre de développement

| Étape | Ce qu’on livre | Vérification |
| --- | --- | --- |
| **1. Démo locale dans Cursor** | Projet indépendant. Accueil, catalogue filtrable, pages de marque, fiches produits, variantes, panier et simulation de commande. Vue de démonstration pour voir la commission et le montant vendeur avant ses frais. | Sur mobile et ordinateur, on peut filtrer les produits, sélectionner une variante, passer une commande fictive auprès d’une marque et vérifier le calcul à 1 %, 2 % et 5 %. |
| **2. Portail fournisseurs** | Comptes fournisseurs, création et modification de produits, photos, variantes, stock et revue des fiches. Tableau d’administration pour approuver les marques et les publications. | Deux comptes de marques différents peuvent gérer leurs fiches. Les tests vérifient qu’un compte ne peut ni lire les données privées ni modifier les produits ou commandes de l’autre. |
| **3. Premières ventes réelles** | Marques pilotes, prix de transport confirmés par destination, devis, paiement chez le fournisseur, numéro de suivi, relevé des commissions et procédure de retour. | Refaire le parcours de bout en bout avec un colis suivi, puis rapprocher le paiement, la commission et le suivi. Tester aussi une annulation et un remboursement. |
| **4. Paiement intégré et nouveaux marchés** | Intégrer le paiement et les versements avec un prestataire qui confirme le montage retenu. Automatiser la synchronisation des statuts et les remboursements. Ajouter des pays et étudier le panier multivendeur selon les données du pilote. | Vérifier les paiements, les versements, le change, les remboursements partiels et les événements reçus en double avant l’encaissement réel par la plateforme. |

En parallèle des étapes 1 et 2, contacte quelques marques que tu peux rencontrer en Thaïlande. Présente-leur la page de marque, la visibilité internationale et la commission sur les ventes générées. Demande un petit catalogue, un devis d’expédition, leur capacité à accepter les paiements des destinations ciblées et leurs conditions de retour. Fixe par écrit qui répond au client, qui prend en charge un colis perdu ou un retour, et comment vous confirmez les ventes et les commissions.

Pour le paiement intégré, fais confirmer le **pays de l’entreprise qui exploite la plateforme**, le rôle du vendeur sur la facture, les obligations fiscales et les pays des comptes fournisseurs. La liste Stripe des versements transfrontaliers Connect en libre-service couvre les États-Unis, le Royaume-Uni, l’EEE, le Canada et la Suisse. Si ton entreprise est canadienne et tes fournisseurs en Thaïlande, demande à Stripe ou à un autre prestataire de confirmer précisément le flux de paiement et de versement avant de choisir l’intégration. [Stripe – disponibilité des versements transfrontaliers](https://docs.stripe.com/connect/connect-cross-border-payouts)

## 5. Base technique proposée

- **Vitrine et portail** — Next.js avec TypeScript. Utilise des données fictives dans la première version. [Documentation Next.js](https://nextjs.org/docs/app/getting-started/installation)
- **Données et accès à l’étape 2** — Un projet Supabase dédié pour les comptes, la base de données et les photos. Les visiteurs lisent les fiches publiées. Les fournisseurs ont accès aux données privées de leur marque et aux commandes qui les concernent. L’administrateur gère la validation. Applique ces droits dans la base avec les politiques RLS et les permissions appropriées. [Documentation Supabase sur les politiques RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- **Données à prévoir** — Fournisseurs et membres, produits et variantes, commandes et lignes de commande, expéditions, commissions et ajustements. Chaque commande garde une copie des prix, de la devise et du taux appliqués au moment de l’achat. Calcule les totaux côté serveur à partir des prix en vigueur avant de confirmer une vente réelle.
- **Hébergement** — Vercel est une option lorsque la démo est prête à être montrée et que le projet dispose de ses propres variables et environnements.

Sur les premières ventes, suis le prix livré, le délai réel, les annulations, le temps de soutien et la commission restante après tes coûts. Ces chiffres guideront le choix du prochain pays et du prochain fournisseur.

## 6. À coller dans Cursor pour commencer

~~~text
Lis PLAN-MARKETPLACE.md et réalise uniquement l’étape 1, la démo locale.

Travaille dans le dossier de ce nouveau projet. Inspecte d’abord son contenu et
adapte-toi à ce qui existe. Si aucune application n’est initialisée, crée une base
Next.js avec TypeScript en conservant ce document.
Prépare un catalogue fictif en anglais avec trois marques thaïlandaises fictives,
des gants, des shorts et des bandes. Indique dans l’interface qu’il s’agit d’une démo.

Implémente l’accueil, le catalogue avec filtres par marque et catégorie, les pages
de marque, les fiches avec taille ou poids, et un panier. Limite chaque commande
simulée à une marque et indique à l’acheteur comment passer une commande séparée
pour une autre marque. Ajoute une vue de démonstration pour sélectionner 1 %, 2 %
ou 5 % et vérifier le calcul de la commission sur le sous-total des articles.
Utilise 5 % par défaut pour la simulation.

Le périmètre de cette étape est local, avec des données et commandes fictives.
Vérifie le parcours complet et le build. Ajoute au README les commandes de
démarrage et le scénario de test d’un achat. Résume le résultat et les
vérifications effectuées.
~~~
