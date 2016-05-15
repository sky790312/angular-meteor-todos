import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // only runs on the server
  // only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      } ]
    });
  });
}

Meteor.methods({
  'tasks.insert' (text) {
    check(text, String);

    // authorized user logged in status before insert
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove' (taskId) {
    check(taskId, String);

	const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== Meteor.userId()) {
      // make sure only the owner can delete the task
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  'tasks.setCompleted' (taskId, setCompleted) {
    check(taskId, String);
    check(setCompleted, Boolean);

	const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== Meteor.userId()) {
      // make sure only the owner can delete the task
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        checked: setCompleted
      }
    });
  },
  'tasks.setPrivate' (taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  }
});