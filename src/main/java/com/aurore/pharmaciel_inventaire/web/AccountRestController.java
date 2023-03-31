package com.aurore.pharmaciel_inventaire.web;

import com.aurore.pharmaciel_inventaire.entities.AppRole;
import com.aurore.pharmaciel_inventaire.entities.AppUser;
import com.aurore.pharmaciel_inventaire.repositories.AppUserRepository;
import com.aurore.pharmaciel_inventaire.services.AccountService;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.aurore.pharmaciel_inventaire.utils.JavaConstant.API_BASE_URL;

@RestController
@RequestMapping(value = API_BASE_URL)
public class AccountRestController {

    private AccountService accountService;

    private AppUserRepository appUserRepository;

    public AccountRestController(AccountService accountService, AppUserRepository appUserRepository) {
        this.accountService = accountService;
        this.appUserRepository = appUserRepository;
    }



    //users list
    @GetMapping(value = "usersList")
    public List<AppUser> usersList(){
        return accountService.listUsers();
    }

    //users list
    @GetMapping(value = "usersListActif")
    public List<AppUser> getActifUsers(){
        return accountService.selectActifUsers();
    }

    //Liste des roles
    @GetMapping(value = "rolesList")
    public List<AppRole> rolesList(){
        return accountService.listRoles();
    }

    //save d'un user
    @PostMapping(value = "saveUser")
    public AppUser saveUser(@RequestBody AppUser appUser){
        return accountService.addNewUser(appUser);
    }

    //reccuperation d'un utilisateur par son nom d'utilisateur
    @GetMapping(value = "loadUser/{username}")
    public AppUser getUserByUsername(@PathVariable String username){
        return accountService.loadUserByUsername(username);
    }

    @GetMapping(value = "loadUserById/{id}")
    public AppUser getUserByid(@PathVariable Long id){
        return accountService.findByUsernameToEdit(id);
    }

    //ajout d'un role
    @PostMapping(value = "saveRole")
    public AppRole saveRole(@RequestBody AppRole appRole){
        return accountService.addNewRole(appRole);
    }

    //add role to user (fonction non utilisée)
    @PostMapping(value = "addRoleToUser/{var1}/{var2}")
    public void addRoleToUser(@PathVariable String var1, @PathVariable String var2){
        accountService.addRoleToUser(var1, var2);
    }

    //logger check
    @GetMapping(value = "/getLogedUser")
    public Map<String, Object> getLogedUser(HttpServletRequest httpServletRequest){
        HttpSession httpSession = httpServletRequest.getSession();
        SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");
        String username = securityContext.getAuthentication().getName();
        String nomPrenom = accountService.loadUserByUsername(username).getNomPrenom();
        List<String> roles = new ArrayList<>();
        for(GrantedAuthority ga:securityContext.getAuthentication().getAuthorities()){
            roles.add(ga.getAuthority());
        }
        Map<String,Object> params = new HashMap<>();
        params.put("nomPrenom", nomPrenom);
        params.put("username", username);
        params.put("roles", roles);
        return params;
    }

}

@Data
class UserRoleForm{
    private String nomPrenom;
    private String username;
    private String roleName;
}
