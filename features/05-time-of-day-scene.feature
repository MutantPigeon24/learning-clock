Feature: Time-of-day scene
  As a child
  I want a background picture that shows what part of the day it is
  So that I can connect the numbers on the clock to sunrise, daytime, sunset and night

  Rule: The scene follows fixed times of day

    # Fixed times, so the scene never needs location access or the internet.
    # They line up with the part-of-day words (see 04-time-in-words.feature):
    # every change of scene happens at a change of part of day. Sunrise is
    # "morning", day is "morning" or "afternoon", sunset is "evening" and night
    # is "night". A future preference can change these times
    # (see 07-preferences.feature).
    #   sunrise 05:00 - 06:59
    #   day     07:00 - 16:59
    #   sunset  17:00 - 19:59
    #   night   20:00 - 04:59

    Scenario Outline: Showing the scene for the current time
      Given the current time is <time>
      When my child looks at the app
      Then the background shows <scene>

      Examples:
        | time  | scene                                                      |
        | 05:30 | a sunrise, with the sun low and a pink-orange sky          |
        | 12:00 | a bright sunny day, with the sun high in a blue sky        |
        | 16:59 | a bright sunny day, with the sun high in a blue sky        |
        | 17:00 | a sunset, with the sun going down and an orange-purple sky |
        | 19:59 | a sunset, with the sun going down and an orange-purple sky |
        | 20:00 | a night sky with the moon and stars                        |
        | 04:59 | a night sky with the moon and stars                        |

  Rule: The scene always agrees with the words

    Scenario Outline: Matching the scene to the part of the day
      Given the current time is <time>
      Then the background shows the <scene> scene
      And the words say it is <part of day>

      Examples:
        | time  | scene   | part of day      |
        | 06:00 | sunrise | in the morning   |
        | 10:00 | day     | in the morning   |
        | 15:00 | day     | in the afternoon |
        | 18:00 | sunset  | in the evening   |
        | 21:00 | night   | at night         |

  Rule: Changes between scenes are gentle

    Scenario: Moving from one scene to the next
      Given the background is showing the day scene
      When the time reaches 17:00
      Then the background fades slowly into the sunset scene
      And nothing flashes or jumps suddenly

  Rule: The clocks stay easy to read in every scene

    Scenario Outline: Keeping the clocks readable
      Given the background is showing <scene>
      When my child looks at the clocks and the words
      Then all of them are clearly readable against the background

      Examples:
        | scene   |
        | sunrise |
        | day     |
        | sunset  |
        | night   |
