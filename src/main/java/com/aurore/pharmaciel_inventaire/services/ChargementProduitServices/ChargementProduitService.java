package com.aurore.pharmaciel_inventaire.services.ChargementProduitServices;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.repositories.LocalisationRepository;
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
    private LocalisationRepository localisationRepository;

    public void saveProduitsToDatabase(MultipartFile file){
        if(ProduitExcelUpload.isValidExcelFile(file)){
            try {
                List<Produit> produits = ProduitExcelUpload.getProduitDataFromExcel(file.getInputStream(),produitRepository,localisationRepository);
                produitRepository.saveAll(produits);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Ce fichier n'est pas un fichier Excel valid");
            }
        }
    }

    public List<Produit> getProduits(){
        return produitRepository.findAll();
    }

}
