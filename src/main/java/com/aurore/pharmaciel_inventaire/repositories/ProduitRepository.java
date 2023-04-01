package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit,Long> {

    //produit par code ou par nom
    @Query("select p from Produit p where p.codeIp like %:critere% or p.libelle like %:critere%")
    Produit produitTrouver(@Param("critere") String critere);

    //reccuperation des produits comptés par rayon
    /*@Query("select p from Produit p where p.localisation=:code_rayon and p.etat=1")
    List<Produit> getCounted(@Param("code_rayon") String code_rayon);*/

}
