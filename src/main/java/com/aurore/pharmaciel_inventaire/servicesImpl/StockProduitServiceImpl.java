package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.repositories.StockProduitRepository;
import com.aurore.pharmaciel_inventaire.services.StockProduitService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Service
@Transactional
public class StockProduitServiceImpl implements StockProduitService {


    private final StockProduitRepository stockProduitRepository;

    private final HttpServletRequest httpServletRequest;

    private final LogsRepository logsRepository;

    public StockProduitServiceImpl(StockProduitRepository stockProduitRepository, HttpServletRequest httpServletRequest, LogsRepository logsRepository) {
        this.stockProduitRepository = stockProduitRepository;
        this.httpServletRequest = httpServletRequest;
        this.logsRepository = logsRepository;
    }

    @Override
    public StockProduit createStockProduit(StockProduit stockProduit) {
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
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
    public StockProduit findStockProduitByCodeUnique(String codeUnique) {
        return stockProduitRepository.findStockProduitByCodeUnique(codeUnique);
    }

    @Override
    public void deleteStockProduit(Long id) {

        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        String codeUnique = stockProduitRepository.findById(id).get().getCodeUnique().toString();

        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
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
