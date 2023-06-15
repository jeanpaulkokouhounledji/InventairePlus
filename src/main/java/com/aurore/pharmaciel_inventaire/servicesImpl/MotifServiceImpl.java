package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Motif;
import com.aurore.pharmaciel_inventaire.repositories.MotifRepository;
import com.aurore.pharmaciel_inventaire.services.MotifService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MotifServiceImpl implements MotifService {

    private final MotifRepository motifRepository;

    public MotifServiceImpl(MotifRepository motifRepository) {
        this.motifRepository = motifRepository;
    }

    @Override
    public List<Motif> listMotifs() {
        return motifRepository.findAll();
    }
}
