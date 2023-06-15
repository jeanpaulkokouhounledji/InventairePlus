package com.aurore.pharmaciel_inventaire.services.ChargementProduitServices;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.LocalisationRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public interface ProduitExcelUpload {


    public static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    }
    public static List<Produit> getCustomersDataFromExcel(InputStream inputStream, ProduitRepository produitRepository, LocalisationRepository localisationRepository){
        List<Produit> produits = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("PRODUITS");
            int rowIndex =0;
            for (Row row : sheet){
                if (rowIndex ==0){
                    rowIndex++;
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;
                Produit produit = new Produit();
                while (cellIterator.hasNext()){
                    Cell cell = cellIterator.next();
                    switch (cellIndex){
                        case 0 -> produit.setId((long) cell.getNumericCellValue());
                        case 1 -> produit.setCodeProduit(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 2 -> produit.setLibelle(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 3 -> produit.setDci(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 4 -> {
                            assert false;
                            produit.setLocalisation(localisationRepository.findById((long) Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()))));
                        }
                        case 5 -> produit.setIdForme(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 6 -> produit.setIdFamille(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        //case 6 -> produit.setIdLocalisation((long) cell.getNumericCellValue());
                        default -> {
                        }
                    }
                    cellIndex++;
                }
               /* System.out.println("=============================================================");
                System.out.println(produit);
                System.out.println("=============================================================");*/
                produits.add(produit);


            }
        } catch (IOException e) {
            e.getStackTrace();
        }
        return produits;
    }

}

