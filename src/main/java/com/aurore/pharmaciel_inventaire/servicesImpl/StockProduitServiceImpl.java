package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.repositories.StockProduitRepository;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockProduitServiceImpl implements StockProduitService {

    private final StockProduitRepository stockProduitRepository;

    public StockProduitServiceImpl(StockProduitRepository stockProduitRepository) {
        this.stockProduitRepository = stockProduitRepository;
    }

    @Override
    public StockProduit createStockProduit(StockProduit stockProduit) {
        stockProduit.setEtat(false);
        return stockProduitRepository.save(stockProduit);
    }

    @Override
    public StockProduit editStockProduit(Long id) {
        return null;
    }

    @Override
    public void deleteStockProduit(Long id) {
    }

    @Override
    public void changeProduitStockState(Long id) {
    }

    @Override
    public List<StockProduit> stockProduitList() {
        return stockProduitRepository.findAll();
    }

    @Override
    public StockProduit stockProduitTrouver(String critere) {
        return stockProduitRepository.stockProduitTrouver(critere);
    }

}
