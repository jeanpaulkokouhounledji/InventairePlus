package com.aurore.pharmaciel_inventaire.services;


import com.aurore.pharmaciel_inventaire.entities.Produit;

import java.util.List;

public interface ProduitService {

    Produit createProduit(Produit produit);

    Produit editProduit(Long id);

    void deleteProduit(Long id);

    void changeProduitState(Long id);

    List<Produit> produitsLists();

    //Produit rechercher par code ou nom pour comptage
    Produit produitTrouver(String codeRayon,String critere);

    //selection des produit comptés pour un rayon
    List<Produit> getProduitsInventories(String rayon);
}
