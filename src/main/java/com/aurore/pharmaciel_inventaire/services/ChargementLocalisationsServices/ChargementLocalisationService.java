package com.aurore.pharmaciel_inventaire.services.ChargementLocalisationsServices;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.repositories.LocalisationRepository;
import com.aurore.pharmaciel_inventaire.services.ChargementProduitServices.ProduitExcelUpload;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChargementLocalisationService {

    private LocalisationRepository localisationRepository;

    public void saveLocalisationsToDatabase(MultipartFile file){
        if(ProduitExcelUpload.isValidExcelFile(file)){
            try {
                List<Localisation> localisations = LocalisationExcelUpload.getLocalisationDataFromExcel(file.getInputStream());
                localisationRepository.saveAll(localisations);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Le fichier rattacher n'est pas un fichier excel");
            }
        }
    }

    public List<Localisation> getFichiers(){
        return localisationRepository.findAll();
    }

}
