I'm adapting this from the Keeper app since I was already working with React here and there's perfectly good CSS that doesn't need to go to waste. 
Was originally written in CodeSandbox, lucklily just replacing src/ and index.html (+adding a < script/> tag) allowed vite to build.

```
1. npm install
2. npm update
3. npm run dev

index.html 
|-> src/index.jsx 
    |-> App.jsx
        |-> /components/ 
            |-> Header.jsx
            |-> IslandCard.jsx
            |-> Footer.jsx
```
In essence this wasn't too difficult, 80% of it clicked into place. But I still felt thrown to the wayside in that last 20%, mainly with the App/Island Card props and how React handles that with the ...spread operator -- and why 'key=' exists. I think I got every other way to pass multiple values working before the spread implementation (array, object, individual values). That was only after knowing it was called a prop, barking up the wrong tree there for a bit.

With hindsight its easy, the spread operator treats an object {id:"", name:""} as like < id="" name="" />, but it just didn't click with my knowhow of the spread operator at the time, with how JS treats the usual Array/String. Is that an JSX thing? Dunno. Also with the key="" thing, how thats a prop that React eats up and it never sees the component, still don't know why thats there.