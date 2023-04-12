package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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
    @PostMapping(value = "/realSave/{id_stockproduit}/{id_participer}/{id_fournisseur}/{qteCompte}/{datePeremption}/{prixVente}")
    public Traitement saveLeTraitement(@PathVariable long id_stockproduit, @PathVariable long id_participer,@PathVariable long id_fournisseur,@PathVariable double qteCompte, @PathVariable Date datePeremption,@PathVariable double prixVente){
        return traitementService.saveLeTraitement(id_stockproduit,id_participer, id_fournisseur,qteCompte,datePeremption,prixVente);
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

    //sauvegarde du motif d'un traitement
    @PutMapping(value = "/saveMotif/{id}/{motif}")
    Traitement saveMotif(@PathVariable long id, @PathVariable String motif){
        return traitementService.saveTraitementMotif(id,motif);
    }

}
