package com.aurore.pharmaciel_inventaire.controllers;

import com.aurore.pharmaciel_inventaire.entities.Localisation;
import com.aurore.pharmaciel_inventaire.repositories.*;
import com.aurore.pharmaciel_inventaire.services.ParticiperService;
import com.aurore.pharmaciel_inventaire.services.StatsService;
import org.springframework.web.bind.annotation.*;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"stats")
public class StatsController {

    private final StatsService statsService;

    private final ParticiperService participerService;

    private final FournisseurRepository fournisseurRepository;

    private final LocalisationRepository localisationRepository;

    private final MotifRepository motifRepository;

    private final ProduitRepository produitRepository;

    private final StockProduitRepository stockProduitRepository;

    private final InventaireRepository inventaireRepository;

    private final ParticiperRepository participerRepository;

    public StatsController(StatsService statsService, ParticiperService participerService, FournisseurRepository fournisseurRepository, LocalisationRepository localisationRepository, MotifRepository motifRepository, ProduitRepository produitRepository, StockProduitRepository stockProduitRepository, InventaireRepository inventaireRepository, ParticiperRepository participerRepository) {
        this.statsService = statsService;
        this.participerService = participerService;
        this.fournisseurRepository = fournisseurRepository;
        this.localisationRepository = localisationRepository;
        this.motifRepository = motifRepository;
        this.produitRepository = produitRepository;
        this.stockProduitRepository = stockProduitRepository;
        this.inventaireRepository = inventaireRepository;
        this.participerRepository = participerRepository;
    }

    @GetMapping(value = "/count/produitsByLocalisation/{localisation}")
    public long countProduitParLocalisationCompte(@PathVariable String localisation){
        return statsService.countProduitParLocalisationCompte(localisation);
    }

    @GetMapping(value = "/count/produitCompte/parLocalisation/{localisation}")
    public long countProduitCompte(@PathVariable String localisation){
        return statsService.countProduitCompte(localisation);
    }

    @GetMapping(value = "all/localisations/traitement")
    public List<String> listDesLocalisationsComptés(){
        return statsService.listDesLocalisationsComptés();
    }

    //trouver les localisations liees à un inventaire
    @GetMapping(value = "/localisationByInventaire/{codeInventaire}")
    public Collection statsByLocalisation(@PathVariable String codeInventaire){
        long nbCompte,totalProduit = 0;
        double pourcentage = .0;
        Vector collection = new Vector();
        //formatage de decimal
        String format = "#.###";
        DecimalFormat df = new DecimalFormat(format);
        df.setRoundingMode(RoundingMode.HALF_UP);
        List<Localisation> localisations = participerService.localisationByInventaire(codeInventaire);

        for(Localisation l : localisations){
            HashMap<String,Object> map = new HashMap<>();
            //nb de fois compte dans traitement
            nbCompte = statsService.countProduitCompte(l.getLibelle());
            totalProduit = statsService.countProduitParLocalisationCompte(l.getLibelle());
            //calcul du pourcentage
            if(totalProduit!=0){
                pourcentage = ((double) nbCompte / totalProduit) * 100;
            }else{
                pourcentage = 0;
            }
            map.put("localisation",l.getLibelle());
            map.put("nombreCompte", nbCompte);
            map.put("nombreEnBase", totalProduit);
            map.put("etat", df.format(pourcentage));
            collection.add(map);
        }
        return collection;
    }

    //statistique des imports

    @GetMapping(value = "/fichierimport")
    public HashMap<String,Object> getCountedImport(){
       HashMap<String,Object> map = new HashMap<>();
       long nbFournisseurs, nbLocalisations, nbMotifs, nbProduits, nbStocksProduits= 0;
       nbFournisseurs = fournisseurRepository.getCountFournisseurs();
       nbLocalisations = localisationRepository.getCountLocalisations();
       nbMotifs = motifRepository.getCountMotifs();
       nbProduits = produitRepository.getCountProduits();
       nbStocksProduits = stockProduitRepository.getCountStockProduit();

       map.put("nbFournisseurs", nbFournisseurs);
       map.put("nbLocalisations", nbLocalisations);
       map.put("nbMotifs", nbMotifs);
       map.put("nbProduits", nbProduits);
       map.put("nbStocksProduits", nbStocksProduits);
       return map;
    }

    @PostMapping(value = "/resetTables")
    public void dropData(){
        stockProduitRepository.deleteAll();
        participerRepository.deleteAll();
        localisationRepository.deleteAll();
        produitRepository.deleteAll();
        fournisseurRepository.deleteAll();
        motifRepository.deleteAll();
        inventaireRepository.deleteAll();

    }
}
