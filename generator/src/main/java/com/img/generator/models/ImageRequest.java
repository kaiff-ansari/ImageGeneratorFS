package com.img.generator.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageRequest {

    private String prompt;
    private Integer width = 1024;
    private Integer height = 1024;
    private Integer steps = 30;
    private Integer cfgScale = 7;
}
