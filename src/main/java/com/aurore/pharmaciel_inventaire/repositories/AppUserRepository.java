package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    //authentification d'un utilisateur actif
    @Query("select u from AppUser u where u.etat=true and u.username=:x")
    AppUser findByUsername(@Param("x") String username);

    //sélection de tous les utilisateurs actifs
    @Query("select u from AppUser u where u.etat=true order by u.nomPrenom asc")
    List<AppUser> findAllActif();

    //redefinition de la requete de liste
    @Query("select u from AppUser u where u.username<>'administrator' order by u.id desc")
    List<AppUser> findAll();
}