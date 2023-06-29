package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.services.LocalisationService;
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

    private final LocalisationService localisationService;

    private final ProduitService produitService;

    public TraitementController(TraitementService traitementService, LocalisationService localisationService, ProduitService produitService) {
        this.traitementService = traitementService;
        this.localisationService = localisationService;
        this.produitService = produitService;
    }

    //generation d'un etat d'inventaire
    @GetMapping(value = "/generate/etatInventaire/{codeInventaire}/{codeRayon}")
    public void generateEtatInventaire(@PathVariable String codeInventaire,@PathVariable String codeRayon){
        traitementService.generateEtatInventaire(codeInventaire,codeRayon);
    }

    @PostMapping(value = "/save")
    public Traitement saveTraitement(@RequestBody Traitement traitement){
        return traitementService.saveTraitement(traitement);
    }

    //sauvegarde de tout le traitement
    @PostMapping(value = "/realSave/{id_stockproduit}/{id_participer}/{id_fournisseur}/{qteCompte}/{datePeremption}/{prixVente}")
    public Traitement saveLeTraitement(@PathVariable String id_stockproduit, @PathVariable long id_participer,@PathVariable long id_fournisseur,@PathVariable double qteCompte, @PathVariable Date datePeremption,@PathVariable double prixVente){
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

    //liste des localisations
    @GetMapping(value = "localisations")
    public List<Localisation> listLocalisations(){
        return localisationService.listLocalisations();
    }

}
