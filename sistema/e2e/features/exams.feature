Feature: Exam Management
  As a user
  I want to create exams from previously defined questions
  So that I can test students with different formats

  Scenario: Create an exam with letter identifiers
    Given the following questions exist:
      | id | text                     |
      | 1  | "What is 2+2?"           |
      | 2  | "What is the capital?"   |
    When I create a new exam with title "Math Test 1"
    And I select questions "1" and "2"
    And I set the identifier type to "letters"
    And I save the exam
    Then the exam should be successfully created
    And the exam preview should display options as "a, b, c..."
    And the exam should have a space for the student to answer with the selected letters

  Scenario: Create an exam with powers of 2 identifiers
    Given the following questions exist:
      | id | text                     |
      | 3  | "Explain gravity."       |
      | 4  | "What is 5*5?"           |
    When I create a new exam with title "Physics and Math"
    And I select questions "3" and "4"
    And I set the identifier type to "powers_of_2"
    And I save the exam
    Then the exam should be successfully created
    And the exam preview should display options as "1, 2, 4, 8..."
    And the exam should have a space for the student to answer with the sum of the selected numbers

  Scenario: Generate test instances
    Given an exam exists
    When I choose to generate 2 instances of the exam
    Then a ZIP file should be downloaded

