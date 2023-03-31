package com.aurore.pharmaciel_inventaire.services;


import com.aurore.pharmaciel_inventaire.entities.Inventaire;

import java.util.List;
import java.util.Optional;

public interface InventaireService {

    //fonction de creation d'une ligne d'inventaire
    Inventaire createInventaire(Inventaire inventaire);

    //fonction de reccuperation d'un inventaire par son id
    Optional<Inventaire> getInventaireById(Long id);

    //suppression d'une ligne d'inventaire
    void deleteInventaire(Long id);

    //modification de l'etat d'un inventaire
    Inventaire changeStatus(Long id);

    List<Inventaire> findAllInventaire();

}
