package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.EtatInventaire;
import com.aurore.pharmaciel_inventaire.repositories.EtatInventaireRepository;
import com.aurore.pharmaciel_inventaire.services.EtatInventaireService;
import com.aurore.pharmaciel_inventaire.services.GenererFichierImportService.ExcelExportUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EtatInventaireServiceImpl implements EtatInventaireService {

    private final EtatInventaireRepository etatInventaireRepository;

    public EtatInventaireServiceImpl(EtatInventaireRepository etatInventaireRepository) {
        this.etatInventaireRepository = etatInventaireRepository;
    }

    @Override
    public List<EtatInventaire> exportEtatInventaireToExcel(HttpServletResponse response, String codeInventaire, String codeRayon) throws IOException {

        //exporte en fonction du rayon et de l'inventaire
        List<EtatInventaire> etatInventaires = etatInventaireRepository.etatPatRayonDinventaire(codeInventaire,codeRayon);
        ExcelExportUtils excelExportUtils = new ExcelExportUtils(etatInventaires);
        excelExportUtils.exportDataToExcel(response);
        return etatInventaires;
    }

    @Override
    public List<EtatInventaire> exportAllEtatInventaireToExcel(HttpServletResponse response) throws IOException {
        //exporte tous les produits sans specification du rayon ni de l'inventaire
        List<EtatInventaire> etatInventaires = etatInventaireRepository.findAll();
        ExcelExportUtils excelExportUtils = new ExcelExportUtils(etatInventaires);
        excelExportUtils.exportDataToExcel(response);
        return etatInventaires;
    }

    @Override
    public EtatInventaire createEtatInventaire(EtatInventaire etatInventaire) {
        return etatInventaireRepository.save(etatInventaire);
    }

    @Override
    public Optional<EtatInventaire> getEtatInventaire(Long id) {
        return etatInventaireRepository.findById(id);
    }

    @Override
    public List<EtatInventaire> getListEtatInventaire() {
        return etatInventaireRepository.findAll();
    }

    @Override
    public List<EtatInventaire> getEtatByInventaireAndRayon(String codeInventaire, String codeRayon) {
        return null;
    }
}
