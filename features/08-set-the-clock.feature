Feature: Setting the clock by dragging the hands
  As a child learning to tell time
  I want to drag the hands of the analog clock to any time I like
  So that I can practise reading times I choose and see how every clock shows them

  As a parent
  I want to set the clock to a time and ask my child what it says
  So that we can practise together

  # While the clock is set by hand, every display uses the set time instead of
  # the device's time: both digital clocks, the words, the read-aloud sentence
  # and the scene. See 01-current-time.feature for following the real time.

  Rule: The hands can be dragged with a finger

    Scenario: Picking up a hand
      Given the clock is showing the real time
      When my child touches the minute hand and moves their finger around the clock face
      Then the minute hand follows their finger
      And the page does not scroll, zoom or go back

    Scenario: Choosing which hand to move
      When my child touches the clock face
      Then the hand closest to their finger is the one that moves
      And the hands are easy to grab with a small finger

    Scenario: Letting go of the minute hand
      Given my child is dragging the minute hand
      When they let go between two minute marks
      Then the minute hand settles on the nearest whole minute

  Rule: Moving the minute hand also moves the hour hand

    Scenario Outline: Dragging the minute hand
      Given the clock is showing <start>
      When my child drags the minute hand <direction> to minute <minute>
      Then the time is <end>
      And the hour hand is in the right place for <end>

      Examples:
        | start | direction                    | minute | end   |
        | 09:12 | clockwise                    | 30     | 09:30 |
        | 09:30 | anticlockwise                | 5      | 09:05 |
        | 09:50 | clockwise, past the 12       | 5      | 10:05 |
        | 10:05 | anticlockwise, past the 12   | 50     | 09:50 |
        | 09:15 | clockwise, twice round       | 15     | 11:15 |

  Rule: Moving the hour hand changes the hour and keeps the minutes

    Scenario Outline: Dragging the hour hand
      Given the clock is showing <start>
      When my child drags the hour hand <direction> to the <hour>
      Then the time is <end>
      And the minute hand has not moved

      Examples:
        | start | direction                  | hour | end   |
        | 09:30 | clockwise                  | 11   | 11:30 |
        | 09:30 | anticlockwise              | 7    | 07:30 |
        | 09:30 | clockwise, past the 12     | 3    | 15:30 |
        | 14:20 | anticlockwise, past the 12 | 10   | 10:20 |

  Rule: Going round past the 12 moves between morning and evening

    # The clock face looks the same in the morning and the evening, so the app
    # keeps count: each time the hour hand passes 12 going forward, the time moves
    # on 12 hours; going backward, it moves back 12 hours.

    Scenario Outline: Crossing midday and midnight
      Given the clock is showing <start>
      When my child drags the minute hand <direction> to minute <minute>
      Then the time is <end>
      And the 12-hour clock highlights "<label>"
      And the words say "<sentence>"

      Examples:
        | start | direction                  | minute | end   | label | sentence                                   |
        | 11:50 | clockwise, past the 12     | 0      | 12:00 | PM    | It is 12 o'clock midday.                   |
        | 11:50 | clockwise, past the 12     | 10     | 12:10 | PM    | It is 10 minutes past 12 in the afternoon. |
        | 12:10 | anticlockwise, past the 12 | 50     | 11:50 | AM    | It is 50 minutes past 11 in the morning.   |
        | 23:55 | clockwise, past the 12     | 5      | 00:05 | AM    | It is 5 minutes past 12 at night.          |
        | 00:05 | anticlockwise, past the 12 | 55     | 23:55 | PM    | It is 55 minutes past 11 at night.         |

  Rule: Every display follows the set time

    Scenario: Everything changes together while dragging
      Given the clock is showing the real time of 09:12
      When my child drags the minute hand to 09:45
      Then while they drag, both digital clocks and the words change with every minute the hand passes
      And when they let go, the 12-hour clock shows "9:45" with "AM" highlighted
      And the 24-hour clock shows "09:45"
      And the words say "It is 45 minutes past 9 in the morning."

    Scenario: Hearing the set time
      Given my child has set the clock to 16:20
      When they press the read-aloud button
      Then the app says "It is 20 minutes past 4 in the afternoon."

    Scenario: The scene follows the set time
      Given the clock is showing 16:50 with the day scene
      When my child drags the minute hand clockwise, past the 12, to minute 10
      Then the time is 17:10
      And the background changes to the sunset scene
      And the change is quick enough to keep up with the hands, without flashing

    Scenario: Dragging does not speak by itself
      When my child drags a hand
      Then nothing is read aloud until they press the read-aloud button

  Rule: A set time stays still until it is changed or reset

    Scenario: The set time does not tick
      Given my child has set the clock to 09:45
      When a real minute passes on the device
      Then every display still shows 09:45

    Scenario: Coming back from the background keeps the set time
      Given my child has set the clock to 09:45
      And the app goes into the background
      When my child returns to the app
      Then every display still shows 09:45

    Scenario: Opening the app fresh shows the real time
      Given my child set the clock to 09:45 and the app was closed
      When the app is opened again
      Then every display shows the real time

  Rule: There is always a way back to the real time

    Scenario: Seeing that the clock has been set
      Given the clock is showing the real time
      When my child drags a hand to a different time
      Then a large "back to now" button appears
      And it can be recognised without reading

    Scenario: Going back to the real time
      Given my child has set the clock to 09:45
      And the device's real time is 14:20
      When they press the "back to now" button
      Then every display shows 14:20
      And the time keeps itself up to date again
      And the "back to now" button goes away

    Scenario: No "back to now" button while showing the real time
      Given the clock is showing the real time
      Then no "back to now" button is shown

    Scenario: Dragging the hands back to the real time
      Given the device's real time is 14:20
      And my child has set the clock to 09:45
      When they drag the hands to show 14:20
      Then the clock still counts as set by hand
      And the "back to now" button is still shown
