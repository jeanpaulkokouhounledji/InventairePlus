package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.TypeUtilisateur;
import com.aurore.pharmaciel_inventaire.repositories.TypeUtilisateurRepository;
import com.aurore.pharmaciel_inventaire.services.TypeUtilisateurService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TypeUtilisateurServiceImpl implements TypeUtilisateurService {

    private final TypeUtilisateurRepository typeUtilisateurRepository;

    public TypeUtilisateurServiceImpl(TypeUtilisateurRepository typeUtilisateurRepository) {
        this.typeUtilisateurRepository = typeUtilisateurRepository;
    }


    @Override
    public List<TypeUtilisateur> getTypesUtilisateur() {
        return typeUtilisateurRepository.findAll();
    }
}
