package com.aurore.pharmaciel_inventaire.repositories;

import com.aurore.pharmaciel_inventaire.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface AppRoleRepository extends JpaRepository<AppRole, Long> {

    //retrouve un role par sa designation
    AppRole findByRoleName(String roleName);

    //list des role excepte le role administrateur supreme et celui du gestionnaire de l'application
    @Query("select r from AppRole r where r.roleName<>'ADMIN' and r.roleName<>'MANAGER'")
    List<AppRole> findAll();
}