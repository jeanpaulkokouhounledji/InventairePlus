package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.*;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"ecartTraitement")
public class EcartController {

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    private double ecart = .0;

    public EcartController(TraitementRepository traitementRepository, ProduitRepository produitRepository) {
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
    }

    @PostMapping(value = "/save")
    public Traitement updateEcart(@RequestBody Traitement traitement){
        //difference des quantitées
        this.ecart = traitement.getQteDisponible() - traitement.getQteCompte();
        traitement.setEcart(ecart);
        //changement de la localisation du produit en stock
        Localisation localisation = traitement.getParticiper().getLocalisation();
        Produit produit = traitement.getStockProduit().getProduit();
        produit.setLocalisation(localisation);
        //mise à jour de la localisation du produit
        produitRepository.save(produit);
        return traitementRepository.save(traitement);
    }

    @GetMapping(value = "/ecarts/list")
    public List<Traitement> listEcarts(){
        return traitementRepository.listTraitementsAvecEcarts();
    }

}
