package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.entities.StockProduit;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.*;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TraitementServiceImpl implements TraitementService {

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    private final StockProduitRepository stockProduitRepository;

    private final ParticiperRepository participerRepository;

    private final FournisseurRepository fournisseurRepository;

    public TraitementServiceImpl(TraitementRepository traitementRepository, ProduitRepository produitRepository, StockProduitRepository stockProduitRepository, ParticiperRepository participerRepository, FournisseurRepository fournisseurRepository) {
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
        this.stockProduitRepository = stockProduitRepository;
        this.participerRepository = participerRepository;
        this.fournisseurRepository = fournisseurRepository;
    }

    private double ecart = .0;

    @Override
    public Traitement saveTraitement(Traitement traitement) {
        this.ecart = traitement.getQteDisponible() - traitement.getQteCompte();
        traitement.setEcart(ecart);
        //flag de comptage
        //traitement.setStatut(1);
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
        return traitementRepository.save(traitement);
    }


    @Override
    public Optional<Traitement> getForEdit(Long id) {
        return traitementRepository.findById(id);
    }

    @Override
    public void deleteTraitement(long id) {
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
        return traitement.get();
    }


}
