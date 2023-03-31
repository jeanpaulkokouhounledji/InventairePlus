package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.repositories.LocalisationRepository;
import com.aurore.pharmaciel_inventaire.services.LocalisationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LocalisationServiceImpl implements LocalisationService {

    private final LocalisationRepository localisationRepository;

    public LocalisationServiceImpl(LocalisationRepository localisationRepository) {
        this.localisationRepository = localisationRepository;
    }

    @Override
    public List<Localisation> listLocalisations() {
        return localisationRepository.findAll();
    }
}
