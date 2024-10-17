var app = (function () {

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

    var getMousePosition = function (evt) {
        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        // Subscribe to /topic/newpoint when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                addPointToCanvas(theObject);
            });
        });
    };

    return {

        init: function () {
            var canvas = document.getElementById("canvas");

            // Websocket connection
            connectAndSubscribe();

            // Add click event listener to canvas
            canvas.addEventListener('click', function (evt) {
                var mousePos = getMousePosition(evt);
                app.publishPoint(mousePos.x, mousePos.y);
                console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
            });
        },

        publishPoint: function (px, py) {
            var pt = new Point(px, py);
            console.info("Publishing point at " + pt.x + ", " + pt.y);
            addPointToCanvas(pt);

            // Publish the event
            stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        }
    };
})();
