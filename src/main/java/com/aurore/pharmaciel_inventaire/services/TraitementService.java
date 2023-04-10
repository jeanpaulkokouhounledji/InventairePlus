package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Traitement;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TraitementService {

    //sauvegarde d'une ligne de traitement
    Traitement saveTraitement(Traitement traitement);

    Traitement saveLeTraitement(long produit_id, long participer_id, double qteCompte, Date datePeremption, String codeFournisseur);

    //Reccuperation du traitement pour modification
    Optional<Traitement> getForEdit(Long id);

    void deleteTraitement(long id);

    //liste des lignes comptées
    List<Traitement> getTraitementByRayon(String codeRayon);

    //Liste de tous les traitements
    List<Traitement> listTraitement();

    //liste de traitement avec ashmap
    List<Traitement> listTraitementHash();

    //sauvegarde d'un motif
    Traitement saveTraitementMotif(long id,String motif);

}
