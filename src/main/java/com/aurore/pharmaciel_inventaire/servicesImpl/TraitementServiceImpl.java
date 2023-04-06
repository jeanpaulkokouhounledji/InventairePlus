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

    @Override
    public Traitement saveTraitement(Traitement traitement) {
        return traitementRepository.save(traitement);
    }

    @Override
    public Traitement saveLeTraitement(long produit_id, long participer_id, double qteCompte, Date datePeremption, String codeFournisseur) {
        Traitement traitement = new Traitement();
        Optional<Produit> produit = Optional.of(produitRepository.findById(produit_id));
        Optional<Participer> participer = Optional.of(participerRepository.findById(participer_id));
        //produit correspondant
        traitement.setProduit(produit.get());
        //participer correspondant
        traitement.setParticiper(participer.get());
        traitement.setQteCompte(qteCompte);
        traitement.setDatePeremption(datePeremption);
        traitement.setCodeFournisseur(codeFournisseur);
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


}
