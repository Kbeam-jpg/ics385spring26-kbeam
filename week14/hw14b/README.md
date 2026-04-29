Purpose of bcrypt: 

The purpose of bcrypt is to prevent brute force attacks using rainbow tables (common passwords, common sha256 hashes of those passwords) by salting (adding consistent noise) and then hashing again. It also makes comparing inputed passwords with hashed ones a one-line function -- bcrypt.compare() -- so easy enough there.

bcrypt also uses the 'crypto' module for it's hashes, so "it's the same thing" is 100% accurate; it isn't any different under the hood than the passport.js website examples.

Important to note that this is HTTP trafic, so data-in-transit is very much unsafe. Though switching to an HTTPS capable setup would help fix that (would need to use the https module & openssl w/ NGINX it looks like?, inheriting the secure status from AWS or Cloudflare would be easiest?). 

A client-side hash would only obfuscate sniffing for a "password=" field, slightly.