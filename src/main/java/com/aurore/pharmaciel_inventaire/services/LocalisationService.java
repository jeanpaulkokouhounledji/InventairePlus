package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Localisation;

import java.util.List;

public interface LocalisationService {

    //liste des rayons
    List<Localisation> listLocalisations();
}
