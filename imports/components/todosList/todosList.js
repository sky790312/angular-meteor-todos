import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../../api/tasks.js';
import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    // meteor.publish task and $scope.subscribe
    this.subscribe('tasks');

    this.hideCompleted = false;

    this.helpers({
      tasks() {
        const selector = {};

        // hide completed - filter tasks
        // $scope.getReactively : turn angular scope variables into meteor reactive variables
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        // sort tasks by newest time
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }

  addTask(task) {
    // insert new task into collection
    Meteor.call('tasks.insert', task);

    // clear input
    this.newTask = '';
  }

  setCompleted(task) {
    // toggle the checked status
    Meteor.call('tasks.setCompleted', task._id, !task.checked);
  }

  removeTask(task) {
    Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });