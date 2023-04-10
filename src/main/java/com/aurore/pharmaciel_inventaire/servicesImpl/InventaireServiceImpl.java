package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.repositories.InventaireRepository;
import com.aurore.pharmaciel_inventaire.services.InventaireService;
import org.jfree.data.time.Day;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Month;
import java.time.MonthDay;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class InventaireServiceImpl implements InventaireService {

    private final InventaireRepository inventaireRepository;

    public InventaireServiceImpl(InventaireRepository inventaireRepository) {
        this.inventaireRepository = inventaireRepository;
    }

    @Override
    public Inventaire createInventaire(Inventaire inventaire) {
        Inventaire i = inventaireRepository.save(inventaire);
        //generation du code d'inventaire
        String num = "INV-"+Year.now()+"-"+"000"+i.getId().toString();
        i.setNumero(num);
        return i;
    }

    @Override
    public Optional<Inventaire> getInventaireById(Long id) {
        return inventaireRepository.findById(id);
    }

    @Override
    public void deleteInventaire(Long id) {
        inventaireRepository.deleteById(id);
    }

    @Override
    public Inventaire changeStatus(Long id) {
        Optional<Inventaire> inventaire = inventaireRepository.findById(id);
        if(inventaire.get().isStatut()){
            inventaire.get().setStatut(false);
        }else {
            inventaire.get().setStatut(true);
        }
        return inventaireRepository.save(inventaire.get());
    }

    @Override
    public List<Inventaire> findAllInventaire() {
        return inventaireRepository.findAll();
    }

    //liste des inventaires actifs
    @Override
    public List<Inventaire> findInventaireActif() {
        return inventaireRepository.allInventaireActif();
    }
}
