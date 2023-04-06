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
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Traitement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participer")
    Participer participer;

    @ManyToOne
    @JoinColumn(name = "produit", unique = true)
    Produit produit;

    @Column
    private double qteCompte = .0;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date datePeremption;

    @Column(length = 150)
    private String codeFournisseur = "";

    @Column
    private double ecart = .0;

    @Column
    private String motif = "";

    @Column
    private double statut = .0;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date dateComptage = new Date();

}
