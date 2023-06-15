package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Motif;
import com.aurore.pharmaciel_inventaire.services.MotifService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"motif")
public class MotifController {

    private final MotifService motifService;

    public MotifController(MotifService motifService) {
        this.motifService = motifService;
    }

    //liste des motifs
    @GetMapping(value = "/list")
    public List<Motif> listProduit(){
        return motifService.listMotifs();
    }

}
