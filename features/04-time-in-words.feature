Feature: Time written in words
  As a child learning how to say the time
  I want to see a sentence that says the current time
  So that I learn how people say the time out loud

  # This sentence is also what the read-aloud button speaks (see 06-read-aloud.feature).
  # The child hasn't learnt fractions yet, so the default wording never uses
  # "quarter", "half" or "to". A future preference can switch to that style
  # (see 07-preferences.feature).

  Rule: The time is always said as minutes past the hour

    Scenario Outline: Saying the time
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples: On the hour
        | time  | sentence                                  |
        | 09:00 | It is 9 o'clock in the morning.           |
        | 14:00 | It is 2 o'clock in the afternoon.         |

      Examples: Minutes past
        | time  | sentence                                  |
        | 09:01 | It is 1 minute past 9 in the morning.     |
        | 09:12 | It is 12 minutes past 9 in the morning.   |
        | 09:15 | It is 15 minutes past 9 in the morning.   |
        | 09:30 | It is 30 minutes past 9 in the morning.   |
        | 09:45 | It is 45 minutes past 9 in the morning.   |
        | 09:59 | It is 59 minutes past 9 in the morning.   |
        | 14:25 | It is 25 minutes past 2 in the afternoon. |

    Scenario: Never using fractions or "to"
      When my child reads the sentence at any time of day
      Then it never contains "quarter", "half" or "to"

  Rule: The sentence says which part of the day it is

    # Part of the day comes from the current time, not from the hour being named.
    # These times match the time-of-day scene (see 05-time-of-day-scene.feature).
    #   morning   05:00 - 11:59
    #   afternoon 12:00 - 16:59
    #   evening   17:00 - 19:59
    #   night     20:00 - 04:59

    Scenario Outline: Naming the part of the day
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples:
        | time  | sentence                                  |
        | 05:00 | It is 5 o'clock in the morning.           |
        | 11:59 | It is 59 minutes past 11 in the morning.  |
        | 16:45 | It is 45 minutes past 4 in the afternoon. |
        | 17:00 | It is 5 o'clock in the evening.           |
        | 19:59 | It is 59 minutes past 7 in the evening.   |
        | 20:00 | It is 8 o'clock at night.                 |
        | 20:50 | It is 50 minutes past 8 at night.         |
        | 04:30 | It is 30 minutes past 4 at night.         |

  Rule: 12 o'clock exactly is called midday or midnight

    Scenario Outline: Saying times close to 12 o'clock
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples:
        | time  | sentence                                   |
        | 11:45 | It is 45 minutes past 11 in the morning.   |
        | 12:00 | It is 12 o'clock midday.                   |
        | 12:10 | It is 10 minutes past 12 in the afternoon. |
        | 23:45 | It is 45 minutes past 11 at night.         |
        | 00:00 | It is 12 o'clock midnight.                 |
        | 00:10 | It is 10 minutes past 12 at night.         |

  Rule: The words are easy for a young reader

    Scenario: Writing numbers as digits
      When my child reads the sentence
      Then hours and minutes are written as digits, not spelled out
      And the sentence is in large, clear text
