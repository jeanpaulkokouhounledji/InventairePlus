package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping(value = "/list")
    public List<StockProduit> listStockProduit(){
        return stockProduitService.stockProduitList();
    }

}
