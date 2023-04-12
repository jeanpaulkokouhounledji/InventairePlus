package com.aurore.pharmaciel_inventaire.services;

import com.aurore.pharmaciel_inventaire.entities.StockProduit;

import java.util.List;

public interface StockProduitService {

    StockProduit createStockProduit(StockProduit stockProduit);

    StockProduit editStockProduit(Long id);

    void deleteStockProduit(Long id);

    void changeProduitStockState(Long id);

    List<StockProduit> stockProduitList();

    StockProduit stockProduitTrouver(String critere);

}
