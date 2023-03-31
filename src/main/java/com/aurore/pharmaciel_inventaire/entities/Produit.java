package com.aurore.pharmaciel_inventaire.entities;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor @ToString
public class Produit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column
    private String localisation;
    @Column
    private String fournisseur;
    @Column(nullable = false, length = 50, columnDefinition = "")
    private String codeIp;
    @Column(nullable = false, length = 200, columnDefinition = "")
    private String libelle;
    @Column
    private double prixAchat = .0;
    @Column
    private double prixVente = .0;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private String datePeremption;
    @Column
    private double qte = .0;
    @Column
    private double qteTotale;
    @Column
    private double qteDepot;
    @Column
    private double codeUtilisateur;
    @Column
    private double id_produit;
    @Column
    private double id_ligne;
    @Column
    private double id_fournisseur;
    @Column
    private int etat=0;

}
