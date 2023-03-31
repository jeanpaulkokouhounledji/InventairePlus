var app = angular.module('paramapp', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngTable', 'checklist-model']);



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
app.controller('dialogController', dialogController);

function dialogController($scope, $mdDialog) {
	$scope.status = '';
	$scope.items = [1, 2, 3, 4, 5];
	$scope.showAlert = function (ev) {
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#dialogContainer')))
			.clickOutsideToClose(true)
			.title('TutorialsPoint.com')
			.textContent('Welcome to TutorialsPoint.com')
			.ariaLabel('Welcome to TutorialsPoint.com')
			.ok('Ok!')
			.targetEvent(ev)
		);
	};

	 
	$scope.showConfirm = function (event) {
		var confirm = $mdDialog.confirm()
			.title('Are you sure to delete the record?')
			.textContent('Record will be deleted permanently.')
			.ariaLabel('TutorialsPoint.com')
			.targetEvent(event)
			.ok('Yes')
			.cancel('No');
		$mdDialog.show(confirm).then(function () {
			$scope.status = 'Record deleted successfully!';
		}, function () {
			$scope.status = 'You decided to keep your record.';
		});
	};


	$scope.showCustom = function (event) {
		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			template: '<md-dialog>' +
				'  <md-dialog-content>' +
				'     Welcome to TutorialsPoint.com' +
				'  </md-dialog-content>' +
				'</md-dialog>',
			controller: function DialogController($scope, $mdDialog) {
				$scope.closeDialog = function () {
					$mdDialog.hide();
				}
			}
		});
	};
}

app.directive("select2", function($timeout, $parse) {
  return {
    restrict: 'AC',
    require: 'ngModel',
    link: function(scope, element, attrs) {
      console.log(attrs);
            $timeout(function() {
                $(element).select2();
                element.select2Initialized = true;
      },200); 

      var refreshSelect = function() {
        if (!element.select2Initialized) return;
        $timeout(function() {
          element.trigger('change');
        });
      };
      
      var recreateSelect = function () {
        if (!element.select2Initialized) return;
        $timeout(function() {
          element.select2('destroy');
          element.select2();
        });
      };

      scope.$watch(attrs.ngModel, refreshSelect);

      if (attrs.ngOptions) {
        var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
        // watch for option list change
        scope.$watch(list, recreateSelect);
      }

      if (attrs.ngDisabled) {
        scope.$watch(attrs.ngDisabled, refreshSelect);
      }
    }
  };
});

/***************************** CONTROLLEUR DE GESTION DES CATEGORIES ***************************** 
***********************************************************************************************/

app.controller('paramNotification', paramNotification);

function paramNotification($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	 // Methode pour charger la liste des articles en alerte de stock
	 $scope.OnChangeAlert = function () 
	 {
		$http.get("/article/liste/alerte")
			 .then(function (response) 
		     {
				$scope.notification = response.data;
			 });
	 };
	$scope.OnChangeAlert();
	
	 // Methode pour charger la liste des articles en rupture de stock
	 $scope.OnChangeRupture = function () 
	 {
		$http.get("/article/liste/rupture")
			 .then(function (response) 
		     {
				$scope.notifications = response.data;
			 });
	 };
	$scope.OnChangeRupture();
	
	// Methode pour charger les notifications
	 $scope.OnChange = function () 
	 {
		$http.get("/article/afficher/notification")
			 .then(function (response) 
		     {
				$scope.etats = response.data;
			 });
	 };
	$scope.OnChange();

	$scope.utilisateur;
	// Methode pour charger les notifications
	 $scope.OnUser = function () 
	 {
		$http.get("/Security/getLoggers")
			 .then(function (response) 
		     {
				$scope.utilisateur = response.data;
			 });
	 };
	
	 $scope.OnUser();
	
};

/***************************** CONTROLLEUR DE GESTION DES CLIENTS ***************************** 
***********************************************************************************************/

app.controller('paramClient', paramClient);

function paramClient($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.client = {};
	}
   
 	$scope.verifier = 0;
	$scope.client = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/client/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.client = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/client/save", $scope.client)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du client '  +" "+$scope.client.nom+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/client/edite/" + id)
			 .then(function (response) 
		     {
				$scope.client = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			 $http.post("/client/save", $scope.client)
			   .then(function (response) {
					$scope.client = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification du client'+" "+$scope.client.nom+" "+'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/client/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES CLIENTS ***************************** 
***********************************************************************************************/

app.controller('paramDashboards', paramDashboards);

function paramDashboards($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};
	
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/Vente/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});
						 $scope.OnDesactiveAutoJournee();
	                     $scope.OnDesactiveAutoPromotion();
				});

		};
	$scope.OnChange();
	

	 $scope.articleDispo;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnNombreArticle = function () 
	 {
		$http.get("/article/nombre/articleDispo")
			 .then(function (response) 
		     {
				 $scope.articleDispo = response.data;
			 });
	 };
	 
	 $scope.OnNombreArticle();
	 
	 // Methode pour effectuer une verification de jrne active
	 $scope.OnVerif = function () 
	 {
		$http.get("/impression/verifier")
			 .then(function (response) 
		     {
				 $scope.resultat = response.data;
			 });
	 };
	 
	 $scope.OnVerif();

	 $scope.articleAlerte;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnNombreArticleAlerte = function () 
	 {
		$http.get("/article/nombre/articleAlerte")
			 .then(function (response) 
		     {
				 $scope.articleAlerte = response.data;
			 });
	 };
	 
	 $scope.OnNombreArticleAlerte();
	 
	 $scope.articleEpuise;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnNombreArticleEpuise = function () 
	 {
		$http.get("/article/nombre/articleEpuise")
			 .then(function (response) 
		     {
				 $scope.articleEpuise = response.data;
			 });
	 };
	 
	 
	 $scope.OnNombreArticleEpuise();
	 
	 $scope.totalVenteJour;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnTotalVenteJour= function () 
	 {
		$http.get("/Vente/total/venteJour")
			 .then(function (response) 
		     {
				 $scope.totalVenteJour = response.data;
			 });
	 };
	 
	 $scope.OnTotalVenteJour();
	 
	 $scope.nombreVenteJour;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnNombreVenteJour = function () 
	 {
		$http.get("/Vente/nombre/venteJour")
			 .then(function (response) 
		     {
				 $scope.nombreVenteJour = response.data;
			 });
	 };
	 
	 $scope.nombreDetteActif;
	 
	 // Methode pour effectuer une suppression
	 $scope.OnNombreDetteActif = function () 
	 {
		$http.get("/reglement/nombre/detteActif")
			 .then(function (response) 
		     {
				 $scope.nombreDetteActif = response.data;
			 });
	 };
	 
	// Methode pour desactiver automatiquement les journee d'autre jour
	 $scope.OnDesactiveAutoJournee = function () 
	 {
		$http.get("/Journee/desactivationAutoJournee")
			 .then(function (response) 
		     {
				 $scope.etat = response.data;
				 if($scope.etat == true){
					 new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Les journees precedentes ont été desactiver avec succes',
		                 type:  'info',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				 }
			 });
	 };
	 
	// Methode pour verifier les promotions afin de les desactiver
	 $scope.OnDesactiveAutoPromotion = function () 
	 {
		$http.get("/Promotion/verifypromotionactive")
			 .then(function (response) 
		     {
				$scope.promos = response.data;
				if($scope.promos == true){
					new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Les promotions dépassées ont été desactiver avec succes',
		                 type:  'info',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				}
			 });
	 };
	 
	 $scope.OnNombreVenteJour();
		
	 
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES UNITES DE MESURE ***************************** 
***********************************************************************************************/

app.controller('paramUniteMesure', paramUniteMesure);

function paramUniteMesure($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.unite = {};
	}
   
 	$scope.verifier = 0;
	$scope.unite = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/uniteMesure/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.unite = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/uniteMesure/save", $scope.unite)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de l\'unité'  +" "+$scope.unite.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/uniteMesure/edite/" + id)
			 .then(function (response) 
		     {
				$scope.unite = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			$http.post("/uniteMesure/save", $scope.unite)
			   .then(function (response) {
					$scope.unite = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de l\'unité' +" "+$scope.unite.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/uniteMesure/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};


/***************************** CONTROLLEUR DE GESTION DES FOURNISSEURS ***************************** 
***********************************************************************************************/

app.controller('paramFournisseur', paramFournisseur);

function paramFournisseur($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.fournisseur = {};
	}
   
 	$scope.verifier = 0;
	$scope.fournisseur = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/fournisseur/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.fournisseur = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/fournisseur/save", $scope.fournisseur)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du fournisseur '  +" "+$scope.fournisseur.nom+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/fournisseur/edite/" + id)
			 .then(function (response) 
		     {
				$scope.fournisseur = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			 $http.post("/fournisseur/save", $scope.fournisseur)
			   .then(function (response) {
					$scope.fournisseur = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification du fournisseur'+" "+$scope.fournisseur.nom+" "+'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/fournisseur/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};


/***************************** CONTROLLEUR DE GESTION DES MOIS ***************************** 
***********************************************************************************************/

app.controller('paramMois', paramMois);

function paramMois($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.mois = {};
	}
   
 	$scope.verifier = 0;
	$scope.mois = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/mois/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.mois = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/mois/save", $scope.mois)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du mois de '  +" "+$scope.mois.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/mois/edite/" + id)
			 .then(function (response) 
		     {
				$scope.mois = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			 $http.post("/mois/save", $scope.mois)
			   .then(function (response) {
					$scope.mois = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification du mois de'+" "+$scope.mois.libelle+" "+'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/mois/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
     // Methode pour effectuer une activation
	 $scope.OnActive = function (id) 
	 {
		$http.get("/mois/activate/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };

	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		
		$scope.showConfirm2 = function (event, id) {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir Activer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnActive(id);
				new PNotify({
	                title: 'GesStock validation',
	                text:  'Activation du mois',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock information ',
	                text:  'Opération d\'Activation annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES RUBRIQUES ***************************** 
***********************************************************************************************/

app.controller('paramRubrique', paramRubrique);

function paramRubrique($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.rubrique = {};
	}
   
 	$scope.verifier = 0;
	$scope.rubrique = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/rubrique/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.rubrique = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/rubrique/save", $scope.rubrique)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de la rubrique'  +" "+$scope.rubrique.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/rubrique/edite/" + id)
			 .then(function (response) 
		     {
				$scope.rubrique = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			$http.post("/rubrique/save", $scope.rubrique)
			   .then(function (response) {
					$scope.rubrique = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de la rubrique' +" "+$scope.rubrique.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/rubrique/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};



/***************************** CONTROLLEUR DE GESTION DES CATEGORIES ***************************** 
***********************************************************************************************/

app.controller('paramCategorie', paramCategorie);

function paramCategorie($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.categorie = {};
	}
   
 	$scope.verifier = 0;
	$scope.categorie = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/Categorie/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.categorie = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/Categorie/save", $scope.categorie)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de la categorie'  +" "+$scope.categorie.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/Categorie/edite/" + id)
			 .then(function (response) 
		     {
				$scope.categorie = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
			 $http.post("/Categorie/save", $scope.categorie)
			   .then(function (response) {
					$scope.categorie = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de la catégorie'  +" "+$scope.categorie.libelle+" "+' éffectué avec succès',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/Categorie/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES ARTICLES ***************************** 
***********************************************************************************************/

app.controller('paramArticle', paramArticle);

function paramArticle($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.article = {};
	}
   
     // Methode pour charger la liste des categories
	 $scope.OnChangeCategories = function () 
	 {
		$http.get("/Categorie/liste")
			 .then(function (response) 
		     {
				$scope.categories = response.data;
			 });
	 };
	$scope.OnChangeCategories();
	 
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSaveCategorie = function () 
	{
		  $http.post("/Categorie/save", $scope.categorie)
			   .then(function (response) {
					$scope.OnChangeCategories();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de la categorie'  +" "+$scope.categorie.libelle+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	}
	
 	$scope.verifier = 0;
	$scope.article = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/article/liste/categorie/" +$scope.article.categorie.id)
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.article.id = null;
					$scope.article.designation = null;
					$scope.article.reference = null;
					$scope.article.qteStock = null;
					$scope.article.alerte = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/article/save", $scope.article)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de l\' article'  +" "+$scope.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/article/update/" + id)
			 .then(function (response) 
		     {
				$scope.article = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			$http.post("/article/save", $scope.article)
			   .then(function (response) {
					$scope.article = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de l\'article' +" "+$scope.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/article/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES PROMOTIONS ***************************** 
***********************************************************************************************/

app.controller('paramPromotion', paramPromotion);

function paramPromotion($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.promotion = {};
	}
   
 	$scope.verifier = 0;
	$scope.promotion = {};
    $scope.users;
    
    // Methode pour charger la liste des article
	 $scope.OnChangeArticles= function () 
	 {
		$http.get("/article/liste")
			 .then(function (response) 
		     {
				$scope.articles = response.data;
			 });
	 };
	$scope.OnChangeArticles();

    // Methode pour charger la liste des unites
	 $scope.OnChangeUnites = function (id) 
	 {
		$http.get("/uniteVente/liste/article/" +id)
			 .then(function (response) 
		     {
				$scope.unites = response.data;
			 });
	 };
	$scope.OnChangeUnites();
	
	// Methode pour activer une promotion
	 $scope.OnActive = function (id) 
	 {
		$http.get("/Promotion/active/"+id)
			 .then(function (response) 
		     {
				 $scope.OnChange();
				$scope.promotion = response.data;
			 });
	 };
	 
	// Methode pour desactiver une promotion
	 $scope.OnDesactive = function (id) 
	 {
		$http.get("/Promotion/desactive/"+id)
			 .then(function (response) 
		     {
				 $scope.OnChange();
				$scope.promotion = response.data;
			 });
	 };
	 
	// Methode pour verifier une promotion les promotion afin de les desactiver
	 $scope.OnVerifyPromotion = function () 
	 {
		$http.get("/Promotion/verifypromotionactive")
			 .then(function (response) 
		     {
				$scope.promotion = response.data;
			 });
	 };
	 
	 $scope.OnVerifyPromotion();
	
	$scope.OnChange = function () {
		  $http.get("/Promotion/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.promotion = null;
					$scope.verifier = 0;
					$scope.user.data = null;
					
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/Promotion/save", $scope.promotion)
			   .then(function (response) {
				   $scope.promotions = response.data
					$scope.OnChange();
				   
				   if($scope.promotions == false)
				   {
					   new PNotify({
			                 title: 'GesStock Enregistrement',
			                 text:  'Enrégistrement de la promotion n\' à pas été faite car cet article est déjà en promotion',
			                 type:  'warning',
			                 styling: 'bootstrap3',
			                 delay:3000,
			                 history:false,
			                 sticker:true
			                  
			                });
				   }
				   else
				   {
					   new PNotify({
			                 title: 'GesStock Enregistrement',
			                 text:  'Enrégistrement de la promotion'  +" "+$scope.promotion.libelle+" "+  'éffectué',
			                 type:  'success',
			                 styling: 'bootstrap3',
			                 delay:3000,
			                 history:false,
			                 sticker:true
			                  
			                });
				   }
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/Promotion/edit/" + id)
			 .then(function (response) 
		     {
				$scope.promotion = response.data;
				$scope.verifier = 1;
				$scope.promotion.dateDebut= new Date($scope.promotion.dateDebut);
				$scope.promotion.dateFin= new Date($scope.promotion.dateFin);
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
			 $http.post("/Promotion/save", $scope.promotion)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de la promotion'  +" "+$scope.promotion.libelle+" "+' éffectué avec succès',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/Promotion/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};

/***************************** CONTROLLEUR DE GESTION DES UNITES ARTICLES ***************************** 
***********************************************************************************************/

app.controller('paramUnite', paramUnite);

function paramUnite($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.unitevente = {};
	}
   
     // Methode pour charger la liste des categories
	 $scope.OnChangeCategories = function () 
	 {
		$http.get("/Categorie/liste")
			 .then(function (response) 
		     {
				$scope.categories = response.data;
				
			 });
	 };
	$scope.OnChangeCategories();
	
   // Methode pour charger la liste des Article
	 $scope.OnChangeArticle = function () 
	 {
		$http.get("/article/liste/categorie/"+$scope.categorie.id)
			 .then(function (response) 
		     {
				$scope.articles = response.data;
			 });
	 };
	 
	// Methode pour charger la liste des unites de mesure
	 $scope.OnChangeUniteMesure = function () 
	 {
		$http.get("/uniteMesure/liste")
			 .then(function (response) 
		     {
				$scope.unitemesures = response.data;
			 });
	 };
	$scope.OnChangeUniteMesure();
	 
	 
	
 	$scope.verifier = 0;
	$scope.unitevente = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/uniteVente/liste/article/" +$scope.unitevente.article.id)
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.unitevente.id = null;
					$scope.unitevente.uniteMesure.id = null;
					$scope.unitevente.contenance = null;
					$scope.unitevente.prixUnitaire = null;
					$scope.unitevente.remise = null;
					$scope.unitevente.qteRemise = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/uniteVente/save", $scope.unitevente)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de l\' unite de '  +" "+$scope.unitevente.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/uniteVente/edite/" + id)
			 .then(function (response) 
		     {
				$scope.unitevente = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
		
			$http.post("/uniteVente/save", $scope.unitevente)
			   .then(function (response) {
					$scope.unitevente = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de l\'unite de ' +" "+$scope.unitevente.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/uniteVente/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

};


/***************************** CONTROLLEUR DE GESTION DES JOURNEE ***************************** 
***********************************************************************************************/

app.controller('paramJournee', paramJournee);

function paramJournee($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.journee = {};
	}
   
 	$scope.verifier = 0;
	$scope.journee = {};
    $scope.users;

  //Methode pour verifier si une journée est active et si il existe une journee avec la date d'aujourdhui
    $scope.OnVerifyJournee = function () {
    	$http.get("/Journee/verification")
    		.then(function (response){
    			$scope.desactivation = response.data;
    		});
    }

    $scope.OnVerifyJournee();
    
    //Methode pour verifier si une journée est active
    $scope.OnActiveJournee = function () {
    	$http.get("/Journee/oneactivedayverification")
    		.then(function (response){
    			$scope.activation = response.data;
    		});
    }
    
    $scope.OnActiveJournee();
    
    $scope.OnChange = function () {
		  $http.get("/Journee/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});
					$scope.journee = null;
					$scope.verifier = 0;
					$scope.user.data = null;
					$scope.OnVerifyJournee();
					$scope.OnActiveJournee();
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.get("/Journee/save")
			   .then(function (response) {
					$scope.etat = response.data;
					$scope.OnChange();
					$scope.OnVerifyJournee();
					if(etat==true){
						new PNotify({
				                 title: 'GesStock Enregistrement',
				                 text:  'Enrégistrement de la journée éffectué',
				                 type:  'success',
				                 styling: 'bootstrap3',
				                 delay:3000,
				                 history:false,
				                 sticker:true
				                  
				                });
					}
					else {
						new PNotify({
					             title: 'GesStock Enregistrement',
					             text:  'Vous ne pouvez pas activer deux journées le même jour attendez demain pour en activé une autre',
					             type:  'warning',
					             styling: 'bootstrap3',
					             delay:3000,
					             history:false,
					             sticker:true
					                  
					     });
					}
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }


     // Methode pour effectuer une fermeture de journee 
	 $scope.OnClose = function (id) 
	 {
			 $http.get("/Journee/close/" +id)
			   .then(function (response) {
					$scope.journee = response.data;
					$scope.verifier = 1;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Fermeture de la journee'  +" "+$scope.journee.code+" "+' éffectué avec succès',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };
	 
	// Methode pour effectuer une activation de journee 
	 $scope.OnActive = function (id) 
	 {
			 $http.get("/Journee/active/" +id)
			   .then(function (response) {
					$scope.journee = response.data;
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Activation de la journee'  +" "+$scope.journee.code+" "+' éffectué avec succès',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/Journee/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		
		 // Methode de notification pour la fermeture de journee
		 $scope.showConfirm2 = function (event, id) 
	     {
				var confirm = $mdDialog.confirm()
					.title('Etes-vous sur de vouloir desactiver cette journee,')
					.textContent('Cet operation ne pourra plus être annuler')
					.ariaLabel('GesStock Avertissement')
					.targetEvent(event)
					.ok('Oui')
					.cancel('Non');
				$mdDialog.show(confirm).then(function () {
					$scope.OnClose(id);
					new PNotify({
		                title: 'GesStock Validation',
		                text:  'Journée activé  avec succes',
		                type: 'info',
		                styling: 'bootstrap3',
		                delay:3000,
		                history:false,
		                sticker:true
		                 
		               });
				}, function () {
					new PNotify({
		                title: 'GesStock Information ',
		                text:  'Opération de suppression annulée',
		                type: 'warning',
		                styling: 'bootstrap3',
		                delay:3000,
		                history:false,
		                sticker:true
		                 
		               });
				});
			};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};
		
		app.config(function ($mdDateLocaleProvider) {
			$mdDateLocaleProvider.formatDate = function (date) {
				return date ? moment(date).format('DD-MM-YYYY') : '';
			};

			$mdDateLocaleProvider.parseDate = function (dateString) {
				var m = moment(dateString, 'DD-MM-YYYY', true);
				return m.isValid() ? m.toDate() : new Date(NaN);
			};
		});
		
		$scope.searchTerm;
		$scope.clearSearchTerm = function () {
			$scope.searchTerm = '';
		};

		$element.find('input').on('keydown', function (ev) {
			ev.stopPropagation();
		});

		$scope.myDate = new Date();

		$scope.minDate = new Date(
			$scope.myDate.getFullYear() - 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());

		$scope.maxDate = new Date(
			$scope.myDate.getFullYear() + 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());

};


/***************************** CONTROLLEUR DE GESTION DES ENTREES ***************************** 
***********************************************************************************************/

app.controller('paramEntre', paramEntre);

function paramEntre($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.detailentree = {};
	}
   
    // Methode pour charger la liste des fournisseurs
	$scope.OnChangeFournisseur = function () 
	{
		$http.get("/fournisseur/liste")
			 .then(function (response) 
		     {
				$scope.fournisseurs = response.data;
			 });
	};
	$scope.OnChangeFournisseur();
	 
	
 	$scope.verifier = 0;
 	//Variable pour afficher l'interface des entrees
 	$scope.afficher = 0;
 	
	$scope.entree = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/entreStock/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.entree.id = null;
					$scope.verifier = 0;
					$scope.OnVerifyActualisation();
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/entreStock/save", $scope.entree)
			   .then(function (response) {
					$scope.recupererEntree = response.data;
					$scope.afficher = 1;
					$scope.OnEditeFournisseur($scope.recupererEntree.fournisseur.id);
					
					$scope.OnChangeDetails();
					$scope.OnChange();
					
					$scope.entree.fournisseur.id = null;
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de l\' entree'  +" "+$scope.entree.code+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	        
	    	})
	    	
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/entreStock/edite/" + id)
			 .then(function (response) 
		     {
				$scope.recupererEntree = response.data;
				
				$scope.afficher = 1;
				$scope.OnChangeDetails();
			 });
	 };

   
	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/entreStock/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

		app.config(function ($mdDateLocaleProvider) {
			$mdDateLocaleProvider.formatDate = function (date) {
				return date ? moment(date).format('DD-MM-YYYY') : '';
			};

			$mdDateLocaleProvider.parseDate = function (dateString) {
				var m = moment(dateString, 'DD-MM-YYYY', true);
				return m.isValid() ? m.toDate() : new Date(NaN);
			};
		});
		
		$scope.searchTerm;
		$scope.clearSearchTerm = function () {
			$scope.searchTerm = '';
		};

		$element.find('input').on('keydown', function (ev) {
			ev.stopPropagation();
		});

		$scope.myDate = new Date();

		$scope.minDate = new Date(
			$scope.myDate.getFullYear() - 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());

		$scope.maxDate = new Date(
			$scope.myDate.getFullYear() + 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());
			
	/******************************** DEBUT DES FONCTIONALITES POUR LE DETAIL ENTREE*********************/
		
     $scope.detailentree = {};
     
     // Methode pour effectuer une suppression
	 $scope.OnEditeFournisseur = function (id) 
	 {
		$http.get("/fournisseur/edite/" + id)
			 .then(function (response) 
		     {
				$scope.recupererFournisseur = response.data;
			 });
	 };
     
     // Methode pour charger la liste des categories
	 $scope.OnChangeCategories = function () 
	 {
		$http.get("/Categorie/liste")
			 .then(function (response) 
		     {
				$scope.categories = response.data;
			 });
	 };
	$scope.OnChangeCategories();
	
     // Methode pour charger la liste des Article
	 $scope.OnChangeArticle = function () 
	 {
		$http.get("/article/liste/categorie/"+$scope.categorie.id)
			 .then(function (response) 
		     {
				$scope.articles = response.data;
			 });
	 };
	 
	 // Methode pour charger la liste des unites de vente
	 $scope.OnChangeUniteVente = function () 
	 {
		$http.get("/detailsEntreStock/unite/entreUnite/"+$scope.recupererEntree.id+"/"+$scope.article.id)
			 .then(function (response) 
		     {
				$scope.uniteventes = response.data;
			 });
	 };
	 
	 // Methode pour effectuer une edition
	 $scope.OnEditeDetails = function (id) 
	 {
		$http.get("/detailsEntreStock/edite/" + id)
			 .then(function (response) 
		     {
				$scope.detailentree = response.data;
			 });
	 };
	 
	// Methode pour ajouter un details d'entre 
	$scope.OnAddDetails = function () 
	{
		  $http.post("/detailsEntreStock/save?id="+$scope.recupererEntree.id+"&idarticle="+$scope.article.id, $scope.detailentree)
			   .then(function (response) {
					$scope.OnChangeDetails();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du details'  +" "+$scope.detailentree.uniteVente.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	            
	    	})
	    	
	 }
	 
	 $scope.OnChangeDetails = function () {
		  $http.get("/detailsEntreStock/liste/"+$scope.recupererEntree.id)
			.then(function (response) {
				$scope.users1 = response.data;
				$scope.usersTable1 = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users1.length,
						getData: function (params) {
							$scope.data1 = params.sorting() ? $filter('orderBy')($scope.users1, params.orderBy()) : $scope.users1;
							$scope.data1 = params.filter() ? $filter('filter')($scope.data1, params.filter()) : $scope.data1;
							$scope.data1 = $scope.data1.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data1;
						}
					});

					$scope.detailentree = null;
					$scope.user.data = null;
					$scope.OnChangeUniteVente();
					$scope.calculerSommeTTC();
					$scope.calculerSommeHT();
					$scope.calculerSommeTVA();
				});

		};
	
	   
	 // Methode pour effectuer une suppression
	 $scope.OnDeleteDetails = function (id) 
	 {
		$http.delete("/detailsEntreStock/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChangeDetails();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm2 = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDeleteDetails(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.calculerSommeHT = function () {
			$http.get("/detailsEntreStock/sommeHT/" + $scope.recupererEntree.id)
				.then(function (response) {
					$scope.sommeHT = response.data;
				});
		};
		
		$scope.calculerSommeTVA = function () {
			$http.get("/detailsEntreStock/sommeTVA/" + $scope.recupererEntree.id)
				.then(function (response) {
					$scope.sommeTVA = response.data;
				});
		};
		
		$scope.calculerSommeTTC = function () {
			$http.get("/detailsEntreStock/sommeTTC/" + $scope.recupererEntree.id)
				.then(function (response) {
					$scope.sommeTTC = response.data;
				});
		};
		
		//Methode pour fermer le details des entrees
		$scope.OnCloseDetails = function () 
		{
			$scope.OnChange();
			$scope.afficher = 0;
			$scope.recupererEntree = null;
			$scope.recupererFournisseur.nom = null;
			$scope.categorie.id = null;
			$scope.detailentree = null;
			$scope.article.id = null;
			
		};
		
		//Methode pour valider le details des entrees
		$scope.OnValidateDetails = function () 
		{
			$http.get("/detailsEntreStock/validate/"+$scope.recupererEntree.id)
				.then(function (response) {
					$scope.OnChangeDetails();
					$scope.OnChange();
				});
		};

		$scope.showConfirm3 = function (event, id) {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir valider ces produits commandés,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('Frigosoft Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnValidateDetails(id);
				new PNotify({
	                title: 'Frigosoft validation',
	                text:  'Validation éffectue avec succes',
	                type: 'success',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'Frigosoft information ',
	                text:  'Opération de validation annulée',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
	 
	 /************************ Debut des methode pour actualisation***************************/
	 
	 // Methode pour effectuer une edition d'actualistion
	 $scope.OnGetActualisation = function (id) 
	 {
		$http.get("/entreStock/edite/" + id)
			 .then(function (response) 
		     {
		        //Cette variable recupere l'identifiant de l'entree pour actualisation
				$scope.recupererActulisation = response.data;
				
				$scope.visualiser = 1;
				$scope.afficher  = 2;
				$scope.OnChangeDetailEntreValider();
				$scope.OnChangeArticleALl();
				
			 });
	 };
	 
	 //Charger la liste des Details entrees
	 $scope.users3 =null;
	 
	 $scope.OnChangeDetailEntreValider = function () {
   		$http.get("detailsEntreStock/entrer/validate/" + $scope.recupererActulisation.id)
				.then(function (response) {
					$scope.users3 = response.data;
					$scope.usersTable3 = new NgTableParams({
						page: 1,
						count: 5
					}, {
						total: $scope.users3.length,
						getData: function (params) {
							$scope.data3 = params.sorting() ? $filter('orderBy')($scope.users3, params.orderBy()) : $scope.users3;
							$scope.data3 = params.filter() ? $filter('filter')($scope.data3, params.filter()) : $scope.data3;
							$scope.data3 = $scope.data3.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data3;
							// /$defer.resolve($scope.data);
						}
					});

					$scope.users3.data = null;
					$scope.OnChangeProduitALl();
				});

		};
		
		 $scope.checkAll = function() {
    		   $scope.user1.data = angular.copy($scope.users3);		
    	 };
    	
    	 $scope.uncheckAll = function() {
    			$scope.user1.data= [];	 
    	 };
    	 
    	 $scope.user1 = {
			    data: []            		         
		 };
    		
        $scope.users4 ;
		$scope.OnChangeArticleALl = function () {

			$http.get("/detailsEntreStock/article/liste/" + $scope.recupererActulisation.id)
				.then(function (response) {

					$scope.users4 = response.data;
					$scope.usersTable4 = new NgTableParams({
						page: 1,
						count: 5
					}, {
						total: $scope.users4.length,
						getData: function (params) {
							$scope.data4 = params.sorting() ? $filter('orderBy')($scope.users4, params.orderBy()) : $scope.users4;
							$scope.data4 = params.filter() ? $filter('filter')($scope.data4, params.filter()) : $scope.data4;
							$scope.data4 = $scope.data4.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data4;
							// /$defer.resolve($scope.data);
						}
					});

					$scope.users4.data = null;
				});

		     };	
		     
		     $scope.filtre = 0;
		     //Methode pour ajouter une actualistion
		     $scope.OnValiderActualisation=function()
    		 {
    				  if ($scope.user1.data!=null)
    				  {
    				 
		                  	for (i=0;i<$scope.user1.data.length;i++)
		                  	{
		    	    		          $http.get("/detailsEntreStock/addActualisation/"+$scope.user1.data[i].id+"/"+$scope.recupererActulisation.id+"/"+$scope.filtre)
		    	    			           .then(function(response)
		    	    			           {
			    	    			        	    $scope.OnChangeArticleALl();
			    	    			  	            $scope.OnChangeDetailEntreValider();
	 												
			    	    			       });
		    	    		
		    	    	    }
						$scope.filtre = 0; 
						$scope.user1.data = null;
                  	 }
                  	
                  	 	           
				}
				
		$scope.showConfirm5 = function (event, id) {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir suprimmer cette actualiser de quantités de ce produit,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.supprimerActualisation(id);
				new PNotify({
	                title: 'GesStock notification',
	                text:  'Actualisation supprimer avec succes',
	                type: 'success',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock information ',
	                text:  'Opération de suppression annulée',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		
		$scope.OnVerifyActualisation = function () {
			$http.get("/detailsEntreStock/verify/actulisation")
				.then(function (response) {
				});
		};
		
		$scope.supprimerActualisation = function (id) {
			$http.get("/detailsEntreStock/delete/actulisation/"+$scope.recupererActulisation.id+"/"+id)
				.then(function (response) {
					  $scope.OnChangeArticleALl();
		    	      $scope.OnChangeDetailEntreValider();
				});
		};
		
		
		//Methode pour fermer l'actualisation des articles entrees
		$scope.fermer2 = function () 
		{
			$scope.recupererActulisation.id = null;
			$scope.visualiser = 0;
			$scope.afficher = 0;
			
		};
};

/***************************** CONTROLLEUR DE GESTION DES PROFORMATS ***************************** 
***********************************************************************************************/

app.controller('paramProformat', paramProformat);

function paramProformat($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.detailentree = {};
	}
   
    // Methode pour charger la liste des fournisseurs
	$scope.OnChangeClient = function () 
	{
		$http.get("/client/liste")
			 .then(function (response) 
		     {
				$scope.clients = response.data;
			 });
	};
	$scope.OnChangeClient();
	 
	
 	$scope.verifier = 0;
 	//Variable pour afficher l'interface des entrees
 	$scope.afficher = 0;
 	
	$scope.proformat = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/proformat/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.proformat = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChange();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSave = function () 
	{
		  $http.post("/proformat/save", $scope.proformat)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du proformat '  +" "+$scope.proformat.code+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	                  
	    	})
	    	
	 }
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSaveClient = function () 
	{
		  $http.post("/client/save", $scope.client)
			   .then(function (response) {
					$scope.OnChangeClient();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du client '  +" "+$scope.client.nom+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

	// Methode pour pour effectuer un modification 
	$scope.OnUpdate = function () 
	{
		  $http.post("/proformat/save", $scope.proformat)
			   .then(function (response) {
					$scope.OnChange();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Modification du proformat '  +" "+$scope.proformat.code+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	              
	    	})
	    	
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/proformat/edite/" + id)
			 .then(function (response) 
		     {
				$scope.proformat = response.data;
				$scope.verifier = 1;
			 });
	 };

   
	 // Methode pour effectuer une suppression
	 $scope.OnDelete = function (id) 
	 {
		$http.delete("/proformat/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDelete(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};

		app.config(function ($mdDateLocaleProvider) {
			$mdDateLocaleProvider.formatDate = function (date) {
				return date ? moment(date).format('DD-MM-YYYY') : '';
			};

			$mdDateLocaleProvider.parseDate = function (dateString) {
				var m = moment(dateString, 'DD-MM-YYYY', true);
				return m.isValid() ? m.toDate() : new Date(NaN);
			};
		});
		
		$scope.searchTerm;
		$scope.clearSearchTerm = function () {
			$scope.searchTerm = '';
		};

		$element.find('input').on('keydown', function (ev) {
			ev.stopPropagation();
		});

		$scope.myDate = new Date();

		$scope.minDate = new Date(
			$scope.myDate.getFullYear() - 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());

		$scope.maxDate = new Date(
			$scope.myDate.getFullYear() + 1,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());


			
	/******************************** DEBUT DES FONCTIONALITES POUR LE DETAIL PROFORMAT *********************/
		
     $scope.detailproformat = {};
     
     // Methode pour charger la liste des categories
	 $scope.OnChangeCategories = function () 
	 {
		$http.get("/Categorie/liste")
			 .then(function (response) 
		     {
				$scope.categories = response.data;
			 });
	 };
	$scope.OnChangeCategories();
	
     // Methode pour charger la liste des Article
	 $scope.OnChangeArticle = function () 
	 {
		$http.get("/article/liste/categorie/"+$scope.categorie.id)
			 .then(function (response) 
		     {
				$scope.articles = response.data;
			 });
	 };
	 
	 // Methode pour charger la liste des unites de vente
	 $scope.OnChangeUniteVente = function () 
	 {
		$http.get("/uniteVente/liste/article/"+$scope.article.id)
			 .then(function (response) 
		     {
				$scope.uniteventes = response.data;
			 });
	 };

	 // Methode pour charger lae prix unitaire
	
	$scope.OnEditsUniteVente = function (id) 
	 {
		$http.get("/uniteVente/edite/"+id)
			 .then(function (response) 
		     {
				$scope.selectprix = response.data;
				$scope.OnChangePrixUniteVente();
			 });
	 };

	 $scope.OnChangePrixUniteVente = function () 
	 {
	    $scope.detailproformat.prixUnitaire = $scope.selectprix.prixUnitaire ;
	 };

     // Methode pour effectuer une edition de detailProformat
	 $scope.OnViewDetails = function (id) 
	 {
		$http.get("/proformat/edite/" + id)
			 .then(function (response) 
		     {
				$scope.proformats = response.data;
				$scope.OnChangeDetails();
			 });
	 };

     // Methode pour effectuer une edition de detailProformat
	 $scope.OnEditeProformats = function (id) 
	 {
		$http.get("/detailsProformat/edite/" + id)
			 .then(function (response) 
		     {
				$scope.detailproformat = response.data;
			 });
	 };

     $scope.OnChangeDetails = function () {
		  $http.get("/detailsProformat/liste/"+$scope.proformats.id)
			.then(function (response) {
				$scope.users1 = response.data;
				$scope.usersTable1 = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users1.length,
						getData: function (params) {
							$scope.data1 = params.sorting() ? $filter('orderBy')($scope.users1, params.orderBy()) : $scope.users1;
							$scope.data1 = params.filter() ? $filter('filter')($scope.data1, params.filter()) : $scope.data1;
							$scope.data1 = $scope.data1.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data1;
						}
					});

					$scope.detailproformat.id = null;
					
					$scope.detailproformat.prixUnitaire= null;
					$scope.detailproformat.qteEntree = null;
					$scope.user.data = null;
				});

		};
	
		// Methode pour pour effectuer un enregistrement 
		$scope.OnSaveDetails = function () 
		{
			  $http.post("/detailsProformat/save/"+$scope.proformats.id, $scope.detailproformat)
			   .then(function (response) {
					$scope.detailproformat = response.data;
					$scope.OnChangeDetails();
					$scope.OnCalculer();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du detail de proformat de l\'article '  +" "+$scope.detailproformat.uniteVente.article.designation+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });

		    	})
		    	
	 }
	
      // Methode pour effectuer une suppression
	 $scope.OnDeleteDetails = function (id) 
	 {
		$http.delete("/detailsProformat/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChangeDetails();
				$scope.OnCalculer();
			 });
	 };
		
	 // Methode pour calculer le montant
	 $scope.OnCalculer = function () 
	 {
		$http.get("/detailsProformat/calculerMontant/" + $scope.proformats.id)
			 .then(function (response) 
		     {
				$scope.OnChange();
			 });
	 };

	 // Methode pour calculer le montant
	 $scope.OnInitialise = function () 
	 {
		$scope.proformats.id = null;
		$scope.detailproformat.uniteVente.id = null;
	 };

};

/***************************** CONTROLLEUR DE GESTION DES REGLEMENT ET DETTE ***************************** 
***********************************************************************************************/

app.controller('paramReglement', paramReglement);

function paramReglement($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.reglement = {};
	}
   
    // Methode pour charger la liste des dettes nom active
	$scope.OnChangeDette = function () 
	{
		$http.get("/reglement/liste/detteInactif")
			 .then(function (response) 
		     {
				$scope.dettes = response.data;
			 });
	};
	$scope.OnChangeDette();
	
	// Methode pour cedite une dette
	$scope.OnEditeDette = function (id) 
	{
		$http.get("/reglement/edite/dette/" +id)
			 .then(function (response) 
		     {
				$scope.recupererDette = response.data;
				$scope.OnChangeReglement();
			 });
	};
	
 	$scope.verifier = 0;
 	//Variable pour afficher l'interface des entrees
 	$scope.afficher = 0;
 	
	$scope.reglement = {};
    $scope.users;

	$scope.OnChange = function () {
		  $http.get("/reglement/liste/detteActif")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});
					$scope.user.data = null;
				});

		};
    $scope.OnChange();

    $scope.users1 = {};
 	
    $scope.OnChangeReglement=function(){
    	$http.get("/reglement/liste/client/"+$scope.recupererDette.idDette)
   		 .then(function(response){
   			
   			$scope.users1=response.data;	
   			
			$scope.usersTable1 = new NgTableParams({
				page: 1,
				count:5
				}, {
				total: $scope.users1.length,
				getData: function (params) {
				$scope.data1 = params.sorting() ? $filter('orderBy')($scope.users1, params.orderBy()) : $scope.users1;
				$scope.data1 = params.filter() ? $filter('filter')($scope.data1, params.filter()) : $scope.data1;
				$scope.data1 = $scope.data1.slice((params.page() - 1) * params.count(), params.page() * params.count());
				return $scope.data1;
			
				}
			}); 
			$scope.situationclient();
   		});
    }

    $scope.validerReglement=function()
	{
 		$scope.testervalidation($scope.recupererDette.idDette,$scope.reglement.montantPayement);
 	};
 	
 	
	$scope.testervalidation=function(dette,montant){
		var montant_a_payer=null;
 		$http.get("/reglement/testerValidation/"+dette+"/"+montant)
 			.then(function(response){
				if (response.data==3)
				{
				
					new PNotify({
		                title: 'GesStock notification ',
		                text:  'Attention !!! Le montant payé ne peut être superieur au montant à payer.',
		                type: 'warning',
		                styling: 'bootstrap3',
		                delay:3000,
		                history:false,
		                sticker:true
		                 
		               });
				  $scope.solde="ko";
					
				}
				else if  (response.data==1)
				{
					$http.post("/reglement/save/"+$scope.recupererDette.idDette ,$scope.reglement)
	         		.then(function(response){  	
	         			   $scope.reglement.datePayement=new Date($scope.reglement.datePayement);
	         		       			
	         		       $scope.OnChangeReglement();
						   $scope.situationclient();
		         		   $scope.reglement.id=null;
		         		   $scope.reglement.montantPayement=null;
						   $scope.totalPayerParClient();
	         		})
					
	         		new PNotify({
		                title: 'Frigosoft notification ',
		                text:  'Payement effectuer avec succès.',
		                type: 'success',
		                styling: 'bootstrap3',
		                delay:3000,
		                history:false,
		                sticker:true
		                 
		               });
	         		   $scope.solde="ko"
	         		 
					
				}
				
				else if  (response.data==2){
					$http.post("/reglement/save/"+$scope.recupererDette.idDette ,$scope.reglement)
	         		.then(function(response){  	
	         			   $scope.reglement.datePayement=new Date($scope.reglement.datePayement);
	         		       			
	         		       $scope.OnChangeReglement();
						   $scope.situationclient();
		         		   $scope.reglement.id=null;
		         		   $scope.reglement.montantPayement=null;
 						   $scope.totalPayerParClient();
	         		})
					
	         		new PNotify({
		                title: 'GesStock notification ',
		                text:  'Payement effectuer avec succès.',
		                type: 'success',
		                styling: 'bootstrap3',
		                delay:3000,
		                history:false,
		                sticker:true
		                 
		               });
	         		   $scope.solde="ko"
					
				}
				 
				  				
 			});
 	 
 	};


    // renvoye par hashmap de ap, p ,r
	$scope.situationclient=function(){
 		$http.get("/reglement/apayer_payer_rapayer/"+$scope.recupererDette.idDette)
 			.then(function(response){
				$scope.situation=response.data; 
 			});

 	};
 	
 	
	$scope.calculNvReste = function () {
		$scope.nw = ($scope.reglementDette.reste) + $scope.montant;
	}
	
   // Methode pour calculer le montant payer
	$scope.totalPayerParClient = function () 
	{
		$http.get("/reglement/totalPayer/"+$scope.recupererDette.idDette)
			 .then(function (response) 
		     {
			    $scope.verifierEtatDette();
				$scope.OnChange();
				$scope.OnChangeDette();
			 });
	};
	
	// Methode pour verifier etat
	$scope.verifierEtatDette = function () 
	{
		$http.get("/reglement/verifierEtat/"+$scope.recupererDette.idDette)
			 .then(function (response) 
		     {
			 });
	};
   
   $scope.closeReglement = function () 
   {
		$scope.recupererDette.idDette = null;
		$scope.reglement = null;
		$scope.OnChange();
		$scope.OnChangeDette();
		
	}
	
	/************************************* VISUALISE LES REGLEMENTS DES DETTES PASSEE******************************** */
	
   // Methode pour cedite une dette
	$scope.OnEditeDette2 = function (id) 
	{
		$http.get("/reglement/edite/dette/" +id)
			 .then(function (response) 
		     {
				$scope.selecteDette = response.data;
				$scope.OnChangeReglements();
			 });
	};
	
	$scope.users2;
	$scope.OnChangeReglements=function(){
    	$http.get("/reglement/liste/client/"+$scope.selecteDette.idDette)
   		 .then(function(response){
   			
   			$scope.users2=response.data;	
   			
			$scope.usersTable2 = new NgTableParams({
				page: 1,
				count:5
				}, {
				total: $scope.users2.length,
				getData: function (params) {
				$scope.data2 = params.sorting() ? $filter('orderBy')($scope.users2, params.orderBy()) : $scope.users2;
				$scope.data2 = params.filter() ? $filter('filter')($scope.data2, params.filter()) : $scope.data2;
				$scope.data2 = $scope.data2.slice((params.page() - 1) * params.count(), params.page() * params.count());
				return $scope.data2;
			
				}
			}); 
   		});
    }
	
   $scope.closeReglements = function () 
   {
		$scope.selecteDette.idDette = null;		
   }
};



/***************************** CONTROLLEUR DE GESTION DES UTILISATEURS ***************************** 
***********************************************************************************************/
app.controller('paramUtilisateur', paramUtilisateur);

function paramUtilisateur($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {    
      
   $scope.user = {
   		data: []
   };
    	
    $scope.init = function () {
    	$scope.user = {};
    }
       
    $scope.verifier = 0;	
    $scope.utilisateur={};
    $scope.users;
    
    $scope.OnListeRole = function()
	{
	   $http.get("/Security/listeRole")
			 .then(function(response){
			  $scope.listeroles=response.data;
		});
	};
	  
	$scope.OnListeRole();
	
	$scope.OnChangeUser = function () {
		  $http.get("/Security/listeUser")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.utilisateur = null;
					$scope.role = null;
					$scope.verifier = 0;
					$scope.users.data = null;
				});
		  
		};
	
	$scope.OnChangeUser();
	
	
	//Methode pour pour effectuer un enregistrement d'utilisateur
	$scope.OnSaveUser = function () 
	{
		  $http.post("/Security/addUser", $scope.utilisateur)
			   .then(function (response) {
				 $scope.utilisateur=response.data; 
			   username = $scope.utilisateur.username;
               $http.post("/Security/addRoleToUser2/"+username+"/"+$scope.role)
					$scope.OnUserEcran();
					$scope.OnChangeUser();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de '  +" "+$scope.utilisateur.nomComplet+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	    	$scope.utilisateur = null;
	 }
	
	//Methode pour effectuer une edition d'utilisateur
	$scope.OnEditeUser = function (id) 
	{
		$http.get("/Security/updateUser/" + id)
			 .then(function (response) 
		     {
				$scope.utilisateur = response.data;
				$scope.verifier = 1;
			 });
	};
	
	$scope.OnActiveProfil = function(id)
	{
		$http.get("/Security/activerprofil/"+id)
			.then(function(response){
			 
				$scope.OnChangeUser();
				new PNotify({
	               title: 'GesStock Information ',
	               text:  'Vous venez d\'activer cet utilisateur',
	               type: 'info',
	               styling: 'bootstrap3',
	               delay:3000,
	               history:false,
	               sticker:true
	                
	              });
			});
		 
	  	};
	
	$scope.OnDesctiverProfil = function(id)
	{
		$http.get("/Security/desactiverprofil/"+id)
			.then(function(response){
			
				$scope.OnChangeUser();
				new PNotify({
	               title: 'GesStock Information ',
	               text:  'Vous venez de désactiver cet utilisateur',
	               type: 'info',
	               styling: 'bootstrap3',
	               delay:3000,
	               history:false,
	               sticker:true
	                
	              });
			});
	};
	             
	$scope.OnActiverToutProfils = function()
	{
		$http.get("/Security/activerprofiltout")
			.then(function(response){
			 
				$scope.OnChangeUser();
				new PNotify({
	               title: 'GesStock Information ',
	               text:  'Vous venez d\'activer tout les utilisateurs',
	               type: 'info',
	               styling: 'bootstrap3',
	               delay:3000,
	               history:false,
	               sticker:true
	                
	              });
				 
			});
	};
	   
	$scope.OnDesactiverToutProfils = function()
	{
		 $http.get("/Security/desactiverprofiltout")
			.then(function(response){
			 
				$scope.OnChangeUser();
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Vous venez désactiver cet utilisateur',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
	};
	                       				       	
	                       				       	
	$scope.showConfirmActiverProfil = function(event,id)
	{
		var confirm = $mdDialog.confirm()
	    .title('Etes-vous sur de vouloir activer cet utilisateur,')
	    .textContent('Cet operation ne pourra plus être annuler')
	    .ariaLabel('UM Avertissement')
	    .targetEvent(event)
	    .ok('Oui')
	    .cancel('Non');
	         $mdDialog.show(confirm).then(function() {
	             $scope.OnActiveProfil(id);
	             $scope.status = 'Activation éffectuer avec succès';
	             }, function() {
	                 $scope.status = 'Opération annulée';                     
	         });
	};
	            
	$scope.showConfirmDesactiverProfil = function(event,id)
	{
		var confirm = $mdDialog.confirm()
	    .title('Etes-vous sur de vouloir désactiver cet utilisateur,')
	    .textContent('Cet operation ne pourra plus être annuler')
	    .ariaLabel('UM Avertissement')
	    .targetEvent(event)
	    .ok('Oui')
	    .cancel('Non');
	         $mdDialog.show(confirm).then(function() {
	             $scope.OnDesctiverProfil(id);
	             $scope.status = 'Désactivation éffectuer avec succès';
	             }, function() {
	                 $scope.status = 'Opération annulée';                     
	         });
	};
	
	$scope.showConfirmActiverToutProfil = function(event)
	{
		var confirm = $mdDialog.confirm()
	    .title('Etes-vous sur de vouloir activer tous les utilisateurs,')
	    .textContent('Cet operation ne pourra plus être annuler')
	    .ariaLabel('UM Avertissement')
	    .targetEvent(event)
	    .ok('Oui')
	    .cancel('Non');
	         $mdDialog.show(confirm).then(function() {
	             $scope.OnActiverToutProfils();
	             $scope.status = 'Activation éffectuer avec succès';
	             }, function() {
	                 $scope.status = 'Opération annulée';                     
	         });
	};
	            
	$scope.showConfirmDesactiverToutProfil = function(event)
	{
		var confirm = $mdDialog.confirm()
	    .title('Etes-vous sur de vouloir désactiver tous les utilisateurs,')
	    .textContent('Cet operation ne pourra plus être annuler')
	    .ariaLabel('UM Avertissement')
	    .targetEvent(event)
	    .ok('Oui')
	    .cancel('Non');
	         $mdDialog.show(confirm).then(function() {
	             $scope.OnDesactiverToutProfils();
	             $scope.status = 'Désactivation éffectuer avec succès';
	             }, function() {
	                 $scope.status = 'Opération annulée';                     
	         });
	};	
	
	$scope.utilisateurecran;
	// Methode pour charger les notifications
	 $scope.OnUserEcran = function () 
	 {
		$http.get("/Security/getLoggers")
			 .then(function (response) 
		     {
				$scope.utilisateurecran = response.data;
			 });
	 };
	
	 $scope.OnUserEcran();
		
};

/***************************** CONTROLLEUR DE GESTION DES VENTES ***************************** 
***********************************************************************************************/

app.controller('paramVente', paramVente);

function paramVente($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.vente = {};
	}
   
 	$scope.verifier = 0;
 	$scope.affichepageventepanier = 0;
	$scope.vente = {};
    $scope.users;
	$scope.remisevente = 0;

    // Methode pour afficher la liste des client
	 $scope.OnChangeClient = function () 
	 {
		$http.get("/client/liste")
			 .then(function (response) 
		     {
				$scope.clients = response.data;
			 });
	 };
	 
	 $scope.OnChangeClient();
	 
	$scope.OnChangeVente = function () {
		  $http.get("/Vente/liste")
			.then(function (response) {
				$scope.users = response.data;
				$scope.usersTable = new NgTableParams({
					page: 1,
					count: 5
				}, {
				   total: $scope.users.length,
						getData: function (params) {
							$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
							$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
							$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
							return $scope.data;
						}
					});

					$scope.vente = null;
					$scope.verifier = 0;
					$scope.user.data = null;
				});

		};
	$scope.OnChangeVente();
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSaveClient = function () 
	{
		  $http.post("/client/save", $scope.client)
			   .then(function (response) {
					$scope.OnChangeClient();
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement du client '  +" "+$scope.client.nom+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }
	
	// Methode pour effectuer une edition
	 $scope.OnEditeClient = function (id) 
	 {
		$http.get("/client/edite/" + id)
			 .then(function (response) 
		     {
				$scope.recupererClients = response.data;
				
			 });
	 };
	
	
	// Methode pour pour effectuer un enregistrement 
	$scope.OnSaveVente = function () 
	{
		  $http.post("/Vente/save", $scope.vente)
			   .then(function (response) {
				    $scope.OnChangeVente();
					$scope.affichepageventepanier = 1;
					$scope.recupererVente = response.data;
					$scope.OnEditeClient($scope.recupererVente.client.id);
					$scope.OnChangeUnitePanierVente();
					$scope.OnSommePanier($scope.recupererVente.id);
				new PNotify({
		                 title: 'GesStock Enregistrement',
		                 text:  'Enrégistrement de la vente'  +" "+$scope.recupererVente.code+" "+  'éffectué',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 }

     // Methode pour effectuer une edition
	 $scope.OnEdite = function (id) 
	 {
		$http.get("/Vente/edite/" + id)
			 .then(function (response) 
		     {
				$scope.vente = response.data;
				$scope.verifier = 1;
			 });
	 };

     // Methode pour effectuer une modification 
	 $scope.OnUpdate = function (id) 
	 {
			 $http.post("/Vente/save", $scope.vente)
			   .then(function (response) {
					$scope.vente = response.data;
					$scope.OnChangeVente();
				new PNotify({
		                 title: 'GesStock Modification',
		                 text:  'Modification de la catégorie'  +" "+$scope.vente.code+" "+' éffectué avec succès',
		                 type:  'success',
		                 styling: 'bootstrap3',
		                 delay:3000,
		                 history:false,
		                 sticker:true
		                  
		                });
				},function errorCallback(response){
	    			   new PNotify
					   ({
		                     title: 'GesStock Message d\'erreur',
		                     text: 'Une erreur liée au serveur s\'est produite',
		                     type: 'error',
		                     styling: 'bootstrap3',
		                     delay:3000,
		                     history:false,
		                     sticker:true
		                      
	                    });
	    	})
	 };

	 // Methode pour effectuer une suppression
	 $scope.OnDeleteVente = function (id) 
	 {
		$http.delete("/Vente/delete/" + id)
			 .then(function (response) 
		     {
				$scope.OnChangeVente();
			 });
	 };
		
	 // Methode de notification pour la suppression
	 $scope.showConfirm = function (event, id) 
     {
			var confirm = $mdDialog.confirm()
				.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
				.textContent('Cet operation ne pourra plus être annuler')
				.ariaLabel('GesStock Avertissement')
				.targetEvent(event)
				.ok('Oui')
				.cancel('Non');
			$mdDialog.show(confirm).then(function () {
				$scope.OnDeleteVente(id);
				new PNotify({
	                title: 'GesStock Validation',
	                text:  'Enregistrement supprimer avec succes',
	                type: 'info',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			}, function () {
				new PNotify({
	                title: 'GesStock Information ',
	                text:  'Opération de suppression annulée',
	                type: 'warning',
	                styling: 'bootstrap3',
	                delay:3000,
	                history:false,
	                sticker:true
	                 
	               });
			});
		};
		
		$scope.regex = '^[a-zA-Z0-9._-]+$';
		
		$scope.transfererx = function () 
		{
			$("#myModal").modal({
				backdrop: "static"
			});
			$("#myModal").modal({
				keyboard: true
			});
		};

		$scope.fermer = function ()
	    {
			$("#myModal").modal('hide');
		};
		
	/***************************** GESTION DES PANIERS *****************************/
	
		// Methode pour afficher la liste des categories
		 $scope.OnChangeCategorie = function () 
		 {
			$http.get("/Categorie/liste")
				 .then(function (response) 
			     {
					$scope.categories = response.data;
				 });
		 };
		 
		 $scope.OnChangeCategorie();
		 
		// Methode pour afficher la liste des articles par categorie
		 $scope.OnChangeArticles = function () 
		 {
			$http.get("/article/liste/categorie/"+ $scope.uniteVente.article.categorie.id)
				 .then(function (response) 
			     {
					$scope.articles = response.data;
				 });
		 };
		 
		 // Methode pour fermer le panier
		 $scope.fermerPanier = function () 
		 {
			 $scope.affichepageventepanier = 0;
			 $scope.viderPanier2();
		 };
		 
		// Methode pour ouvrir le panier
		 $scope.ouvrirPanier = function (id) 
		 {
			 $scope.affichepageventepanier = 1;
			 $scope.OnEditeVente2(id);
		 };
		 
		// Methode pour effectuer une edition
		 $scope.OnEditeVente2 = function (id) 
		 {
			$http.get("/Vente/edite/" + id)
				 .then(function (response) 
			     {
					$scope.recupererVente = response.data;
					$scope.remisevente = $scope.recupererVente.remiseVente;
					$scope.OnEditeClient($scope.recupererVente.client.id);
					$scope.OnChangeUnitePanierVente();
					$scope.OnSommePanier();
				 });
		 };
		 
		 $scope.users1;
		 
		 $scope.OnChangeUniteVente = function () {
			  $http.get("/uniteVente/liste/article/"+$scope.uniteVente.article.id)
				.then(function (response) {
					$scope.users1 = response.data;
					$scope.usersTable1 = new NgTableParams({
						page: 1,
						count: 5
					}, {
					   total: $scope.users1.length,
							getData: function (params) {
								$scope.data1 = params.sorting() ? $filter('orderBy')($scope.users1, params.orderBy()) : $scope.users1;
								$scope.data1 = params.filter() ? $filter('filter')($scope.data1, params.filter()) : $scope.data1;
								$scope.data1 = $scope.data1.slice((params.page() - 1) * params.count(), params.page() * params.count());
								return $scope.data1;
							}
						});
						$scope.user.data = null;
					});

			};
			
			$scope.users2 ;
			$scope.OnChangeUnitePanierVente = function () {
				  $http.get("/Panier/liste/"+$scope.recupererVente.id)
					.then(function (response) {
						$scope.users2 = response.data;
						$scope.usersTable2 = new NgTableParams({
							page: 1,
							count: 5
						}, {
						   total: $scope.users2.length,
								getData: function (params) {
									$scope.data2 = params.sorting() ? $filter('orderBy')($scope.users2, params.orderBy()) : $scope.users2;
									$scope.data2 = params.filter() ? $filter('filter')($scope.data2, params.filter()) : $scope.data2;
									$scope.data2 = $scope.data2.slice((params.page() - 1) * params.count(), params.page() * params.count());
									return $scope.data2;
								}
							});
							$scope.user.data = null;
						});

				};
			
			// Methode pour effectuer une edition
			 $scope.OnEditeUnite = function (id) 
			 {
				$http.get("/uniteVente/edite/" + id)
					 .then(function (response) 
				     {
						$scope.uniteVentes = response.data;
						$scope.panier.qteVente = null;
						$scope.totalecran = null;
						$scope.activerAjoutPanier = 0;
					 });
			 };
			 
			// Methode pour verifier le prix unitaire par rapport à la promotion
			 $scope.OnVerifyPromotionPrixVente = function () 
			 {
				$http.get("/Panier/verifyPrixVente/"+ $scope.uniteVentes.id +"/"+ $scope.panier.qteVente+"/"+ $scope.uniteVentes.prixUnitaire)
					 .then(function (response) 
				     {
						$scope.uniteVentes.prixUnitaire = response.data;
						$scope.OnCalculEcran();
						$scope.OnVerifyArticleQte();
					 });
			 };
			 
			// Methode pour effectuer le calcul total de vente
			 $scope.OnCalculEcran = function () 
			 {
				if($scope.panier.actionTVA == undefined || $scope.panier.actionTVA == false)
				{
					$scope.totalecran = $scope.uniteVentes.prixUnitaire * $scope.panier.qteVente;
				}
				else
				{
					$scope.totalecran = ($scope.uniteVentes.prixUnitaire * $scope.panier.qteVente) + ($scope.uniteVentes.prixUnitaire * $scope.panier.qteVente)*0.18;
				}
			 };
			 
			 $scope.panier = {};
			 
			// Methode pour pour effectuer un enregistrement 
				$scope.OnSavePanier = function () 
				{
					  $http.post("/Panier/save/" + $scope.uniteVentes.id + "/" + $scope.recupererVente.id + "/" + $scope.uniteVentes.prixUnitaire + "/" + $scope.panier.actionTVA, $scope.panier)
						   .then(function (response) {
							    $scope.OnChangeUniteVente();
							    $scope.OnChangeUnitePanierVente();
								$scope.OnSommePanier($scope.recupererVente.id);
								$scope.activerAjoutPanier = 1;
				    			$scope.viderPanier1();
				    			$scope.montantRemise = null;
				    			$scope.montantRestant = null;
							new PNotify({
					                 title: 'GesStock Enregistrement',
					                 text:  'Enrégistrement de l\' article '  +" "+$scope.uniteVente.article.designation+" "+  ' dans le panier éffectué',
					                 type:  'success',
					                 styling: 'bootstrap3',
					                 delay:3000,
					                 history:false,
					                 sticker:true
					                  
					                });
							},function errorCallback(response){
				    			   new PNotify
								   ({
					                     title: 'GesStock Message d\'erreur',
					                     text: 'Une erreur liée au serveur s\'est produite',
					                     type: 'error',
					                     styling: 'bootstrap3',
					                     delay:3000,
					                     history:false,
					                     sticker:true
					                      
				                    });
				    			   $scope.panier = null;
				    	})
				 }
				
				$scope.viderPanier1 = function(){
					$scope.panier.qteVente = null;
					$scope.uniteVentes.prixUnitaire = null;
					$scope.panier.actionTVA = false;
					$scope.totalecran = null;
				}
				
				$scope.viderPanier2 = function(){
					$scope.recuperVente = null;
					$scope.sommeprise = null;
					$scope.montantRestant = null;
					$scope.apayer = null;
					$scope.remisevente = null;
					$scope.totalAchat = null;
					$scope.uniteVente = null;
					$scope.panier.qteVente = null;
					$scope.uniteVentes.prixUnitaire = null;
					$scope.panier.actionTVA = false;
					$scope.totalecran = null;
					$scope.uniteVentes.article.designation = null;
					$scope.recupererVente.code = null;
					$scope.recupererVente.id = null;
					$scope.recupererClient.nom = null;
					$scope.uniteVente.article.categorie.id = null;
					$scope.uniteVente.article.id = null;
				}
				
				$scope.activerAjoutPanier = 0;
				
				$scope.OnVerifyArticleQte = function(){
					if($scope.panier.qteVente >= ($scope.uniteVentes.article.qteStock / $scope.uniteVentes.contenance)){
						$scope.activerAjoutPanier = 1;
						new PNotify
						   ({
			                     title: 'GesStock Message d\'erreur',
			                     text: 'La quantité saisi est superieur à celle en stock',
			                     type: 'warning',
			                     styling: 'bootstrap3',
			                     delay:3000,
			                     history:false,
			                     sticker:true
			                      
		                    });
						
					}else{
						$scope.activerAjoutPanier = 0;
					}
				}
				

				 // Methode pour effectuer une suppression
				 $scope.OnDeletePanier = function (id) 
				 {
					$http.delete("/Panier/delete/" + id)
						 .then(function (response) 
					     {
							 $scope.OnChangeUnitePanierVente();
							 $scope.OnChangeUniteVente();
							 $scope.OnSommePanier();
						 });
				 };
				 
				// Methode pour calculer la somme total du panier
				 $scope.OnSommePanier = function (id) 
				 {
					$http.get("/Panier/sommePanier/" + $scope.recupererVente.id)
						 .then(function (response) 
					     {
							  $scope.totalAchat = response.data;
						 });
				 };
				 
				 $scope.calculAPayer = function (){
					 $scope.apayer = $scope.totalAchat - $scope.remisevente;
				 }
				 
				 $scope.calculReliquat = function (){
					 $scope.montantRestant = ($scope.totalAchat - $scope.remisevente) - $scope.sommeprise;
				 }
				 
				 $scope.validerComptantPanier = function (){
					 $http.get("/Panier/validerComptantPanier/" + $scope.recupererVente.id +"/" +$scope.totalAchat +"/" +$scope.remisevente)
					 .then(function (response) 
				     {
						 $scope.OnChangeVente();
						 $scope.OnSommePanier();
						 new PNotify({
			                 title: 'GesStock Enregistrement',
			                 text:  'Enrégistrement de la vente payement comptant',
			                 type:  'success',
			                 styling: 'bootstrap3',
			                 delay:3000,
			                 history:false,
			                 sticker:true
			                  
			                });
					},function errorCallback(response){
		    			   new PNotify
						   ({
			                     title: 'GesStock Message d\'erreur',
			                     text: 'Une erreur liée au serveur s\'est produite',
			                     type: 'error',
			                     styling: 'bootstrap3',
			                     delay:3000,
			                     history:false,
			                     sticker:true
			                      
		                    });
					 });
				 }
				 
				 $scope.validerDettePanier = function (){
					 $http.get("/Panier/validerDettePanier/" + $scope.recupererVente.id +"/" +$scope.totalAchat+ "/" +$scope.montantRestant +"/" +$scope.remisevente)
					 .then(function (response) 
				     {
						 new PNotify({
			                 title: 'GesStock Enregistrement',
			                 text:  'Enrégistrement de la dette',
			                 type:  'success',
			                 styling: 'bootstrap3',
			                 delay:3000,
			                 history:false,
			                 sticker:true
			                  
			                });
 						 $scope.OnChangeVente();
						 $scope.OnSommePanier();
					
					},function errorCallback(response){
		    			   new PNotify
						   ({
			                     title: 'GesStock Message d\'erreur',
			                     text: 'Une erreur liée au serveur s\'est produite',
			                     type: 'error',
			                     styling: 'bootstrap3',
			                     delay:3000,
			                     history:false,
			                     sticker:true
			                      
		                    });
					 });
				 }
				 
				// Methode de notification pour la suppression
				 $scope.showConfirm1 = function (event, id) 
			     {
						var confirm = $mdDialog.confirm()
							.title('Etes-vous sur de vouloir supprimer cet enregistremnt,')
							.textContent('Cet operation ne pourra plus être annuler')
							.ariaLabel('GesStock Avertissement')
							.targetEvent(event)
							.ok('Oui')
							.cancel('Non');
						$mdDialog.show(confirm).then(function () {
							$scope.OnDeletePanier(id);
							$scope.OnSommePanier();
							new PNotify({
				                title: 'GesStock Validation',
				                text:  'Enregistrement supprimer avec succes',
				                type: 'info',
				                styling: 'bootstrap3',
				                delay:3000,
				                history:false,
				                sticker:true
				               });
						}, function () {
							new PNotify({
				                title: 'GesStock Information ',
				                text:  'Opération de suppression annulée',
				                type: 'warning',
				                styling: 'bootstrap3',
				                delay:3000,
				                history:false,
				                sticker:true
				                 
				               });
						});
					};
};

/***************************** CONTROLLEUR GRILLES DES STATS ***************************** 
***********************************************************************************************/

app.controller('paramGrille', paramGrille);

function paramGrille($scope, $window, $mdSelect, $mdDialog, $http, $rootScope, $element, $filter, $routeParams, NgTableParams, $location) {

	$scope.user = {
			data: []
		};

	$scope.init = function () {
		$scope.unitevente = {};
	}
   
	 $scope.OnChangeEntree = function () 
	 {
		$http.get("/entreStock/liste")
			 .then(function (response) 
		     {
				$scope.entres = response.data;
			 });
	 };
	$scope.OnChangeEntree();
	
     // Methode pour charger la liste des journee
	 $scope.OnChangeJournee = function () 
	 {
		$http.get("/Journee/liste")
			 .then(function (response) 
		     {
				$scope.journees = response.data;
			 });
	 };
	$scope.OnChangeJournee();
	
   // Methode pour charger la liste des vente
	 $scope.OnChangeVente = function () 
	 {
		$http.get("/Vente/liste/journee/"+$scope.journee.id)
			 .then(function (response) 
		     {
				$scope.ventes = response.data;
				$scope.OnCalculJournee();
			 });
	 };
	 
	 // Methode pour charger la liste des articles achete
	 $scope.OnChange = function () 
	 {
		$http.get("/Panier/liste/"+$scope.vente.id)
			 .then(function (response) 
		     {
				$scope.paniers = response.data;
				 $scope.OnCalculVente();
			 });
	 };

	 $scope.OnCalculJournee = function () 
	 {
		$http.get("/Panier/sommeJournee/"+$scope.journee.id)
			 .then(function (response) 
		     {
				$scope.montantJournee = response.data;
			 });
	 };

	 $scope.OnCalculVente = function () 
	 {
		$http.get("/Panier/sommePanier/"+$scope.vente.id)
			 .then(function (response) 
		     {
				$scope.montantVente = response.data;
			 });
	 };

};
        