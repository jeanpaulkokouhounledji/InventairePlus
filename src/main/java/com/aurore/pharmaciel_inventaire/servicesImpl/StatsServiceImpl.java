package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import com.aurore.pharmaciel_inventaire.services.StatsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StatsServiceImpl implements StatsService {

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    public StatsServiceImpl(TraitementRepository traitementRepository, ProduitRepository produitRepository) {
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
    }

    @Override
    public long countProduitParLocalisationCompte(String localisation) {
        return produitRepository.getProduitNumberByLocalisation(localisation);
    }

    @Override
    public long countProduitCompte(String localisation) {
        return traitementRepository.nbTraitementByLocalisation(localisation);
    }

    @Override
    public List<String> listDesLocalisationsComptés() {
        return traitementRepository.getCountedLocalisation();
    }
}
