
var app = angular.module('myApp', ['ngRoute']);

app.controller('inicioCtrl', function ($scope) {

    $scope.Titulo = 'Productos demo';
});


app.controller('ArticulosCtrl',['$rootScope', '$scope', '$location','$locale',
    function ($rootScope, $scope, $location, $locale) {
        var esTarjeta = $location.hash();

        if(esTarjeta === '2'){
            $rootScope.formaPago =  "/Tarjeta.html";
        }


      $scope.currentYear = new Date().getFullYear()
      $scope.currentMonth = new Date().getMonth() + 1
      $scope.months = $locale.DATETIME_FORMATS.MONTH
      $scope.ccinfo = {type:undefined}
      $scope.save = function(data){
        if ($scope.paymentForm.$valid){
          console.log(data) // valid data saving stuff here
        }
      };

        $scope.Titulo = 'Tu pedido';
        $scope.TituloAccionABMC = { A: '(Agregar)', B: '(Eliminar)', M: '(Modificar)', C: '(Consultar)', L: null };
        $scope.AccionABMC = 'L';   // inicialmente inicia el el listado (buscar con parametros)
        $scope.Mensajes = { SD: ' No se encontraron registros...', RD: ' Revisar los datos ingresados...' };


        $scope.DtoFiltro = {};    // dto con las opciones para buscar en grilla
        $scope.Dom = {};    // dto con las opciones para buscar en grilla
        $scope.fecha = {};
        $scope.DtoFiltro.Activo = null;
        $scope.DtoFiltro.monto = '$';
        $scope.PaginaActual = 1;  // inicia pagina 1

        // opciones del filtro activo
        $scope.OpcionesSiNo = [{ Id: null, Nombre: '' }, { Id: true, Nombre: 'SI' }, { Id: false, Nombre: 'NO' }];

        // invoca metodo WebApi para cargar una lista de medicos
        // $http.get('http://localhost:8083/WSRestTodo1/productos/obtener').then(function (response) {
        //     $scope.Lista = response.data;
        // });
        $scope.Lista = [
            {comercio:'McDonals', nombre : 'Hamburguesa',categoria:'Gastronomia',cantidad:1 },
            {comercio:'McDonals', nombre : 'Agua',categoria:'Gastronomia',cantidad:1 }]; 

        ///**FUNCIONES**///
        $scope.Agregar = function () {
            $scope.AccionABMC = 'DP';
            $scope.DtoSel = {};
            $scope.DtoSel.Activo = true;
        };

       

        
        $scope.AgregarTarjeta = function (ccinfo,  paymentForm, FormFiltro) {
            $rootScope.formaPago = "/Tarjeta.html";

            if(ccinfo.type !== 'visa'){
                toastr.error('Solo se permite una tarjeta visa  válida', 'Error');
                return;
            }

            if (!$scope.paymentForm.$valid){
                console.log(ccinfo) ;
                return;
              }

            window.location.href='/Pedido.html#2';

        };

        $scope.AgregarDomicilio = function () {
            $scope.AccionABMC = 'D';
          
        };

        
        $scope.AgregarDomicilioUI = function (Dom) {
            $scope.AccionABMC = 'L';
            $scope.DtoFiltro.direccion = Dom.Calle + ' - ' + Dom.Nro + ' - ' + Dom.Ciudad + ' - ' + Dom.Referencia
          
        };

        $scope.EliminarPedido = function (index) {
          //  $scope.Lista = []; 
          $scope.Lista.splice(index, 1);
        }
          

        $scope.ValidarFecha = function (fecha) {
            var date = new Date();
            if (  fecha.getFullYear() === date.getFullYear()
                && fecha.getMonth() < date.getMonth()
              ) {
                    return true;
              } else {
                  return false;
              }
        };


        $scope.HacerPedido = function (Lista, lst, formaPago) {
     
            var pedidoExito = true;
            //Validar campos
            if(lst.length === 0){
                pedidoExito = false;
                toastr.warning('No se puede hacer un pedido sin productos en el carrito de compras!.', 'Cuidado');
                return;
            } 

           
            if(!Lista.direccion){
                pedidoExito = false;
                toastr.warning('Falta agregar la dirección!', 'Cuidado');
                return;
            }
            if(Lista.formaEntregaAntes === undefined && Lista.formaEntregaFecha == undefined){
                pedidoExito = false;
                toastr.warning('Falta agregar la forma de entrega!', 'Cuidado');
                return;
            } 
            if(Lista.formaEntregaFecha !== undefined && Lista.formaEntregaFecha !== false){
                if ($scope.ValidarFecha(Lista.fecha)){
                toastr.warning('Fecha de entrega invalida!', 'Cuidado');
                return;
                }
            } 

            if(!formaPago){
                pedidoExito = false;
                toastr.warning('Falta agregar la forma de pago!', 'Cuidado');
                return;
            } 
            if(formaPago==='1' && (Lista.monto === '$' || Lista.monto === undefined)){
                pedidoExito = false;
                toastr.warning('Falta agregar el monto!', 'Cuidado');
                return;
            } 

            if (pedidoExito === true) {
                toastr.success('Pedido Realizado!.', 'Exito');
            }

        };

         $scope.SetFalseElegirFecha = function () {
            $scope.DtoFiltro.formaEntregaFecha = false;
            };
        //Buscar segun los filtros, establecidos en DtoFiltro
        $scope.Buscar = function () {
            alert('Buscando datos...');
                // las propiedades del params tienen que coincidir con el nombre de los parámetros de c# (case sensitive)
                params = { Nombre: $scope.DtoFiltro.Nombre, Activo: $scope.DtoFiltro.Activo, numeroPagina: $scope.PaginaActual };
                $scope.Lista = [
                                {id:'McDonals', nombre : 'Hamburguesa',categoria:'Gastronomia',cantidad:1 }]; 
                // $http.get('/WSRestTodo1/productos/obtener', { params: params })
                //     .then(function (response) {
                //         $scope.Lista = [
                //             {id:1, nombre : 'Hamburguesa',categoria:'Gastronomia',cantidad:1 }]; 
                //     });

        };


        $scope.Consultar = function (Dto) {
            $scope.BuscarPorId(Dto, 'C');
        };

        //comienza la modificacion, luego la confirma con el metodo Grabar
        $scope.Modificar = function (Dto) {
            if (!Dto.Activo) {
                alert("No puede modificarse un registro Inactivo.");
                return;
            }
            $scope.BuscarPorId(Dto, 'M');
        };

        //Obtengo datos del servidor de un registros, metodo usado en el consultar y modificar
        $scope.BuscarPorId = function (Dto, accionABM) {
            $scope.DtoSel = Dto;
            $scope.AccionABMC = accionABM
        };


        //grabar tanto altas como modificaciones
        $scope.Grabar = function () {
            if ($scope.DtoSel.IdArticulo == undefined)  // agregar
            {
                alert('Grabando datos...');
              //  params = { Nombre: $scope.DtoFiltro.Nombre, Activo: $scope.DtoFiltro.Activo, numeroPagina: $scope.PaginaActual };
                $http.post('http://localhost:8088/', $scope.DtoSel)
                    .then(function (response) {
                        $scope.Lista = response;  // variable para luego imprimir
                        $scope.RegistrosTotal = response.data.RegistrosTotal;  // var para mostrar en interface
                    });
                $scope.Volver()

               //  alert('Articulo Agregado!');
            }
            else {
                // modificar put
                $scope.Volver()
                alert('Articulo Modificado!');
            }
        };

        $scope.ActivarDesactivar = function (Dto) {
            var resp = confirm("Esta seguro de " + (Dto.Activo ? "desactivar" : "activar") + " este registro?");
            if (resp)
                alert('Articulo ' + (Dto.Activo ? "desactivado" : "activado"));
        };

        // Volver Agregar/Modificar
        $scope.Volver = function () {
            $scope.DtoSel = null;
            $scope.AccionABMC = 'L';
        };

    //Funcion efectivo
    $scope.Buscar = function () {
        alert('funcion efectivo...');
            // params = { Nombre: $scope.DtoFiltro.Nombre, Activo: $scope.DtoFiltro.Activo, numeroPagina: $scope.PaginaActual };
            // $http.get('/WSRestTodo1/productos/obtener', { params: params })
            //     .then(function (response) {
            //         $scope.Lista = response;  // variable para luego imprimir
            //         $scope.RegistrosTotal = response.data.RegistrosTotal;  // var para mostrar en interface
            //     });

    };

    // Jquery Dependency

$("input[data-type='currency']").on({
    keyup: function() {
      formatCurrency($(this));
    },
    blur: function() { 
      formatCurrency($(this), "blur");
    }
});


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value
  var input_val = input.val();
  
  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    
    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }
  
  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}



    }
]);


angular.module('myApp').directive
  ( 'creditCardType'
  , function(){
      var directive =
        { require: 'ngModel'
        , link: function(scope, elm, attrs, ctrl){
            ctrl.$parsers.unshift(function(value){
              scope.ccinfo.type =
                (/^5[1-5]/.test(value)) ? "mastercard"
                : (/^4/.test(value)) ? "visa"
                : (/^3[47]/.test(value)) ? 'amex'
                : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
                : undefined
              ctrl.$setValidity('invalid',!!scope.ccinfo.type)
              return value
            })
          }
        }
      return directive
      }
    )

angular.module('myApp').directive
  ( 'cardExpiration'
  , function(){
      var directive =
        { require: 'ngModel'
        , link: function(scope, elm, attrs, ctrl){
            scope.$watch('[ccinfo.month,ccinfo.year]',function(value){
              ctrl.$setValidity('invalid',true)
              if ( scope.ccinfo.year == scope.currentYear
                   && scope.ccinfo.month <= scope.currentMonth
                 ) {
                ctrl.$setValidity('invalid',false)
              }
              return value
            },true)
          }
        }
      return directive
      }
    )

angular.module('myApp').filter
  ( 'range'
  , function() {
      var filter = 
        function(arr, lower, upper) {
          for (var i = lower; i <= upper; i++) arr.push(i)
          return arr
        }
      return filter
    }
  )