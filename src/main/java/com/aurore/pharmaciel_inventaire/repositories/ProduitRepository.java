package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit,Long> {

    //produit par code ou par nom
    @Query("select p from Produit p where p.codeProduit like %:critere% or p.libelle like %:critere%")
    Produit produitTrouver(@Param("critere") String critere);


    @Query("select p from Produit p where p.id=:x")
    Produit findById(@Param("x") long x);

    //selection du nombre total des produits par localisation
    @Query("select count(p) from Produit p where p.localisation.libelle=:x")
    long getProduitNumberByLocalisation(@Param("x") String localisation);

    @Query("select count(p) from Produit p")
    long getCountProduits();

    //suppression de toutes les lignes
    @Query(value = "delete from produit ",nativeQuery = true)
    void deleteAll();

}
