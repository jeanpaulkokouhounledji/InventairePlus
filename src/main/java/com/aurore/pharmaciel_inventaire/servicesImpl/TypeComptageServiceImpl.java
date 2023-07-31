package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.TypeComptage;
import com.aurore.pharmaciel_inventaire.repositories.TypeComptageRepository;
import com.aurore.pharmaciel_inventaire.services.TypeComptageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TypeComptageServiceImpl implements TypeComptageService {

    private final TypeComptageRepository typeComptageRepository;

    public TypeComptageServiceImpl(TypeComptageRepository typeComptageRepository) {
        this.typeComptageRepository = typeComptageRepository;
    }

    @Override
    public List<TypeComptage> getTypeComptageList() {
        return typeComptageRepository.findAll();
    }

}
