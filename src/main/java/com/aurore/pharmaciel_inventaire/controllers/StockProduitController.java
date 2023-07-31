package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"stockproduit")
public class StockProduitController {

    private final StockProduitService stockProduitService;

    public StockProduitController(StockProduitService stockProduitService) {
        this.stockProduitService = stockProduitService;
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

     @GetMapping(value = "/list")
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
                 collection.add(map);
         }

         return collection;
    }

}
