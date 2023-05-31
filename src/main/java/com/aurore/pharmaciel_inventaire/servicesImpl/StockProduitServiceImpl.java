package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.repositories.StockProduitRepository;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockProduitServiceImpl implements StockProduitService {

    //récupération des données d'authentification
    private Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    private final StockProduitRepository stockProduitRepository;

    private final LogsRepository logsRepository;

    public StockProduitServiceImpl(StockProduitRepository stockProduitRepository, LogsRepository logsRepository) {
        this.stockProduitRepository = stockProduitRepository;
        this.logsRepository = logsRepository;
    }

    @Override
    public StockProduit createStockProduit(StockProduit stockProduit) {
        Logs log = new Logs();
        log.setUser(auth.getName());
        log.setDescription("Création de la ligne de stock" + " " + stockProduit.getCodeUnique());
        logsRepository.save(log);
        stockProduit.setEtat(false);
        return stockProduitRepository.save(stockProduit);
    }

    @Override
    public StockProduit editStockProduit(Long id) {
        return null;
    }

    @Override
    public void deleteStockProduit(Long id) {

        String codeUnique = stockProduitRepository.findById(id).get().getCodeUnique().toString();

        Logs log = new Logs();
        log.setUser(auth.getName());
        log.setDescription("Création de la ligne de stock au code unique" + " " + codeUnique);
        logsRepository.save(log);
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
