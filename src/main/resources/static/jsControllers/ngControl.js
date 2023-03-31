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
        $http.get("http://localhost:3000/pharmaxiel/api/v1/getLogedUser")
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

   /* $scope.produitToCount = function (localisation,critere){
        $http.get("/pharmaxiel/api/v1/produit/recherche/"+localisation+"/"+critere)
            .then(function (response) {
                $scope.toCount = response.data;
                    alert("OK");
                })
    }*/


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


app.controller('comptageController',comptageController);
function comptageController($scope , $http , $filter , fileUpload , NgTableParams){
    $scope.comptageData = {data:[]};
    //objet produit
    $scope.produit = {};
    //etat d'affichage du formulaire
    $scope.showForm = false;
    //code du rayon choisi
    $scope.chosedRayon;
    //predit du medicament à inventorié
    $scope.codeNomProduit;


    $scope.reset = function () {
        $scope.produit = {};
    }

    //ouvrir la fenetre de comptage
    $scope.toggleForm = function () {
        $scope.showForm==false?$scope.showForm=true:$scope.showForm=false;
    }

    //liste des rayons d'un utilisateur
    $scope.localisationUser = function(username){
        $http.get("/pharmaxiel/api/v1/participer/localisationByUser/"+username)
            .then(function (response) {
                $scope.localisationByUser = response.data;
            })
    }

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


    //parametres utilisateur
    $scope.getUserDetails = function (){
        $http.get("/pharmaxiel/api/v1/getLogedUser")
            .then(function (response) {
                $scope.user = response.data;
                $scope.localisationUser($scope.user.username)
            })
    }
    $scope.getUserDetails();


    //ligne de produit à compter
    $scope.aCompter = function (rayon,codeNomProduit) {
        $http.get("/pharmaxiel/api/v1/produit/recherche/"+rayon+"/"+codeNomProduit)
            .then(function (response) {
                $scope.produit = response.data;
                if($scope.produit==''){
                    new PNotify({
                        title: "Inventaire+ | Notification",
                        text: "Aucune ligne correspondande à "+rayon+" dans le rayon << "+$scope.chosedRayon+" >>",
                        type: "warning",
                        styling: "bootstrap3",
                        delay: 5000,
                        history: false,
                        sticker: true,
                    });
                }
            })
    }


    //Liste des produits comptés
    $scope.countedList = function(rayon) {
        $http.get("/pharmaxiel/api/v1/produit/checkedList/"+rayon)
            .then(function (response) {
                $scope.countedData = response.data;
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





