package com.aurore.pharmaciel_inventaire.utils;

public class JavaConstant {

    public final static String API_BASE_URL = "pharmaxiel/api/v1/";
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Impossible de vérifier l'authenticité de la source";
    public static final String GET_ARRAYS_LLC = "Get arrays, LLC";
    public static final String GET_ARRAYS_ADMINISTRATION = "User management portal";
    public static final String AUTHORITIES = "Authorities";
    public static final String FORBIDDEN_MESSAGE = "Vous devez vous connecter pour accéder à cette page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String[] PUBLIC_URLS = { API_BASE_URL+"login", API_BASE_URL+"register",  API_BASE_URL+"etat/**",API_BASE_URL+"enabled/**"};

}
