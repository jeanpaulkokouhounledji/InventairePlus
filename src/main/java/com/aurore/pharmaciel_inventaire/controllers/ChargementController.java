package com.aurore.pharmaciel_inventaire.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = "chargement")
public class ChargementController {

    @Value("${modelsDir}")
    private String directory;

    //téléchargement du model de produits
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

}
