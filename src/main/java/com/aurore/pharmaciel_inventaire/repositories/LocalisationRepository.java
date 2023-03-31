package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Localisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LocalisationRepository extends JpaRepository<Localisation,Long> {

    @Query("select l from Localisation l")
    List<Localisation> getRayons();
}
