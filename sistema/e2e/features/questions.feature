Feature: Question Management
  As a user
  I want to be able to manage multiple-choice questions
  So that I can create tests or quizzes

  Scenario: Create a new multiple-choice question
    Given I am on the questions management page
    When I create a new question with description "What is 2+2?"
    And I add an alternative "3" which is not correct
    And I add an alternative "4" which is correct
    And I save the question
    Then the question "What is 2+2?" should be in the list of questions

  Scenario: Update an existing question
    Given there is an existing question "What is the capital of France?"
    When I update the question description to "What is the capital of Italy?"
    And I save the question
    Then the question "What is the capital of Italy?" should be in the list of questions

  Scenario: Remove a question
    Given there is an existing question "What is the capital of France?"
    When I delete the question "What is the capital of France?"
    Then the question "What is the capital of France?" should not be in the list of questions
