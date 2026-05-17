package com.codingplatform.repository;

import com.codingplatform.model.CodingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CodingRoomRepository extends JpaRepository<CodingRoom, Long> {
    Optional<CodingRoom> findByRoomId(String roomId);
}
