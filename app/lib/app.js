
var app = angular.module('myApp', ['ngRoute']);

app.controller('inicioCtrl', function ($scope) {
    toastr.success('Pedido Realizado!', 'Exito');

    $scope.Titulo = 'Pedido Exitoso';

    $scope.Volver = function () {
        window.location.href = '/app/Pedido.html';

    };
});


app.controller('ArticulosCtrl', ['$rootScope', '$scope', '$location', '$locale',
    function ($rootScope, $scope, $location, $locale) {
        var esTarjeta = $location.hash();

        if (esTarjeta === '2') {
            $rootScope.formaPago = "/Tarjeta.html";
        }

        $scope.currentYear = new Date().getFullYear()
        $scope.currentMonth = new Date().getMonth() + 1
        $scope.months = $locale.DATETIME_FORMATS.MONTH
        $scope.ccinfo = { type: undefined }
        $scope.save = function (data) {
            if ($scope.paymentForm.$valid) {
                console.log(data)
            }
        };

        $scope.Titulo = 'Tu pedido';
        $scope.TituloAccionABMC = { A: '(Agregar)', B: '(Eliminar)', M: '(Modificar)', C: '(Consultar)', L: null };
        $scope.AccionABMC = 'L';
        $scope.Mensajes = { SD: ' No se encontraron registros...', RD: ' Revisar los datos ingresados...' };

        $scope.DtoFiltro = {};
        $scope.Dom = {};
        $scope.fecha = {};
        $scope.total = 0;
        $scope.DtoFiltro.Activo = null;
        $scope.DtoFiltro.monto = '$';
        $scope.PaginaActual = 1;
        $scope.OpcionesSiNo = [{ Id: null, Nombre: '' }, { Id: true, Nombre: 'SI' }, { Id: false, Nombre: 'NO' }];


        $scope.Lista = [
            { comercio: 'McDonals', nombre: 'Hamburguesa', categoria: 'Gastronomia', cantidad: 1, precio: 125 },
            { comercio: 'McDonals', nombre: 'Agua', categoria: 'Gastronomia', cantidad: 1, precio: 25 }];

        if ($scope.Lista.length > 0) {
            angular.forEach($scope.Lista, function (value, key) {
                $scope.total += value.precio;
            });

        }


        $scope.Agregar = function () {
            $scope.AccionABMC = 'DP';
            $scope.DtoSel = {};
            $scope.DtoSel.Activo = true;
        };


        $scope.AgregarTarjetaForm = function (value) {
            if (value === '2') {
                $scope.AccionABMC = 'T';
            }
        };


        $scope.AgregarTarjeta = function (ccinfo, paymentForm, FormFiltro) {
            $rootScope.formaPago = "/Tarjeta.html";

            if (ccinfo.type !== 'visa') {
                toastr.error('Solo se permite una tarjeta visa válida', 'Error');
                return;
            }

            if (!$scope.paymentForm.$valid) {
                console.log(ccinfo);
                return;
            }
            $scope.AccionABMC = 'L';
        };


        $scope.AgregarDomicilio = function () {
            $scope.AccionABMC = 'D';
        };


        $scope.AgregarDomicilioUI = function (Dom) {

            if (!Dom.Calle) {
                toastr.warning('Falta agregar la calle', 'Cuidado');
                return;
            }
            if (!Dom.Nro) {
                toastr.warning('Falta agregar el número', 'Cuidado');
                return;
            }
            if (!Dom.Ciudad) {
                toastr.warning('Falta agregar la ciudad', 'Cuidado');
                return;
            }

            $scope.AccionABMC = 'L';
            $scope.DtoFiltro.direccion = Dom.Calle + ' - ' + Dom.Nro + ' - ' + Dom.Ciudad + ' - ' + Dom.Referencia

        };


        $scope.EliminarPedido = function (index) {
            $scope.total = 0;
            $scope.Lista.splice(index, 1);

            if ($scope.Lista.length > 0) {
                angular.forEach($scope.Lista, function (value, key) {
                    $scope.total += value.precio;
                });

            }
        }


        $scope.ValidarFecha = function (fecha) {
            var date = new Date();
            if (fecha.getFullYear() === date.getFullYear()
                && fecha.getMonth() < date.getMonth()
            ) {
                return true;
            } else {
                return false;
            }
        };


        $scope.HacerPedido = function (Lista, lst, formaPago) {

            var pedidoExito = true;

            if (lst.length === 0) {
                pedidoExito = false;
                toastr.warning('No se puede hacer un pedido sin productos seleccionados', 'Cuidado');
                return;
            }
            if (!Lista.direccion) {
                pedidoExito = false;
                toastr.warning('Falta agregar la dirección', 'Cuidado');
                return;
            }
            if (Lista.formaEntregaAntes === undefined && Lista.formaEntregaFecha == undefined) {
                pedidoExito = false;
                toastr.warning('Falta agregar la forma de entrega', 'Cuidado');
                return;
            }
            if (Lista.formaEntregaFecha !== undefined && Lista.formaEntregaFecha !== false) {
                if ($scope.ValidarFecha(Lista.fecha)) {
                    toastr.warning('Fecha de entrega inválida', 'Cuidado');
                    return;
                }
            }
            if (!formaPago) {
                pedidoExito = false;
                toastr.warning('Falta agregar la forma de pago', 'Cuidado');
                return;
            }
            if (formaPago === '1'){
                 if(Lista.monto === '$' || Lista.monto === undefined) {
                pedidoExito = false;
                toastr.warning('Falta agregar el monto', 'Cuidado');
                return;
               } else {
                   if((parseInt(Lista.monto.substring(1)) - $scope.total) < 0) {
                      pedidoExito = false;
                      toastr.warning('El monto ingresado a pagar es menor al total, faltan : $' 
                      +(parseInt(Lista.monto.substring(1)) - $scope.total), 'Cuidado');
                    return;
                   } else {

                   }
               }
            }
            if (pedidoExito === true) {
                window.location.href = '/app/index.html';

            }

        };


        $scope.SetFalseElegirFecha = function () {
            $scope.DtoFiltro.formaEntregaFecha = false;
        };


        $scope.Buscar = function () {
            alert('Buscando datos...');
            params = { Nombre: $scope.DtoFiltro.Nombre, Activo: $scope.DtoFiltro.Activo, numeroPagina: $scope.PaginaActual };
            $scope.Lista = [
                { id: 'McDonals', nombre: 'Hamburguesa', categoria: 'Gastronomia', cantidad: 1 }];

        };


        $scope.Consultar = function (Dto) {
            $scope.BuscarPorId(Dto, 'C');
        };


        $scope.Modificar = function (Dto) {
            if (!Dto.Activo) {
                alert("No puede modificarse un registro Inactivo.");
                return;
            }
            $scope.BuscarPorId(Dto, 'M');
        };


        $scope.BuscarPorId = function (Dto, accionABM) {
            $scope.DtoSel = Dto;
            $scope.AccionABMC = accionABM
        };


        $scope.Grabar = function () {
            if ($scope.DtoSel.IdArticulo == undefined) {
                alert('Grabando datos...');
                $http.post('http://localhost:8088/', $scope.DtoSel)
                    .then(function (response) {
                        $scope.Lista = response;
                        $scope.RegistrosTotal = response.data.RegistrosTotal;
                    });
                $scope.Volver()

            }
            else {
                $scope.Volver()
                alert('Articulo Modificado!');
            }
        };


        $scope.ActivarDesactivar = function (Dto) {
            var resp = confirm("Esta seguro de " + (Dto.Activo ? "desactivar" : "activar") + " este registro?");
            if (resp)
                alert('Articulo ' + (Dto.Activo ? "desactivado" : "activado"));
        };


        $scope.Volver = function () {
            $scope.DtoSel = null;
            $scope.AccionABMC = 'L';
        };


        $scope.Buscar = function () {
            alert('funcion efectivo...');


        };


        $("input[data-type='currency']").on({
            keyup: function () {
                formatCurrency($(this));
            },
            blur: function () {
                formatCurrency($(this), "blur");
            }
        });


        function formatNumber(n) {
            return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }


        function formatCurrency(input, blur) {

            var input_val = input.val();

            if (input_val === "") { return; }

            var original_len = input_val.length;

            var caret_pos = input.prop("selectionStart");

            if (input_val.indexOf(".") >= 0) {

                var decimal_pos = input_val.indexOf(".");

                var left_side = input_val.substring(0, decimal_pos);
                var right_side = input_val.substring(decimal_pos);

                left_side = formatNumber(left_side);

                right_side = formatNumber(right_side);

                if (blur === "blur") {
                    right_side += "00";
                }

                right_side = right_side.substring(0, 2);

                input_val = "$" + left_side + "." + right_side;

            } else {

                input_val = formatNumber(input_val);
                input_val = "$" + input_val;

                if (blur === "blur") {
                    input_val += ".00";
                }
            }

            input.val(input_val);

            var updated_len = input_val.length;
            caret_pos = updated_len - original_len + caret_pos;
            input[0].setSelectionRange(caret_pos, caret_pos);
        }



    }
]);



angular.module('myApp').directive
    ('creditCardType'
        , function () {
            var directive =
            {
                require: 'ngModel'
                , link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        scope.ccinfo.type =
                            (/^5[1-5]/.test(value)) ? "mastercard"
                                : (/^4/.test(value)) ? "visa"
                                    : (/^3[47]/.test(value)) ? 'amex'
                                        : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
                                            : undefined
                        ctrl.$setValidity('invalid', !!scope.ccinfo.type)
                        return value
                    })
                }
            }
            return directive
        }
    )

angular.module('myApp').directive
    ('cardExpiration'
        , function () {
            var directive =
            {
                require: 'ngModel'
                , link: function (scope, elm, attrs, ctrl) {
                    scope.$watch('[ccinfo.month,ccinfo.year]', function (value) {
                        ctrl.$setValidity('invalid', true)
                        if (scope.ccinfo.year == scope.currentYear
                            && scope.ccinfo.month <= scope.currentMonth
                        ) {
                            ctrl.$setValidity('invalid', false)
                        }
                        return value
                    }, true)
                }
            }
            return directive
        }
    )

angular.module('myApp').filter
    ('range'
        , function () {
            var filter =
                function (arr, lower, upper) {
                    for (var i = lower; i <= upper; i++) arr.push(i)
                    return arr
                }
            return filter
        }
    )