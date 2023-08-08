package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.EtatInventaire;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface EtatInventaireService {

    //Genereation du fichier excel
    List<EtatInventaire> exportEtatInventaireToExcel(HttpServletResponse response,String codeInventaire, String codeRayon) throws IOException;
    List<EtatInventaire> exportAllEtatInventaireToExcel(HttpServletResponse response) throws IOException;
    //sauvegarde d'une ligne d'etat
    EtatInventaire createEtatInventaire(EtatInventaire etatInventaire);
    //selection d'une ligne d'etat d'inventaire
    Optional<EtatInventaire> getEtatInventaire(Long id);
    //liste de toutes les lignes de traitement d'inventaire
    List<EtatInventaire> getListEtatInventaire();
    //liste des etats générés par
    List<EtatInventaire> getEtatByInventaireAndRayon(String codeInventaire, String codeRayon);

}
