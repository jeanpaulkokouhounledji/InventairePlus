package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.*;
import com.aurore.pharmaciel_inventaire.repositories.*;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class TraitementServiceImpl implements TraitementService {

    //récupération des données d'authentification
    private Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    private  final LogsRepository logsRepository;

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    private final StockProduitRepository stockProduitRepository;

    private final ParticiperRepository participerRepository;

    private final FournisseurRepository fournisseurRepository;

    private final EtatInventaireRepository etatInventaireRepository;

    public TraitementServiceImpl(LogsRepository logsRepository, TraitementRepository traitementRepository, ProduitRepository produitRepository, StockProduitRepository stockProduitRepository, ParticiperRepository participerRepository, FournisseurRepository fournisseurRepository, EtatInventaireRepository etatInventaireRepository) {
        this.logsRepository = logsRepository;
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
        this.stockProduitRepository = stockProduitRepository;
        this.participerRepository = participerRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.etatInventaireRepository = etatInventaireRepository;
    }

    private double ecart = .0;

    //generation d'etat d'un rayon d'inventaire traité
    @Override
    public void generateEtatInventaire(String codeInventaire, String codeRayon) {
        //reccuperation de la liste des traitements concernés
        List<Traitement> traitements = traitementRepository.listByRayonOfInventaire(codeInventaire, codeRayon);



        for (Traitement t : traitements){
            String codeCip = t.getStockProduit()==null?t.getCodeCip():t.getStockProduit().getProduit().getCodeProduit();
            String nomProduit = t.getStockProduit()==null?t.getLibelleProduit():t.getStockProduit().getProduit().getLibelle();
            //création d'une nouvelle ligne à chaque itération
            EtatInventaire etatInventaire = new EtatInventaire();
            //enrégistrement des attributs
            etatInventaire.setLocalisation(t.getParticiper().getLocalisation().getLibelle());
            etatInventaire.setFournisseur(t.getFournisseur().getRaisonSociale().toString());
            etatInventaire.setCodeCip(codeCip);
            etatInventaire.setLibelle(nomProduit);
            etatInventaire.setPrixAchat(t.getStockProduit()==null?t.getPrixVente():t.getStockProduit().getPrixAchat());
            etatInventaire.setPrixVente(t.getPrixVente());
            etatInventaire.setDatePeremption(t.getDatePeremption().toString());
            etatInventaire.setQte(t.getQteCompte());
            etatInventaire.setQteTotale(t.getQteCompte());
            etatInventaire.setQteDepot(t.getQteDisponible()==0?t.getStockProduit().getQuantite():t.getQteDisponible());
            etatInventaire.setCodeUtilisateur(t.getParticiper().getAppUser().getId().toString());
            etatInventaire.setIdProduit(t.getStockProduit()==null?t.getId().toString():t.getStockProduit().getProduit().getId().toString());
            etatInventaire.setIdLigne(t.getStockProduit()==null?t.getId().toString():t.getStockProduit().getId().toString());
            etatInventaire.setIdFournisseur(t.getFournisseur().getId().toString());
            etatInventaire.setCodeInventaire(t.getParticiper().getInventaire().getNumero());
            etatInventaire.setCodeLocalisation(t.getParticiper().getLocalisation().getCode());
            //sauvegarde de la ligne
            etatInventaireRepository.save(etatInventaire);
        }

    }

    @Override
    public Traitement saveTraitement(Traitement traitement) {
        //calcul de l'écart
        this.ecart = traitement.getQteDisponible() - traitement.getQteCompte();
        traitement.setEcart(ecart);
        //changement du rayon
        //flag de comptage
        traitement.setStatut(1);
        Logs log = new Logs();
        //log.setUser((String) auth.getCredentials());
        log.setDescription("Comptage du nouveau produit " + traitement.getLibelleProduit());
        logsRepository.save(log);
        return traitementRepository.save(traitement);
    }

    @Override
    public Traitement saveLeTraitement(String id_stockproduit, long id_participer, long id_fournisseur,double qteCompte, Date datePeremption,double prixVente) {
        Traitement traitement = new Traitement();
        Optional<StockProduit> stockProduit = Optional.ofNullable(stockProduitRepository.findStockProduitByCodeUnique(id_stockproduit));
        Optional<Participer> participer = Optional.of(participerRepository.findById(id_participer));
        Optional<Fournisseur> fournisseur = Optional.of(fournisseurRepository.findById(id_fournisseur));
        //produit correspondant
        traitement.setStockProduit(stockProduit.get());
        traitement.setPrixVente(prixVente);
        //prix de vente du produit
        //stockProduit.get().setPrixVente(prixVente);
        //participer correspondant
        traitement.setParticiper(participer.get());
        traitement.setQteCompte(qteCompte);
        traitement.setDatePeremption(datePeremption);
        traitement.setFournisseur(fournisseur.get());
        //calcul de l'ecart entre qté compté et qté disponible
        this.ecart = stockProduit.get().getQuantite() - qteCompte;
        traitement.setEcart(ecart);
        //flag de comptage
        traitement.setStatut(1);
        //sauvegarde
        Logs log = new Logs();
        //log.setUser(auth.getName());
        log.setDescription("Comptage du produit " + traitement.getLibelleProduit());
        logsRepository.save(log);

        return traitementRepository.save(traitement);
    }


    @Override
    public Optional<Traitement> getForEdit(Long id) {
        return traitementRepository.findById(id);
    }

    @Override
    public void deleteTraitement(long id) {

        Optional<Traitement> traitement = traitementRepository.findById(id);

        Logs log = new Logs();
        //log.setUser(auth.getName());
        log.setDescription("Comptage du produit " + traitement.get().getLibelleProduit()==null || traitement.get().getLibelleProduit()==""?traitement.get().getStockProduit().getProduit().getLibelle():traitement.get().getLibelleProduit());
        logsRepository.save(log);
        traitementRepository.deleteById(id);
    }

    @Override
    public List<Traitement> getTraitementByRayon(String codeRayon) {
        return null;
    }

   /* @Override
    public List<Traitement> getTraitementByRayon(String codeRayon) {
        return traitementRepository.getTraitementByCodeRayon(codeRayon);
    }*/

    @Override
    public List<Traitement> listTraitement() {
        return traitementRepository.listeDesTraitements();
    }

    @Override
    public List<Traitement> listTraitementHash() {
        return null;
    }

    @Override
    public Traitement saveTraitementMotif(long id, String motif) {
        Optional<Traitement> traitement = Optional.of(traitementRepository.findById(id).get());
        traitement.get().setMotif(motif.toString());
        traitementRepository.save(traitement.get());
        Logs log = new Logs();
        //log.setUser(auth.getName());
        log.setDescription("Sauvegarde du motif pour " + traitement.get().getLibelleProduit()==null || traitement.get().getLibelleProduit()==""?traitement.get().getStockProduit().getProduit().getLibelle():traitement.get().getLibelleProduit());
        logsRepository.save(log);
        return traitement.get();
    }


}
