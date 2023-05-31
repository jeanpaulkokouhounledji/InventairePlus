package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.AppRole;
import com.aurore.pharmaciel_inventaire.entities.AppUser;
import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.repositories.AppRoleRepository;
import com.aurore.pharmaciel_inventaire.repositories.AppUserRepository;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.services.AccountService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    //donnees de l'utilisateur connecté
    private Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;

    private final LogsRepository logsRepository;

    public AccountServiceImpl(AppUserRepository appUserRepository, AppRoleRepository appRoleRepository, PasswordEncoder passwordEncoder, LogsRepository logsRepository) {
        this.appUserRepository = appUserRepository;
        this.appRoleRepository = appRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.logsRepository = logsRepository;
    }

    @Override
    public AppUser addNewUser(AppUser appUser) {
        String pw = appUser.getPassword();
        Logs log = new Logs();
        log.setDescription("Création de l'utilisateur "+appUser.getNomPrenom());
        log.setUser(auth.getName());
        logsRepository.save(log);
        appUser.setPassword(passwordEncoder.encode(pw));
        return appUserRepository.save(appUser);
    }

    @Override
    public AppRole addNewRole(AppRole appRole) {
        Logs log = new Logs();
        log.setDescription("Création du role "+ appRole.getDefinition());
        log.setUser(auth.getName());
        logsRepository.save(log);
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        Logs log = new Logs();
        log.setDescription("Attribution du rôle"+ " " + roleName + "à" + " " + username );
        log.setUser(auth.getName());
        logsRepository.save(log);
        appUser.getAppRoles().add(appRole);
    }

    @Override
    public AppUser changeStatus(Long id) {
        Optional<AppUser> user = appUserRepository.findById(id);
        Logs log = new Logs();
        if(user.get().isEtat()){
            user.get().setEtat(false);
            log.setDescription("Désactivation du compte de "+user.get().getNomPrenom());
            log.setUser(auth.getName());
            logsRepository.save(log);
        }else {
            user.get().setEtat(true);
            log.setDescription("Activation du compte de "+user.get().getNomPrenom());
            log.setUser(auth.getName());
            logsRepository.save(log);
        }
        return appUserRepository.save(user.get());
    }

    @Override
    public AppUser findByUsernameToEdit(Long id) {
        Optional<AppUser> appUser = appUserRepository.findById(id);
        return appUser.get();
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> listUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public List<AppRole> listRoles() {
        return appRoleRepository.findAll();
    }

    @Override
    public List<AppUser> selectActifUsers() {
        return appUserRepository.findAllActif();
    }

}
