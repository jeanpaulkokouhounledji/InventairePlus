package com.aurore.pharmaciel_inventaire.services.ChargementProduitServices;

import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChargementProduitService {

    private ProduitRepository produitRepository;

    public void saveProduitsToDatabase(MultipartFile file){
        if(ProduitExcelUpload.isValidExcelFile(file)){
            try {
                List<Produit> produits = ProduitExcelUpload.getCustomersDataFromExcel(file.getInputStream());
                produitRepository.saveAll(produits);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Ce fichier n'est pas un fichier Excel valid");
            }
        }
    }

    public List<Produit> getCustomers(){
        return produitRepository.findAll();
    }

}
