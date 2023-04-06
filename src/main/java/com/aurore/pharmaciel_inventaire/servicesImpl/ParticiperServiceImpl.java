package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.AppUser;
import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.repositories.AppUserRepository;
import com.aurore.pharmaciel_inventaire.repositories.InventaireRepository;
import com.aurore.pharmaciel_inventaire.repositories.LocalisationRepository;
import com.aurore.pharmaciel_inventaire.repositories.ParticiperRepository;
import com.aurore.pharmaciel_inventaire.services.ParticiperService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParticiperServiceImpl implements ParticiperService {

    private final ParticiperRepository participerRepository;

    private final AppUserRepository appUserRepository;

    private final InventaireRepository inventaireRepository;

    private final LocalisationRepository localisationRepository;

    public ParticiperServiceImpl(ParticiperRepository participerRepository, AppUserRepository appUserRepository, InventaireRepository inventaireRepository, LocalisationRepository localisationRepository) {
        this.participerRepository = participerRepository;
        this.appUserRepository = appUserRepository;
        this.inventaireRepository = inventaireRepository;
        this.localisationRepository = localisationRepository;
    }


    @Override
    public Participer createParticiper(Long user_id, Long inventaire_id, Long localisation_id) {
        Participer participer = new Participer();
        //reccupération des differentes entités

        //utilisateur
        Optional<AppUser> appUser = appUserRepository.findById(user_id);
        //inventaire
        Optional<Inventaire> inventaire = inventaireRepository.findById(inventaire_id);
        //Localisation
        Optional<Localisation> localisation = localisationRepository.findById(localisation_id);

        participer.setAppUser(appUser.get());
        participer.setInventaire(inventaire.get());
        participer.setLocalisation(localisation.get());
        participerRepository.save(participer);
        return participer;
    }

    @Override
    public Participer editParticiper(Long id) {
        Optional<Participer> participer = participerRepository.findById(id);
        participer.isPresent();
        return participer.get();
    }

    @Override
    public void deleteParticiper(Long id) {
        participerRepository.deleteById(id);
    }

    @Override
    public List<Participer> allParticipations() {
        return participerRepository.findAll();
    }

    @Override
    public String getInventaireForUser(String username) {
        return participerRepository.findInventaireParticiper(username);
    }


    @Override
    public List<Localisation> localisationByUser(String username) {
        return participerRepository.findUserLocalisations(username);
    }


}
