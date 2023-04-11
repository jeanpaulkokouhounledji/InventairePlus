package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.Participer;
import com.aurore.pharmaciel_inventaire.entities.Produit;
import com.aurore.pharmaciel_inventaire.entities.Traitement;
import com.aurore.pharmaciel_inventaire.repositories.ParticiperRepository;
import com.aurore.pharmaciel_inventaire.repositories.ProduitRepository;
import com.aurore.pharmaciel_inventaire.repositories.TraitementRepository;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TraitementServiceImpl implements TraitementService {

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    private final ParticiperRepository participerRepository;

    public TraitementServiceImpl(TraitementRepository traitementRepository, ProduitRepository produitRepository, ParticiperRepository participerRepository) {
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
        this.participerRepository = participerRepository;
    }

    private double ecart = .0;

    @Override
    public Traitement saveTraitement(Traitement traitement) {
        return traitementRepository.save(traitement);
    }

    @Override
    public Traitement saveLeTraitement(long produit_id, long participer_id, double qteCompte, Date datePeremption, String fournisseur,double prixVente) {
        Traitement traitement = new Traitement();
        Optional<Produit> produit = Optional.of(produitRepository.findById(produit_id));
        Optional<Participer> participer = Optional.of(participerRepository.findById(participer_id));
        //produit correspondant
        traitement.setProduit(produit.get());
        //prix de vente du produit
        produit.get().setPrixVente(prixVente);
        //participer correspondant
        traitement.setParticiper(participer.get());
        traitement.setQteCompte(qteCompte);
        traitement.setDatePeremption(datePeremption);
        traitement.setCodeFournisseur(fournisseur);
        //calcul de l'ecart entre qté compté et qté disponible
        this.ecart = produit.get().getQteDispo() - qteCompte;
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
