@future
Feature: Preferences (future)
  As a parent
  I want to change how the app says the time and when the scenes change
  So that the app can grow with my child as they learn more

  # Not part of the first version. The first version uses the defaults described
  # in 04-time-in-words.feature, 05-time-of-day-scene.feature and 06-read-aloud.feature.
  # The child should not be able to change these by accident.

  Rule: Preferences are kept away from the child and stored on the tablet

    Scenario: Opening the preferences
      Given the clock screen is showing
      When a parent opens the preferences
      Then they have to do something a young child is unlikely to do by accident
      And the clock screen stays the same until they do

    Scenario: Keeping preferences offline
      Given a parent has changed a preference
      When the app is closed and opened again without internet
      Then the changed preference is still in use

    Scenario: Going back to the defaults
      Given a parent has changed some preferences
      When they choose to reset the preferences
      Then the app uses the default wording, scene times and voice again

  Rule: The wording style can be changed once the child knows fractions

    Scenario Outline: Choosing a wording style
      Given a parent has chosen the <style> wording
      And the current time is <time>
      Then the words say "<sentence>"
      And the read-aloud button says the same sentence

      Examples:
        | style                      | time  | sentence                                 |
        | minutes past (default)     | 09:45 | It is 45 minutes past 9 in the morning.  |
        | quarter, half, past and to | 09:15 | It is quarter past 9 in the morning.     |
        | quarter, half, past and to | 09:30 | It is half past 9 in the morning.        |
        | quarter, half, past and to | 09:45 | It is quarter to 10 in the morning.      |
        | quarter, half, past and to | 09:40 | It is 20 minutes to 10 in the morning.   |
        | quarter, half, past and to | 11:45 | It is quarter to 12 in the morning.      |

  Rule: The part-of-day and scene times can be changed

    Scenario: Changing when the parts of the day start
      Given a parent sets evening to start at 18:00
      And the current time is 17:30
      Then the words say it is in the afternoon
      And the background shows the day scene

    Scenario: Keeping the scene and the words in step by default
      When a parent changes when a part of the day starts
      Then the scene changes at the same time as the words

    Scenario: Setting the scene times separately
      Given a parent chooses to set the scene times separately from the words
      And they set sunset to start at 18:00
      And evening still starts at 17:00
      When the current time is 17:30
      Then the words say it is in the evening
      And the background shows the day scene

  Rule: The voice can be changed

    Scenario: Choosing a voice
      Given the tablet has more than one offline voice
      When a parent chooses a different voice
      Then the read-aloud button uses that voice

    Scenario: Choosing how fast the voice speaks
      When a parent chooses a slower or faster speaking speed
      Then the read-aloud button speaks at that speed
