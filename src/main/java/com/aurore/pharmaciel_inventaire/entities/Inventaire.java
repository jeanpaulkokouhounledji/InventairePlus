package com.aurore.pharmaciel_inventaire.entities;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table
@Data
@AllArgsConstructor @NoArgsConstructor @ToString
public class Inventaire implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 60)
    private String numero = "";

    @Column(nullable = false, length = 200)
    private String libelle = "";

    @Column(nullable = false)
    private String showQteStock;

    @Column
    private String date;

    @Column(nullable = false)
    private boolean statut = false;

}
