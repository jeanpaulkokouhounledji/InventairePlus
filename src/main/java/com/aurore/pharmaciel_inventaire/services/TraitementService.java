package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Traitement;

import java.util.List;
import java.util.Optional;

public interface TraitementService {

    //sauvegarde d'une ligne de traitement
    Traitement saveTraitement(Traitement traitement);

    Traitement saveLeTraitement(Traitement traitement, long produit_id,long participer_id);

    //Reccuperation du traitement pour modification
    Optional<Traitement> getForEdit(Long id);

    void deleteTraitement(long id);

    //liste des lignes comptées
    List<Traitement> getTraitementByRayon(String codeRayon);

    //Liste de tous les traitements
    List<Traitement> listTraitement();

}
