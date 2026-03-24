Feature: Exam Grading
  As a user
  I want to grade a generated exam
  So that I can see the score

  Scenario: Grade a generated exam
    Given an exam exists and "1" instance of it has been generated
    When I navigate to the Grading page
    And I select the exam, set test number to "1"
    And I fill in answers for the questions
    And I submit the grading form
    Then I should see the grade result on the screen