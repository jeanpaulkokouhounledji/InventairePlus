package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.TypeComptage;
import com.aurore.pharmaciel_inventaire.services.TypeComptageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"typeComptage")
public class TypeComptageController {

    private final TypeComptageService typeComptageService;

    public TypeComptageController(TypeComptageService typeComptageService) {
        this.typeComptageService = typeComptageService;
    }

    @GetMapping(value = "/list")
    public List<TypeComptage> getListTypeComptage(){
        return typeComptageService.getTypeComptageList();
    }
}
