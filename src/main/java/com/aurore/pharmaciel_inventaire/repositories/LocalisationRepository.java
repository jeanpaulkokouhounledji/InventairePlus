package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Localisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocalisationRepository extends JpaRepository<Localisation,Long> {

    @Query("select l from Localisation l")
    List<Localisation> getRayons();

    @Query("select l from Localisation l where l.id=:id")
    Localisation findById(@Param("id") long id);

    @Query("select count(l) from Localisation l")
    long getCountLocalisations();

    //suppression de toutes les lignes
    @Query(value = "delete from localisation ",nativeQuery = true)
    void deleteAll();

}
