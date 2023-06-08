package com.aurore.pharmaciel_inventaire.services.GenererFichierImportService;

import com.aurore.pharmaciel_inventaire.entities.EtatInventaire;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class ExcelExportUtils {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<EtatInventaire> etatInventaireList;

    public ExcelExportUtils(List<EtatInventaire> etatInventaireList){
        this.etatInventaireList = etatInventaireList;
        workbook = new XSSFWorkbook();
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style){
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if(value instanceof Integer){
            cell.setCellValue((Integer) value);
        }else if(value instanceof Double){
            cell.setCellValue((Double) value);
        }else if(value instanceof Boolean){
            cell.setCellValue((Boolean) value);
        }else if(value instanceof Long){
            cell.setCellValue((Long) value);
        }else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void createHeaderRow(){
        sheet = workbook.createSheet("Etat Inventaire");
        Row row = sheet.createRow(0);
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(20.0);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        createCell(row,0,"Etat Inventaire",style);
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,14));
        font.setFontHeightInPoints((short) 10);
        row = sheet.createRow(1);
        font.setBold(true);
        font.setFontHeight(16.0);
        style.setFont(font);
        createCell(row,0,"Id",style);
        createCell(row,1,"localisation",style);
        createCell(row,2,"fournisseur",style);
        createCell(row,3,"codeCip",style);
        createCell(row,4,"libelle",style);
        createCell(row,5,"prixAchat",style);
        createCell(row,6,"prixVente",style);
        createCell(row,7,"datePeremption",style);
        createCell(row,8,"qte",style);
        createCell(row,9,"qteTotale",style);
        createCell(row,10,"qteDepot",style);
        createCell(row,11,"codeUtilisateur",style);
        createCell(row,12,"idProduit",style);
        createCell(row,13,"idLigne",style);
    }

    private void writeEtatInvaireData(){
        int rowCount = 2;
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14.0);
        style.setFont(font);

        for (EtatInventaire etatInventaire : etatInventaireList){
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;
            createCell(row,columnCount++,etatInventaire.getId(), style);
            createCell(row,columnCount++,etatInventaire.getLocalisation(), style);
            createCell(row,columnCount++,etatInventaire.getFournisseur(), style);
            createCell(row,columnCount++,etatInventaire.getCodeCip(), style);
            createCell(row,columnCount++,etatInventaire.getLibelle(), style);
            createCell(row,columnCount++,etatInventaire.getPrixAchat(), style);
            createCell(row,columnCount++,etatInventaire.getPrixVente(), style);
            createCell(row,columnCount++,etatInventaire.getDatePeremption(), style);
            createCell(row,columnCount++,etatInventaire.getQte(), style);
            createCell(row,columnCount++,etatInventaire.getQteTotale(), style);
            createCell(row,columnCount++,etatInventaire.getQteDepot(), style);
            createCell(row,columnCount++,etatInventaire.getCodeUtilisateur(), style);
            createCell(row,columnCount++,etatInventaire.getIdProduit(), style);
            createCell(row,columnCount++,etatInventaire.getIdLigne(), style);
        }
    }

    public void exportDataToExcel(HttpServletResponse response) throws IOException {
        createHeaderRow();
        writeEtatInvaireData();
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }

}
