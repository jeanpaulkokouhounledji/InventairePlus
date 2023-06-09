package com.aurore.pharmaciel_inventaire.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor @ToString
@Table(uniqueConstraints={@UniqueConstraint(columnNames={"user_id","inventaire_id", "localisation_id" })})
public class Participer implements Serializable {


    //injection des cles
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "inventaire_id")
    private Inventaire inventaire;

    @ManyToOne
    @JoinColumn(name = "localisation_id")
    private Localisation localisation;


}
