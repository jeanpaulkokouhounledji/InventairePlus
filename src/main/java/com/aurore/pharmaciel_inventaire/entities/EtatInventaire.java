package com.aurore.pharmaciel_inventaire.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Table(uniqueConstraints={@UniqueConstraint(columnNames={"libelle","codeInventaire", "codeLocalisation" })})
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor @ToString
public class EtatInventaire implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @Column
    private String localisation = "";
    @Column
    private String fournisseur = "";
    @Column
    private String codeCip = "";
    @Column
    private String libelle = "";
    @Column
    private double prixAchat = .0;
    @Column
    private double prixVente = .0;
    @Column
    private String datePeremption = "";
    @Column
    private double qte = .0;
    @Column
    private double qteTotale = .0;
    @Column
    private double qteDepot = .0;
    @Column
    private String codeUtilisateur = "";
    @Column
    private String idProduit = "";
    @Column
    private String idLigne = "";
    @Column
    private String idFournisseur = "";
    @Column
    private String codeInventaire = "";
    @Column
    private String codeLocalisation = "";
    /*@JoinColumn(name = "participer_id")
    @ManyToOne
    Participer participer;*/
}
