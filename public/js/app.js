/**
 * Created by Khoa on 12/27/2016.
 */

"use strict";

//configs

var screenWidth = void 0,
    screenHeight = void 0;
var STARTING_PARTICLE_NUM = 75;
var PARTICLE_RADIUS = 3;
var MAX_VELOCITY = 200;

var app = angular.module("app", []);

app.controller('MainCtrl', ['$scope', 'animate', function ($scope, animate) {
    $scope.dots = [];

    $scope.moreDots = function (num) {
        addParticle(num);
    };

    //build the dot with starting position x y and vector
    var buildShape = function buildShape() {
        return {
            x: Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            y: Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            velX: Math.random() * MAX_VELOCITY - MAX_VELOCITY / 2,
            velY: Math.random() * MAX_VELOCITY - MAX_VELOCITY / 2
        };
    };

    var addParticle = function addParticle(num) {
        for (var i = 0; i < num; i++) {
            $scope.dots.push(buildShape());
        }
    };

    //initialize page
    var init = function init() {

        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;

        addParticle(STARTING_PARTICLE_NUM);
        animator($scope.dots, animate);
    };

    init();
}]);

/**
 * On-resize directive
 * This directive resizes the div to the size of the entire window.
 **/
app.directive('resizeOnWindow', function ($window) {
    return function (scope, element, attributes) {
        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'height': window.innerHeight,
                'width': window.innerWidth
            };
        }, function (newValue, oldValue) {
            screenWidth = newValue.width || window.innerWidth;
            screenHeight = newValue.height || window.innerHeight;

            scope.resizeDiv = function (offSet) {
                return {
                    'height': newValue.height - offSet + 'px',
                    'width': '100%'
                };
            };
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    };
});

app.directive('ball', function ($window) {
    return {
        restrict: 'E',
        link: function link(scope, element, attrs) {
            var w = angular.element($window);
            element.addClass('dot');

            var randBlur = Math.random();
            if (randBlur > 0.50) element.addClass('dot-blur1');else element.addClass('dot-blur2');

            scope.$watch(attrs.x, function (x) {
                element.css('left', x + 'px');
            });

            scope.$watch(attrs.y, function (y) {
                element.css('top', y + 'px');
            });
        }
    };
});

app.directive('kyleTitle', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var w = angular.element($window),
                topClass = attrs.kyleTitle,
                initialOffset = element.offset().top;

            w.bind('scroll', function () {
                var currentTop = w.scrollTop(); //get current pos

                if (currentTop < initialOffset) {
                    //move element up/down against the scroll direction
                    element.css('top', -1 * $window.pageYOffset + 'px');
                    element.removeClass(topClass);
                }

                //once current rect reaches 50, apply fixed
                if (currentTop > initialOffset / 2) {
                    element.addClass(topClass);
                    element.removeAttr('style');
                }
            });
        }
    };
}]);

app.directive('fadeOnScroll', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var w = angular.element($window),
                fadeSpeed = attrs.fadeOnScroll;

            var height = $window.innerHeight;
            w.bind('scroll', function () {
                var offSet = $window.pageYOffset,
                    scrolledPercentage = offSet / height * fadeSpeed;

                element.css('opacity', Math.max(1 - scrolledPercentage, 0));
            });
        }
    };
}]);

/**
 * Animate factory to be called to loop requestAnimationFrame
 */
app.factory('animate', ['$window', '$rootScope', function ($window, $rootScope) {
    var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame || $window.oRequestAnimationFrame || $window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    return function (tick) {
        requestAnimationFrame(function () {
            $rootScope.$apply(tick);
        });
    };
}]);

//function to animate dots on the screen
var animator = function animator(shapes, animate) {
    (function tick() {
        var i = void 0,
            shape = void 0,
            now = void 0;
        var maxY = screenHeight,
            maxX = document.body.clientWidth,
            multiplier = -30;
        //now = new Date().getTime();

        for (i = 0; i < shapes.length; i++) {
            shape = shapes[i];
            //multiplier = (shape.timestamp || now) - now;

            //shape.timestamp = now;

            var nextPosX = shape.x + multiplier * shape.velX / 1000;
            var nextPosY = shape.y + multiplier * shape.velY / 1000;

            //bounce off walls
            if (nextPosX < PARTICLE_RADIUS || nextPosX + PARTICLE_RADIUS > maxX) shape.velX *= -1;

            if (nextPosY < PARTICLE_RADIUS || nextPosY + PARTICLE_RADIUS > maxY) shape.velY *= -1;

            //update position
            shape.x += multiplier * shape.velX / 1000;
            shape.y += multiplier * shape.velY / 1000;

            //if the window is resized, bring the balls with you
            if (shape.x > maxX) shape.x = maxX - PARTICLE_RADIUS;
            if (shape.y > maxY) shape.y = maxY - PARTICLE_RADIUS;

            if (shape.x < 0) shape.x = PARTICLE_RADIUS;
            if (shape.y < PARTICLE_RADIUS) shape.y = PARTICLE_RADIUS;
        }

        animate(tick);
    })();
};
//# sourceMappingURL=app.js.map
