Feature: Time written in words
  As a child learning how to say the time
  I want to see a sentence that says the current time
  So that I learn how people say the time out loud

  # This sentence is also what the read-aloud button speaks (see 06-read-aloud.feature).

  Rule: Minutes 1 to 30 are "past" the hour, minutes 31 to 59 are "to" the next hour

    Scenario Outline: Saying the time
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples: On the hour, quarters and halves
        | time  | sentence                                   |
        | 09:00 | It is 9 o'clock in the morning.            |
        | 09:15 | It is quarter past 9 in the morning.       |
        | 09:30 | It is half past 9 in the morning.          |
        | 09:45 | It is quarter to 10 in the morning.        |

      Examples: Minutes past
        | time  | sentence                                   |
        | 09:01 | It is 1 minute past 9 in the morning.      |
        | 09:12 | It is 12 minutes past 9 in the morning.    |
        | 14:25 | It is 25 minutes past 2 in the afternoon.  |

      Examples: Minutes to
        | time  | sentence                                   |
        | 09:40 | It is 20 minutes to 10 in the morning.     |
        | 09:59 | It is 1 minute to 10 in the morning.       |
        | 20:50 | It is 10 minutes to 9 in the evening.      |

  Rule: The sentence says which part of the day it is

    # Part of the day comes from the current time, not from the hour being named.
    #   morning   05:00 - 11:59
    #   afternoon 12:00 - 16:59
    #   evening   17:00 - 20:59
    #   night     21:00 - 04:59

    Scenario Outline: Naming the part of the day
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples:
        | time  | sentence                                   |
        | 05:00 | It is 5 o'clock in the morning.            |
        | 16:45 | It is quarter to 5 in the afternoon.       |
        | 17:00 | It is 5 o'clock in the evening.            |
        | 21:00 | It is 9 o'clock at night.                  |
        | 04:30 | It is half past 4 at night.                |

  Rule: 12 o'clock is called midday or midnight

    Scenario Outline: Saying times close to 12 o'clock
      Given the current time is <time>
      Then the words say "<sentence>"

      Examples:
        | time  | sentence                                   |
        | 12:00 | It is 12 o'clock midday.                   |
        | 11:45 | It is quarter to 12 midday.                |
        | 12:10 | It is 10 minutes past 12 in the afternoon. |
        | 00:00 | It is 12 o'clock midnight.                 |
        | 23:45 | It is quarter to 12 midnight.              |
        | 00:10 | It is 10 minutes past 12 at night.         |

  Rule: The words are easy for a young reader

    Scenario: Writing numbers as digits
      When my child reads the sentence
      Then hours and minutes are written as digits, not spelled out
      And the sentence is in large, clear text
