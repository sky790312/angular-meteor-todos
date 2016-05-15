import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

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

    Tasks.remove(taskId);
  },
  'tasks.setCompleted' (taskId, setCompleted) {
    check(taskId, String);
    check(setCompleted, Boolean);

    Tasks.update(taskId, {
      $set: {
        checked: setCompleted
      }
    });
  },
});