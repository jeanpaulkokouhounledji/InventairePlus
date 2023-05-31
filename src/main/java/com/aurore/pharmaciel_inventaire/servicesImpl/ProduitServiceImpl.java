package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProduitServiceImpl implements ProduitService {

    //donnees de l'utilisateur connecté
    private Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    private final ProduitRepository produitRepository;

    private final LogsRepository logsRepository;

    public ProduitServiceImpl(ProduitRepository produitRepository, LogsRepository logsRepository) {
        this.produitRepository = produitRepository;
        this.logsRepository = logsRepository;
    }


    @Override
    public Produit createProduit(Produit produit) {
        Logs log = new Logs();
        log.setDescription("Création du produit " + " " + produit.getLibelle());
        log.setUser(auth.getName());
        logsRepository.save(log);
        return produitRepository.save(produit);
    }

    @Override
    public Produit editProduit(Long id) {
        return null;
    }

    @Override
    public void deleteProduit(Long id) {

        Optional<Produit> produit = produitRepository.findById(id);

        Logs log = new Logs();
        log.setDescription("Suppression du produit " + " " + produit.get().getLibelle() + " " + "N°" + " " + produit.get().getId());
        log.setUser(auth.getName());
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
