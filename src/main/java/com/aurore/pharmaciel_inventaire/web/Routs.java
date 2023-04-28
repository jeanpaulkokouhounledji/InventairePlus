package com.aurore.pharmaciel_inventaire.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Routs {


    @RequestMapping(value = "/")
    public String accueil(){
        return "pages/homePage";
    }

    @RequestMapping(value = "login")
    public String login(){
        return "loginPage";
    }

    @RequestMapping(value = "auth")
    public String usersManager(){
        return "pages/usersPage";
    }

    @RequestMapping(value = "comptage")
    public String comptage(){
        return "pages/comptagePage";
    }

    @RequestMapping(value = "inventaire")
    public String inventaire(){
        return "pages/inventairePage";
    }

    @RequestMapping(value = "ecarts")
    public String ecarts(){
        return "pages/ecartsPage";
    }

    @RequestMapping(value = "stocks")
    public String updateStock(){
        return "pages/updateStock";
    }

    @RequestMapping(value = "historique")
    public String history(){
        return "pages/historyPage";
    }

    //page de chargement
    @RequestMapping(value = "chargement")
    public String charge(){
        return "pages/chargementPage";
    }

    //============= Utilisateur ========================

    //route vers la page de gestion des utilisateurs (Creation, modifier, ...)
    @RequestMapping(value = "/usersManagement")
    public String conventionUsers(){
        return "users/usersManagement";
    }

    //route vers la page parametrage des utilisateurs
    @RequestMapping(value = "/userParam")
    public String parametrageDesUtilisateurs(){
        return "users/usersSettings";
    }

    //route vers la page de profil
    @RequestMapping(value = "/profil")
    public String gestionDuProfil(){
        return "users/changePassword";
    }


}
