package com.aurore.pharmaciel_inventaire.services.GenererFichierImportService;


import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class EcartExcelExportUtils {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;

    private TraitementRepository traitementRepository;

    private List<Traitement> traitementsList;

    public EcartExcelExportUtils(List<Traitement> traitementsList){
        this.traitementsList = traitementsList;
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
        sheet = workbook.createSheet("Etat Ecart");

        Row row = sheet.createRow(0);
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(20.0);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        createCell(row,0,"Etat Ecart",style);
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,14));
        font.setFontHeightInPoints((short) 11);
        row = sheet.createRow(1);
        font.setBold(true);
        font.setFontHeight(16.0);
        style.setFont(font);
        createCell(row,0,"CODE CIP",style);
        createCell(row,1,"PRODUIT",style);
        createCell(row,2,"QUANTITE INVENTORIE",style);
        createCell(row,3,"QUANTITE STOCK",style);
        createCell(row,4,"PRIX VENTE INVENTORIE",style);
        createCell(row,5,"PRIX VENTE STOCK",style);
        createCell(row,6,"FOURNISSEUR INVENTORIE",style);
        createCell(row,7,"FOURNISSEUR STOCK",style);
        createCell(row,8,"LOCALISATION INVENTORIE",style);
        createCell(row,9,"LOCALISATION STOCK",style);
        createCell(row,10,"DATE PEREMPTION INVENTAIRE",style);
        createCell(row,11,"DATE PEREMPTION STOCK",style);
        createCell(row,12,"DATE COMPTAGE",style);
        createCell(row,13,"INVENTORISTE",style);
        createCell(row,14,"INVENTAIRE",style);

    }

    private void writeTraitementData(){
        int rowCount = 2;
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14.0);
        style.setFont(font);

        //formatage de la date
     /*   final String format = "yyyy-MM-dd";
        SimpleDateFormat sdf = new SimpleDateFormat(format);*/

        for (Traitement t : traitementsList){
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            //Date date = new Date(t.getDatePeremption());

            createCell(row,columnCount++,t.getCodeCip()==null?t.getStockProduit().getProduit().getCodeProduit():t.getCodeCip(),style);
            createCell(row,columnCount++,t.getLibelleProduit()!=null?t.getLibelleProduit():t.getStockProduit().getProduit().getLibelle(),style);
            createCell(row,columnCount++,t.getQteCompte(),style);
            createCell(row,columnCount++,t.getStockProduit().getQuantite(),style);
            createCell(row,columnCount++,t.getPrixVente(),style);
            createCell(row,columnCount++,t.getStockProduit().getPrixVente(),style);
            createCell(row,columnCount++,t.getFournisseur().getRaisonSociale(),style);
            createCell(row,columnCount++,t.getStockProduit().getFournisseur().getRaisonSociale(),style);
            createCell(row,columnCount++,t.getParticiper().getLocalisation().getLibelle(),style);
            createCell(row,columnCount++,t.getStockProduit().getProduit().getLibelle(),style);
            createCell(row,columnCount++,t.getDatePeremption(),style);
            createCell(row,columnCount++,t.getStockProduit().getDatePeremption(),style);
            createCell(row,columnCount++,t.getDatePeremption(),style);
            createCell(row,columnCount++,t.getParticiper().getAppUser().getNomPrenom(),style);
            createCell(row,columnCount++,t.getParticiper().getInventaire().getNumero(),style);

        }
    }

    public void exportDataToExcel(HttpServletResponse response) throws IOException {
        createHeaderRow();
        writeTraitementData();
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.createSheet("Liste des Ecarts");
        workbook.close();
        outputStream.close();
    }
}
