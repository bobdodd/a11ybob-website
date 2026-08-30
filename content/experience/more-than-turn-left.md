---
title: 'More Than Turn Left: Exploring a Place Using Accessible Maps'
publishedAt: '2026-07-01'
originUrl: 'https://www.linkedin.com/pulse/more-than-turn-left-exploring-place-using-accessible-maps-robert-dodd-gi70c/'
originLabel: 'LinkedIn'
tags:
  - 'accessibility'
  - 'maps'
  - 'OpenStreetMap'
  - 'wayfinding'
  - 'blind and low vision'
  - 'AI'
---

- [Context Map](/maps/context-map) — a map describing your location
- [Conversational Map](/maps/conversational-map) — a map you talk to

## Exploration

> Obstacle avoidance is not the problem — we have a dog, a cane and our blindness skills for that. The gap is knowing where things are and being able to decide what's of interest.
>
> — Erin Lauridsen, Access Technology Director, LightHouse for the Blind

What Lauridsen describes is exactly what I hear from the blind and low vision community when talking about wayfinding tools. The frustration is rarely about the next few steps to take, it is about the bigger picture: where am I right now and what's around me? What am I beside? What did I just pass? What is a little further on that I might have gone to, if only something had told me it was there?

Those tools are overwhelmingly about routing: turn left, turn right, you have arrived. Which is useful, and is not the complaint. Routing answers how do I get from A to B; it says almost nothing about the place you are moving through. It is the difference between being directed through somewhere and being able to explore it — and exploration is the part sighted people do without noticing, a glance around, a picture forming, and precisely the part our tools sometimes leave out.

## A name for the gap

This is not new. The research community has a name for the split: routing — getting from A to B — versus exploration, building a mental map of the world around you. Orientation-and-mobility practitioners draw the parallel line between micronavigation — the next few metres, obstacle by obstacle — and macronavigation — orientation: knowing where you are and where you are heading relative to the landmarks around you.

Macronavigation is not only something you do on the spot; it is what every map has ever offered — the chance to explore a place and its surroundings without being there, to build a picture and plan before you set out. What Lauridsen names, and what I keep hearing, sits on the exploration and macronavigation side. It is the side our tools serve worst.

One direct statement of this is from a 2023 study by Gaurav Jain and colleagues at Columbia, titled, aptly, "I Want to Figure Things Out." They argue that navigation assistance has to "evolve to be instruments for exploration," so that blind people can "form more complete cognitive maps," rather than only be piped along a route.

Turn-by-turn directions do not merely omit the surroundings — they can quietly erode your grasp of them. Clemenson and colleagues, in Scientific Reports (2021), found that step-by-step guidance builds route knowledge — the sequence of turns — while doing little for the orientation that lets you understand a place; lean on it and you form less of a mental map, not more.

There seems to be an assumption lurking under a lot of accessible-mapping work: that a blind traveller cannot hold a spatial picture anyway, so why offer one. The research says the reverse — blind travellers build rich spatial maps through non-visual channels; the capacity is intact, and what is missing is anything to feed it.

## One goal, many grains

The subject of accessible maps is one I've worked on independently of work for years, it's one of those hobby passion projects. Over time I built not one mapping tool, but a family, each with a different granularity of information, with its own purpose.

At one end is an exploration into faceted search and maps (the classic Google search with pins), in the middle detailed interactive maps that work with screen-readers at street and address level using explore-by-touch and screen-reader navigation, and finally schematic maps with my example being an airport terminal. They all have one common trait: they are about discoverable spatial relationships.

This piece is about the two at the far end of the dial: the ones that deliberately strip the detail away.

## The Context Map

The Context Map is the most stripped-back of all of them. No graphics — nothing to look at, by design, because it is built screen-reader-first for people who will never see a screen. You start it, it finds your location, and it tells you what is around you three ways: a quick describe for a fast read of where you are; a describe-as-I-move mode that keeps talking as you walk, re-reading the scene as it changes and you turn; and a detailed surroundings read-out you can move through as headings and lists at your own pace.

What it deliberately does not do is tell you exactly where anything is. It will tell you there are benches near you; it will not tell you the bench is four metres ahead against the wall and the path is clear. That precision — the last few metres — is micronavigation, and the tool says so in as many words: it is not a navigation or mobility aid, and not a substitute for your cane, your guide dog, your own orientation and mobility skills, or proper navigation tools. That is not a disclaimer bolted on out of caution; it is the design line. The Context Map's job is the macro picture — enough to orient yourself and decide what is worth heading towards.

## The Conversational Map

The Conversational Map is the newest, and it builds on the Context Map using the same data. The Context Map describes the location, but it only ever tells you about the one spot you are standing on and without any filtering of the information. I wanted to be able to ask my own question: anything, about here or about anywhere.

It is designed to allow you to ask a question, in plain language, by voice or by typing.

The questions may be in-the-moment type questions: e.g. are there any benches nearby to sit down, or is there an accessible washroom near me, or what wheelchair accessible restaurants are around here?

The questions may also be more of the armchair kind, e.g. what's on the corner of King and Bathurst in Toronto? — getting the feel of a place before you set out.

The same tool serves both ends of macronavigation.

I am not the first to point a phone at this, and I would not want to pretend otherwise. Microsoft's Soundscape showed years ago how good audio-first, OpenStreetMap-based exploration could feel for blind travellers; its ideas carry on in VoiceVista and in tools like BlindSquare, and the Conversational Map stands on that ground.

What I set out to add is a map you can interrogate. The conversation itself becomes the controls: you choose what to learn about, how to group it, how to narrow it — "what shops are near me?", then "what about a bit further away?", then "which of those are wheelchair-accessible?" — with each question refining the last. It is faceted search, but the facets are yours to choose, in plain words, as you go. And because the whole map sits behind the conversation, anything it knows is something you can ask for: the everyday detail and the accessibility detail alike, whichever you happen to need.

Every answer comes back the same considered way: the name, the street it is on, the settlement it is in, how far, and which direction — as a clock face relative to the way you are facing, so "two o'clock" means two o'clock to you, not a compass bearing you would have to translate. Ask where the nearest accessible washroom is and it might answer: in the community centre on Main Street, ninety metres away, at two o'clock.

Underneath is a Large Language Model, but its job is deliberately narrow — it chooses what to look up and how to phrase it, and nothing else. Every name, distance and direction is computed by the code from the map and handed over already worked out; the model may pick the words, but it cannot invent a washroom, move a street, or guess a distance. That guardrail — the model phrases, the map computes — is what makes a chatbot safe to point at this problem at all. And it holds the same line as the Context Map: it will tell you the washroom is there, and roughly where; it will not walk you to the door. That last stretch is still yours.

## What it actually is

A word on what this actually is, because I think the modesty of it matters. Both maps run on a single server in France that costs me 10 Canadian dollars and change a month, holding close to forty gigabytes of map data — the whole of Canada, and beyond it a scattering of other cities and countries. There is no fleet of machines behind the curtain, no company, no budget. It is the kind of thing one person can build and keep running — which, to me, is part of the point: useful, accessible tools do not have to be moonshots.

With one honest exception. The Conversational Map leans on AI twice over — once to turn your spoken words into text, and once to understand the question and phrase the answer — and unlike the server, that is not a flat monthly fee: every question costs a little real money. I pay for it out of a small pot of my own, and when that pot runs dry the Conversational Map will simply stop answering. The Context Map carries no such charge and will keep running regardless; it is the conversation, specifically, that I have to keep feeding. I would rather you knew that up front than found the door quietly locked one day.

Fitting all of that onto a small box meant compromises, and the biggest one shapes what you can ask. The map indexes named things — roads, intersections, places, and some categories of land use — so it answers well about a named street or a junction, and falls quiet on an unnamed back-lane. Partly that is to keep the data small; partly it is a real question of how you would even refer to a lane that has no name. And that points at the single most important thing to understand about either map: when it says nothing, that means it has nothing mapped there — not that there is nothing there. A silent map is not an empty street. That distinction matters enormously when you are trusting it, and I would rather be honest about it than let the map imply a completeness it does not have.

It is also still moving. An update due shortly softens that unnamed-lane silence: instead of only placing you "near" the nearest named road, it will tell you that you are in a lane, and which road it joins — a small thing that makes a real difference to knowing where you stand. The same update adds anonymous buildings — not their shapes, just a point to say something is there — so the map can give you a better feel for how built-up or open the ground around you really is. The picture keeps filling in.

## The other half

None of this replaces a cane, a guide dog, or the skills a disabled traveller already has. It was never meant to. It is an attempt at the other half — the exploring half, the one our tools have under-served for so long: the chance to know where you are, what is around you, what is a little further on, and to decide for yourself what is worth heading towards. To take stock of a place, the way sighted people do without thinking about it.

Building it taught me something I now can't forget: a map for someone who cannot see it is not the same artefact with the pictures read aloud. You are not captioning an image; you are expressing relationships — this is beside that, this joins that, this is thirty metres at two o'clock from where you stand. That is the half of WCAG's "Info and Relationships" we tend to forget, and a non-visual map lives or dies by it.

And because the point was never to own this, all of it is open. Every one of my map demos is free and open source — the software under the GPL, the words and design under Creative Commons BY-SA — with the code on GitHub for anyone to read, run, or build on. The [Maps section of a11ybob.com](/maps) gathers the lot: the demos, how each one works, and where to find its source. If any of it is useful to you, take it.

If you would like to try the two this piece is about, the links are at the top of this article. They work best on a phone, or at least a device with GPS (you may need to set some permissions on your phone for the apps to use your microphone, though).

I would love to hear about your experience — what worked, and where they could do better. That is how the next version gets written. And if you are one of the people who has spent years telling me a map should let you do more than turn left — thank you. This is me trying to listen.
