
Notes:

    The old code never really solved a problem ("solving an argument with dice", like what?)

    A part of user experience, for me at least, is the site actually doing something useful
    So changed the core idea actually do something: solve indecision / decide what to do
    This is brought about by a couple things:
        - input fields to change titles
        - titles reflect instantly, and in header
        
    CSS layout could be better, but opted not to change it much

    Other additions for User Experience:
        - dice shake animation
        - reroll button to avoid page refresh
        - color/font change
        - tutorial image + close/button functionality

    Time gated / scope-creeped on a few things:
        - ability to add/remove "players" so more options can be decided
            - made winner display logic work with that
        - a handicap dice
            - add a dice to a player
            - may need multiple dice




To Do:

    - implement 'add player' and 'remove player' buttons
        - playerCounter - keep track of players
            - keep min==2 max==5 for simplicity

        addPlayer()
            call:
                appendChild() for playerDice HTML elements
                appendChild() for associated input field
            - make containers for easier searching?
        
        - removePlayer()
            call:
                removeChild() on last playerDice
                removeChild() on last 

        - make diceMap based on playerCounter
            - keep global array for playerDice()?

        - event listeners for buttons dynamically?
        - update CSS
            grid?

    - implement a handicap dice
        - may need multiple dice
            - to reduce ties
            - to soften impact of adding a handicap dice
        - button to add a dice
        - mutiple dice (3 or 4) per player
            - completely change how I'm DOM searching
            - to account for handicap

    
