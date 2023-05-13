package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class ProduitServiceImpl implements ProduitService {

    private final ProduitRepository produitRepository;


    public ProduitServiceImpl(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }


    @Override
    public Produit createProduit(Produit produit) {
        //produit.setEtat(1);
        return produitRepository.save(produit);
    }

    @Override
    public Produit editProduit(Long id) {
        return null;
    }

    @Override
    public void deleteProduit(Long id) {

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
