Feature: Learning to tell time
  As a 7-year-old learning to tell time
  I want to see the current time shown in several different ways at once
  So that I can learn how analog clocks, digital clocks and spoken time relate

  As a parent
  I want the app to work fully offline on my child's tablet
  So that it is safe, distraction-free and usable anywhere

  # Platform: an installable offline web app (PWA) on an Android tablet using Chrome.

  Rule: The app is installed once from a web address, then lives on the home screen

    Scenario: Installing the app on the tablet
      Given the tablet is online
      And Chrome is open at the app's web address
      When I choose "Add to Home screen" or "Install app"
      Then a Learning Clock icon appears on the tablet's home screen

    Scenario: Opening the app like a normal app
      Given the app is installed
      When my child taps the Learning Clock icon
      Then the app opens full screen
      And no browser address bar or tabs are visible

    Scenario: Everything is saved during installation
      Given the app has been opened once while online
      Then every page, image, sound and font it needs is stored on the tablet
      And nothing is loaded from the internet afterwards

    Scenario: Getting updates when online
      Given a newer version of the app has been published
      And the tablet is online
      When my child next opens the app
      Then the new version is downloaded in the background
      And it is used the next time the app opens

    Scenario: Keeping the old version when offline
      Given a newer version of the app has been published
      And the tablet is offline
      When my child opens the app
      Then the version already installed works as normal

  Rule: The app keeps working after its web address is taken down

    # The repo is only made public (and hosted) for installs and updates,
    # then made private again, which takes the web address offline.

    Scenario: Asking the tablet to keep the app's files
      When the app is opened for the first time
      Then it asks Chrome to store its files persistently
      And the tablet does not clear them when it runs low on space

    Scenario: Opening the app after hosting is removed
      Given the app is installed on the tablet
      And the web address it was installed from no longer exists
      When my child opens the app, online or offline
      Then the installed version works as normal
      And no error or "page not found" message is shown

    Scenario: Failing to check for updates
      Given the app is installed on the tablet
      And the tablet is online
      And the web address it was installed from no longer exists
      When the app checks for a newer version
      Then the check fails quietly
      And the installed version and its stored files are kept

  Rule: Once installed, the app works fully offline

    Background:
      Given the app has been installed on the tablet
      And the tablet has no internet connection

    Scenario: App opens and works without internet
      When my child opens the app
      Then the clock screen appears
      And every feature works

    Scenario: The app contains no external content
      When my child uses any part of the app
      Then no ads, links or sign-in prompts are shown
      And no data leaves the device

    Scenario: Everything on the clock screen is shown together
      When my child opens the app
      Then they see an analog clock
      And they see a 12-hour digital clock with AM and PM
      And they see a 24-hour digital clock
      And they see the time written in words
      And they see a time-of-day scene behind the clocks
      And they see a button that reads the time aloud

  Rule: The app suits a tablet held by a young child

    Scenario: Usable by a young child
      When my child looks at the clock screen
      Then every button is big enough for small fingers
      And no feature depends on reading instructions

    Scenario Outline: Fitting the tablet screen
      Given the tablet is held in <orientation>
      When my child looks at the clock screen
      Then every display fits on screen without scrolling

      Examples:
        | orientation |
        | landscape   |
        | portrait    |
