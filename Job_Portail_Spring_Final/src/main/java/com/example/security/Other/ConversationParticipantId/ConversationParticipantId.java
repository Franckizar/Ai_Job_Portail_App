// 14. ConversationParticipantId.java (Composite Key)
package com.example.security.Other.ConversationParticipantId;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ConversationParticipantId implements Serializable {
    private Integer conversation;
    private Integer user;
}
