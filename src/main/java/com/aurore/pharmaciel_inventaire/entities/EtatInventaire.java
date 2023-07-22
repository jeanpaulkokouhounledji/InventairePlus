package com.aurore.pharmaciel_inventaire.entities;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Subselect;
import org.springframework.data.annotation.Immutable;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Immutable
@Subselect("select * from etat_inventaire")
@AllArgsConstructor @NoArgsConstructor @ToString
public class EtatInventaire implements Serializable{
  /*  @Id
    private Long id;*/
    @Id @Column
    private String idLigne = "";
    @Column
    private String idProduit = "";
    @Column
    private String codeCip = "";
    @Column
    private String libelle = "";
    @Column
    private Long idFournisseur;
    @Column
    private String prixAchat = "";
    @Column
    private double prixVente = .0;
    @Column
    private double qte = 0;
    @Column
    private String datePeremption = "";
    @Column
    private String lot = "";
    @Column
    private String idMotif = "";
    @Column
    private String libelleMotif = "";
    @Column
    private String codeLocalisation = "";
    @Column
    private String localisation = "";
    @Column
    private long codeUtilisateur = 0;
    @Column
    private String codeInventaire = "";


}
