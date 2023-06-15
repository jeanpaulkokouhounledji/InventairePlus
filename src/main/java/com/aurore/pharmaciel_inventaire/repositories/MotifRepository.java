package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.Motif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MotifRepository extends JpaRepository<Motif, Long> {

    //requet de reccuperations des localisations
    @Query("select m from Motif m")
    List<Motif> findAll();
}
