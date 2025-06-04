package ITSS.Backend.Trainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerMemberDTO {
    private Long userId;
    private String fullname;
    private String packageName;
}
