package com.aurore.pharmaciel_inventaire.services.ChargementMotifService;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Motif;
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

public interface MotifExcelUpload {

    static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    }
    static List<Motif> getMotifDataFromExcel(InputStream inputStream){
        List<Motif> motifs = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("MOTIF");
            int rowIndex =0;
            for (Row row : sheet){
                if (rowIndex ==0){
                    rowIndex++;
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;
                Motif motif = new Motif();
                while (cellIterator.hasNext()){
                    Cell cell = cellIterator.next();
                    switch (cellIndex){
                        case 0 -> motif.setId((long) cell.getNumericCellValue());
                        case 1 -> {
                            assert false;
                            motif.setCode(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                            motif.setLibelle(cell.getCellType()== CellType.STRING? cell.getStringCellValue() : String.valueOf(cell.getNumericCellValue()));
                        }
                        default -> {
                        }
                    }
                    cellIndex++;
                }
               /* System.out.println("=============================================================");
                System.out.println(produit);
                System.out.println("=============================================================");*/
                motifs.add(motif);


            }
        } catch (IOException e) {
            e.getStackTrace();
        }
        return motifs;
    }
}
