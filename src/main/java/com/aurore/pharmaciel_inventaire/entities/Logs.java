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
public class Logs implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column
    private String description = "";

    @Column
    private String user = "";

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date date = new Date();

}
