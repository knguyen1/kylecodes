/**
 * Created by Khoa on 1/7/2017.
 */

"use strict";

const app = angular.module('Flashcards', ['ngSanitize']);

app.controller('FlashcardsCtrl', ['$scope', 'FlashcardFactory', ($scope, FlashcardFactory) => {
    /**
     * Hello world! Main controller... Nothing to see here.
     */
}]);

/**
 * Filters
 */

app.filter('parseUrl', [() => {
    const urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim
        ,emails = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;

    return (text) => {
        if(text.length === 0)
            return '';

        if(text.match(urls))
            text = text.replace(urls, "<a href=\"$1\" target=\"_blank\">$1</a>");

        if(text.match(emails))
            text = text.replace(emails, "<a href=\"mailto:$1\">$1</a>");
        
        return text;
    };
}]);

/**
 * Factory
 */
app.factory('FlashcardFactory', [() => {
    let flashcards = [],
        currentCard = 0;

    flashcards.push({
        'id': 0,
        'question': 'Who is Kyle Nguyen?',
        'answer': 'An awesome developer.'
    });

    flashcards.push({
        'id': 1,
        'question': 'How do I interview Kyle Nguyen?',
        'answer': 'Send me an email here: dbo.kylenguyen@gmail.com.'
    });

    flashcards.push({
        'id': 2,
        'question': 'What are Kyle\'s favourite languages?',
        'answer': 'C# ASP.NET, Javascript, HTML5/CSS'
    });

    return {
        getCards: () => {
            return flashcards;
        },
        getSize: () => {
            return flashcards.length;
        },
        getCurrentCard: () => {
            return currentCard;
        },
        setCurrentCard: (n) => {
            if(n <= flashcards.length && n > -1)
                currentCard = n;
        },
        showNextCard: () => {
            let len = flashcards.length;
            if(currentCard + 1 !== len)
                currentCard++;
        },
        showPreviousCard: () => {
            if(currentCard !== 0)
                currentCard--;
        },
        setCard: (card) => {
            flashcards.push(card);
        }
    };
}]);

/**
 * Directives
 */

//the header directive contains the re-usable header component
app.directive('flashcardsHeader', [() => {
    return {
        restrict: 'E',
        templateUrl: 'flheader.html',
        link: (scope, element, attrs) => {

        }
    }
}]);

//the card directive contains the card
//cards should have some properties
//1. is the answer showing?
//2. the prompt
//3. the answer
//4. the card id
app.directive('cardContainer', [() => {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'cardcontainer.html',
        controller: ($scope, FlashcardFactory) => {
            $scope.showModal = false;
            $scope.toggleModal = () => {
                $scope.showModal = !$scope.showModal;
            }
            
            $scope.addCard = () => {
                $scope.showModal = true;
            }
            
            $scope.cards = FlashcardFactory.getCards();
            $scope.getCurrentCard = () => {
                return FlashcardFactory.getCurrentCard();
            }
            
            $scope.setCurrentCard = (n) => {
                FlashcardFactory.setCurrentCard(n);
            }
        },
        link: (scope, element, attrs) => {
        }
    }
}]);

app.directive('card', [() => {
    return {
        restrict: 'E',
        require: '^cardContainer',
        scope: {
            card: '=cardData'
        },
        templateUrl: 'card.html',
        controller: ($scope, FlashcardFactory) => {
            $scope.showAnswer = false;
            $scope.toggleAnswer = () => {
                $scope.showAnswer = !$scope.showAnswer;
            };
            
            $scope.getSize = () => {
                return FlashcardFactory.getSize();
            };

            //set the show answer state to false then show previous or next card
            $scope.showPreviousCard = () => {
                $scope.showAnswer = false;
                FlashcardFactory.showPreviousCard();
            };

            $scope.showNextCard = () => {
                $scope.showAnswer = false;
                FlashcardFactory.showNextCard();
            };
        },
        link: (scope, element, attrs, ctrl) => {
        }
    };
}]);

app.directive('createCard', [() => {
    return {
        restrict: 'E',
        scope: {
            toggle: '&'
        },
        templateUrl: 'createcard.html',
        controller: ($scope, FlashcardFactory) => {
            $scope.d = () => {
                $scope.toggle();
            }
            
            $scope.cardQuestion = '';
            $scope.cardAnswer = '';
            
            $scope.createCard = (q, a) => {
                const size = FlashcardFactory.getSize();
                const card = {
                    'id': size,
                    'question': q,
                    'answer': a
                }

                FlashcardFactory.setCard(card);
                $scope.d();
            }
        }
    }
}]);