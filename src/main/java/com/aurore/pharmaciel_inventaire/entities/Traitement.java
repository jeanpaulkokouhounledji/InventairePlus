package com.aurore.pharmaciel_inventaire.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @ToString
@Table(uniqueConstraints={@UniqueConstraint(columnNames={"participer","stockProduit", "fournisseur" })})
public class Traitement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participer")
    Participer participer;

    @ManyToOne
    @JoinColumn(name = "stockProduit")
    StockProduit stockProduit;

    @ManyToOne
    @JoinColumn(name = "fournisseur")
    Fournisseur fournisseur;

    @Column
    private double qteCompte = .0;

    @Column
    private double qteDisponible = .0;

    @Temporal(TemporalType.DATE)
    //@JsonFormat(pattern="dd-MM-yyyy")
    private Date datePeremption;


    @Column
    private double ecart = .0;

    @Column
    private String motif = "";

    @Column
    private double statut = .0;

    @Column
    private double prixVente = .0;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date dateComptage = new Date();

    //=========== ajout des champs pour la creation d'une nouvelle ligne
    @Column
    private String codeCip;

    @Column
    private String libelleProduit;

}
