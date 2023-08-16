package com.aurore.pharmaciel_inventaire.servicesImpl;

import com.aurore.pharmaciel_inventaire.entities.*;
import com.aurore.pharmaciel_inventaire.repositories.*;
import com.aurore.pharmaciel_inventaire.services.GenererFichierImportService.ComptageEnCoursEportUtils;
import com.aurore.pharmaciel_inventaire.services.GenererFichierImportService.EcartExcelExportUtils;
import com.aurore.pharmaciel_inventaire.services.TraitementService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class TraitementServiceImpl implements TraitementService {

    private final HttpServletRequest httpServletRequest;

    private  final LogsRepository logsRepository;

    private final TraitementRepository traitementRepository;

    private final ProduitRepository produitRepository;

    private final StockProduitRepository stockProduitRepository;

    private final ParticiperRepository participerRepository;

    private final FournisseurRepository fournisseurRepository;

    private final EtatInventaireRepository etatInventaireRepository;

    public TraitementServiceImpl(HttpServletRequest httpServletRequest, LogsRepository logsRepository, TraitementRepository traitementRepository, ProduitRepository produitRepository, StockProduitRepository stockProduitRepository, ParticiperRepository participerRepository, FournisseurRepository fournisseurRepository, EtatInventaireRepository etatInventaireRepository) {
        this.httpServletRequest = httpServletRequest;
        this.logsRepository = logsRepository;
        this.traitementRepository = traitementRepository;
        this.produitRepository = produitRepository;
        this.stockProduitRepository = stockProduitRepository;
        this.participerRepository = participerRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.etatInventaireRepository = etatInventaireRepository;
    }

    private double ecart = .0;

    @Override
    public List<Traitement> exportEcartToExcel(HttpServletResponse response) throws IOException {
        List<Traitement> traitements = traitementRepository.listTraitementsAvecEcarts();
        EcartExcelExportUtils excelExportUtils = new EcartExcelExportUtils(traitements);
        excelExportUtils.exportDataToExcel(response);
        return traitements;
    }

    @Override
    public List<Traitement> exportComptageEnCoursToExcel(HttpServletResponse response) throws IOException {
        List<Traitement> traitements = traitementRepository.findAll();
        ComptageEnCoursEportUtils comptageEnCoursEportUtils = new ComptageEnCoursEportUtils(traitements);
        comptageEnCoursEportUtils.exportDataToExcel(response);
        return traitements;
    }

    //generation d'etat d'un rayon d'inventaire traité
   /* @Override
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

            etatInventaireRepository.save(etatInventaire);
        }

    }
*/
    @Override
    public Traitement saveTraitement(Traitement traitement) {
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        //formatage de la date
        final String format = "dd/MM/yyyy HH:mm Z";
        SimpleDateFormat sdf = new SimpleDateFormat();
        sdf.applyPattern(format);
        //String dateToFormat = traitement.getDatePeremption().toString();
        //Date date = new Date(traitement.getDatePeremption());
        //calcul de l'écart
        this.ecart = traitement.getQteDisponible() - traitement.getQteCompte();
        traitement.setEcart(ecart);
        traitement.setStatut(1);
        traitement.setDatePeremption(traitement.getDatePeremption());
        System.out.println("===================================================");
        System.out.println(traitement.getDatePeremption());
        System.out.println("===================================================");
        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
        log.setDescription("Comptage du nouveau produit " + traitement.getLibelleProduit());
        logsRepository.save(log);
        return traitementRepository.save(traitement);
    }

    @Override
    public Traitement saveLeTraitement(String id_stockproduit, long id_participer, String fournisseur,double qteCompte, String datePeremption,double prixVente) throws ParseException {
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");
        //formatage de la date
        final String format = "yyyy-MM-dd";
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        Date date = new Date(datePeremption);

        Traitement traitement = new Traitement();
        Optional<StockProduit> stockProduit = Optional.ofNullable(stockProduitRepository.findStockProduitByCodeUnique(id_stockproduit));
        Optional<Participer> participer = Optional.of(participerRepository.findById(id_participer));
        Optional<Fournisseur> fourn = Optional.ofNullable(fournisseurRepository.findFournisseurByRaisonSociale(fournisseur));
        //produit correspondant
        traitement.setStockProduit(stockProduit.get());
        traitement.setPrixVente(prixVente);
        traitement.setParticiper(participer.get());
        traitement.setQteCompte(qteCompte);
        traitement.setDatePeremption(sdf.format(date).toString());
        traitement.setFournisseur(fourn.get());
        //calcul de l'ecart entre qté compté et qté disponible
        this.ecart = stockProduit.get().getQuantite() - qteCompte;
        traitement.setEcart(ecart);
        //flag de comptage
        traitement.setStatut(1);
        //sauvegarde
        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
        log.setDescription("Comptage du produit " + stockProduit.get().getProduit().getLibelle().toString());
        logsRepository.save(log);

        return traitementRepository.save(traitement);
    }


    @Override
    public Optional<Traitement> getForEdit(Long id) {
        return traitementRepository.findById(id);
    }

    @Override
    public void deleteTraitement(long id) {
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        Optional<Traitement> traitement = traitementRepository.findById(id);

        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
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
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");

        Optional<Traitement> traitement = Optional.of(traitementRepository.findById(id).get());
        traitement.get().setMotif(motif.toString());
        traitementRepository.save(traitement.get());
        Logs log = new Logs();
        log.setUser(securityContext.getAuthentication().getName());
        log.setDescription("Sauvegarde du motif pour " + traitement.get().getLibelleProduit()==null || traitement.get().getLibelleProduit()==""?traitement.get().getStockProduit().getProduit().getLibelle():traitement.get().getLibelleProduit());
        logsRepository.save(log);
        return traitement.get();
    }


}
