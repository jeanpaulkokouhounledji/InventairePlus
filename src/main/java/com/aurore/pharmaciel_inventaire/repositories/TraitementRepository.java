package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TraitementRepository extends JpaRepository<Traitement,Long>{

  /*  @Query("select t from Traitement t where t.qteCompte<>t.qteDisponible" +
            " or t.prixVente<>t.stockProduit.prixVente " +
            "or t.datePeremption<>t.stockProduit.datePeremption " +
            "or t.fournisseur.codeFournisseur<>t.stockProduit.fournisseur.codeFournisseur " +
            "or t.participer.localisation.id<>t.stockProduit.produit.idLocalisation") */
    @Query("select t from Traitement t where (t.qteCompte<>t.qteDisponible " +
            "or t.prixVente<>t.stockProduit.prixVente " +
            "or t.datePeremption<>t.stockProduit.datePeremption " +
            "or t.fournisseur.codeFournisseur<>t.stockProduit.fournisseur.codeFournisseur " +
            "or t.participer.localisation.id<>t.stockProduit.produit.localisation.id) and t.leMotif=null or t.leMotif=''")
    List<Traitement> listTraitementsAvecEcarts();

    //selection des lignes de traitements d'une localisation d'un inventaire
    @Query("select t from Traitement t where t.participer.inventaire.numero=:codeInventaire and t.participer.localisation.code=:codeRayon")
    List<Traitement> listByRayonOfInventaire(@Param("codeInventaire") String codeInventaire, @Param("codeRayon") String codeRayon);

    //liste des donnees de traitements
    @Query("select t from Traitement t order by t.id desc")
    List<Traitement> listeDesTraitements();

    //suppression du traitement correspondant à la participation
    @Query("delete Traitement t where t.participer.id=:x")
    void deleteTraitementByParticiperId(@Param("x") long x);

}
