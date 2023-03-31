package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.services.ParticiperService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"participer")
public class ParticiperController {

    private final ParticiperService participerService;

    public ParticiperController(ParticiperService participerService) {
        this.participerService = participerService;
    }

    //création d'une ligne de participation
    @PostMapping(value = "/save/{user_id}/{inventaire_id}/{localisation_id}")
    public Participer createParticiper(@PathVariable Long user_id,@PathVariable Long inventaire_id,@PathVariable Long localisation_id){
        return participerService.createParticiper(user_id,inventaire_id,localisation_id);
    }

    @DeleteMapping(value = "/delete/{id}")
    public void deleteParticipation(@PathVariable Long id){
        participerService.deleteParticiper(id);
    }

    //List des participations
    @GetMapping(value = "list")
    public List<Participer> listParticipation(){
        return participerService.allParticipations();
    }

    //reccuperation des rayons d'un utilisateur x
    @GetMapping(value = "/localisationByUser/{username}")
    public List<Localisation> localisationsParUtilisateur(@PathVariable String username){
        return participerService.localisationByUser(username);
    }
}
