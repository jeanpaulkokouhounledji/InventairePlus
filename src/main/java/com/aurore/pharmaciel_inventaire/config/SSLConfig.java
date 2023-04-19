package com.aurore.pharmaciel_inventaire.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.security.KeyStore;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
public class SSLConfig {

    @Value("${trust.store}")
    String trustKeyPath;

    @Value("${trust.store.password}")
    String trustPassword;

    @Bean
    public SSLContext sslContext(ResourceLoader resourceLoader) throws Exception {
        Resource trustStoreResource = new ClassPathResource(trustKeyPath); // Replace with your trust store file name
        InputStream trustStoreInputStream = trustStoreResource.getInputStream();
        KeyStore trustStore = KeyStore.getInstance("PKCS12");
        trustStore.load(trustStoreInputStream, trustPassword.toCharArray()); // Replace with your trust store password

        SSLContext sslContext = SSLContext.getInstance("TLS");
        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(trustStore);
        sslContext.init(null, trustManagerFactory.getTrustManagers(), null);

        return sslContext;
    }

}
