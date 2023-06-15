package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.repositories.FournisseurRepository;
import com.aurore.pharmaciel_inventaire.services.FournisseurService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurServiceImpl(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }


/*
    @Override
    public Fournisseur getFournisseurForEdit(Long id) {
        return fournisseurRepository.findById(id);
    }
*/

    @Override
    public List<Fournisseur> listFournisseur() {
        return fournisseurRepository.getListFOurnisseur();
    }

}
