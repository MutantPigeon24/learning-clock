Feature: Looks children can pick
  As a child
  I want to pick a look for my clock, like a dinosaur world or outer space
  So that the clock feels like mine and I want to come back to it

  As a parent
  I want every look to teach the same things in the same way
  So that changing the look never changes what my child learns

  # There are six looks, named by picture so any child can pick any of them:
  # Sky, Blossom, Unicorn, Hero, Dino and Space. Each look is its own world,
  # with its own background, characters, clock ring, cards and buttons.
  # The time of day still decides which scene shows (see
  # 05-time-of-day-scene.feature); the look decides how that scene is painted
  # and how it changes from one scene to the next.

  Rule: A child can pick a look from pictures

    Scenario: Opening the look picker
      Given the clock screen is showing
      When my child presses the look button
      Then they see six big picture tiles: Sky, Blossom, Unicorn, Hero, Dino and Space
      And each tile shows the look's own picture, so it can be chosen without reading
      And the look that is in use is marked

    Scenario: Picking a look
      Given the look picker is open
      When my child presses the Dino tile
      Then the whole screen changes to the Dino look straight away
      And the time, the set time and everything the clock shows stay the same
      And no grown-up check is needed

    Scenario: Keeping the look
      Given my child picked the Dino look
      When the app is closed and opened again
      Then the Dino look is still in use

    Scenario: A grown-up can stop the look from being changed
      Given a grown-up has turned off "Children can change the look"
      When my child looks at the clock screen
      Then there is no look button

  Rule: Each look is its own world

    Scenario Outline: Seeing the look's own world
      Given the look is <look>
      When my child looks at the clock screen
      Then the background shows <world>
      And the clock's minutes ring is shaped like <ring>
      And the cards, buttons and small labels are styled to match <look>

      Examples:
        | look    | world                                                                     | ring                     |
        | Sky     | a sea of clouds with hot-air balloons, a kite, a paper plane and birds     | a cloud                  |
        | Blossom | a meadow with cherry trees, tulips, falling petals and butterflies         | a flower with 12 petals  |
        | Unicorn | candy-coloured hills with a castle, a unicorn, a rainbow and sparkles      | a rainbow                |
        | Hero    | a comic-book city with a hero on a rooftop and ZAP! and POW! bursts        | a comic starburst        |
        | Dino    | a valley with a volcano, a long-neck dinosaur, pterosaurs, palms and ferns | a dinosaur's back plates |
        | Space   | a moon base with a rocket, an astronaut, planets and a UFO                 | an orbit with a planet   |

  Rule: The time picks the scene, and the look paints it

    # Every look has its own sunrise, day, sunset and night. The scenes change
    # at the same times in every look, and every look keeps the same reading:
    # a light sky with the sun high is day, a dark sky with the moon is night.
    # So the picture always agrees with the words, whatever the look.

    Scenario Outline: Each look has its own version of each scene
      Given the look is <look>
      And the time is <time>
      Then the background shows the <scene> scene painted in the <look> look
      And <what is special>

      Examples:
        | look    | time  | scene   | what is special                                                         |
        | Sky     | 06:00 | sunrise | the sea of clouds turns peach and the balloons catch the early light    |
        | Sky     | 21:00 | night   | the clouds turn silver-blue and the balloons and birds have gone        |
        | Blossom | 10:00 | day     | butterflies fly over the tulips and petals drift down                   |
        | Blossom | 21:00 | night   | the meadow is dark and fireflies glow                                   |
        | Unicorn | 15:00 | day     | a rainbow arches behind the castle                                      |
        | Unicorn | 21:00 | night   | the rainbow has gone and the castle windows glow                        |
        | Hero    | 10:00 | day     | the sky is bright comic blue with halftone dots                         |
        | Hero    | 21:00 | night   | the city windows are lit and a searchlight shines a star into the sky   |
        | Dino    | 10:00 | day     | the volcano smokes and pterosaurs fly overhead                          |
        | Dino    | 21:00 | night   | the smoke and pterosaurs have gone and the volcano's lava glows         |
        | Space   | 10:00 | day     | the sky is a deep blue with planets, and the sun is high                |
        | Space   | 21:00 | night   | the sky is black and full of stars, and a shooting star crosses it      |

    Scenario Outline: Every look keeps the same reading of the day
      Given the look is <look>
      When the time is 12:00
      Then the sky is light and the sun is high
      When the time is 21:00
      Then the sky is dark and the moon and stars are out

      Examples:
        | look    |
        | Sky     |
        | Blossom |
        | Unicorn |
        | Hero    |
        | Dino    |
        | Space   |

  Rule: Each look changes between scenes in its own way

    Scenario Outline: Moving into the night
      Given the look is <look>
      And the background is showing the sunset scene
      When the time reaches 20:00
      Then the sky fades into the look's night sky
      And <change>
      And the change takes about 2 seconds, with nothing flashing or bouncing

      Examples:
        | look    | change                                                          |
        | Sky     | the balloons drift down out of sight and the clouds turn silver |
        | Blossom | the fireflies come out one by one                               |
        | Unicorn | the rainbow fades and the castle windows light up one by one    |
        | Hero    | the city windows light up one by one and the searchlight turns on |
        | Dino    | the smoke fades and the lava starts to glow                     |
        | Space   | the stars appear one by one and the rocket's window lights up   |

    Scenario: Moving into the morning
      Given the background is showing the night scene in any look
      When the time reaches 05:00
      Then the night lights go out
      And the things that only come out by day come back
      And the change is gentle, with nothing flashing or bouncing

    Scenario: Changing scene while dragging the hands
      Given my child is dragging a hand past a change of scene
      Then the look changes scene quickly, so it keeps up with the hands

    Scenario: Less motion
      Given the tablet is set to reduce motion
      When the scene changes
      Then the new scene appears straight away without any movement

  Rule: Pictures never get in the way of reading

    Scenario Outline: Keeping every look readable
      Given the look is <look>
      When my child looks at the clocks and the words
      Then all the text sits on solid cards, never straight on the pictures
      And the clock face stays plain, with the pictures only round its edge
      And all text is at least 4.5 : 1 against its card

      Examples:
        | look    |
        | Sky     |
        | Blossom |
        | Unicorn |
        | Hero    |
        | Dino    |
        | Space   |

  Rule: Button colours never look like the hour or minute colours

    # The hour and minute colours mean "hours" and "minutes" everywhere, so a
    # button must never be the same colour as either. Each look's own pair is
    # chosen to suit its buttons. Some of the other pairs a child can pick
    # would clash with a look's buttons, so the picker hides them for that look.

    Scenario Outline: Hiding colour pairs that clash with the look
      Given the look is <look>
      When my child opens the hour and minute colours in the look picker
      Then they cannot pick <hidden>

      Examples:
        | look    | hidden                               |
        | Sky     | red and blue                         |
        | Blossom | red and blue, pink and teal          |
        | Unicorn | orange and purple, purple and orange |
        | Hero    | nothing                              |
        | Dino    | nothing                              |
        | Space   | nothing                              |

    Scenario: Changing to a look that clashes with the picked colours
      Given my child picked the red and blue colours
      When they change to the Sky look
      Then the hours and minutes use the Sky look's own colours
