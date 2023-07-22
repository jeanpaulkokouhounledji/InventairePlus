CREATE VIEW etat_inventaire AS
SELECT
    stock_produit.code_unique as id_ligne,
    produit.id as id_produit,
    produit.code_produit as code_cip,
    produit.libelle as libelle,
    fournisseur.id as id_fournisseur,
    stock_produit.prix_achat as prix_achat,
    traitement.prix_vente as prix_vente,
    traitement.qte_compte as qte,
    traitement.date_peremption as date_peremption,
    "" as lot,
    motif.id as id_motif,
    motif.libelle as libelle_motif,
    localisation.code as code_localisation,
    localisation.libelle as localisation,
    app_user.id as code_utilisateur,
    inventaire.numero as code_inventaire

FROM produit,inventaire,localisation,app_user,traitement left join motif on traitement.le_motif=motif.libelle,participer,fournisseur,stock_produit

WHERE
        traitement.stock_produit=stock_produit.id
  AND
        produit.id=stock_produit.id_produit
  AND
        traitement.participer=participer.id
  AND
        participer.inventaire_id=inventaire.id
  AND
        participer.user_id=app_user.id
  AND
        traitement.fournisseur=fournisseur.id
  AND
        produit.id_localisation=localisation.id
  AND
    traitement.stock_produit is not null

UNION

SELECT
    "" as id_ligne,
    "" as id_produit,
    traitement.code_cip as code_cip,
    traitement.libelle_produit as libelle,
    fournisseur.id as id_fournisseur,
    "" as prix_achat,
    traitement.prix_vente as prix_vente,
    traitement.qte_compte as qte,
    traitement.date_peremption as date_peremption,
    "" as lot,
    motif.id as id_motif,
    motif.libelle as libelle_motif,
    "" as code_localisation,
    "" as localisation,
    app_user.id as code_utilisateur,
    inventaire.numero as code_inventaire

FROM inventaire,app_user,traitement left join motif on traitement.le_motif=motif.libelle,participer,fournisseur

WHERE
        traitement.participer=participer.id
  AND
        participer.inventaire_id=inventaire.id
  AND
        participer.user_id=app_user.id
  AND
        traitement.fournisseur=fournisseur.id
  AND
    traitement.stock_produit is null