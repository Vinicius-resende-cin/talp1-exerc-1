Feature: Exam Grading with CSV

  Scenario: High rigor grading by uploading CSV files
    Given I navigate to the Grading page
    When I fill in the exam ID "HIGH-123"
    And I upload the correct answers CSV with high rigor mock data
    And I upload the student answers CSV with high rigor mock data
    And I select "high" rigor
    And I click "Grade Exam"
    Then I should see the grades table with "Bob" getting "0"
    And I should see the grades table with "Alice" getting "10"

  Scenario: Low rigor grading by uploading CSV files
    Given I navigate to the Grading page
    When I fill in the exam ID "LOW-123"
    And I upload the correct answers CSV with low rigor mock data
    And I upload the student answers CSV with low rigor mock data
    And I select "low" rigor
    And I click "Grade Exam"
    Then I should see the grades table with "Bob" getting "5"
    And I should see the grades table with "Alice" getting "10"
