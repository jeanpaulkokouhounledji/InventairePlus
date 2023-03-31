package com.aurore.pharmaciel_inventaire.Security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;


@Configuration
@EnableWebMvc
public class CrossOriginConfig implements WebMvcConfigurer {

    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("*" + API_BASE_URL + "**")
                .allowedOrigins("*", "*" + API_BASE_URL + "**")
                .allowedMethods("GET");
    }
}
