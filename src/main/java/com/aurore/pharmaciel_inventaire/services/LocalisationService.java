package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Localisation;

import java.util.List;
import java.util.Optional;

public interface LocalisationService {

    //liste des rayons
    List<Localisation> listLocalisations();

    //localisation par id
    Optional<Localisation> findLocalisationById(Long id);
}
