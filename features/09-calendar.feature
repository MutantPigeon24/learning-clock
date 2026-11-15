@future
Feature: Learning the calendar (future)
  As a child who is learning to tell the time
  I want to see today's date shown in several ways, like the clock
  So that I learn how days, weeks, months, years and seasons fit together

  As a parent
  I want the calendar to work the same way as the clock
  So that my child already knows how to use it

  # Not part of the first version. This reuses the clock's ideas: the same
  # date shown in several ways at once, a sentence that is also read aloud,
  # a picture that changes with the season, and setting your own date with a
  # "back to today" button. Like the clock, it works offline and never needs
  # location access.

  Rule: The calendar has its own screen

    Scenario: Going between the clock and the calendar
      Given the clock screen is showing
      When my child presses the calendar button
      Then the calendar screen opens
      And a clock button takes them back to the clock screen
      And both buttons can be recognised without reading

    Scenario: Everything on the calendar screen is shown together
      When my child opens the calendar screen
      Then they see today's date written in words
      And they see this month as a calendar page with today highlighted
      And they see this week as a row of 7 days with today highlighted
      And they see a year wheel with the 12 months and the seasons
      And they see the date in numbers
      And they see a season picture behind the calendar
      And they see a button that reads the date aloud

  Rule: The date comes from the device and changes at midnight

    Scenario: Showing today's date
      Given the device's date is Sunday 15 November 2026
      When my child opens the calendar screen
      Then every calendar display shows Sunday 15 November 2026

    Scenario: Going past midnight
      Given the calendar is showing Sunday 15 November 2026
      When the device clock goes past midnight
      Then every calendar display changes to Monday 16 November 2026

  Rule: The date is written as a sentence, and read aloud the same way

    Scenario Outline: Saying the date
      Given today is <date>
      Then the words say "<sentence>"
      And the read-aloud button says the same sentence

      Examples: Ordinal endings
        | date       | sentence                                        |
        | 2026-01-01 | Today is Thursday, the 1st of January 2026.     |
        | 2026-02-02 | Today is Monday, the 2nd of February 2026.      |
        | 2026-03-03 | Today is Tuesday, the 3rd of March 2026.        |
        | 2026-04-11 | Today is Saturday, the 11th of April 2026.      |
        | 2026-05-12 | Today is Tuesday, the 12th of May 2026.         |
        | 2026-06-13 | Today is Saturday, the 13th of June 2026.       |
        | 2026-07-21 | Today is Tuesday, the 21st of July 2026.        |
        | 2026-08-22 | Today is Saturday, the 22nd of August 2026.     |
        | 2026-09-23 | Today is Wednesday, the 23rd of September 2026. |
        | 2026-10-31 | Today is Saturday, the 31st of October 2026.    |

    Scenario Outline: Saying yesterday and tomorrow
      Given today is <date>
      Then the words also say "<around>"

      Examples:
        | date       | around                                       |
        | 2026-11-15 | Yesterday was Saturday. Tomorrow is Monday.  |
        | 2026-12-31 | Yesterday was Wednesday. Tomorrow is Friday. |

  Rule: The date in numbers is shown day, month, year

    Scenario Outline: Writing the date in numbers
      Given today is <date>
      Then the date in numbers shows "<display>"

      Examples:
        | date       | display    |
        | 2026-11-15 | 15/11/2026 |
        | 2026-01-01 | 01/01/2026 |
        | 2028-02-29 | 29/02/2028 |

  Rule: The week shows 7 days, starting on Monday

    Scenario: Seeing the week
      Given today is Sunday 15 November 2026
      When my child looks at the week
      Then they see Monday to Sunday in order
      And Sunday is highlighted as today
      And Saturday and Sunday look different, as the weekend

  Rule: The month page shows how many days the month has

    Scenario Outline: Counting the days in a month
      Given the calendar is showing <month>
      Then the month page has <days> days

      Examples:
        | month         | days |
        | January 2026  | 31   |
        | April 2026    | 30   |
        | February 2026 | 28   |
        | February 2028 | 29   |
        | February 2100 | 28   |
        | February 2000 | 29   |

    Scenario: Lining up the days under the right weekday
      Given the calendar is showing November 2026
      Then the 1st of November is under Sunday
      And the 30th of November is under Monday

  Rule: The year wheel shows the months like numbers on a clock

    Scenario: Seeing the year wheel
      When my child looks at the year wheel
      Then they see the 12 months around a circle, starting with January at the top
      And a pointer points at the current month
      And each season is a different colour

  Rule: The season picture follows the month and the hemisphere

    # Meteorological seasons, by whole months. The seasons are opposite in the
    # southern hemisphere. The app never uses location, so the hemisphere is a
    # preference that a parent sets once.

    Scenario Outline: Showing the season
      Given the hemisphere is set to <hemisphere>
      And today is in <month>
      Then the season is <season>
      And the background shows <picture>

      Examples:
        | hemisphere | month   | season | picture                              |
        | northern   | January | winter | bare trees and snow                  |
        | northern   | April   | spring | blossom and new leaves               |
        | northern   | July    | summer | a bright sun and green trees         |
        | northern   | October | autumn | orange leaves falling from the trees |
        | southern   | January | summer | a bright sun and green trees         |
        | southern   | April   | autumn | orange leaves falling from the trees |
        | southern   | July    | winter | bare trees and snow                  |
        | southern   | October | spring | blossom and new leaves               |

    Scenario Outline: Naming the months in each season
      Given the hemisphere is set to <hemisphere>
      Then <season> is <months>

      Examples:
        | hemisphere | season | months                          |
        | northern   | winter | December, January and February  |
        | northern   | spring | March, April and May            |
        | northern   | summer | June, July and August           |
        | northern   | autumn | September, October and November |
        | southern   | summer | December, January and February  |
        | southern   | autumn | March, April and May            |
        | southern   | winter | June, July and August           |
        | southern   | spring | September, October and November |

  Rule: My child can choose their own date, and go back to today

    Scenario: Moving to another day
      Given the calendar is showing today
      When my child taps a different day on the month page
      Then every calendar display shows that day
      And a large "back to today" button appears

    Scenario Outline: Moving to another month or year
      Given the calendar is showing <start>
      When my child moves <step>
      Then the calendar shows <end>

      Examples:
        | start         | step            | end           |
        | November 2026 | forward 1 month | December 2026 |
        | December 2026 | forward 1 month | January 2027  |
        | January 2027  | back 1 month    | December 2026 |
        | November 2026 | forward 1 year  | November 2027 |

    Scenario: A chosen date stays still
      Given my child has chosen Friday 25 December 2026
      When the device clock goes past midnight
      Then every calendar display still shows Friday 25 December 2026

    Scenario: Going back to today
      Given my child has chosen Friday 25 December 2026
      When they press the "back to today" button
      Then every calendar display shows today's date
      And the date changes at midnight again
      And the "back to today" button goes away

  Rule: Setting the clock past midnight also changes the date

    Scenario Outline: Dragging the clock hands past midnight
      Given the clock is set by hand to <start time> on <start date>
      When my child drags the minute hand <direction>, past the 12, to minute <minute>
      Then the time is <end time>
      And the date is <end date>

      Examples:
        | start time | start date              | direction     | minute | end time | end date                |
        | 23:55      | Sunday 15 November 2026 | clockwise     | 5      | 00:05    | Monday 16 November 2026 |
        | 00:05      | Monday 16 November 2026 | anticlockwise | 55     | 23:55    | Sunday 15 November 2026 |

    Scenario: The AM/PM switch does not change the date
      Given the clock is set by hand to 21:45 on Sunday 15 November 2026
      When my child presses the AM/PM switch
      Then the time is 09:45
      And the date is still Sunday 15 November 2026
