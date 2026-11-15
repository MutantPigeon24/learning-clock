Feature: Hours and minutes linked by colour
  As a child learning to tell the time
  I want the hours to be one colour and the minutes another, everywhere on the screen
  So that I can see which part of each clock and of the sentence is the hour and which is the minutes

  As a parent
  I want to switch the colours off once my child can read minutes on their own
  So that my child learns to read an ordinary clock too

  # The hour colour and the minute colour are called the "hour and minute
  # helpers", together with the minutes ring. They are on by default. A
  # grown-up can switch them off in the settings (07-preferences.feature).

  Rule: The hour colour and the minute colour mark the same parts of every display

    Scenario Outline: Colouring each part of the clock screen
      Given the hour and minute helpers are on
      When my child looks at the clock screen
      Then <part> is in the <colour>

      Examples:
        | part                                          | colour        |
        | the short hour hand and its grip              | hour colour   |
        | the numbers 1 to 12 on the clock face         | hour colour   |
        | the hour digits on both digital clocks        | hour colour   |
        | the hour in the sentence                      | hour colour   |
        | the long minute hand and its grip             | minute colour |
        | the minutes ring round the clock face         | minute colour |
        | the minute digits on both digital clocks      | minute colour |
        | the minutes in the sentence                   | minute colour |
        | the colon, AM or PM and the rest of the words | look's ink    |

    Scenario Outline: Colouring the sentence
      Given the hour and minute helpers are on
      And the time is <time>
      When my child reads the sentence "<sentence>"
      Then "<hour words>" is in the hour colour
      And "<minute words>" is in the minute colour
      And the other words are in the look's ink

      Examples:
        | time  | sentence                                   | hour words | minute words |
        | 09:45 | It is 45 minutes past 9 in the morning.    | 9          | 45 minutes   |
        | 09:01 | It is 1 minute past 9 in the morning.      | 9          | 1 minute     |
        | 21:30 | It is 30 minutes past 9 at night.          | 9          | 30 minutes   |
        | 12:10 | It is 10 minutes past 12 in the afternoon. | 12         | 10 minutes   |
        | 09:00 | It is 9 o'clock in the morning.            | 9          | nothing      |
        | 12:00 | It is 12 o'clock midday.                   | 12         | nothing      |
        | 00:00 | It is 12 o'clock midnight.                 | 12         | nothing      |

    Scenario Outline: Colouring the digits
      Given the hour and minute helpers are on
      And the time is <time>
      Then on the 12-hour clock "<12-hour hour>" is in the hour colour and "<minutes>" is in the minute colour
      And on the 24-hour clock "<24-hour hour>" is in the hour colour and "<minutes>" is in the minute colour

      Examples:
        | time  | 12-hour hour | 24-hour hour | minutes |
        | 09:45 | 9            | 09           | 45      |
        | 21:45 | 9            | 21           | 45      |
        | 00:05 | 12           | 00           | 05      |
        | 12:00 | 12           | 12           | 00      |

    Scenario Outline: Reading the minutes ring
      Given the hour and minute helpers are on
      When my child looks at the clock face
      Then next to the <number> the minutes ring shows <minutes>

      Examples:
        | number | minutes |
        | 12     | 0       |
        | 1      | 5       |
        | 3      | 15      |
        | 6      | 30      |
        | 9      | 45      |
        | 11     | 55      |

  Rule: Each look has its own hour and minute colours

    # Each look's pair is chosen so that neither colour looks like its buttons.

    Scenario Outline: Using the look's own colours
      Given the look is <look>
      And my child has not picked other hour and minute colours
      Then the hours are <hours>
      And the minutes are <minutes>
      And the buttons are <buttons>

      Examples:
        | look    | hours  | minutes | buttons |
        | Sky     | orange | purple  | blue    |
        | Blossom | purple | teal    | pink    |
        | Unicorn | pink   | blue    | purple  |
        | Hero    | red    | blue    | yellow  |
        | Dino    | orange | blue    | green   |
        | Space   | orange | blue    | yellow  |

  Rule: A child can pick other hour and minute colours

    Scenario Outline: Picking other colours
      Given the look picker is open
      When my child picks "<pair>"
      Then the hours are <hours> and the minutes are <minutes> everywhere on the screen

      Examples:
        | pair              | hours        | minutes        |
        | Match the look    | look's hours | look's minutes |
        | Red and blue      | red          | blue           |
        | Orange and purple | orange       | purple         |
        | Pink and teal     | pink         | teal           |
        | Purple and orange | purple       | orange         |

    # Some pairs are hidden for some looks, because a colour would look like
    # the look's buttons. See "Button colours never look like the hour or
    # minute colours" in 10-looks.feature.

    Scenario: Keeping the picked colours
      Given my child picked "Pink and teal"
      When the app is closed and opened again
      Then the hours are still pink and the minutes teal

  Rule: The hour and minute colours are always easy to read

    Scenario: Checking every look and every pair
      Given any look
      And any hour and minute colours that look offers
      Then the hour colour and the minute colour are at least 4.5 : 1 against the clock face
      And at least 4.5 : 1 against the cards
      And the minute colour is at least 4.5 : 1 against the minutes ring

    Scenario: Using lighter colours on dark cards
      Given the look is Space, which has dark cards
      Then the hour and minute digits and words on the cards use lighter versions of the hour and minute colours
      And the hands and numbers on the clock face, which stays light, use the ordinary ones

  Rule: Colour is never the only clue

    Scenario: Telling the hands apart without colour
      When my child looks at the analog clock, whether the helpers are on or off
      Then the hour hand is shorter and thicker than the minute hand

  Rule: A grown-up can switch the helpers off

    Scenario Outline: Clock screen with the helpers off
      Given a grown-up has switched the hour and minute helpers off
      When my child looks at the clock screen
      Then <part> is <shown>

      Examples:
        | part                                  | shown                        |
        | the short hour hand and its grip      | in the clock's own ink       |
        | the long minute hand and its grip     | in the clock's own ink       |
        | the numbers 1 to 12 on the clock face | in the clock's own ink       |
        | the hour and minute digits            | plain text in the look's ink |
        | the words of the sentence             | plain text in the look's ink |
        | the minutes ring                      | gone                         |

    Scenario: No colour choices while the helpers are off
      Given the hour and minute helpers are off
      When my child opens the look picker
      Then they can still pick a look
      But there are no hour and minute colours to pick

    Scenario: Switching the helpers back on
      Given my child picked "Pink and teal"
      And a grown-up switched the helpers off
      When a grown-up switches the helpers on again
      Then the minutes ring comes back
      And the hours are pink and the minutes teal again
