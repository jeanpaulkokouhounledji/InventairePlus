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
@NoArgsConstructor
@ToString
public class StockProduit implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column
    private long idDepot;
    @Column
    private String codeUnique;
    @Column
    private double prixVente;
    @Column
    private double prixAchat;
    @Column
    private double quantite;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private String datePeremption;
    @Column
    private String lot;
    @Column
    private boolean etat;

    /*@ManyToOne
    @JoinColumn(name = "id_inventaire")
    Inventaire inventaire;*/
    @ManyToOne
    @JoinColumn(name = "id_produit")
    Produit produit;

    @ManyToOne
    @JoinColumn(name = "id_fournisseur")
    Fournisseur fournisseur;

}
