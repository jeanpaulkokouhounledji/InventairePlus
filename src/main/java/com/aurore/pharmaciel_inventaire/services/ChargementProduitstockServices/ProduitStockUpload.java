package com.aurore.pharmaciel_inventaire.services.ChargementProduitstockServices;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.repositories.FournisseurRepository;
import com.aurore.pharmaciel_inventaire.repositories.InventaireRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.function.Function;

public class ProduitStockUpload {

    static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    }

    static List<StockProduit> getProduitStockDataFromExcel(InputStream inputStream, ProduitRepository produitRepository, InventaireRepository inventaireRepository,FournisseurRepository fournisseurRepository){


        List<StockProduit> stockProduits = new ArrayList<>();

        try {

            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("stock_produit");
            int rowIndex =0;
            for (Row row : sheet){
                if (rowIndex ==0){
                    rowIndex++;
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;
                StockProduit stockProduit = new StockProduit();
                while (cellIterator.hasNext()){
                    Cell cell = cellIterator.next();
                    switch (cellIndex){
                        case 0 -> stockProduit.setId((long) cell.getNumericCellValue());
                        case 1 -> stockProduit.setCodeUnique(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 2 -> stockProduit.setDatePeremption(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 3 -> stockProduit.setEtat(false);
                        case 4 -> stockProduit.setIdDepot((long) cell.getNumericCellValue());
                        case 5 -> stockProduit.setLot(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 6 -> stockProduit.setPrixAchat(Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue())));
                        case 7 -> stockProduit.setPrixVente(Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue())));
                        case 8 -> stockProduit.setQuantite(Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue())));
                        case 9 -> {
                            assert false;
                            stockProduit.setProduit(produitRepository.findById((long) Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()))));
                        }
                        case 10 -> {
                            assert false;
                            stockProduit.setFournisseur(fournisseurRepository.findById((long) Double.parseDouble(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()))));
                        }

                        default -> {
                        }
                    }
                    cellIndex++;
                }
               /* System.out.println("=============================================================");
                System.out.println(produit);
                System.out.println("=============================================================");*/
                stockProduits.add(stockProduit);

            }
        } catch (IOException e) {
            e.getStackTrace();
        }
        return stockProduits;
    }

}
