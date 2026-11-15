Feature: 12-hour and 24-hour digital clocks
  As a child
  I want to see the time on both a 12-hour and a 24-hour digital clock
  So that I can read the kinds of clock I see at home, at school and on screens

  # The hour digits take the hour colour and the minute digits the minute
  # colour while the hour and minute helpers are on
  # (11-hour-and-minute-colours.feature).

  Rule: The 12-hour clock shows whether it is AM or PM

    # Only the AM/PM switch on the analog clock shows "AM" and "PM" side by
    # side, because pressing it changes the time. The 12-hour clock only shows
    # the one that applies, as plain text, so it never looks like a button
    # that does nothing.

    Scenario: Seeing AM or PM on the 12-hour clock
      When my child looks at the 12-hour clock
      Then they see "AM" or "PM" written after the time, for example "9:45 PM"
      And it is plain text, not something that looks like a button

    Scenario Outline: Writing the time on the 12-hour clock
      Given the current time is <time>
      Then the 12-hour clock shows "<display>"
      And "<label>" is written after it

      Examples:
        | time  | display | label |
        | 00:00 | 12:00   | AM    |
        | 00:05 | 12:05   | AM    |
        | 09:12 | 9:12    | AM    |
        | 11:59 | 11:59   | AM    |
        | 12:00 | 12:00   | PM    |
        | 13:05 | 1:05    | PM    |
        | 21:30 | 9:30    | PM    |
        | 23:59 | 11:59   | PM    |

  Rule: The 24-hour clock has no AM or PM and always shows two digits for the hour

    Scenario Outline: Writing the time on the 24-hour clock
      Given the current time is <time>
      Then the 24-hour clock shows "<display>"
      And no AM or PM label appears with it

      Examples:
        | time  | display |
        | 00:00 | 00:00   |
        | 09:12 | 09:12   |
        | 12:00 | 12:00   |
        | 13:05 | 13:05   |
        | 23:59 | 23:59   |

  Rule: The two digital clocks are easy to tell apart

    Scenario: Labelling each digital clock
      When my child looks at the digital clocks
      Then each one has a short label such as "12-hour" and "24-hour"
