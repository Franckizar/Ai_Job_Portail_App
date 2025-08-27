// File 13: DTOs
package com.example.security.Other.community.post;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String content;
    private String mediaUrl;
}

