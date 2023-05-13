package com.aurore.pharmaciel_inventaire.services.ChargementFournisseurServices;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

public interface FournisseurExcelUpload {

    static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    }
    static List<Fournisseur> getFournisseurDataFromExcel(InputStream inputStream){
        List<Fournisseur> fournisseurs = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("fournisseur");
            int rowIndex =0;
            for (Row row : sheet){
                if (rowIndex ==0){
                    rowIndex++;
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;
                Fournisseur fournisseur = new Fournisseur();
                while (cellIterator.hasNext()){
                    Cell cell = cellIterator.next();
                    switch (cellIndex){
                        case 0 -> fournisseur.setId((long) cell.getNumericCellValue());
                        case 1 -> fournisseur.setCodeFournisseur(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        case 2 -> fournisseur.setRaisonSociale(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        default -> {
                        }
                    }
                    cellIndex++;
                }
              /*  System.out.println("=============================================================");
                System.out.println(fournisseur);
                System.out.println("=============================================================");*/
                fournisseurs.add(fournisseur);


            }
        } catch (IOException e) {
            e.getStackTrace();
        }
        return fournisseurs;
    }

}
