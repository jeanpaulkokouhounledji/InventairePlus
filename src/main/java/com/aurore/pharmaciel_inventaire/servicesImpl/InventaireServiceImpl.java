package com.aurore.pharmaciel_inventaire.servicesImpl;


import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.entities.Logs;
import com.aurore.pharmaciel_inventaire.repositories.InventaireRepository;
import com.aurore.pharmaciel_inventaire.repositories.LogsRepository;
import com.aurore.pharmaciel_inventaire.services.InventaireService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class InventaireServiceImpl implements InventaireService {

    private final InventaireRepository inventaireRepository;

    private final LogsRepository logsRepository;

    public InventaireServiceImpl(InventaireRepository inventaireRepository, LogsRepository logsRepository) {
        this.inventaireRepository = inventaireRepository;
        this.logsRepository = logsRepository;
    }

    @Override
    public Inventaire createInventaire(Inventaire inventaire) {
        DateFormat dateFormat = new  SimpleDateFormat("yyyy-MM-dd");
        String date = dateFormat.format(new Date());
        Inventaire i = inventaireRepository.save(inventaire);
        //generation du code d'inventaire
        String num = "INV-"+Year.now()+"-"+"000"+i.getId().toString();
        i.setNumero(num);
        i.setDate(date);
        return i;
    }

    @Override
    public Optional<Inventaire> getInventaireById(Long id) {
        return inventaireRepository.findById(id);
    }

    @Override
    public void deleteInventaire(Long id) {
        try{
            Logs log = new Logs();
            log.setDescription("Supression de la ligne d'inventaire à l'id "+ id);
            logsRepository.save(log);
            inventaireRepository.deleteById(id);
        }catch (Exception e){
            Logs log = new Logs();
            log.setDescription("Tentative de suppression du traitement "+ id);
            logsRepository.save(log);
        }

    }

    @Override
    public Inventaire changeStatus(Long id) {
        Optional<Inventaire> inventaire = inventaireRepository.findById(id);
        if(inventaire.get().isStatut()){
            inventaire.get().setStatut(false);
            Logs log = new Logs();
            log.setDescription("Désactivation de l'inventaire "+ inventaire.get().getNumero());
            logsRepository.save(log);
        }else {
            inventaire.get().setStatut(true);
            Logs log = new Logs();
            log.setDescription("Activation de l'inventaire "+ inventaire.get().getNumero());
            logsRepository.save(log);
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
