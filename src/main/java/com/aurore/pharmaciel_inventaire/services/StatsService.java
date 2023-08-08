package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Traitement;

import java.util.List;

public interface StatsService {
    long countProduitParLocalisationCompte(String localisation);

    long countProduitCompte(String localisation);

    List<String> listDesLocalisationsComptés();
}
