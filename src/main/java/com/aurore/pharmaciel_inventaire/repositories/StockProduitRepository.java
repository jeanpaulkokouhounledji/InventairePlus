package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.Collection;
import java.util.List;

public interface StockProduitRepository extends JpaRepository<StockProduit,Long> {

    @Query("select p from StockProduit p where p.codeUnique like %:critere% or p.produit.codeProduit like %:critere%")
    StockProduit stockProduitTrouver(@Param("critere") String critere);


    @Query("select p from StockProduit p where p.codeUnique=:x")
    StockProduit findStockProduitByCodeUnique(@Param("x") String x);


    @Query("select st from StockProduit st where st.produit<>null and st.fournisseur<>null order by st.produit.libelle asc")
    List<StockProduit> findAll();
    //produits par localisation
  /*  @Query(

            value = "select st.code_unique as code,st.date_peremption  from stock_produit st",
            nativeQuery = true
    )*/
    @Query("select st from StockProduit st " +
            "where st.produit<>null and st.fournisseur<>null " +
            "and st.produit.localisation.id=:x " +
            "and st.produit not in (select t.stockProduit.produit from Traitement t where t.participer.id=:y) order by st.produit.libelle asc")
    List<StockProduit> findAllStock(@Param("x") Long x,@Param("y") Long y);

    @Query("select count(s) from StockProduit s")
    long getCountStockProduit();

}
