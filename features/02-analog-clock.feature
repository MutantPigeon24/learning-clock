Feature: Analog clock display
  As a child learning to read a clock face
  I want to see the current time on an analog clock
  So that I can learn what the positions of the hands mean

  Scenario: Reading the clock face
    When my child looks at the analog clock
    Then they see the numbers 1 to 12 around the face
    And they see 60 minute marks, with every fifth mark bolder

  Scenario: Telling the hands apart
    When my child looks at the analog clock
    Then the hour hand is shorter and thicker than the minute hand
    And the two hands are different colours

  Scenario: Showing only the hour and minute hands
    When my child looks at the analog clock
    Then they see an hour hand and a minute hand
    And there is no second hand

  Scenario Outline: Moving the hour hand smoothly between hours
    Given the current time is <time>
    When my child looks at the analog clock
    Then the minute hand points at minute <minute>
    And the hour hand is <hour position>

    Examples:
      | time  | minute | hour position                         |
      | 09:00 | 0      | pointing exactly at 9                 |
      | 09:15 | 15     | a quarter of the way from 9 to 10     |
      | 09:30 | 30     | halfway between 9 and 10              |
      | 09:45 | 45     | three quarters of the way from 9 to 10 |
      | 21:30 | 30     | halfway between 9 and 10              |

  Scenario: Showing morning and evening the same way
    Given it is 09:30 or 21:30
    When my child looks at the analog clock
    Then the clock face looks the same at both times
