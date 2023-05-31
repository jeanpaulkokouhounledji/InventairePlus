package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.*;
import com.aurore.pharmaciel_inventaire.repositories.*;
import com.aurore.pharmaciel_inventaire.services.ParticiperService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParticiperServiceImpl implements ParticiperService {

    //donnees de l'utilisateur connecté
    private Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    private final ParticiperRepository participerRepository;

    private final AppUserRepository appUserRepository;

    private final InventaireRepository inventaireRepository;

    private final LocalisationRepository localisationRepository;

    private final LogsRepository logsRepository;

    private final TraitementRepository traitementRepository;

    public ParticiperServiceImpl(ParticiperRepository participerRepository, AppUserRepository appUserRepository, InventaireRepository inventaireRepository, LocalisationRepository localisationRepository, LogsRepository logsRepository, TraitementRepository traitementRepository) {
        this.participerRepository = participerRepository;
        this.appUserRepository = appUserRepository;
        this.inventaireRepository = inventaireRepository;
        this.localisationRepository = localisationRepository;
        this.logsRepository = logsRepository;
        this.traitementRepository = traitementRepository;
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

        //enrégistrement des logs
        Logs log = new Logs();
        log.setDescription("Paramétrage de l'inventaire" + " " + inventaire.get().getNumero() + " " + "pour" + appUser.get().getNomPrenom() + " " + "Sur le rayon" + " " + localisation.get().getLibelle() );
        log.setUser(auth.getName());
        logsRepository.save(log);

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
        Logs log = new Logs();

        //reccuperation du nom de l'agent
        String nomAgent = participerRepository.findById(id).get().getAppUser().getNomPrenom().toString();

        try {
            //traitementRepository.deleteTraitementByParticiperId(id);
            log.setDescription("Suppression de la ligne de parametrage N°" + " " + id + " " + nomAgent);
            log.setUser(auth.getName());
            logsRepository.save(log);
            participerRepository.deleteById(id);
        }catch (Exception e){
            log.setDescription("Echec de suppression du paramétrage N°" + " " + id + " " + nomAgent);
            log.setUser(auth.getName());
            logsRepository.save(log);
        }

    }

    @Override
    public List<Participer> allParticipations() {
        return participerRepository.findAll();
    }

    @Override
    public Inventaire getInventaireForUser(String username) {
        return participerRepository.findInventaireParticiper(username);
    }


    @Override
    public List<Participer> localisationByUser(String username) {
        return participerRepository.findUserLocalisations(username);
    }

    @Override
    public List<Localisation> localisationByInventaire(String codeInventaire) {
        return participerRepository.localisationByInventaire(codeInventaire);
    }


}
