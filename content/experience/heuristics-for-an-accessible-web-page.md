---
title: 'Heuristics for an accessible web page?'
publishedAt: '2024-12-07'
originUrl: 'https://www.linkedin.com/pulse/heuristics-accessible-web-page-robert-dodd-qykie'
originLabel: 'LinkedIn'
tags:
  - 'layout'
  - 'screen magnification'
  - 'low vision'
  - 'UX'
  - 'heuristics'
  - 'web design'
---

One of the more frustrating experiences for web designers and developers are the reports from user testing and for formal web audits, where they are given specific detailed information about issues, and suggestions to remediate, but no-one really tells them how to think accessibly. It's learning from negatives, and it's not efficient.

I'm going to talk about web pages only in terms of layout. We also need to consider navigation and semantic meaning, but that's for another day.

## Layout

Page layout impacts everyone, including blind and low vision users to your site because the way you describe the order and layout of content on the page drives the order it is presented to assistive technology.

Layout presents an even bigger issue to people who use magnification because once you can only see a small part of the page at any one time, understanding the structure of the page: finding headings, floating buttons and sidebars becomes a challenge. And if there is lots of white space it gets worse.

## Reads top left to bottom right

Accessible pages, in western languages at least should read top-left to bottom right, column by column, row by row. That order is the order the elements on the page, headings, buttons, text need to be declared in your HTML. Assistive technology doesn't read the webpage we see, it reads the HTML in the order it is declared. It doesn't matter what you do with fancy CSS to place content on the page, the reading order to assistive tech is the order in the HTML. The two must match. You may have heard of the tabindex attribute for elements, which in theory can be used to change the order of some navigation; don't go there, you'll mess up.

## Important stuff to the top

This goes with the previous heuristic. Content is read out to screen-reader users from the beginning of the HTML to the end, if you need to prioritize information it needs to be early in the HTML, which means it needs to be near the top. Users do have shortcut navigation to jump around, but if they are jumping around they may miss entire sections of the page. Earlier on in the sequence, they are more likely to find your important info.

This also impacts screen magnifier users. A screen magnifier, at least in large magnification, shows only a small part of the screen, so users coming in at the top of the page will be a very long way (and out of sight) of content down towards the footer of the page. If you want a screen magnifier user to find something, put it at the top.

This heuristic shouldn't be a surprise, it's what we do anyway for system alerts typically, because it helps everyone find stuff.

## Standard places for standard items

People are creatures of habit, and when we learn a "standard" layout of a page, we expect it on every page. That consistency helps us navigate content quickly.

If you can't see the screen and are navigating serially with short-cuts as a screen-reader user does, or you have panning around the page as a screen-magnifier user does, then this consistency is even more important. If you have spent significant time learning the structure of one page (where the headings are placed, when the menus are located, where the next and back of search results and forms are placed), you don't want to go through the learning process again and again. We need to ensure that page structure is consistent between pages, and representation of similar things like button and links is consistent so we recognize them easily.

We don't want consistency only within a single website, we generally want it also between websites. There is, for example, a user expectation that the user menu, and language switch on a website is going to be somewhere around the top right of the page. Again, it helps particularly screen-magnifier users know when to pan the magnifier if those norms are honoured.

## Minimum whitespace that looks "cool"

One of the many challenges a screen magnifier user has is moving from block to block of content on the screen. What looks like a reasonable amount of whitespace to delineate blocks of content on the page, or to indent content can leave users on large magnification staring at a blank page, or near blank page as they go in search of content. It also gives the opportunity to accidentally move up and down a row of content as you move left and right and not realize. Imagine that when you are trying to read the departures board on an airport website: you end up at the wrong gate or worse.

The answer is not to pack content close together on the page, but to consider how much whitespace is really needed to separate blocks effectively. Whatever your choice, try it on a mock-up of your page. Turn on Windows accessibility magnifier (Windows plus) and zoom in to something fairly high and try and navigate your content. Press Windows minus to escape from the experience.

In considering this issue, be aware that it is not only low vision users who use magnification. One of the strategies that may be used by people who are neurodivergent is to zoom the page to ensure that all they see is the content the need to read or interact with, with distractions and problematic animations off-screen. Again, they need to be able to pan between content blocks without spending too much time looking at empty pages of white.

## Left aligned text, blocks, and ideally headings

Left alignment, at least in western languages, helps lead the eye to where "content" starts on the page, it allows the eye to look up and down a single column of text and images scanning each row to see if they have found what they need. So the text starts under the heading, images related to the content start where the content starts on the left. It's just easier. That's true of single column pages and multi-column pages. And especially Multi-column because it helps define the shape of the column.

It is even more useful for screen magnifier users because having found the start of the first row of the page or column, they only need to move down to find the start of all content and they won't accidentally miss any content floating off to the right, nor will they have to pan right trying to find headings. Generally this comes down to the "raggedness" of content layout.

Ragged layout is everywhere on the web. We see it in centre aligned headings and left aligned text blocks. We see it in the pattern of text on left and image on right followed by image on left and text on right so that every other heading/text block is half-way across the page. We see it in stacked tiles where they are in a brick pattern with a ragged left and right edge, and while that may not seem a big issue if the tile is maybe 25-30% of the page width we have the problem of large magnification sitting on a white page. There are ways and means to mitigate all of these examples, but pages that don't utilize those design patterns are more likely to be both accessible and usable to screen-magnifier users.

## Buttons and their effects are close together

Generally in UX design we look for buttons / controls for content to be close to the content they manage because we want to create a visual association between the button and what it controls.

How close must they be for it to work for everyone? Very close is the answer. We want some indication of the effect of the button, ideally, to appear within the window of a screen-magnifier. Not all the changes, but enough that the screen-magnifier user knows that the button has had some effect and where that effect can be found.

An example of this done well is often the search box on the web page, where a search icon expands to have the search input box immediately to the left (and where focus moves). An example of it going wrong is also the search button, where the button opens the search box in the centre of the page header, far away from that initial search icon/button.

## Picture or text, not text in pictures

Not every font works for every user, font face or font size, and users reach for the accessibility settings of their operating systems and browsers to change them.

If the CSS is correctly specified, and that would be a LinkedIn article in itself, those choices will be reflected on the web page on all text, but not text that is rendered inside of an image. That is burned in to the image and remains in that font and size regardless of user need. The only place where this is allowed is in corporate logos and screenshots/photos.

## Text beats icon

Often screen real-estate is at a premium and designers reach for icon buttons rather than textual ones. For very common and well-understood icons, this works for most people. However as the icons become less well understood or where they have different names in common usage, problems begin.

The essential heuristic is to use text for all buttons when possible, or for less understood buttons where not (or both icon and text). By doing this we make the page more accessible as people will better understand the buttons in general, and people who rely on voice control to select on-screen content know what to say: "Click back", "Click notifications". If you don't know what explicit words are associated with a button, you simply don't know what to "Click".

## Label beats placeholder

This heuristic goes with "Text beats icon" above. When you are entering information on a form or in a widget on the page, users need to know what the field represents and what to call it if they are using voice control. If you use placeholders as labels to save on real-estate, that "label" disappears as soon as the user types into the field. It is even worse for voice control users as major voice control software works only with proper field labels and will not recognize the placeholder text as the label.

## Reading order matters

How many times have you seen a login screen with important information below the login button? How many times have you seen that with submit buttons on forms?

Screen-reader users generally navigate content from top to bottom of a page. content beyond the control/button it goes with may not be read until the control has been tried. There are wily, seasoned screen-reader users who will read every piece of content they can before touching interactive content, but you cannot assume this will happen.

Screen-magnifier users are in the same position, as the instructions may not be in their magnifier window when the login or submit button is in view.

There is also a problem when you hide content in the reading order. An example of that is the submit button on forms that is often disabled if the form is incomplete or has errors. Again both screen-reader users and screen-magnifier users are impacted by this design pattern. If you don't know whether the button is there either because it is not announced or is greyed out and it can't be perceived by a user with contrast issues, the users can end up navigating away from the form, looking for the button, unaware of the reason for it being disabled.

As a general rule, it is better not to hide content from the reading order of the page, especially for submit/login buttons. It is always better to plan to report form issues when the user selects the submit button than to allow them to navigate around the page trying to find the button or the problem.

## Quiet backgrounds for text

Web pages are generally more accessible when text is against a solid background colour where you can guarantee the text contrast. When the background is an image or a colour gradient, it can be extremely difficult to determine if text contrast is achieved. Because users can change text size and browser window size, the responsive design of the page is likely to move the position of the background relative to the text.

A second issue with text on images is the background "noise" generated by complex and busy images that reduce readability of the text. It slows non-disabled user down, and can cause a serious barrier to reading for people who are neurodivergent.

A translucent or solid colour block placed behind the text can mitigate some of the contrast issues, but does not help readability for neurodivergent users.

## Minimum animations, minimum flashing

Animations on a web page particularly where images move behind static text, but all animations to some degree, can trigger vestibular disorders in some users, and that impact can be quite severe including dizziness and vomiting. The animations may also be sufficiently distracting that neurodivergent users cannot interact with the page successfully.

Further, one form of animation is flashing content. Depending on how fast the content is flashing, it may cause fitting in some users. That's why we only ever see very slow flashing on websites and apps.

The rule in both cases is to minimize those animations when requested to do so by the user, and there is a CSS media query that can be used to detect the setting (prefers-reduced-motion) and that in any case to keep the animations short and relevant, which is good UX advice in any case.

## Conclusion

The twelve layout heuristics given here are certainly not comprehensive but they do give a reasonable starting point when considering the visual design and implementation of web pages. They won't in themselves create you an accessible website, but they will take away a lot of the issues I see on websites and apps that I audit.
