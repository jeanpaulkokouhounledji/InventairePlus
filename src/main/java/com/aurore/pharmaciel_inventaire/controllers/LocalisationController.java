package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.services.LocalisationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"localisation")
public class LocalisationController {

    private final LocalisationService localisationService;

    public LocalisationController(LocalisationService localisationService) {
        this.localisationService = localisationService;
    }

    //localisation par son id
    @GetMapping(value = "localisation/by/{id}")
    public Optional<Localisation> findLocalisationById(@PathVariable Long id){
        return localisationService.findLocalisationById(id);
    }

    //liste des rayons
    @GetMapping(value = "/list")
    public List<Localisation> listRayons(){
        return localisationService.listLocalisations();
    }
}
