package com.aurore.pharmaciel_inventaire.services.ChargementProduitstockServices;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.repositories.FournisseurRepository;
import com.aurore.pharmaciel_inventaire.repositories.InventaireRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.repositories.StockProduitRepository;
import com.aurore.pharmaciel_inventaire.services.ChargementProduitServices.ProduitExcelUpload;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChargementProduitStockService {

    private StockProduitRepository stockProduitRepository;

    private ProduitRepository  produitRepository;

    private InventaireRepository inventaireRepository;

    private FournisseurRepository fournisseurRepository;

    public void saveProduitStockToDatabase(MultipartFile file){
        if(ProduitExcelUpload.isValidExcelFile(file)){
            try {
                List<StockProduit> stockProduits = ProduitStockUpload.getProduitStockDataFromExcel(file.getInputStream(),produitRepository,inventaireRepository,fournisseurRepository);
                stockProduitRepository.saveAll(stockProduits);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Ce fichier n'est pas un fichier Excel valid");
            }
        }
    }

}
