package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.Traitement;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TraitementService {

    //generation des etats
    //void generateEtatInventaire(String codeInventaire, String codeRayon);

    //exportation ecarts
    List<Traitement> exportEcartToExcel(HttpServletResponse response) throws IOException;
    List<Traitement> exportComptageEnCoursToExcel(HttpServletResponse response) throws IOException;

    //sauvegarde d'une ligne de traitement
    Traitement saveTraitement(Traitement traitement);

    Traitement saveLeTraitement(String id_stockproduit, long id_participer, String fournisseur,double qteCompte, String datePeremption,double prixVente) throws ParseException;

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
