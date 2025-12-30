package com.img.generator.controller;

import com.img.generator.models.ImageRequest;
import com.img.generator.models.ImageResponse;
import com.img.generator.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ImageResponse> generateImage(@RequestBody ImageRequest request) {
        System.out.println("Request received: " + request.getPrompt());

        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            ImageResponse error = new ImageResponse();
            error.setStatus("error");
            error.setMessage("Prompt is required");
            return ResponseEntity.badRequest().body(error);
        }

        ImageResponse response = imageService.generateImage(request);

        if ("success".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API is running!");
    }
}
