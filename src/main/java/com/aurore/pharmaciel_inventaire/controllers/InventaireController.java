package com.aurore.pharmaciel_inventaire.controllers;


import com.aurore.pharmaciel_inventaire.entities.AppUser;
import com.aurore.pharmaciel_inventaire.entities.Inventaire;
import com.aurore.pharmaciel_inventaire.repositories.AppRoleRepository;
import com.aurore.pharmaciel_inventaire.services.AccountService;
import com.aurore.pharmaciel_inventaire.services.InventaireService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL+"inventaire")
public class InventaireController {

    private final InventaireService inventaireService;

    private final AppRoleRepository appRoleRepository;

    private final HttpServletRequest httpServletRequest;

    private final AccountService accountService;

    public InventaireController(InventaireService inventaireService, AppRoleRepository appRoleRepository, HttpServletRequest httpServletRequest, AccountService accountService) {
        this.inventaireService = inventaireService;
        this.appRoleRepository = appRoleRepository;
        this.httpServletRequest = httpServletRequest;
        this.accountService = accountService;
    }

    //suppression des roles d'un utilisateur
    @DeleteMapping(value = "/deleteRoles/{username}")
    public void deleteAppUser_AppRole(@PathVariable("username") String username){
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");
        AppUser appUser = accountService.loadUserByUsername(username);
        appUser.getAppRoles().clear();
        accountService.addNewUser(appUser);
    }

    @PostMapping(path = "/save")
    public ResponseEntity<Inventaire> createNewInventaire(@Validated @RequestBody Inventaire inventaire){
        Inventaire inventaire1 = inventaireService.createInventaire(inventaire);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("desc","Création d'une ligne d'inventaire");
        return new ResponseEntity<>(inventaire1,httpHeaders,HttpStatus.CREATED);
    }
    @GetMapping(path = "/edit/{id}")
    public ResponseEntity<Inventaire> editInventaire(@PathVariable("id") Long id){
        Optional<Inventaire> inventaire = inventaireService.getInventaireById(id);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("desc","Réccupération d'une ligne d'inventaire à partir de l'ID");
        return new ResponseEntity<>(inventaire.get(),httpHeaders,HttpStatus.OK);
    }
    @GetMapping(path = "/delete/{id}")
    public ResponseEntity<?> deleteInventaire(@PathVariable("id") Long id){
        HttpHeaders httpHeaders = new HttpHeaders();
        try {
            inventaireService.deleteInventaire(id);
            httpHeaders.add("desc", "Supression de l'inventaire par son ID");
            return new ResponseEntity<>(httpHeaders,HttpStatus.OK);
        }catch (Exception e){
            httpHeaders.add("desc", "Cet inventaire n'a pas été trouvé");
            return new ResponseEntity<>(httpHeaders,HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(path = "/changeStatus/{id}")
    public ResponseEntity<?> activateDesactiviteInventaire(@PathVariable("id") Long id){
        inventaireService.changeStatus(id);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("desc", "Changement d'etat d'une ligne d'inventaire");
        return new ResponseEntity<>(httpHeaders,HttpStatus.OK);
    }

    @GetMapping(path = "/list")
    public ResponseEntity<List<Inventaire>> inventairesList(){
        List<Inventaire> list = inventaireService.findAllInventaire();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("desc","Réccupération de la list des inventaires");
        return new ResponseEntity<>(list,httpHeaders,HttpStatus.OK);
    }

    @GetMapping(path = "/allInv")
    public List<Inventaire> list(){
        return inventaireService.findAllInventaire();
    }

    @GetMapping(path = "/list/actifs")
    public List<Inventaire> listInventaireActifs(){
        return inventaireService.findInventaireActif();
    }


}
