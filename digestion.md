 6. Digestion techniques
The jQuery TodoMVC series covered a lot of new and challenging material. So if you feel overwhelmed at this point, it's totally normal. But now that you know all this new stuff, how do you digest it and help it all sink in? Here are a few tips to help with that.

1. Get unstuck

If you've put in an honest effort to figure something out but are still stuck, you must ask for help. You will not magically get unstuck. The answer will probably not come to you in your dreams.

Getting help here is so exceedingly easy that you have no excuse not to. The first place to go is the #questions channel in Slack. If it's Monday, you should go to office hours and get an answer directly from me over video chat. If it's in the morning, go to the morning accountability meeting and tell the group what you're having trouble with. Opportunities to get unstuck are all around you. You just have to put your hand out and take them.

2. Add comments that describe each line in plain English

Translating each line of code into plain English forces you to understand everything in detail. It also makes reviewing the code easier since you can just refer to your comments in case you get stuck.

3. Leave it on your desk until it bores you

Print the code on a sheet of paper and leave it on your desk. Each time you're bored at your desk, instead of looking at Facebook or Reddit, look at the code. Scribble notes on the parts that were tricky or confusing.

Keep doing this and leave the code on your desk until you're bored. The day you look at the code and say to yourself, "damn this is so obvious, this is for little kids", is the day that you crumple it up and toss it. You can also save it somewhere if you're the nostalgic type. It doesn't matter as long as you leave it on your desk until it bores you.

4. Fix every combination of 1 missing feature

For simplicity, let's pretend that the todo list has just three features: "add", "delete", and "edit". Break the app by deleting the code for the "add" feature. Then, fix it so that the "add" feature works again. Repeat this process for the remaining features "delete" and "edit".

This technique allows you to focus on just a single manageable chunk at a time so that you don't get overwhelmed. By the time you fix every combination of 1 missing feature, you should feel very very comfortable with the codebase and understand how everything links together (it's impossible not to).

For the obsessive compulsive among you, you can modify this exercise by doing "every combination of N missing features" where N > 1. It definitely helps to reinforce the material, but you will also see rapidly diminishing returns on your time as N gets larger. So just be aware that you may be overdoing it. A good hint that you're overdoing it is when things feel boring because you know everything already. So as soon as that happens you should stop and move on.

5. Remove jQuery

The objective with this exercise is really simple. Make the application work exactly the same but do so without any jQuery. To break this exercise into more manageable steps, start by removing jQuery from app.js method-by-method (create, destroy, etc). Once you’re done, remove the jQuery script tag from index.html (line 56).

If you do the exercise correctly, everything in your application should work exactly as it did in the original application. What I really like about this exercise is that it really makes you think about what's happening in the application and it's really easy to see if you succeeded — the app either works at the end or it doesn't.
