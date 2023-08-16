package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParticiperRepository extends JpaRepository<Participer,Long> {

    //trouvé les rayons affectés à un utilisateur pour un inventaire actif
    @Query("select distinct p.inventaire from Participer p where p.inventaire.statut=true and p.appUser.username=:username")
    Inventaire findInventaireParticiper(@Param("username") String username);

    //Participations d'un utilisateur
    @Query("select p from Participer p where p.appUser.username=:username and p.inventaire.statut=true order by p.id desc")
    List<Participer> findUserLocalisations(@Param("username") String username);


    @Query("select p from Participer p where p.id=:x")
    Participer findById(@Param("x") long x);

    //selection des rayons comptés dans in inventaire
    @Query("select distinct p.localisation from Participer p where p.inventaire.numero=:x")
    List<Localisation> localisationByInventaire(@Param("x") String x);

    @Query(value = "delete from participer ",nativeQuery = true)
    void deleteAll();

}
