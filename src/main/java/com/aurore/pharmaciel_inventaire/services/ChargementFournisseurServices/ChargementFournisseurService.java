package com.aurore.pharmaciel_inventaire.services.ChargementFournisseurServices;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.repositories.FournisseurRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChargementFournisseurService {

    private FournisseurRepository fournisseurRepository;

    public void saveFournisseursToDatabase(MultipartFile file){
        if(FournisseurExcelUpload.isValidExcelFile(file)){
            try {
                List<Fournisseur> fournisseurs = FournisseurExcelUpload.getFournisseurDataFromExcel(file.getInputStream());
                fournisseurRepository.saveAll(fournisseurs);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Le fichier rattacher n'est pas un fichier excel");
            }
        }
    }

    public List<Fournisseur> getFichiers(){
        return fournisseurRepository.findAll();
    }
}
