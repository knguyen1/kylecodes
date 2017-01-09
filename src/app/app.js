/**
 * Created by Khoa on 12/27/2016.
 */

"use strict";

//configs
let screenWidth, screenHeight;
const STARTING_PARTICLE_NUM = 75;
const PARTICLE_RADIUS = 3;
const MAX_VELOCITY = 200;

const app = angular.module("app", []);

app.controller('MainCtrl', ['$scope','animate', ($scope, animate) => {
    $scope.dots = [];

    $scope.moreDots = (num) => {
        addParticle(num);
    }

    //build the dot with starting position x y and vector
    const buildShape = () => {
        return {
            x: Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            y: Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            velX: Math.random() * MAX_VELOCITY - MAX_VELOCITY/2,
            velY: Math.random() * MAX_VELOCITY - MAX_VELOCITY/2
        };
    }

    const addParticle = (num) => {
        for(let i = 0; i < num; i++) {
            $scope.dots.push(buildShape());
        }
    }

    //initialize page
    const init = () => {

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
app.directive('resizeOnWindow', ($window) => {
    return (scope, element, attributes) => {
        const w = angular.element($window);
        scope.$watch(() => {
            return {
                'height': window.innerHeight,
                'width': window.innerWidth
            };
        }, (newValue, oldValue) => {
            screenWidth = newValue.width || window.innerWidth;
            screenHeight = newValue.height || window.innerHeight;

            scope.resizeDiv = (offSet) => {
                return {
                    'height': (newValue.height - offSet) + 'px',
                    'width': '100%'
                };
            };
        }, true);

        w.bind('resize', () => {
            scope.$apply();
        })
    }
});

app.directive('ball', ($window) => {
    return {
        restrict: 'E',
        link: (scope, element, attrs) => {
            const w = angular.element($window);
            element.addClass('dot');

            let randBlur = Math.random();
            if(randBlur > 0.50)
                element.addClass('dot-blur1');
            else
                element.addClass('dot-blur2');

            scope.$watch(attrs.x, (x) => {
                element.css('left', x + 'px');
            });

            scope.$watch(attrs.y, (y) => {
                element.css('top', y + 'px');
            });
        }
    };
});

app.directive('kyleTitle', ['$window', ($window) => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            const w = angular.element($window),
                topClass = attrs.kyleTitle,
                initialOffset = element.offset().top;

            w.bind('scroll', () => {
                let currentTop = w.scrollTop(); //get current pos

                if(currentTop < initialOffset) {
                    //move element up/down against the scroll direction
                    element.css('top', -1 * $window.pageYOffset + 'px');
                    element.removeClass(topClass);
                }

                //once current rect reaches 50, apply fixed
                if(currentTop > (initialOffset / 2)) {
                    element.addClass(topClass);
                    element.removeAttr('style');
                }
            });
        }
    };
}]);

app.directive('fadeOnScroll', ['$window', ($window) => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            const w = angular.element($window),
                fadeSpeed = attrs.fadeOnScroll;

            const height = $window.innerHeight;
            w.bind('scroll', () => {
                let offSet = $window.pageYOffset,
                    scrolledPercentage = (offSet / height) * fadeSpeed;

                element.css('opacity', Math.max(1 - scrolledPercentage, 0));
            });
        }
    }
}]);

/**
 * Animate factory to be called to loop requestAnimationFrame
 */
app.factory('animate',['$window', '$rootScope', ($window, $rootScope) => {
    const requestAnimationFrame = $window.requestAnimationFrame
        || $window.webkitRequestAnimationFrame
        || $window.mozRequestAnimationFrame
        || $window.oRequestAnimationFrame
        || $window.msRequestAnimationFrame
        || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    return (tick) => {
        requestAnimationFrame(() => {
            $rootScope.$apply(tick);
        });
    };
}]);

//function to animate dots on the screen
const animator = (shapes, animate) => {
    (function tick(){
        let i, shape, now;
        const maxY = screenHeight,
            maxX = document.body.clientWidth,
            multiplier = -30;
        //now = new Date().getTime();

        for(i = 0; i < shapes.length; i++) {
            shape = shapes[i];
            //multiplier = (shape.timestamp || now) - now;

            //shape.timestamp = now;

            const nextPosX = shape.x + multiplier * shape.velX / 1000;
            const nextPosY = shape.y + multiplier * shape.velY / 1000;

            //bounce off walls
            if(nextPosX < PARTICLE_RADIUS || nextPosX + PARTICLE_RADIUS > maxX)
                shape.velX *= -1;

            if(nextPosY < PARTICLE_RADIUS || nextPosY + PARTICLE_RADIUS > maxY)
                shape.velY *= -1;

            //update position
            shape.x += multiplier * shape.velX / 1000;
            shape.y += multiplier * shape.velY / 1000;

            //if the window is resized, bring the balls with you
            if(shape.x > maxX)
                shape.x = maxX - PARTICLE_RADIUS;
            if(shape.y > maxY)
                shape.y = maxY - PARTICLE_RADIUS;

            if(shape.x < 0)
                shape.x = PARTICLE_RADIUS;
            if(shape.y < PARTICLE_RADIUS)
                shape.y = PARTICLE_RADIUS;
        }

        animate(tick);
    })();
}