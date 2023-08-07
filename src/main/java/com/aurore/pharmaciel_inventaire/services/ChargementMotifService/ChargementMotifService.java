package com.aurore.pharmaciel_inventaire.services.ChargementMotifService;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Motif;
import com.aurore.pharmaciel_inventaire.repositories.MotifRepository;
import com.aurore.pharmaciel_inventaire.services.ChargementProduitServices.ProduitExcelUpload;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChargementMotifService {

    private MotifRepository motifRepository;

    public void saveMotifsToDatabase(MultipartFile file){
        if(ProduitExcelUpload.isValidExcelFile(file)){
            try {
                List<Motif> motifs = MotifExcelUpload.getMotifDataFromExcel(file.getInputStream());
                motifRepository.saveAll(motifs);
                //this.customerRepository.saveAll(produits);
            } catch (IOException e) {
                throw new IllegalArgumentException("Le fichier rattacher n'est pas un fichier excel");
            }
        }
    }

    public List<Motif> getMotifs(){
        return motifRepository.findAll();
    }

}
