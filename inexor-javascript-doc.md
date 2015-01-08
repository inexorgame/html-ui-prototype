# inexor javascript documentation

State: 08.01.2015

This is the documentation for the inexor-object in javascript.
You can find all included functions and variables in the **/src/ui/cefcontext.cpp** file.

## Events

### subscribe

	inexor.subscribe(string name, function callback)

Subscribes a function _callback_ to the event _name_.
Callback is fired when the game or the a script itself fires the event.

Possible subscriptions user-created ones (see _inexor.fire_) and the following predefined ones:

| eventname       | callback-parameters (in this order)    | called when                                           |
|-----------------|----------------------------------------|-------------------------------------------------------|
| frag            | int victim-cn, int fragger-cn          | one player frags another one                          |
| healthChange    | int difference                         | the player looses / gains health                      |
| maxHealthChange | int difference                         | the player gets a healthboost                         |
| ammoChange      | string weapon, int newAmmunitionAmount | the player **gets** ammunition, **not** when he shots |
| shot            | string weapon                          | the player shoots                                     |

**These events can still be fired by a script.**

# fire

	inexor.fire(string name [, mixed parameter [, mixed ...]])

Fires all callbacks subscribed to the event _name_.
The game may react on the events if it is a predefined event.

## Methods

### showLayer

	inexor.showLayer(string name)

Shows the HTML-rendering layer named _name_.

### hideLayer

	inexor.hideLayer(string name)

Hides the HTML-rendering layer named _name_. JavaScript will still be executed.
Newly (e.g. with JavaScript) generated Elements will **not** be rendered!

### logoutf

	inexor.logoutf(string text)

Prints _text_ to the console / terminal / command-line (system-console, not sauerbraten-console).

### quit

	inexor.quit()

Quits the game.

## Variables

| Variablename        | Readonly |
|---------------------|----------|
| int curtime         | yes      |
| int lastmillis      | yes      |
| int elapsedtime     | yes      |
| int totalmillis     | yes      |
| int totalsecs       | yes      |
| int fps             | yes      |
| int health          | yes      |
| int maxHealth       | yes      |
| object ammo         | yes      |
| int ammo.rifleround | yes      |
| int ammo.rocket     | yes      |
| int ammo.chaingun   | yes      |
| int ammo.shotgun    | yes      |
| int ammo.pistol     | yes      |
| int ammo.grenade    | yes      |
| int thirdperson     | no       |
| int scr_w           | no       |
| int scr_h           | no       |
| int vsync           | no       |
| string name         | no       |
