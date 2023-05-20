package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"ecartTraitement")
public class EcartController {

    private final TraitementRepository traitementRepository;

    private double ecart = .0;

    public EcartController(TraitementRepository traitementRepository) {
        this.traitementRepository = traitementRepository;
    }

    @PostMapping(value = "/save")
    public Traitement updateEcart(@RequestBody Traitement traitement){
        this.ecart = traitement.getQteDisponible() - traitement.getQteCompte();
        traitement.setEcart(ecart);
        return traitementRepository.save(traitement);
    }

}
