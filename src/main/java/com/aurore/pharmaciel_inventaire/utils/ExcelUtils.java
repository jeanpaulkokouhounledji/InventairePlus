package com.aurore.pharmaciel_inventaire.utils;

import org.springframework.web.multipart.MultipartFile;

public class ExcelUtils {

    public static boolean isExcelFile(MultipartFile file) {
        return file.getOriginalFilename().endsWith(".xls") || file.getOriginalFilename().endsWith(".xlsx");
    }

   /* public static List<Import> parseExcelFile(MultipartFile file) throws IOException {
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0); // Assuming the first sheet is where the data is

        List<Import> imports = new ArrayList<>();
        for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Skip header row
            Row row = sheet.getRow(i);

            String nom = ExcelUtils.getCellStringValue(row,0);
            String prenom = ExcelUtils.getCellStringValue(row, 1);
            // Other data fields from Excel columns

            Import anImport = new Import(nom, prenom);
            // Set other fields in User object

            imports.add(anImport);
        }

        workbook.close();
        return imports;
    }

    public static String getCellStringValue(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell != null) {
            return cell.getStringCellValue();
        } else {
            return null;
        }
    }*/

}
