package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FournisseurRepository extends JpaRepository<Fournisseur,Long> {

    @Query("select f from Fournisseur f order by f.id desc")
    List<Fournisseur> getListFOurnisseur();

    @Query("select f from Fournisseur f where f.id=:x")
    Fournisseur findById(@Param("x") long x);

    Fournisseur findFournisseurByRaisonSociale(@Param("x") String x);

    @Query("select count(f) from Fournisseur f")
    long getCountFournisseurs();

    //suppression de toutes les lignes
    @Query(value = "delete from fournisseur ",nativeQuery = true)
    void deleteAll();

}
