---
title: 'Build your own automated accessibility tool?'
publishedAt: '2025-05-15'
originUrl: 'https://www.linkedin.com/pulse/build-your-own-automated-accessibility-tool-robert-dodd-4lige'
originLabel: 'LinkedIn'
tags:
  - 'AI'
  - 'Claude Code'
  - 'AI coding'
  - 'automated testing'
  - 'accessible name'
  - 'Chrome extension'
  - 'Carnforth'
  - 'GPL'
---

Recently, I published a LinkedIn article Automated accessibility test tools find even less than expected where I reported how well Accessible Name was tested by current commercial automation (the Accessible Name is what a screen-reader announces for an element on a Web page) with generally poorer results than expected. The commercial tools used caught the more common issues found on Web pages but not the edge-cases, and also some not-so-edge-cases.

The question that came to mind was, how easy would it be to create a tool that did find those edge cases? I already had a large suite of test cases from testing the commercial tools that I could also use to test my own tool, so I would be able to directly compare my work against those commercial test results. This article talks about how I approached the task and ends with a URL to the working code in GitHub, which I have released as open source under the GPL.

## Scoping the Tool

I wanted to replicate, as far as I could, the test experience of a Web developer/tester using browser plugins with similar levels of reporting and on-page highlighting.

There are two approaches to browser plugins for this kind of work. They either render their UI and results inside page under test, which is what the WAVE tool from WebAIM does, or the tool runs within the developer tools panel of the browser, but with the issues still highlighted by modifying page content, which is what we see with tools such as Axe from Deque Systems or ARC from TPGi. I chose the latter for accessibility and usability reasons.

### A Template for others

I was anxious to create something of use, not only as a tool in itself, but as a template for others on how to create your own accessibility tools. You would definitely need to have some programming skills, but with a worked example, hopefully the learning curve would be small.

### An Exercise in AI Coding (using Anthropic's Claude Code)

Accessibility professionals are busy people, the world is full of inaccessible designs and products, so I also wanted to see how quickly I could produce the tool with help from an AI coding platform. Not using AI to design tests and even the accessibility of the tool UI, just to code. To that end I limited myself to using only Claude Code, and only prompts. No manual coding, not even debugging, all debugging would be using Claude. This way I hoped to demonstrate that even a basic level of coding would allow people to create their own tools.

### Accessible Test Tools (practice what you preach)

One of the issues we face in web development and testing is that the development tools we use are often as inaccessible to disabled developers as the code we create using them.

There are accessibility guidelines for tool development, the Authoring Tool Accessibility Guidelines (ATAG) from the W3C tools <https://www.w3.org/WAI/standards-guidelines/atag/> being the primary source, but many tools don't follow them. The internal tools we create at CNIB (Canadian National Institute for the Blind) attempt to follow those guidelines, for example our Audit Reporting Portal is WCAG 2.1 (it's older than 2.2) compliant both client facing, and auditor/tester facing.

The finished Accessible Name tester needed to follow in that tradition, though within any browser limitations. The approach I chose was to let Claude code the UI without accessibility guidance to test its default quality, which was as poor as one would expect. I then instructed it to make changes to get the UI at least somewhere near WCAG 2.2. You will find both versions in the GitHub repository with initial Claude-generated inaccessible version as the original commit. Sometimes it took multiple attempts to get a serviceable approach within Claude's capabilities.

To really claim any sort of conformance to WCAG, it does need independent testing, and it especially needs lived experience accessibility testing by disabled users. So, currently I can only say: towards WCAG 2.2.

## Tool Design and Implementation

Tool design was left, as far as possible, to Claude to determine and implement. The initial prompt was to create an automated test tool that would live in a Google Chrome extension with a big Run button followed by a list of results, with the details available through further navigation.

### Forgetting

I also told Claude to avoid animation and timeouts in the UI. It then generated a tool with both animation and timeouts. The cause, I think, is the way the AI interacts with the programmer. Claude has a large input context that holds the entire design and implementation conversation with the designer/programmer. This is large, but not infinite and creating a tool such as the chrome extension it frequently hits the limit. At that point it summarized the conversation to date, compacts the history and moves on. That compacting and summarizing is not perfect and knowledge is lost during compaction, and one of the things lost was instructions on timers and animation so that by the time we got to designing the UI in detail, those requirements were lost.

### Accessible Name Calculation

The core of any Accessible Name testing is a working implementation of the Accessible Name algorithm. I initially allowed Claude to create it based on the W3C specification. What I got was broken so that exception and edge cases were generally not handled (much like my experience with the testing tools). Even telling Claude how to fix the errors, and what cases to consider, it struggled. In the end I had to break my own rule and give it some JavaScript for Accessible Name. Broken code I've had lying around for years, and I let Claude fix that (I have "good" code for professional work, but that wasn't available to give away). As far as I can tell, Claude did manage to correct the code I gave.

Why did Claude have issues with calculating Accessible Name? My suspicion is that I was unlucky. My experience of using Claude, over quite some time, is that there is Clever Claude, and Not So Clever Claude, and you never know which version you will get on any one day. I assume it's down to giant data centres with slightly different versions of Claude and with different user loads on them: sometimes you can be luckier with the version provided than at others.

### Testing for Accessible Name

I asked Claude to inspect the web page primarily for interactive elements, anything that can take focus.

That included semantic HTML elements such as `<button>`, `<a>`, `<select>`, `<input>`, and also their WAI Aria role equivalents (one of the issues I found when originally trying commercial automation was that some tools did not always catch the role versions).

I expanded beyond those semantic elements to interactive roles that do not have semantic equivalents: tabs, menus, grids, tree grids etc.

I also asked Claude to look for any element that had a zero or positive tabindex regardless of the role the element had been given to try and capture clickable content. The goal was to report on Accessible Name for these to capture unlabelled clickable content.

What is missing is testing for a tabindex of -1, which is programmatic focus. It simply got forgotten in the rush to create this tool and was to be addressed when looking for event handlers, also not implemented in this version. We should really test for event handlers in order to find hidden mouse-only clickable content. It's a large and difficult task and involves parsing JavaScript and was put to one side for this version.

### Reporting of Issues

The instruction to Claude was to create a list of issues, each with a heading, a short description of the issue, and a JavaScript selector that could find the issue on the page. The issue was to present as clickable (Claude gave a role of "button") which when selected created a thick red outline around the element on the page, and opened a dialog with the details.

The original implementation was wholly inaccessible: broken tab panel, poor or no focus indication, out of order heading levels, and a modal dialog that opened on keyboard focus over the top of the button without any focus management.

The current implementation uses examples from the WAI Aria APG (Aria Authoring Practices Guide) for tabs and modal dialogs. I first told Claude to use the example from the APG and it came close but deviated in some places. In frustration, I told it to go and actually read the APG examples and follow them precisely (I gave the URL), and it did so. The token count was high, but it did seem to genuinely read the standard and follow it. It was unclear why Claude didn't originally get the examples quite right, but I suspect that its training was overriding the example in order to fix issues that it saw in the APG.

## Test Results

I tested the AI-generated tool against the test pages that were created for testing the commercial test tools, the URL for these pages is <https://a11ybob.com/demos/accessible-names-test-suite/index.html> with each test documented next to the element/widget under test. Please note that the number of pages has grown since the original article was released to cover a wider range of Aria roles, plus some important non-interactive roles including landmarks and tables.

On first run not all test cases passed. Some Aria roles were simply missed by Claude. I had told Claude to test for all of the interactive roles in the WAI Aria specification, and it seems to have missed some. As I worked through the tests I asked Claude to correct the tool, and sometimes the test pages (there were some small errors, often issues that should have been warnings that the test page coded as fails).

Each test on each page was manually checked against the output of the test tool. To date that work is incomplete and only those pages grouped under HTML Elements have been inspected (these are the original test files from the commercial tests). The tool now captures all, or very nearly all, issues in those test pages, beating those original tools, at least for these specific tests.

So yes, it is possible to create a tool that, for something as clearly defined as Accessible Name, can be more comprehensive than some tools out there today.

## Discussion

The first thing of real note is less about the tool itself as the speed of implementation using AI. Claude Code was at times breathtaking in terms of what it could do, and how well it could understand my instructions. At other times, it was deeply frustrating to use. I talked earlier about Clever Claude and Not so Clever Claude where its ability to analyze, debug, and amend design could vary wildly. It's something you have to watch for: the quantity of output from the tool as it analyzes existing code can be overwhelming, and trying to stop Claude before it makes poor, highly consequential mistakes is a challenge. I found GitHub to be my friend with frequent commits so that I could compare and rollback when necessary.

To give some idea of how fast you can build a test tool for something like Accessible Name, the entire Chrome extension from a standing start was completed and tested in a weekend. It took much longer to create the 10 pages of test content that it did to create the first draft of the code. Testing of the tool, however, is back to manual inspection at human speed, which is why only 5 of 10 pages have been manually checked so far. Is it possible to automate that testing? Definitely and the pages are designed to do so. If you inspect the test pages, you will find classes added to tag element for testing, and to tag the result (passing, failing, warning).

I set out, in part, to try and teach people how easy it is to create your own tools, to inspire readers to try and build something, and hopefully to release it to the community as I have. To allow others to build and improve on our first, perhaps slight messy, slightly buggy first attempts. As a profession, we certainly need it, we need a breadth of knowledge on what can be tested and ways that can be automated that isn't IP locked away behind closed doors. We need to keep the commercial devs on their toes. No more automated tools that don't even test Aria roles properly. No more automated tools that don't catch the more obvious of edge cases.

## Conclusion

Given that I develop accessibility testing tools professionally at the CNIB (Canadian National Institute for the Blind) Access Labs, I never seriously expected the specific testing task would fail, I chose a well understood aspect of accessibility to test. What was important was that it could be done quickly, easily, and comprehensively, building something that could take on and "compete" with commercial accessibility industry at least in a very small way. The word compete was in given in quotes because my little AI generated tool is not the same as a full page testing tool. It's not had the peer review, it's not had the testing a commercial tool should get. It's not a WAVE, it's not an Axe. But it too could be the inspiration for an open-source community-led one.

The secondary goal: building accessibility automation tools quickly, at prompt-only level, with AI also succeeded, although with caveats that I've already mentioned in the discussion. It certainly has the potential to democratize test tool design and implementation. What's the value of secretive hoarding of expensive intellectual property when someone can create a tool from scratch in a weekend? Not the same tool, not the same scale, but still... Disruption beckons.

## The Accessible Names Tool

Firstly, you will currently find the tool in my personal GitHub repository: <https://github.com/bobdodd/carnforth>

It is the source code for a Chrome browser extension. To install it you will need to set your browser to developer mode. Go to Chrome Extensions, and choose "Manage extensions". On that page there is a selector for developer mode in the top right corner. Once selected, choose "Load Unpacked" and select the directory/folder where you downloaded the extension. That should be enough, and the extension should appear as a tile on the page.

The tool runs from the developer tools in the browser. The fastest way to get to that on Chrome is to go to the page you want to test, right click on the page and choose "inspect". The developer tools will open. Go to the ">>" (double chevron) on the tools main menu, select it, and you will see "Accessible Names" as a menu item.

Have fun, and please let me know what you think of it, and any issues you find.

Please be aware that the tool is still being worked on, and I will update it over the next few weeks, fixing issues and adding features.

### What Comes Next

This was originally just a toy to try building an accessibility plug-in/extension that could fix the issues in my testing of Accessible Name, and something for GAAD today. On balance, given what I can already find, it's probably worth making a more finished and tested version and adding it to the Chrome Extensions marketplace. For free, and still under the GPL, as a handy reminder to others to up their game if nothing else.

As I said earlier, I work for the CNIB (Canadian National Institute for the Blind) Access Labs, so there is a good chance that I will get to move the code to CNIB's GitHub, and then launch a finished, fully tested and branded version onto the Chrome Extensions marketplace from there.

Hopefully one of many, and not just as browser extensions.
