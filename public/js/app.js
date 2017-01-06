/**
 * Created by Khoa on 12/27/2016.
 */

//configs
let screenWidth, screenHeight;
const STARTING_PARTICLE_NUM = 200;
const PARTICLE_RADIUS = 3;
const MAX_VELOCITY = 200;

const app = angular.module("app", []);

app.controller('MainCtrl', ['$scope','animate',function($scope, animate) {
    $scope.dots = [];

    $scope.moreDots = function(num) {
        addParticle(num);
    }
    
    //build the dot with starting position x y and vector
    function buildShape() {
        return {
            x: Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2), //+ 1 + PARTICLE_RADIUS,
            y: Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2), //+ 1 + PARTICLE_RADIUS,
            velX: Math.random() * MAX_VELOCITY - MAX_VELOCITY / 2,
            velY: Math.random() * MAX_VELOCITY - MAX_VELOCITY / 2
        };
    }

    function addParticle(num) {
        for(let i = 0; i < num; i++) {
            $scope.dots.push(buildShape());
        }
    }
    
    //initialize page
    function init() {

        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;

        addParticle(STARTING_PARTICLE_NUM);
        animator($scope.dots, animate);
    }

    init();
}]);

/**
 * On-resize directive
 * This directive resizes the div to the size of the entire window.
 **/
app.directive('resizeOnWindow', function($window){
    return function(scope, element, attributes) {
        const w = angular.element($window);
        scope.$watch(function(){
           return {
               'height': window.innerHeight,
               'width': window.innerWidth
           };
        }, function(newValue, oldValue){
            screenWidth = newValue.width || window.innerWidth;
            screenHeight = newValue.height || window.innerHeight;

            scope.resizeDiv = function(offSet) {
              return {
                  'height': (newValue.height - offSet) + 'px',
                  'width': '100%'
              };
            };
        }, true);

        w.bind('resize', function(){
            scope.$apply();
        })
    }
});

app.directive('ball', function($window){
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            const w = angular.element($window);
            element.addClass('dot');

            let randBlur = Math.random();
            if(randBlur > 0.50)
                element.addClass('dot-blur1');
            else
                element.addClass('dot-blur2');

            scope.$watch(attrs.x, function(x){
                element.css('left', x + 'px');
            });
            
            scope.$watch(attrs.y, function(y){
                element.css('top', y + 'px'); 
            });
        }
    };
});

/**
 * Animate factory to be called to loop requestAnimationFrame
 */
app.factory('animate',['$window', '$rootScope', function($window, $rootScope){
    const requestAnimationFrame = $window.requestAnimationFrame
        || $window.webkitRequestAnimationFrame
        || $window.mozRequestAnimationFrame
        || $window.oRequestAnimationFrame
        || $window.msRequestAnimationFrame
        || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    return function(tick) {
        requestAnimationFrame(function(){
            $rootScope.$apply(tick);
        });
    };
}]);

//function to animate dots on the screen
function animator(shapes, animate) {
    (function tick(){
        let i, shape, now, elapsed;
        const maxY = screenHeight,
            maxX = document.body.clientWidth;
        now = new Date().getTime();

        for(i = 0; i < shapes.length; i++) {
            shape = shapes[i];
            elapsed = (shape.timestamp || now) - now;

            shape.timestamp = now;

            const nextPosX = shape.x + elapsed * shape.velX / 1000;
            const nextPosY = shape.y + elapsed * shape.velY / 1000;

            //bounce off walls
            if(nextPosX < 3 || nextPosX + 3 > maxX)
                shape.velX *= -1;

            if(nextPosY < 3 || nextPosY + 3 > maxY)
                shape.velY *= -1;

            //update position
            shape.x += elapsed * shape.velX / 1000;
            shape.y += elapsed * shape.velY / 1000;

            //if the window is resized, bring the balls with you
            if(shape.x > maxX)
                shape.x = 2 * maxX - shape.x;
            if(shape.y > maxY)
                shape.y = 2 * maxY - shape.y;
        }

        animate(tick);
    })();
}