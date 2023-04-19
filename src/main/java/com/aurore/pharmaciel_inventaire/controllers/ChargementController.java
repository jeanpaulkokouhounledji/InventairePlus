package com.aurore.pharmaciel_inventaire.controllers;

import com.lowagie.text.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.*;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = "chargement")
public class ChargementController {

    @Value("${modelsDir}")
    private String directory;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

        //==================================================================================================
        //==================      Import des donnees dans les differentes tables            ================
        //==================================================================================================

    @PostMapping("/import")
    public String importData(@RequestParam("file") MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();

        // Use Apache POI to read data from Excel file
        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet

        // Prepare the SQL query for inserting data into MySQL database
        String sql = "INSERT INTO import (nom, prenom) VALUES (?, ?)";

        // Process each row and insert data into MySQL database
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = (Row) sheet.getRow(i);
            String col2Value = (String) row.getCell(0);
            String col3Value = (String) row.getCell(1);

            // Insert data into MySQL database using JDBC
            try {
                PreparedStatement preparedStatement = jdbcTemplate.getDataSource().getConnection().prepareStatement(sql);
                preparedStatement.setString(1, col2Value);
                preparedStatement.setString(2, col3Value);
                preparedStatement.executeUpdate();
                preparedStatement.close();
            } catch (SQLException e) {
                // Handle exception if necessary
                e.printStackTrace();
            }
        }

        workbook.close();
        inputStream.close();

        return "File imported successfully";
    }
}
