package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"produit")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    //enregistrement d'un produit modifier
    @PostMapping(value = "/save")
    public Produit saveProduit(@RequestBody Produit produit){
        return produitService.createProduit(produit);
    }

    //recherche de produit par localisation et critere
    @GetMapping(value = "/recherche/{critere}")
    public Produit produitTrouve(@PathVariable String critere){
        return produitService.produitTrouver(critere);
    }

    //listr des produit comptés pour un rayon
  /*  @GetMapping(value = "/checkedList/{rayon}")
    List<Produit> getCheckedProduct(@PathVariable String rayon){
        return produitService.getProduitsInventories(rayon);
    }*/


}
