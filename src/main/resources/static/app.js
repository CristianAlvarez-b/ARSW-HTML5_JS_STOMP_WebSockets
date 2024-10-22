var app = (function () {
    var valor;
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var stompClient = null;

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    var addPolygonCanvas = function (polygon) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        // Comienza a dibujar el polígono
        ctx.beginPath();
        if (polygon.points.length > 0) {
            // Mueve el "lápiz" al primer punto
            ctx.moveTo(polygon.points[0].x, polygon.points[0].y);

            // Dibuja líneas a cada uno de los puntos
            for (var i = 1; i < polygon.points.length; i++) {
                ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
            }

            // Cierra el polígono
            ctx.closePath();
            ctx.stroke(); // Dibuja el contorno
        }
    };

    var getMousePosition = function (evt) {
        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    var connectAndSubscribe = function (number) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        // Subscribe to /topic/newpoint when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/newpoint.${number}`, function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                addPointToCanvas(theObject);
            });
            stompClient.subscribe(`/topic/newpolygon.${number}`, function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                addPolygonCanvas(theObject);
            });
        });
    };

    return {

        init: function () {
            var canvas = document.getElementById("canvas");
            var button = document.getElementById("connect");
            // Add click event listener to canvas
            canvas.addEventListener('click', function (evt) {
                var mousePos = getMousePosition(evt);
                app.publishPoint(mousePos.x, mousePos.y);
            });
            button.addEventListener('click', function (evt) {
                valor = document.getElementById("draw").value;

                // Verificar que el campo no esté vacío y que el valor sea numérico
                if (valor && !isNaN(valor) && Number.isInteger(Number(valor)) && Number(valor) > 0) {
                    // Limpiar el canvas antes de suscribirse y dibujar
                    clearCanvas();

                    // Desconectar si ya hay una conexión activa
                    if (stompClient !== null) {
                        stompClient.disconnect(function () {
                            console.log('Disconnected from previous subscription.');
                            connectAndSubscribe(valor);
                        });
                    } else {
                        connectAndSubscribe(valor);
                    }

                    console.log('Attempting to connect with valor: ' + valor);
                } else {
                    alert('Por favor ingrese un número válido.');
                }
            });

            // Función para limpiar el canvas
            var clearCanvas = function () {
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
        },

        publishPoint: function (px, py) {
            var pt = new Point(px, py);
            console.info("Publishing point at " + pt.x + ", " + pt.y);
            addPointToCanvas(pt);

            // Publish the event
            stompClient.send(`/app/newpoint.${valor}`, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        }
    };
})();
