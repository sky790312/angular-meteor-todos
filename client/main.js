import angular from 'angular';
import angularMeteor from 'angular-meteor';

import todosList from '../imports/components/todosList/todosList';

angular.module('todos-app', [
  angularMeteor,
  todosList.name
]);

function onReady() {
  angular.bootstrap(document, ['todos-app']);
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}