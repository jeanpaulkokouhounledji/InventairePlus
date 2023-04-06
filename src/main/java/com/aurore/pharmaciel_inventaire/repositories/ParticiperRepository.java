package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParticiperRepository extends JpaRepository<Participer,Long> {

    //trouvé les rayons affectés à un utilisateur pour un inventaire actif
    @Query("select distinct p.inventaire.numero,p.inventaire.libelle from Participer p where p.inventaire.statut=true and p.appUser.username=:username")
    String findInventaireParticiper(@Param("username") String username);

    /*@Query("select distinct p.inventaire.numero from Participer p where p.inventaire.statut=true and p.appUser.username=:x")
    String findParticiperByUserId(@Param("x") String username);*/

    //Participations d'un utilisateur
    @Query("select p from Participer p where p.appUser.username=:username and p.inventaire.statut=true order by p.id desc")
    List<Participer> findUserLocalisations(@Param("username") String username);

    /* @Query("select p.localisation from Participer p where p.appUser.username=:username and p.inventaire.statut=true order by p.id desc")
    List<Localisation> findUserLocalisations(@Param("username") String username);*/

    @Query("select p from Participer p where p.id=:x")
    Participer findById(@Param("x") long x);

}
