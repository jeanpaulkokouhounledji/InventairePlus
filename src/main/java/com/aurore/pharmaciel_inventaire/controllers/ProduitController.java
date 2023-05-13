package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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

    //liste des produits
    @GetMapping(value = "/list")
    public List<Produit> listProduit(){
        return produitService.produitsLists();
    }

}
