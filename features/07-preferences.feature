Feature: Grown-up settings
  As a parent
  I want to change how the app says the time and how much help it gives
  So that the app can grow with my child as they learn more

  As a child
  I want the settings to stay out of my way
  So that I can't change them by accident

  # The grown-up check and the settings below are in the first version. The
  # rules tagged @future come later. Until then the app uses the defaults in
  # 04-time-in-words.feature, 05-time-of-day-scene.feature and 06-read-aloud.feature.
  # Picking a look and its hour and minute colours is the child's own choice
  # and needs no check (10-looks.feature).

  Rule: A times-table question keeps the settings away from the child

    # The questions come from the 6, 7, 8 and 9 times tables, so every answer
    # has two digits: from 6 × 6 = 36 up to 9 × 9 = 81.

    Scenario: Opening the grown-up check
      Given the clock screen is showing
      When someone presses the grown-up button with the lock picture
      Then they see one times-table question, for example "What is 7 × 8?"
      And a big number pad with the digits 0 to 9 and a delete key
      And a close button that goes back to the clock with nothing changed

    Scenario Outline: Answering the question
      Given the grown-up check asks "<question>"
      When someone presses <keys> on the number pad
      Then <result>

      Examples:
        | question       | keys         | result                                            |
        | What is 7 × 8? | 5 6          | the settings open                                 |
        | What is 6 × 6? | 3 6          | the settings open                                 |
        | What is 9 × 9? | 8 1          | the settings open                                 |
        | What is 7 × 8? | 6 5          | the answer is cleared and the same question stays |
        | What is 7 × 8? | 5 delete 5 6 | the settings open                                 |
        | What is 9 × 9? | 8            | it waits for the second digit                     |

    Scenario: A wrong answer never locks the pad
      Given someone has given a wrong answer several times
      When they type the right answer
      Then the settings open

    Scenario: A new question each time
      Given the grown-up check was answered with 56
      When someone opens the grown-up check again
      Then the question has a different answer

    Scenario: Leaving the settings
      Given the settings are open
      When the grown-up presses "Done"
      Then the clock screen shows again with the new settings in use
      And the next visit to the settings asks a new question first

  Rule: The settings and their defaults

    Scenario Outline: Seeing each setting
      When a grown-up opens the settings
      Then they see "<setting>" with the choices <choices>
      And "<default>" is chosen until they change it

      Examples:
        | setting                      | choices                                 | default           |
        | How the time is said         | "45 minutes past 9" and "quarter to 10" | 45 minutes past 9 |
        | Hour and minute helpers      | "On" and "Off"                          | On                |
        | Talking speed                | "Slower" and "Normal"                   | Slower            |
        | Children can change the look | "Yes" and "No"                          | Yes               |

    # What each setting does:
    # How the time is said: the wording style, see the rule below.
    # Hour and minute helpers: the colours and the minutes ring
    #   (11-hour-and-minute-colours.feature).
    # Talking speed: how fast the read-aloud button speaks (06-read-aloud.feature).
    # Children can change the look: whether the look button shows (10-looks.feature).

    Scenario: Changing a setting
      Given the settings are open
      When the grown-up chooses "Off" for "Hour and minute helpers"
      Then the clock behind the settings changes straight away

    Scenario: Keeping settings offline
      Given a grown-up has changed a setting
      When the app is closed and opened again without internet
      Then the changed setting is still in use

    Scenario: Going back to the defaults
      Given a grown-up has changed some settings
      When they press "Reset to defaults"
      Then every setting goes back to its default
      And the look and the hour and minute colours my child picked stay the same

    Scenario: Settings that can't be read
      Given the settings stored on the tablet are missing or damaged
      When the app opens
      Then every setting that can't be read uses its default
      And the app works as normal

  Rule: The wording style can be changed once the child knows fractions

    Scenario Outline: Choosing a wording style
      Given a grown-up has chosen the <style> wording
      And the current time is <time>
      Then the words say "<sentence>"
      And the read-aloud button says the same sentence

      Examples:
        | style                      | time  | sentence                                |
        | minutes past (default)     | 09:45 | It is 45 minutes past 9 in the morning. |
        | quarter, half, past and to | 09:15 | It is quarter past 9 in the morning.    |
        | quarter, half, past and to | 09:30 | It is half past 9 in the morning.       |
        | quarter, half, past and to | 09:45 | It is quarter to 10 in the morning.     |
        | quarter, half, past and to | 09:40 | It is 20 minutes to 10 in the morning.  |
        | quarter, half, past and to | 11:45 | It is quarter to 12 in the morning.     |

    Scenario Outline: Colouring the hour and minutes in the other wording style
      Given a grown-up has chosen the quarter, half, past and to wording
      And the hour and minute helpers are on
      And the current time is <time>
      Then "<hour words>" is in the hour colour
      And "<minute words>" is in the minute colour

      Examples:
        | time  | hour words | minute words |
        | 09:15 | 9          | quarter      |
        | 09:30 | 9          | half         |
        | 09:45 | 10         | quarter      |
        | 09:40 | 10         | 20 minutes   |

  Rule: The talking speed can be changed

    Scenario Outline: Choosing how fast the voice speaks
      Given a grown-up has chosen "<speed>" for "Talking speed"
      When my child presses the read-aloud button
      Then the sentence is spoken at <rate> times normal speed

      Examples:
        | speed  | rate |
        | Slower | 0.8  |
        | Normal | 1    |

  @future
  Rule: The part-of-day and scene times can be changed

    Scenario: Changing when the parts of the day start
      Given a grown-up sets evening to start at 18:00
      And the current time is 17:30
      Then the words say it is in the afternoon
      And the background shows the day scene

    Scenario: Keeping the scene and the words in step by default
      When a grown-up changes when a part of the day starts
      Then the scene changes at the same time as the words

    Scenario: Setting the scene times separately
      Given a grown-up chooses to set the scene times separately from the words
      And they set sunset to start at 18:00
      And evening still starts at 17:00
      When the current time is 17:30
      Then the words say it is in the evening
      And the background shows the day scene

  @future
  Rule: The voice can be changed

    Scenario: Choosing a voice
      Given the tablet has more than one offline voice
      When a grown-up chooses a different voice
      Then the read-aloud button uses that voice

  @future
  Rule: The hemisphere for the seasons can be changed

    # Only once the calendar exists (09-calendar.feature). Until then the
    # settings don't show it, like every other feature that isn't built yet.

    Scenario: Choosing the hemisphere
      Given the calendar is built
      When a grown-up opens the settings
      Then they see "Seasons on the calendar" with the choices "Northern" and "Southern"
      And "Northern" is chosen until they change it
