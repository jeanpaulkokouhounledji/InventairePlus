/**
 * controleur angular
 */
var app = angular.module('pharmaxielweb',['ngTable']);

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
app.directive('ngConfirmClick', [
    function(){
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
                        text: "Fichier(s) envoyé(s) avec succès",
                        nonblock: {
                            nonblock: true
                        },
                        addclass: "success",
                        styling: 'bootstrap3',
                        hide: true,

                    });

                    //$scope.notification("message envoyé avec succès","success");
                    //alert("Fichier importé");
                }
                ,function errorCallback(response) {

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


    //reccuperation des deux parties d'une chaine de caractere de part et d'autre d'un virgule
    $scope.mySplit = function(string, nb) {
        var array = string.split(',');
        return array[nb];
    }

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

    //recherche dans un select
    $(function() {
        $('.selectpicker').selectpicker();
    });

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


    //sauvegarde reelle du traitement
    $scope.saveRealTraitement = function(id_stockproduit,id_participer,id_fournisseur,qteCompte,datePeremption,prixVente){
        $http.post("/pharmaxiel/api/v1/traitement/realSave/"+ id_stockproduit + "/" + id_participer + "/"+ id_fournisseur + "/" + qteCompte +"/"+ datePeremption+"/"+prixVente)
            .then(function (response) {
                    $scope.savedTraitement = response.data;
                    //recharge de la liste
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

    //liste des produit
   /* $scope.stockProduitList = function (){
        $http.get("/pharmaxiel/api/v1/stockproduit/list")
            .then(function (response) {
                $scope.listStockProduit = response.data;
            })
    }
    $scope.stockProduitList();*/

    //liste des fournisseurs
    $scope.fournisseurList = function (){
        $http.get("/pharmaxiel/api/v1/fournisseur/list")
            .then(function (response) {
                $scope.listFournisseurs = response.data;
            })
    }
    $scope.fournisseurList();

    //ligne de produit à compter
    /*$scope.aCompter = function (codeUnique) {
        $http.get("/pharmaxiel/api/v1/stockproduit/recherche/"+codeUnique)
            .then(function (response) {
                $scope.stockProduit = response.data;
                if($scope.stockProduit==''){
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Aucune ligne de produit en stock correspondante",
                        type: "warning",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });
                }
            })
    };*/

    //recharge de la liste des traitement
    $scope.listTraitement = function () {
        $http.get("/pharmaxiel/api/v1/traitement/list")
            .then(function (response) {
                $scope.traitementData = response.data;
                $scope.traitementsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    /*page: 1,
                    count: 5*/
                }, {
                    total: $scope.traitementData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.traitementData, params.orderBy()) : $scope.traitementData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        // $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });
                // $scope.traitement = null;
                $scope.traitementData.data = null;
            });

    };
    $scope.listTraitement();


    //Tableau des produits
    $scope.listProduits = function () {
        $http.get("/pharmaxiel/api/v1/stockproduit/list")
            .then(function (response) {
                $scope.produitData = response.data;
                $scope.produitsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 2
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
    $scope.listProduits();


}

//======================================================
//==========  écarts Controller  ======================
//======================================================


app.controller('ecartsController',ecartsController);
function ecartsController($scope , $http , $filter , fileUpload , NgTableParams ){
    $scope.ecartData = {data:[]};
    $scope.ecart = {};
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
    };
    $scope.getUserDetails();

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
        $http.get("/pharmaxiel/api/v1/traitement/list")
            .then(function (response) {
                $scope.traitementData = response.data;
                $scope.traitementsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    /*page: 1,
                    count: 5*/
                }, {
                    total: $scope.traitementData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.traitementData, params.orderBy()) : $scope.traitementData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        //$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
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

    //upload nomenclature des actes
    $scope.chargerImport = function(){
        var file = $scope.importFile;
        console.log('file is');
        console.dir(file);
        if (file!=undefined){
            var uploadUrl = "/chargement/uploadExcel";

            fileUpload.uploadFileToUrl(file, uploadUrl);

            $("#importFile").val(null);
        }
    };

   /* $scope.chargerImport = function() {
        var file = $scope.importFile; // Get the file from the file input field
        var formData = new FormData(); // Create FormData object

        formData.append('file', file); // Append the file to FormData

        // Make POST request to the server to upload the file
        $http.post('/chargement/import', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(response) {
            // Handle success response
            console.log(response.data); // Display success message
        }, function(error) {
            // Handle error response
            console.error('Error uploading file:', error);
        });
    };*/

}

//controller de chargement des données dans la base
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

    //Listes des participations
    $scope.participerList = function (){
        $http.get("/pharmaxiel/api/v1/participer/list")
            .then(function (response) {
                $scope.allParticiper = response.data;
            })
    };
    $scope.participerList();

}


//controller de chargement des données dans la base
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


    //Ajout d'un nouvel utilisateur
    $scope.saveUser = function () {
        $http.post("/pharmaxiel/api/v1/saveUser", $scope.user)
            .then(function (response) {
                    $scope.appUser = response.data;
                    $scope.resetUserData();
                    new PNotify({
                        title: "INAM | Conventionnement",
                        text: "Votre mot de passe a été changé avec succès",
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
                        text: "Échec! vérifiez les données et réessayez",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 2500,
                        history: false,
                        sticker: true,
                    });

                });
    }

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
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




