package com.aurore.pharmaciel_inventaire.controllers;


import com.aurore.pharmaciel_inventaire.entities.TypeUtilisateur;

import com.aurore.pharmaciel_inventaire.services.TypeUtilisateurService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"typeUtilisateur")
public class TypeUtilisateurController {

   private final TypeUtilisateurService typeUtilisateurService;

    public TypeUtilisateurController(TypeUtilisateurService typeUtilisateurService) {
        this.typeUtilisateurService = typeUtilisateurService;
    }

    @GetMapping(value = "/list")
    List<TypeUtilisateur> getTypeUtilisateurs(){
        return typeUtilisateurService.getTypesUtilisateur();
    }
}
