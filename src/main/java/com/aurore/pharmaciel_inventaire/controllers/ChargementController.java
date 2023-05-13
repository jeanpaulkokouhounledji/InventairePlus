package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.services.ChargementFournisseurServices.ChargementFournisseurService;
import com.aurore.pharmaciel_inventaire.services.ChargementLocalisationsServices.ChargementLocalisationService;
import com.aurore.pharmaciel_inventaire.services.ChargementProduitServices.ChargementProduitService;
import com.aurore.pharmaciel_inventaire.services.ChargementProduitstockServices.ChargementProduitStockService;
import com.aurore.pharmaciel_inventaire.services.ProduitService;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.*;
import java.util.Map;

@RestController
@RequestMapping(value = "chargement")
public class ChargementController {

    @Value("${modelsDir}")
    private String directory;
    private final JdbcTemplate jdbcTemplate;

    private final SessionFactory sessionFactory;

    private final ProduitService produitService;

    private final ChargementProduitService chargementProduitService;

    private final ChargementLocalisationService chargementLocalisationService;

    private final ChargementFournisseurService chargementFournisseurService;

    private final ChargementProduitStockService chargementProduitStockService;

    public ChargementController(JdbcTemplate jdbcTemplate, SessionFactory sessionFactory, ProduitService produitService, ChargementProduitService chargementProduitService, ChargementLocalisationService chargementLocalisationService, ChargementFournisseurService chargementFournisseurService, ChargementProduitStockService chargementProduitStockService) {
        this.jdbcTemplate = jdbcTemplate;
        this.sessionFactory = sessionFactory;
        this.produitService = produitService;
        this.chargementProduitService = chargementProduitService;
        this.chargementLocalisationService = chargementLocalisationService;
        this.chargementFournisseurService = chargementFournisseurService;
        this.chargementProduitStockService = chargementProduitStockService;
    }

    //téléchargement du model de produits
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(value = "inventaire/model/model_des_produits")
    protected void downloadProduitsModel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

            response.setContentType("text/plain");

            response.setHeader("Content-disposition","attachment; filename=produit_model_pour_import_ip.xlsx"); // Used to name the download file and its format

            File produitModel = new File(this.directory+"produit_model_pour_import_ip.xlsx"); // Téléchargement
            OutputStream out = response.getOutputStream();
            FileInputStream in = new FileInputStream(produitModel);
            byte[] buffer = new byte[4096];
            int length;
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }
            in.close();
            out.flush();
        }

    //téléchargement du model des produits en stock
    @GetMapping(value = "inventaire/model/model_des_produits_en_stock")
    protected void downloadProduitStockModel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

            response.setContentType("text/plain");

            response.setHeader("Content-disposition","attachment; filename=stockProduit_model_pour_import_ip.xlsx"); // Used to name the download file and its format

            File produitModel = new File(this.directory+"stockProduit_model_pour_import_ip.xlsx"); // Téléchargement
            OutputStream out = response.getOutputStream();
            FileInputStream in = new FileInputStream(produitModel);
            byte[] buffer = new byte[4096];
            int length;
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }
            in.close();
            out.flush();
        }

    //téléchargement du model des fournisseurs
    @GetMapping(value = "inventaire/model/fournisseur_model_pour_import")
    protected void downloadFournisseurStockModel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

            response.setContentType("text/plain");

            response.setHeader("Content-disposition","attachment; filename=fournisseur_model_pour_import.xlsx"); // Used to name the download file and its format

            File produitModel = new File(this.directory+"fournisseur_model_pour_import.xlsx"); // Téléchargement
            OutputStream out = response.getOutputStream();
            FileInputStream in = new FileInputStream(produitModel);
            byte[] buffer = new byte[4096];
            int length;
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }
            in.close();
            out.flush();
        }

    //téléchargement du model des produits en stock
    @GetMapping(value = "inventaire/model/localisation_model_pour_import")
    protected void downloadLocalisationStockModel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

            response.setContentType("text/plain");

            response.setHeader("Content-disposition","attachment; filename=localisation_model_pour_import_ip.xlsx"); // Used to name the download file and its format

            File produitModel = new File(this.directory+"localisation_model_pour_import_ip.xlsx"); // Téléchargement
            OutputStream out = response.getOutputStream();
            FileInputStream in = new FileInputStream(produitModel);
            byte[] buffer = new byte[4096];
            int length;
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }
            in.close();
            out.flush();
        }



    //chargement des produits dans la base à partir de excel
    @PostMapping(value = "/chargement/produit")
    public ResponseEntity<?> uploadProduitsData(@RequestParam MultipartFile file){
        this.chargementProduitService.saveProduitsToDatabase(file);
        return ResponseEntity.ok(Map
                .of("Message", "Produits chargés"));
    }

    //chargement des localisations dans la base à partir de excel
    @PostMapping(value = "/chargement/localisation")
    public ResponseEntity<?> uploadLocalisationsData(@RequestParam MultipartFile file){
        this.chargementLocalisationService.saveLocalisationsToDatabase(file);
        return ResponseEntity.ok(Map
                .of("Message", "Localisations chargées"));
    }

    //chargement des fournisseurs dans la base à partir de excel
    @PostMapping(value = "/chargement/fournisseur")
    public ResponseEntity<?> uploadFournisseursData(@RequestParam MultipartFile file){
        this.chargementFournisseurService.saveFournisseursToDatabase(file);
        return ResponseEntity.ok(Map
                .of("Message", "Fournisseurs chargés"));
    }

    //chargement des fournisseurs dans la base à partir de excel
    @PostMapping(value = "/chargement/stockproduit")
    public ResponseEntity<?> uploadStockProduit(@RequestParam MultipartFile file){
        this.chargementProduitStockService.saveProduitStockToDatabase(file);
        return ResponseEntity.ok(Map
                .of("Message", "Produits chargés en stock"));
    }

}
