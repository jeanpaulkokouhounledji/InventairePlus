package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProduitServiceImpl implements ProduitService {

    private final HttpServletRequest  httpServletRequest;
    private final ProduitRepository produitRepository;

    private final LogsRepository logsRepository;

    public ProduitServiceImpl(HttpServletRequest httpServletRequest, ProduitRepository produitRepository, LogsRepository logsRepository) {
        this.httpServletRequest = httpServletRequest;
        this.produitRepository = produitRepository;
        this.logsRepository = logsRepository;
    }


    @Override
    public Produit createProduit(Produit produit) {
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        Logs log = new Logs();
        log.setDescription("Création du produit " + " " + produit.getLibelle());
        log.setUser(securityContext.getAuthentication().getName());
        logsRepository.save(log);
        return produitRepository.save(produit);
    }

    @Override
    public Produit editProduit(Long id) {
        return null;
    }

    @Override
    public void deleteProduit(Long id) {

        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        Optional<Produit> produit = produitRepository.findById(id);

        Logs log = new Logs();
        log.setDescription("Suppression du produit " + " " + produit.get().getLibelle() + " " + "N°" + " " + produit.get().getId());
        log.setUser(securityContext.getAuthentication().getName());
        logsRepository.save(log);
    }

    @Override
    public void changeProduitState(Long id) {

    }

    @Override
    public List<Produit> produitsLists() {
        return produitRepository.findAll();
    }

    @Override
    public Produit produitTrouver(String critere) {
        return produitRepository.produitTrouver(critere);
    }


}
