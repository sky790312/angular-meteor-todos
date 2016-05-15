import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Tasks } from '../../api/tasks.js';
import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      tasks() {
        // sort tasks by newest time
        return Tasks.find({}, {
          sort: {
            createdAt: -1
          }
        });
      }
    })
  }

  addTask(task) {
    // insert new task into collection
    Tasks.insert({
      text: task,
      createdAt: new Date
    });

    // clear input
    this.newTask = '';
  }

  setChecked(task) {
    // toggle the checked status
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      },
    });
  }

  removeTask(task) {
    Tasks.remove(task._id);
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });