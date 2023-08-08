package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.services.EtatInventaireService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping( value = API_BASE_URL+"etat")
public class EtatInventaireController {

    private final EtatInventaireService etatInventaireService;

    public EtatInventaireController(EtatInventaireService etatInventaireService) {
        this.etatInventaireService = etatInventaireService;
    }

    //reccuperation des etats par inventaire et localisation
    @GetMapping(value = "/traitement/generate/etatInventaire/{codeInventaire}/{codeRayon}")
    public void exportToExcel(HttpServletResponse response, @PathVariable String codeInventaire, @PathVariable String codeRayon) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Customers_Information.xlsx";
        response.setHeader(headerKey, headerValue);
        etatInventaireService.exportEtatInventaireToExcel(response,codeInventaire,codeRayon);
    }

    @GetMapping(value = "/traitement/generate/etatInventaire/all")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Customers_Information.xlsx";
        response.setHeader(headerKey, headerValue);
        etatInventaireService.exportAllEtatInventaireToExcel(response);
    }
}
