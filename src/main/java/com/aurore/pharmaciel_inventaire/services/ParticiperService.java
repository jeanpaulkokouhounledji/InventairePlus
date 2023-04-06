package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Participer;

import java.util.List;

public interface ParticiperService {

    //création d'une ligne d'inventaire
    Participer createParticiper(Long user_id,Long inventaire_id,Long localisation_id);

    //edition d'une ligne de participation
    Participer editParticiper(Long id);

    //supression d'une ligne de participation
    void deleteParticiper(Long id);

    //séléctionner toutes les participations
    List<Participer> allParticipations();

    //selection de l'inventaire actif pour un utilisateur
    String getInventaireForUser(String username);

    //selection des rayons pour un utilisateur par inventaire actif
    List<Localisation> localisationByUser(String username);



}
