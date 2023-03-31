package com.aurore.pharmaciel_inventaire.services;


import com.aurore.pharmaciel_inventaire.entities.AppRole;
import com.aurore.pharmaciel_inventaire.entities.AppUser;

import java.util.List;

public interface AccountService {

    //ajout d'un utilisateur
    AppUser addNewUser(AppUser appUser);

    //ajout d'un role
    AppRole addNewRole(AppRole appRole);

    //octroie d'un role a un utilisateur
    void addRoleToUser(String username, String roleName);


    AppUser findByUsernameToEdit(Long id);

    //charger l'utilisateur à partir de son nom d'utilisateur
    AppUser loadUserByUsername(String username);

    //liste des utilisateurs
    List<AppUser> listUsers();

    //liste des roles
    List<AppRole> listRoles();

    //selection des utilisateurs actifs
    List<AppUser> selectActifUsers();
}
