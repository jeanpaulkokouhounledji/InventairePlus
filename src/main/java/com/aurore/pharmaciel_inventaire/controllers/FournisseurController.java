package com.aurore.pharmaciel_inventaire.controllers;


import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.services.FournisseurService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"fournisseur")
public class FournisseurController{

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    //liste des fournisseurs
    @GetMapping(value = "/list")
    public List<Fournisseur> listFournisseur(){
        return fournisseurService.listFournisseur();
    }

}
