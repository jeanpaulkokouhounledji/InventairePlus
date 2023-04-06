package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"traitement")
public class TraitementController {

    private final TraitementService traitementService;

    private final ProduitService produitService;

    public TraitementController(TraitementService traitementService, ProduitService produitService) {
        this.traitementService = traitementService;
        this.produitService = produitService;
    }

    @PostMapping(value = "/save")
    public Traitement saveTraitement(@RequestBody Traitement traitement){
        return traitementService.saveTraitement(traitement);
    }

    //sauvegarde de tout le traitement
    @PostMapping(value = "/realSave")
    public Traitement saveLeTraitement(@RequestBody Traitement traitement, @PathVariable long produit_id, @PathVariable long participer_id){
        return traitementService.saveLeTraitement(traitement,produit_id,participer_id);
    }

    //supression d'un traitement
    @DeleteMapping(value = "/delete/{id}")
    public void deleteTraitement(@PathVariable long id){
        traitementService.deleteTraitement(id);
    }

    @GetMapping(value = "/edit/{id}")
    public Optional<Traitement> editTraitement(@PathVariable Long id){
        return traitementService.getForEdit(id);
    }

    //liste des traitements par rayon
    @GetMapping(value = "/list/{codeRayon}")
    List<Traitement> listTraitementsByRayon(@PathVariable String codeRayon){
        return traitementService.getTraitementByRayon(codeRayon);
    }

    //liste de tous les traitements
    @GetMapping(value = "/list")
    List<Traitement> listTraitements(){
        return traitementService.listTraitement();
    }



}
