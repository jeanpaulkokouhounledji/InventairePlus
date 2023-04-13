package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockProduitRepository extends JpaRepository<StockProduit,Long> {

    @Query("select p from StockProduit p where p.codeUnique like %:critere% or p.produit.codeProduit like %:critere%")
    StockProduit stockProduitTrouver(@Param("critere") String critere);


    @Query("select p from StockProduit p where p.codeUnique=:x")
    StockProduit findById(@Param("x") long x);

}
