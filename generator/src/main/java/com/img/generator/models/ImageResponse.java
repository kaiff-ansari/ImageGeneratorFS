package com.img.generator.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {

    private String imageBase64;
    private String prompt;
    private String status;
    private String message;
}
