package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.StockProduitRepository;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"stockproduit")
public class StockProduitController {

    private final StockProduitService stockProduitService;

    private final StockProduitRepository stockProduitRepository;

    private final TraitementRepository traitementRepository;

    private final TraitementService traitementService;

    public StockProduitController(StockProduitService stockProduitService, StockProduitRepository stockProduitRepository, TraitementRepository traitementRepository, TraitementService traitementService) {
        this.stockProduitService = stockProduitService;
        this.stockProduitRepository = stockProduitRepository;
        this.traitementRepository = traitementRepository;
        this.traitementService = traitementService;
    }

    //enregistrement d'un stock modifier
    @PostMapping(value = "/save")
    public StockProduit saveStockProduit(@RequestBody StockProduit stockProduit){
        return stockProduitService.createStockProduit(stockProduit);
    }

    //recherche de stock par localisation et critere
    @GetMapping(value = "/recherche/{critere}")
    public StockProduit stockProduitTrouve(@PathVariable String critere){
        return stockProduitService.stockProduitTrouver(critere);
    }

    //liste des produits
   /* @GetMapping(value = "/list")
    public List<StockProduit> listStockProduit(){
        return stockProduitService.stockProduitList();
    }*/

    //liste des produits pour le comptage
    @GetMapping(value = "/list/{idLocalisation}/{idParticiper}")
    public Collection listStockProduit(@PathVariable Long idLocalisation,@PathVariable Long idParticiper){
        List<StockProduit> stockProduits = stockProduitRepository.findAllStock(idLocalisation,idParticiper);
        Vector collection = new Vector();

        final String format = "yyyy-MM-dd";
        SimpleDateFormat sdf = new SimpleDateFormat(format);


        for (StockProduit pr : stockProduits) {

            Date date = new Date(pr.getDatePeremption());

            HashMap<String, Object> map = new HashMap<>();
            map.put("id",pr.getId());
            map.put("codeCip",pr.getProduit().getCodeProduit());
            map.put("idFournisseur",pr.getFournisseur().getId());
            map.put("codeUnique",pr.getCodeUnique());
            map.put("produit",pr.getProduit().getLibelle());
            map.put("prixVente",pr.getPrixVente());
            map.put("prixAchat",pr.getPrixAchat());
            //donnees en stock
            map.put("prixVenteStock",pr.getPrixVente());
            map.put("fournisseurStock",pr.getFournisseur().getRaisonSociale());
            map.put("peremptionStock",sdf.format(date));
            map.put("qteStock",pr.getQuantite());
            map.put("qteCompteStock",pr.getQuantite());
            map.put("codeUnique",pr.getCodeUnique());
            map.put("idLocalisation", pr.getProduit().getLocalisation().getId());
            collection.add(map);

        }

        return collection;
    }
    /*@GetMapping(value = "/list")
    public Collection listStockProduit(){
         List<StockProduit> stockProduits = stockProduitService.stockProduitList();
         Vector collection = new Vector();

         final String format = "yyyy-MM-dd";
         SimpleDateFormat sdf = new SimpleDateFormat(format);


         for (StockProduit pr : stockProduits) {

            Date date = new Date(pr.getDatePeremption());

             HashMap<String, Object> map = new HashMap<>();
             map.put("id",pr.getId());
             map.put("codeCip",pr.getProduit().getCodeProduit());
             map.put("idFournisseur",pr.getFournisseur().getId());
             map.put("codeUnique",pr.getCodeUnique());
             map.put("produit",pr.getProduit().getLibelle());
             map.put("prixVente",pr.getPrixVente());
             map.put("prixAchat",pr.getPrixAchat());
             //donnees en stock
             map.put("prixVenteStock",pr.getPrixVente());
             map.put("fournisseurStock",pr.getFournisseur().getRaisonSociale());
             map.put("peremptionStock",sdf.format(date));
             map.put("qteStock",pr.getQuantite());
             map.put("qteCompteStock",pr.getQuantite());
             map.put("codeUnique",pr.getCodeUnique());
             map.put("idLocalisation", pr.getProduit().getLocalisation().getId());
             collection.add(map);

         }

         return collection;
    }*/
    @GetMapping(value = "/produit/douchette/{codeUnique}")
    public HashMap<String, Object> produitParCodeUnique(@PathVariable String codeUnique){

         StockProduit pr = stockProduitService.findStockProduitByCodeUnique(codeUnique);

             final String format = "yyyy-MM-dd";
             SimpleDateFormat sdf = new SimpleDateFormat(format);

             Date date = new Date(pr.getDatePeremption());

             HashMap<String, Object> map = new HashMap<>();
             map.put("id",pr.getId());
             map.put("codeCip",pr.getProduit().getCodeProduit());
             map.put("idFournisseur",pr.getFournisseur().getId());
             map.put("codeUnique",pr.getCodeUnique());
             map.put("produit",pr.getProduit().getLibelle());
             map.put("prixVente",pr.getPrixVente());
             map.put("prixAchat",pr.getPrixAchat());
             //donnees en stock
             map.put("prixVenteStock",pr.getPrixVente());
             map.put("fournisseurStock",pr.getFournisseur().getRaisonSociale());
             map.put("peremptionStock",sdf.format(date));
             map.put("qteStock",pr.getQuantite());
             map.put("qteCompteStock",pr.getQuantite());
             map.put("codeUnique",pr.getCodeUnique());

         return map;
    }

    @GetMapping(value = "/testList/{idLocalisation}/{idParticiper}")
    public List<StockProduit> testQuery(@PathVariable Long idLocalisation,@PathVariable Long idParticiper){
        return stockProduitRepository.findAllStock(idLocalisation,idParticiper);
    }

}
