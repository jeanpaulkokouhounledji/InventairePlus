package com.aurore.pharmaciel_inventaire.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor @ToString
public class Produit implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(nullable = false, length = 50)
    private String codeProduit = "";
    @Column(nullable = false, length = 200)
    private String libelle = "";
    @Column(nullable = false, length = 200)
    private String dci="";
    @Column
    private long idForme = 0;
    @Column
    private long idFamille = 0;
    @ManyToOne
    @JoinColumn(name = "id_localisation")
    private Localisation localisation;

 /*   @Column
    private long idLocalisation = 0;*/

}
