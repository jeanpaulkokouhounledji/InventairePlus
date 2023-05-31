package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.EtatInventaire;
import com.aurore.pharmaciel_inventaire.services.LigneService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EtatInventaireRepository extends JpaRepository<EtatInventaire,Long> {

    //liste des etat par inventaire et localisation
    @Query("select e from EtatInventaire e where e.codeInventaire=:codeInventaire and e.codeLocalisation=:codeRayon")
    List<EtatInventaire> etatPatRayonDinventaire(@Param("codeInventaire") String codeInventaire,@Param("codeRayon") String codeRayon);
}
