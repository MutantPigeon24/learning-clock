Feature: Show the device's current time
  As a child
  I want the app to show the time it is right now
  So that what I learn matches the real world around me

  # Everything here applies while the clock is following the real time.
  # When my child sets the clock by dragging the hands, the set time is shown
  # instead until they go back to the real time (see 08-set-the-clock.feature).

  Rule: The time always comes from the device's own clock and time zone

    Scenario: Showing the current time on opening
      Given the device clock reads 09:12
      When my child opens the app
      Then every clock display shows 9:12 in the morning

    Scenario: Working out the time without internet
      Given the tablet has no internet connection
      When my child opens the app
      Then the current time is still shown

    Scenario: Following the device's time zone and daylight saving
      Given the device's time zone or daylight saving changes
      When the app next updates
      Then it shows the new local time

  Rule: The time keeps itself up to date

    Scenario: Moving to the next minute
      Given the app is showing 9:12
      When the device clock reaches 9:13
      Then all displays change to 9:13 within 1 second

    Scenario: Changing every display together
      When the minute changes
      Then the analog clock, both digital clocks, the words and the scene all update together
      And no display ever shows a different time from the others

    Scenario: Going past midnight
      Given the app is showing 11:59 at night
      When the device clock reaches midnight
      Then all displays show 12 o'clock midnight

    Scenario: Coming back to the app after it was in the background
      Given the app was left in the background at 9:12
      When my child returns to it at 10:40
      Then all displays show 10:40 straight away
