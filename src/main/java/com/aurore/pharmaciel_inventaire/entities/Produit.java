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
    @Column(nullable = false, length = 50)
    private String codeCip = "";
    @Column(nullable = false, length = 200)
    private String libelle = "";
    @Column(nullable = false, length = 200)
    private String dci="";
    @Column
    private double qteDispo = .0;
    @Column
    private double etat= .0;
    @Column(nullable = true)
    private double prixVente = .0;
    @Column
    private String datePeremtion = "";
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    Fournisseur fournisseur;

}
