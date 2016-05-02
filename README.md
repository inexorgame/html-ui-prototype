ui-prototype
============

Prototypes for menus, hud etc. using the CEF (HTML, CSS, JS).

[Demos are available here](https://inexor-game.github.io/ui-prototype/).

## Components

To have a robust component library we can work upon, we have first to settle which interactive components we need.

Examples:
* Range Slider
* Tabs
* Pagination/Lazy Loading
* Code Editor (maybe)
* Notifications
* Select2

There are more to come. We have to find that out by thinking about the existing menus

## TODO

Partially copied from https://pad.inexor.org/p/ui

### HUDS
* Mouse hidden
* May accept key input
* Doesn't accept mouse input
* Example: Console HUD

### Menus
* Mouse visible
* Accepts key input
* Accepts mouse input
* Example: Main Menu

### List of HUDs

* Console HUD
* Game HUD
* Edit HUD
* Texture Browser
* Model Browser

### List of Menus

#### Main Menu
 * Multiplayer
   * Bot Match
   * Server Browser
 * Options
   * Player Settings
   * Name
   * Playermodel
 * Game Settings
  * Keyboard Bindings
    * In-Game-Bindings (WASD)
    * HUD-Bindings
    * Menu-Bindings
    * Script-Bindings
  * Video Settings
  * HUD Settings
    * X, Y, W, H
    * Game Stats
    * ...User Interface

#### GameHUD

* Game state (icons)
* ammo
* flags
* skulls
* Game stats (text)
* Past/Remaining game time
* Frames per second
* Frags
* Flags
* KPD
* Additional info
* Wallclock


#### EditHUD

* Current Texture
* Floatspeed
* Cubesize
* Worldsize
* Octree Stats

