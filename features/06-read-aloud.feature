Feature: Read the time aloud
  As a child learning how to say the time
  I want to press a button and hear the time spoken
  So that I can learn how the time sounds even before I can read every word

  # The app reads out whatever time the clock is showing: the real time, or a
  # time set by dragging the hands (see 08-set-the-clock.feature).

  Background:
    Given the clock screen is showing

  Scenario: Finding the button
    When my child looks at the clock screen
    Then they see a large button with a speaker icon
    And they can recognise it without reading

  Scenario: Hearing the current time
    Given the current time is 09:12
    When my child presses the read-aloud button
    Then the app says "It is 12 minutes past 9 in the morning."
    And this is exactly the sentence shown in the words

  Scenario: Speaking clearly for young children
    When the app reads the time aloud
    Then it speaks a little slower than normal speech
    And it uses a clear voice

  Scenario: Reading aloud without internet
    Given the tablet has no internet connection
    When my child presses the read-aloud button
    Then the time is spoken using a voice on the device

  Scenario: Pressing the button again while it is speaking
    Given the app is reading the time aloud
    When my child presses the read-aloud button again
    Then the app stops and starts reading the time again from the beginning
    And two readings never play over each other

  Scenario: The minute changes while it is speaking
    Given the app starts reading at 9:12
    When the clock changes to 9:13 before the reading finishes
    Then the app finishes saying "12 minutes past 9"
    And the next press of the button says the new time

  Scenario: Showing that the app is speaking
    When the app is reading the time aloud
    Then the button shows that speech is playing

  Scenario: No voice is available on the device
    Given the device has no voice the app can use
    When my child looks at the clock screen
    Then the read-aloud button is shown as unavailable
    And every other feature still works

  # Low priority: build this after everything else works.
  @low-priority
  Rule: Each word lights up as it is spoken

    Scenario: Following the words while they are spoken
      Given the current time is 09:12
      When my child presses the read-aloud button
      Then each word of "It is 12 minutes past 9 in the morning." is highlighted as it is spoken
      And only one word is highlighted at a time
      And no word is highlighted once the reading finishes

    Scenario: The device's voice can't say where each word is
      Given the device's voice doesn't report when each word is spoken
      When my child presses the read-aloud button
      Then the time is still read aloud
      And no words are highlighted
