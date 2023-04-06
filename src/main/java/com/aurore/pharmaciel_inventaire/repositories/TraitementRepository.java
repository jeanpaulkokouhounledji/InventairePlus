package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TraitementRepository extends JpaRepository<Traitement,Long>{

    //recherche de traitement par rayon
    @Query("select t from Traitement t where t.participer.localisation.code=:codeRayon")
    List<Traitement> getTraitementByCodeRayon(@Param("codeRayon") String codeRayon);

    @Query("select t from Traitement t order by t.id desc")
    List<Traitement> listeDesTraitements();

}
