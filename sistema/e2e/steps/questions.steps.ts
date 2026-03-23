import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the questions management page', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I create a new question with description {string}', async function (description: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I add an alternative {string} which is not correct', async function (alternative: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I add an alternative {string} which is correct', async function (alternative: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I save the question', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the question {string} should be in the list of questions', async function (description: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('there is an existing question {string}', async function (description: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I update the question description to {string}', async function (newDescription: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I delete the question {string}', async function (description: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the question {string} should not be in the list of questions', async function (description: string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
