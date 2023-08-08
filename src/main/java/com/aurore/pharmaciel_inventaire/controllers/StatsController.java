package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.services.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping(value = "/count/produitsByLocalisation/{localisation}")
    public long countProduitParLocalisationCompte(@PathVariable String localisation){
        return statsService.countProduitParLocalisationCompte(localisation);
    }

    @GetMapping(value = "/count/produitCompte/parLocalisation/{localisation}")
    public long countProduitCompte(@PathVariable String localisation){
        return statsService.countProduitCompte(localisation);
    }

    @GetMapping(value = "all/localisations/traitement")
    public List<String> listDesLocalisationsComptés(){
        return statsService.listDesLocalisationsComptés();
    }
}
