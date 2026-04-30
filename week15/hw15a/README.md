Using Google OAuth does simplify signing in for the user,
and the deserialization code for the back end.
But it did come with it a working with a lot of finicky passport.js code, so trade-offs.

The client id is essentially public, the user sends it as a query paramater when they
access accounts.google.com. But it does add one more responsibility of keeping the 
Google Client Secret hidden. But otherwise it really doesn't add an extra responsibility 
for the server compared to using a local strategy w/ a password db, which is nice.


AI Use: (GPT 5-mini)
```
- planning out checks to meet the first 5 assignment requirements quicker
- getting a jist of different passport.js functions
- creating a diff of ejs files for simple improvements
- tracing down a passport error -> missing initializePassport(passport); line in app.js
```