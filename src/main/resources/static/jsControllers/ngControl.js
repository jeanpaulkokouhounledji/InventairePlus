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

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("http://localhost:3000/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();

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
                        text: "Erreur d'affectation",
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

                        new PNotify({
                            title: "Inventaire+ | Notification",
                            text: "Inventaire activé/ désactivé avec succès",
                            type: "success",
                            styling: "bootstrap3",
                            delay: 5000,
                            history: false,
                            sticker: true,
                        });

                    $scope.inventairesList();

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
    $scope.traitementData = {data:[]};
    //objet produit
    $scope.produit = {};
    //objet traitement
    $scope.traitement = {};
    //etat d'affichage du formulaire
    $scope.showForm = false;
    //code du rayon choisi
    $scope.chosedRayon;
    //predit du medicament à inventorié
    $scope.codeNomProduit;


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
        $scope.produit = {};
    };

    //ouvrir la fenetre de comptage
    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    };

    //liste des rayons d'un utilisateur
    $scope.localisationUser = function(username){
        $http.get("/pharmaxiel/api/v1/participer/localisationByUser/"+username)
            .then(function (response) {
                $scope.localisationByUser = response.data;
            })
    };

    //Inventaire de l'utilisateur
    $scope.inventaireUser = function(username){
        $http.get("/pharmaxiel/api/v1/participer/inventaireParticiper/"+username)
            .then(function (response) {
                $scope.usersInventaire = response;
            })
    };


    //sauvegarde du traitement
    $scope.saveTraitement = function(){
        $http.post("/pharmaxiel/api/v1/traitement/save",$scope.traitement)
            .then(function (response) {
                $scope.savedTraitement = response.data;

                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "<< "+ $scope.produit.libelle +" >> inventorié avec succès",
                        type: "success",
                        styling: "bootstrap3",
                        delay: 2000,
                        history: false,
                        sticker: true,
                    });

                    //reinitialisation des données de traitement
                    $scope.traitement = {};

                    //reinitialisation du produit
                    $scope.produit = {};

                },
                function errorCallback(response) {
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Désolé, la saisie n'a pas été enrégistrée",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };

    //sauvegarde d'un produit
    $scope.saveProduit = function(rayon){
        $http.post("/pharmaxiel/api/v1/produit/save",$scope.produit)
            .then(function (response) {
                $scope.savedProduct = response.data;
                    //mise à jour de la liste des données comptées
                    $scope.countedList(rayon);
                    //reinitialisation des données de produit
                    $scope.produit = {};
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "<< "+$scope.savedProduct.libelle+" >> inventorié avec succès",
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
                        text: "Désolé, les modifications n'ont pas étés enregistrées",
                        type: "error",
                        styling: "bootstrap3",
                        delay: 3000,
                        history: false,
                        sticker: true,
                    });

                })
    };


    //liste des produit
    $scope.produitList = function (){
        $http.get("/pharmaxiel/api/v1/produit/list")
            .then(function (response) {
                $scope.listProduits = response.data;
            })
    }
    $scope.produitList();

    //ligne de produit à compter
    $scope.aCompter = function (codeNomProduit) {
        $http.get("/pharmaxiel/api/v1/produit/recherche/"+codeNomProduit)
            .then(function (response) {
                $scope.produit = response.data;
                if($scope.produit==''){
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Aucun produit correspondant",
                        type: "warning",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });
                }
            })
    };

    //recharge de la liste
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
    }

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("http://localhost:3000/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();


    //recharge de la liste
    $scope.ecartList = function () {
        $http.get("/pharmaxiel_web/Api/v1/users/list")
            .then(function (response) {
                $scope.ecartData = response.data;
                $scope.ecartsTable = new NgTableParams({
                    //nombre de lignes a afficher par defaut
                    page: 1,
                    count: 5
                }, {
                    total: $scope.ecartData.length,
                    getData: function (params) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.ecartData, params.orderBy()) : $scope.ecartData;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        return $scope.data;
                    }
                });

                $scope.ecartData = null;
                $scope.data.data = null;
            });

    };
    $scope.ecartList();


}

app.controller('acceuilController',acceuilController);
function acceuilController($scope , $http , $filter , fileUpload , NgTableParams){

    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("http://localhost:3000/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
            })
    }
    $scope.getUserDetails();


}





