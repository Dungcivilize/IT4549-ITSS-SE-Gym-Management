package com.example.gym.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private String roomName;
    private String roomType;
    private String status;
}
