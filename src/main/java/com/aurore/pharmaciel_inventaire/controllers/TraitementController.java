package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import com.aurore.pharmaciel_inventaire.services.LocalisationService;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"traitement")
public class TraitementController {

    private final TraitementService traitementService;

    private final LocalisationService localisationService;

    private final StockProduitService stockProduitService;

    private final TraitementRepository traitementRepository;
    private final ProduitService produitService;

    public TraitementController(TraitementService traitementService, LocalisationService localisationService, StockProduitService stockProduitService, TraitementRepository traitementRepository, ProduitService produitService) {
        this.traitementService = traitementService;
        this.localisationService = localisationService;
        this.stockProduitService = stockProduitService;
        this.traitementRepository = traitementRepository;
        this.produitService = produitService;
    }


    //export des ecarts
    @GetMapping(value = "/traitement/export/ecarts/all")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Customers_Information.xlsx";
        response.setHeader(headerKey, headerValue);
        traitementService.exportEcartToExcel(response);
    }

    //export des ecarts
    @GetMapping(value = "/export/comptageencours/all")
    public void comptageEnCoursExcelExportUtils(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Customers_Information.xlsx";
        response.setHeader(headerKey, headerValue);
        traitementService.exportComptageEnCoursToExcel(response);
    }

    @PostMapping(value = "/save")
    public Traitement saveTraitement(@RequestBody Traitement traitement){
        return traitementService.saveTraitement(traitement);
    }

    //sauvegarde de tout le traitement
    @PostMapping(value = "/realSave/{id_stockproduit}/{id_participer}/{id_fournisseur}/{qteCompte}/{datePeremption}/{prixVente}")
    public Traitement saveLeTraitement(@PathVariable String id_stockproduit, @PathVariable long id_participer,@PathVariable String id_fournisseur,@PathVariable double qteCompte, @PathVariable String datePeremption,@PathVariable double prixVente) throws ParseException {
        return traitementService.saveLeTraitement(id_stockproduit,id_participer, id_fournisseur,qteCompte,datePeremption,prixVente);
    }
    @PostMapping(value = "/realSaveDouchette/{id_stockproduit}/{id_participer}/{id_fournisseur}/{qteCompte}/{datePeremption}/{prixVente}")
    public Traitement saveLeTraitementParDouchette(@PathVariable String id_stockproduit, @PathVariable long id_participer,@PathVariable String id_fournisseur,@PathVariable double qteCompte, @PathVariable String datePeremption,@PathVariable double prixVente) throws ParseException {
        //verification si déjà compté
        StockProduit stp = stockProduitService.findStockProduitByCodeUnique(id_stockproduit);
        Traitement t = traitementRepository.getTraitementByPstockBid(stp.getId());
        if(t != null){
            t.setQteCompte(t.getQteCompte() + 1);
           return traitementService.saveTraitement(t);
        }else {
            ++qteCompte;
            return traitementService.saveLeTraitement(id_stockproduit,id_participer, id_fournisseur,qteCompte,datePeremption,prixVente);
        }

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
