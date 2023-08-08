/**
 * controleur angular
 */
var app = angular.module('pharmaxielweb',['ngTable']);

//focus sur un input utilisation : <input type="text" ng-focus="isFocused" ng-focus-lost="loseFocus()">
app.directive('ngFocus', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            scope.$watch( attrs.ngFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () { element[0].focus(); } );
                }
            }, true);
            element.bind('blur', function () {
                if ( angular.isDefined( attrs.ngFocusLost ) ) {
                    scope.$apply( attrs.ngFocusLost );

                }
            });
        }
    };
});

app.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});

//confirmation de l'action
app.directive('ngConfirmClick', [ function(){
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Confirmez vous cette action?";
            var clickAction = attr.confirmedClick;
            element.bind('click',function (event) {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
}]);

app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);

//files uploading
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .then(function(){

                    new PNotify({
                        title: "Notification Pharmaxiel_web",
                        type: "success",
                        text: "Données chargées avec succès",
                        nonblock: {
                            nonblock: true
                        },
                        addclass: "success",
                        styling: 'bootstrap3',
                        hide: true,

                    });

                    //$scope.notification("message envoyé avec succès","success");
                    //alert("Fichier importé");
                },function errorCallback(response) {
                new PNotify({
                    title: "Inventaire+ | Notification",
                    text: "Désolé, une erreur est survenue lors du chargement",
                    type: "error",
                    styling: "bootstrap3",
                    delay: 3000,
                    history: false,
                    sticker: true,
                });

            });
    }
}]);

//======================================================
//==========  user Controller  ======================
//======================================================
app.controller('userController',userController);
function userController($scope , $http , $filter , fileUpload , NgTableParams ){
    $scope.userData = {data:[]};
    $scope.appUser = {};
    $scope.showForm = false;

    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
        if($scope.showForm==true){
            $scope.handleAutofocus();
        }
    }

    //réinitialisation de l'objet
    $scope.resetUser = function () {
        $scope.appUser = {};
    }

    //attribution de role
    $scope.addRoleTOUser = function (var1, var2) {
        $http.post("/pharmaxiel/api/v1/addRoleToUser/"+var1+"/"+var2)
            .then(function (response) {
                $scope.userRole = response.data;
                $scope.usersList();
                new PNotify({
                    title: "Inventaire+ | Notification",
                    text: "Role << "+ var2 + " >> Attribuer avec succès à << " + var1 + " >>",
                    type: "success",
                    styling: "bootstrap3",
                    delay: 5000,
                    history: false,
                    sticker: true,

                });
            })
    }

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();

    //list des utilisateurs actif
    $scope.listActif = function () {
        $http.get("/pharmaxiel/api/v1/usersListActif")
            .then(function (response) {
                $scope.listUsersActif = response.data;
            })
    }
    $scope.listActif();

    //list des roles
    $scope.listRoles = function () {
        $http.get("/pharmaxiel/api/v1/rolesList")
            .then(function (response) {
                $scope.listRoles = response.data;
            })
    }
    $scope.listRoles();

    //list des types utilisateurs
    $scope.listUserType = function () {
        $http.get("/pharmaxiel/api/v1/typeUtilisateur/list")
            .then(function (response) {
                $scope.userTypes = response.data;
            })
    }
    $scope.listUserType();

    //Activation desactivation d'un compte utilisateur
    $scope.activeOrDesactivate = function (id){
        $http.put("/pharmaxiel/api/v1/changeAccountStatus/" + id)
            .then(function () {
                    $scope.usersList();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Succès de l'action",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,

                    });
                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenue",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //création d'un utilisateur
    $scope.createUser = function (){
        $http.post("/pharmaxiel/api/v1/saveUser", $scope.appUser)
            .then(function (response) {
                    $scope.appUser = response.data;
                    $scope.resetUser();
                    $scope.usersList();
                    $scope.toggleForm();

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Utilisateur crée avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenu lors de la création de l'utilisateur",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //edition d'un utilisateur
    $scope.editUser = function (id){
        $http.get("/pharmaxiel/api/v1/loadUserById/"+id)
            .then(function (response) {
                    $scope.appUser = response.data;
                    $scope.toggleForm();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Utilisateur sélectionné",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenu lors de la sélection",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //recharge de la liste
    $scope.usersList = function () {
        $http.get("/pharmaxiel/api/v1/usersList")
            .then(function (response) {
                $scope.userData = response.data;
                $scope.usersTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.userData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.userData, params.orderBy()) : $scope.userData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });

                // $scope.userData = null;
                $scope.userData.data = null;
            });

    };
    $scope.usersList();


}
//======================================================
//==========  inventaire Controller  ======================
//======================================================
app.controller('inventaireController',inventaireController);
function inventaireController($scope , $http , $filter , fileUpload , NgTableParams ){
    $scope.inventaireData = {data:[]};
    $scope.inventaire = {};
    $scope.showForm = false;
    $scope.participerRayonId;

    //affichage du formulaire
    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    };

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();


    //réinitialisation de l'objet d'inventaire
    $scope.resetInventaire = function () {
        $scope.inventaire = {};
    }

    //list des utilisateurs actif
    $scope.listActif = function () {
        $http.get("/pharmaxiel/api/v1/usersListActif")
            .then(function (response) {
                $scope.listUsersActif = response.data;
            })
    }
    $scope.listActif();

    //list des localisations
    $scope.listLocalisations = function () {
        $http.get("/pharmaxiel/api/v1/localisation/list")
            .then(function (response) {
                $scope.listRayons = response.data;
            })
    }
    $scope.listLocalisations();

    //création d'une ligne de participation
    $scope.createParticiper = function (user_id,inventaire_id,localisation_id) {
        $http.post("/pharmaxiel/api/v1/participer/save/"+user_id+"/"+inventaire_id+"/"+localisation_id)
            .then(function (response) {
                $scope.participer = response.data;
                    $scope.participerRayonId = null;
                    $scope.participationsList();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Localisation affectée avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Erreur d'affectation, celle-ci peut déjà exister pour cet utilisateur dans cet inventaire.",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    }

    //Creation d'une ligne d'inventaire
    $scope.createInventaire = function (){
        $http.post("/pharmaxiel/api/v1/inventaire/save/", $scope.inventaire)
            .then(function (response) {
                    $scope.inventaire = response.data;
                    $scope.inventairesList();
                    $scope.resetInventaire();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Ligne d'inventaire crée avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenu lors de l'enrégistrement",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //Reccuperer pour editer
    $scope.editInventaire = function (id){
        $http.get("/pharmaxiel/api/v1/inventaire/edit/" + id)
            .then(function (response) {
                    $scope.inventaire = response.data;

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Ligne séléctionnée, procédez à la modification",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenue",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    $scope.deleteParticiper = function (id) {
        $http.delete("/pharmaxiel/api/v1/participer/delete/" + id)
            .then(function (response) {
                    $scope.participationsList();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Succès de la suppression",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Echec de la suppression",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    }

    //Reccuperer pour editer
    $scope.activeOrDesactivate = function (id){
        $http.put("/pharmaxiel/api/v1/inventaire/changeStatus/" + id)
            .then(function (response) {
                    $scope.inventaire = response.data;
                    $scope.inventairesList();
                        new PNotify({
                            title: "Inventaire+ | Notification",
                            text: "Inventaire activé/ désactivé avec succès",
                            type: "success",
                            styling: "bootstrap3",
                            delay: 5000,
                            history: false,
                            sticker: true,
                        });
                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, une erreur est survenue",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //recharge de la liste
    $scope.inventairesList = function () {
        $http.get("/pharmaxiel/api/v1/inventaire/list")
            .then(function (response) {
                $scope.inventaireData = response.data;
                $scope.inventairesTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.inventaireData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.inventaireData, params.orderBy()) : $scope.inventaireData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });

                //$scope.inventaire = null;
                $scope.inventaireData.data = null;
            });

    };
    $scope.inventairesList();

    //Liste des participations en tableau
    $scope.participationsList = function () {
        $http.get("/pharmaxiel/api/v1/participer/list")
            .then(function (response) {
                $scope.participerData = response.data;
                $scope.participationsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.participerData.length,
                    getData: function (params) {
                        $scope.dat = params.sorting() ? $filter('orderBy')($scope.participerData, params.orderBy()) : $scope.participerData;
                        $scope.dat = params.filter() ? $filter('filter')($scope.dat, params.filter()) : $scope.dat;
                        $scope.dat = $scope.dat.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.dat;
                    }
                });

                //$scope.inventaire = null;
                $scope.participerData.dat = null;
            });

    };
    $scope.participationsList();

}
//======================================================
//==========  comptage Controller  ======================
//======================================================
app.controller('traitementController',traitementController);
function traitementController($scope , $http , $filter , fileUpload , NgTableParams){
    $scope.comptageData = {data:[]};
    $scope.produitData = {data:[]};
    $scope.traitementData = {data:[]};
    //objet produit
    $scope.stockProduit = {};
    //objet traitement
    $scope.traitement = {};
    //etat d'affichage du formulaire
    $scope.showForm = false;
    //code du rayon choisi
    $scope.chosedParticiper = {};
    //predit du medicament à inventorié
    $scope.codeNomProduit;
    //variable du model du type de comptage
    $scope.t_Comptage = {};
    //critere de recherche par code unique
    $scope.codeDouchette = "";
    //code unique produit
    $scope.codeUniqueProduit = "";
    //localisation choisi
    $scope.localisationActive = 0;

    $scope.splitArray = [];

    //$scope.splitArray = $scope.chosedParticiper.split('-');


    $scope.maDate = "";
    $scope.maDateD = "";
    $scope.searchTag = "";

    $scope.splitHandler = function (){
        return  $scope.splitArray = $scope.chosedParticiper.split('-');
    }

    //liste des types de comptage
    $scope.getTypeComptage = function (){
        $http.get("/pharmaxiel/api/v1/typeComptage/list")
            .then(function (response) {
                $scope.typeComptage = response.data;
            })
    }
    $scope.getTypeComptage();

    //autofocus function
    $scope.autofocusExtraField = function() {
        if ($scope.codeDouchette === 'd') {
            var extraFieldElement = document.getElementById('codeU');
            extraFieldElement.focus();
        }
    };

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
                //localisations pour un utilisateur
                $scope.localisationUser($scope.user.username);
                $scope.inventaireUser($scope.user.username);
            })
    }
    $scope.getUserDetails();
    $scope.reset = function () {
        $scope.stockProduit = {};
    };
    //ouvrir la fenetre de comptage
    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    };
    //liste des rayons d'un utilisateur
    $scope.localisationUser = function(username){
        $http.get("/pharmaxiel/api/v1/participer/localisationByUser/"+username)
            .then(function (response) {
                $scope.participerByUser = response.data;

            })
    };
    //Inventaire actif d'un utilisateur
    $scope.inventaireUser = function(username){
        $http.get("/pharmaxiel/api/v1/participer/inventaireParticiper/"+username)
            .then(function(response) {
                $scope.userInventaire = response.data;
                //alert("===============");
            })
    };
    //supression d'un comptage
    $scope.deleteTraitement = function (id){
        $http.delete("/pharmaxiel/api/v1/traitement/delete/"+id)
            .then(function (){
                $scope.listTraitement();
                $scope.handleAutofocus();
                $scope.listProduits(parseInt($scope.splitArray[0]),parseInt($scope.splitArray[1]));
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Suppression Effectuée",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback() {
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Échec de la suppression, Veuillez réessayez",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 2500,
                        history: false,
                        sticker: true,
                    });

                })

    }

    //sauvegarde d'une toute nouvelle ligne de traitement d'un produit inexistant en stock
    $scope.saveNewTraitement = function (){
        alert($scope.traitement.datePeremption);
        $http.post("/pharmaxiel/api/v1/traitement/save", $scope.traitement)
            .then(function (response){
                $scope.traitement = response.data;

                $scope.listTraitement();

                $scope.traitement = {};
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Nouveau produit enrégistré avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback() {
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Echec d'enrégistrement du produit",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 2500,
                        history: false,
                        sticker: true,
                    });

                })

    }

    //sauvegarde reelle du traitement
    $scope.saveRealTraitement = function(id_stockproduit,id_participer,id_fournisseur,qteCompte,datePeremption,prixVente){
        id_participer = parseInt(id_participer);
        $http.post("/pharmaxiel/api/v1/traitement/realSave/"+ id_stockproduit + "/" + id_participer + "/"+ id_fournisseur + "/" + qteCompte +"/"+ datePeremption+"/"+prixVente)
            .then(function (response) {
                    $scope.savedTraitement = response.data;
                    //recharge de la liste

                    $scope.listTraitement();
                    $scope.listProduits(parseInt($scope.splitArray[0]),parseInt($scope.splitArray[1]));

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "<< "+ $scope.savedTraitement.stockProduit.produit.libelle +" >> inventorié avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                    //reinitialisation du produit
                    //$scope.stockProduit = {};

                    //reinitialisation des données de traitement
                    $scope.traitement = {};

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé << "+ $scope.savedTraitement.stockProduit.produit.libelle +" >> déjà inventorié, supprimez pour modifier",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    $scope.handleAutofocus = function (){
        var code = document.getElementById('codeU');
        code.value = "";
        code.focus();
    }

    //sauvegarde reelle du traitement pour doucette
    $scope.saveRealTraitementDouchette = function(id_stockproduit,id_participer,id_fournisseur,qteCompte,datePeremption,prixVente){
        id_participer = parseInt(id_participer);
        $http.post("/pharmaxiel/api/v1/traitement/realSave/"+ id_stockproduit + "/" + id_participer + "/"+ id_fournisseur + "/" + qteCompte +"/"+ datePeremption + "/" +prixVente)
            .then(function (response) {
                    $scope.savedTraitement = response.data;

                    $scope.handleAutofocus();

                    $scope.listTraitement();

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "<< "+ $scope.savedTraitement.stockProduit.produit.libelle +" >> inventorié avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                    //reinitialisation du produit
                    //$scope.stockProduit = {};

                    //reinitialisation des données de traitement
                    $scope.traitement = {};

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé << "+ $scope.savedTraitement.stockProduit.produit.libelle +" >> déjà inventorié, supprimez pour modifier",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    $scope.idPart = 0;

    //liste des fournisseurs
    $scope.fournisseurList = function (){
        $http.get("/pharmaxiel/api/v1/fournisseur/list")
            .then(function (response) {
                $scope.listFournisseurs = response.data;
            })
    }
    $scope.fournisseurList();

    //Tableau des produits
    $scope.listProduits = function (idLocalisation,idParticiper) {

        idLocalisation = parseInt(idLocalisation);
        idParticiper = parseInt(idParticiper);

        $scope.idPart = parseInt(idParticiper);

        $http.get("/pharmaxiel/api/v1/stockproduit/list/" + idLocalisation + "/" + idParticiper)
            .then(function (response) {
                $scope.produitData = response.data;
                $scope.produitsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 10
                }, {
                    total: $scope.produitData.length,
                    getData: function (params) {
                        $scope.dataP = params.sorting() ? $filter('orderBy')($scope.produitData, params.orderBy()) : $scope.produitData;
                        $scope.dataP = params.filter() ? $filter('filter')($scope.dataP, params.filter()) : $scope.dataP;
                        $scope.dataP = $scope.dataP.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.dataP;
                    }
                });
                $scope.produitData.data = null;
            });

    };

    //recharge de la liste des traitement
    $scope.listTraitement = function () {
        $http.get("/pharmaxiel/api/v1/traitement/list")
            .then(function (response) {
                $scope.traitementData = response.data;
                $scope.traitementsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.traitementData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.traitementData, params.orderBy()) : $scope.traitementData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });
                // $scope.traitement = null;
                $scope.traitementData.data = null;
            });

    };
    $scope.listTraitement();

    /* $scope.listProduits = function () {
         $http.get("/pharmaxiel/api/v1/stockproduit/list")
             .then(function (response) {
                 $scope.produitData = response.data;
                 $scope.produitsTable = new NgTableParams({
                     //nombre de lignes a afficher par defaut
                     page: 1,
                     count: 500
                 }, {
                     total: $scope.produitData.length,
                     getData: function (params) {
                         $scope.dataP = params.sorting() ? $filter('orderBy')($scope.produitData, params.orderBy()) : $scope.produitData;
                         $scope.dataP = params.filter() ? $filter('filter')($scope.dataP, params.filter()) : $scope.dataP;
                         $scope.dataP = $scope.dataP.slice((params.page() - 1) * params.count(), params.page() * params.count());
                         return $scope.dataP;
                     }
                 });
                 // $scope.traitement = null;
                 $scope.produitData.data = null;
             });

     };
     $scope.listProduits();*/

    //reccuperation d'un produit pour le comptage
    $scope.produitDouchette = function (codeUnique) {
        $http.get("/pharmaxiel/api/v1/stockproduit/produit/douchette/" + codeUnique)
            .then(function (response) {
                $scope.produitDataDouchette = response.data;
            })
    };


}
//======================================================
//==========  écarts Controller  ======================
//======================================================
app.controller('ecartsController',ecartsController);
function ecartsController($scope , $http , $filter , fileUpload , NgTableParams ){
    $scope.ecartData = {data:[]};
    $scope.ecart = {};
    $scope.traitement = {};
    $scope.showForm = false;
    $scope.ligne = 0;

    // @Function
    // Description  : Triggered while displaying expiry date
    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    // gestion du modal
    $scope.showModal = false;
    $scope.buttonClicked = "";
    $scope.toggleModal = function(btnClicked){
        $scope.buttonClicked = btnClicked;
        $scope.showModal = !$scope.showModal;
    };

    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    };

    $scope.resetTraitement = function () {
        // $scope.traitement.libelleProduit = '';
        // $scope.traitement.codeCip = '';
        $scope.traitement.qteCompte = '';
        $scope.traitement.prixVente = '';
        $scope.traitement.datePeremption = '';
        $scope.traitement.participer.localisation.libelle= '';
    };

    //liste des fournisseurs
    $scope.fournisseurList = function (){
        $http.get("/pharmaxiel/api/v1/fournisseur/list")
            .then(function (response) {
                $scope.listFournisseurs = response.data;
            })
    }
    $scope.fournisseurList();

    //liste des motifs
    $scope.motifList = function (){
        $http.get("/pharmaxiel/api/v1/motif/list")
            .then(function (response) {
                $scope.listMotifs = response.data;
            })
    }
    $scope.motifList();

    //liste des localisations
    $scope.listLocalisations = function (){
        $http.get("/pharmaxiel/api/v1/traitement/localisations")
            .then(function (response) {
                $scope.localisations = response.data;
            })
    }
    $scope.listLocalisations();

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    };
    $scope.getUserDetails();

    //reccuperation d'une ligne de traitement
    $scope.editTraitement = function(id){
        $http.get("/pharmaxiel/api/v1/traitement/edit/"+id)
            .then(function (response) {
                $scope.traitement = response.data;
            })
    };

    //Listes des participations
    $scope.participerList = function (){
        $http.get("/pharmaxiel/api/v1/participer/list")
            .then(function (response) {
                $scope.allParticiper = response.data;
            })
    };
    $scope.participerList();

    //liste des inventaires
    $scope.inventaireList = function (){
        $http.get("/pharmaxiel/api/v1/inventaire/list")
            .then(function (response) {
                $scope.allInventaire = response.data;
            })
    };
    $scope.inventaireList();

    //liste des inventaires actifs
    $scope.inventaireActifList = function (){
        $http.get("/pharmaxiel/api/v1/inventaire/list/actifs")
            .then(function (response) {
                $scope.allInventaireActifs = response.data;
            })
    };
    $scope.inventaireActifList();

    //localisations par inventaire
    $scope.localisationByInventaire = function(inventaireCode){
        $http.get("/pharmaxiel/api/v1/participer/localisationByInventaire/"+inventaireCode)
            .then(function (response) {
                $scope.participerLocalisations = response.data;
            })
    };

    //sauvegarde d'une toute nouvelle ligne de traitement d'un produit inexistant en stock
    $scope.saveTraitement = function (){
        $http.post("/pharmaxiel/api/v1/ecartTraitement/save",$scope.traitement)
            .then(function (response){
                    $scope.traitData = response.data;
                    $scope.listTraitement();
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Traitement enrégistré avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback() {
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Echec d'enrégistrement du produit",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 2500,
                        history: false,
                        sticker: true,
                    });

                })

    }

 //sauvegarde d'un motif
    $scope.saveMotif = function (id,motif){
        $http.put("/pharmaxiel/api/v1/traitement/saveMotif/"+id+"/"+motif)
            .then(function (response) {
                $scope.traitement = response.data;
                $scope.listTraitement();
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Motif sauvegardé avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, le motif pour << >> n'a pas été enregistré",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };


    //recharge de la liste des traitement
    $scope.listTraitement = function () {
        $http.get("/pharmaxiel/api/v1/ecartTraitement/ecarts/list")
            .then(function (response) {
                $scope.traitementData = response.data;
                $scope.traitementsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.traitementData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.traitementData, params.orderBy()) : $scope.traitementData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });
                // $scope.traitement = null;
                $scope.traitementData.data = null;
            });

    };
    $scope.listTraitement();


}

//controller de la page d'acceuil
app.controller('acceuilController',acceuilController);
function acceuilController($scope , $http , $filter , fileUpload , NgTableParams){

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();


}

//controller de chargement des données dans la base
app.controller('chargementController',chargementController);
function chargementController($scope , $http , $filter , fileUpload , NgTableParams){

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();

    //chargement de tous les éléments en un
    $scope.chargerDonneesProduits = function(){
        var file = $scope.importProduit;
        $scope.ext = $scope.extractExtension(file.name);

        if($scope.ext==="xlsx"){
            console.log('file is');
            console.dir(file);
            if (file!=undefined){
                var uploadUrl = "/chargement/chargement_all";

                fileUpload.uploadFileToUrl(file, uploadUrl);

                $("#importProduit").val(null);
            }
        }else {
            new PNotify({
                title: "Notification Pharmaxiel_web",
                type: "warning",
                text: "Le fichier choisi n'est pas un fichier Excel valide. Veuillez choisir un fichier au format .xlsx",
                nonblock: {
                    nonblock: false
                },
                addclass: "error",
                styling: 'bootstrap3',
                hide: true,

            });
        }
    };

    //extraire l'extension d'un fichier
    $scope.extractExtension = function (nomFichier) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(nomFichier)[1];
        return ext;
    }


}

//controller des produits en stock
app.controller('updateStockController',updateStockController);
function updateStockController($scope , $http , $filter , fileUpload , NgTableParams){
    $scope.showForm = false;

    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    };

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();

    //liste des inventaires
    $scope.inventaireList = function (){
        $http.get("/pharmaxiel/api/v1/inventaire/list")
            .then(function (response) {
                $scope.allInventaire = response.data;
            })
    };
    $scope.inventaireList();

    //localisations par inventaire
    $scope.localisationByInventaire = function(inventaireCode){
        $http.get("/pharmaxiel/api/v1/participer/localisationByInventaire/"+inventaireCode)
            .then(function (response) {
                $scope.participerLocalisations = response.data;
            })
    };

    //génération d'un etat d'inventaire
    $scope.generateInventaireEtat = function(codeInventaire,codeRayon){
        $http.get("/pharmaxiel/api/v1/etat/traitement/generate/etatInventaire/" + codeInventaire + "/" + codeRayon)
            .then(function (response) {
                //$scope.participerLocalisations = response.data;
                    //$scope.exportToExcel(codeInventaire,codeRayon);
                new PNotify({
                    title: "Inventaire+ | Notification",
                    text: "Téléchargement, parientez...",
                    type: "success",
                    styling: "bootstrap3",
                    delay: 2000,
                    history: false,
                    sticker: true,
                });
            },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Erreur lors du téléchargement",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //Export de l'etat en excel
    $scope.exportToExcel = function(codeInventaire,codeRayon){
        $http.get("/pharmaxiel/api/v1/etat/inventaire/" + codeInventaire + "/" + codeRayon)
            .then(function (response) {
                //$scope.participerLocalisations = response.data;
                //$scope.listTraitement();
                new PNotify({
                    title: "Inventaire+ | Notification",
                    text: "Données exportées avec succès, Téléchargement...",
                    type: "success",
                    styling: "bootstrap3",
                    delay: 2000,
                    history: false,
                    sticker: true,
                });
            },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Erreur de l\'export du fichier",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };


    //Listes des participations
    $scope.participerList = function (){
        $http.get("/pharmaxiel/api/v1/participer/list")
            .then(function (response) {
                $scope.allParticiper = response.data;
            })
    };
    $scope.participerList();

}

//controller de la age historique
app.controller('historiqueController',historiqueController);
function historiqueController($scope , $http , $filter , fileUpload , NgTableParams){
    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();
}

//controleur du profil utilisateur
app.controller('profilController',profilController);
function profilController($scope , $http , $filter , fileUpload , NgTableParams){

    $scope.userData = {data: []};
    //objet utilisateur
    $scope.appUser = {};
    //objet de reccuperation des details de l'utilisateur
    $scope.user = {};
    //objet utilisateur-role
    $scope.userRole = {};
    //affichage du formulaire de modification du mot de passe si vrai
    $scope.schowEditForm = false;


    //pattern du mot de passe
    $scope.pat = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#_?&])[A-Za-z\d$@$!%*#_?&]{9,20}$/;

    //verification du mot de passe
    $scope.compare = function (repass) {
        $scope.isconfirm = $scope.password == repass ?
            true : false;
    }


    //création d'un utilisateur
    $scope.createUser = function (){
        $http.post("/pharmaxiel/api/v1/saveUser", $scope.appUser)
            .then(function (response) {
                    $scope.appUser = response.data;
                    $scope.schowEditForm=false;

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Mot de passe mise à jour avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Erreur de mise à jour du mot de passe",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };


    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.appUser = response.data;
            })
    }
    $scope.getUserDetails();

    //reccuperation d'un utilisateur à travers son nom d'utilisateur
    $scope.loadUser = function (username) {
        $http.get("/conventionnement/Api/v1/loadUser/"+username)
            .then(function (response) {
                $scope.appUser = response.data;
            });
    }

    //initialisation de l'objet utilisateur
    $scope.resetUserData = function () {
        return $scope.appUser = {};
    }

    //reset du userRole
    $scope.resetUserRole = function () {
        return $scope.userRole = {};
    }

}




