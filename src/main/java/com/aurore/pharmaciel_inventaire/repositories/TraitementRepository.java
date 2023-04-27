package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TraitementRepository extends JpaRepository<Traitement,Long>{

    //liste des donnees de traitements
    @Query("select t from Traitement t order by t.id desc")
    List<Traitement> listeDesTraitements();

    //suppression du traitement correspondant à la participation
    @Query("delete Traitement t where t.participer.id=:x")
    void deleteTraitementByParticiperId(@Param("x") long x);

}
