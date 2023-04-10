package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InventaireRepository extends JpaRepository<Inventaire,Long> {

    @Query("select i from  Inventaire i order by i.id desc")
    List<Inventaire> findAll();

    //liste des inventaires actifs
    @Query("select i from Inventaire i where i.statut=true order by i.id desc")
    List<Inventaire> allInventaireActif();


}
