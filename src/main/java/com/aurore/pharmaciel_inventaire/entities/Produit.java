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
    private String codeProduit = "";
    @Column(nullable = false, length = 200)
    private String libelle = "";
    @Column(nullable = false, length = 200)
    private String dci="";
    @Column
    private double idForme = .0;
    @Column
    private double idFamille = .0;
    @ManyToOne
    @JoinColumn(name = "id_localisation")
    Localisation localisation;

}
