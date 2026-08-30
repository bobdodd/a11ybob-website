---
title: 'Building automated accessibility test tools using Anthropic''s Claude 4 AI (live demo)'
publishedAt: '2025-06-01'
originUrl: 'https://www.linkedin.com/pulse/building-automated-accessibility-test-tools-using-anthropics-dodd-6azme'
originLabel: 'LinkedIn'
tags:
  - 'AI'
  - 'Claude'
  - 'AI coding'
  - 'automated testing'
  - 'Chrome extension'
  - 'Carnforth'
---

Most of my posts and articles on LinkedIn recently, have been either about using AI to test web pages, or using AI to help build test tools to test web pages, or both. I thought it might be useful to let people see what it is like to do that in a continuous "live" screen recording from initial prompt to running tool.

I work primarily with Anthropic's Claude family of AI models, and this demo utilizes the recently released Claude 4 models, primarily the fancy, and more expensive, Opus model. Keep this in mind if you want to follow along: you may want to use the much cheaper Sonnet model for playing.

The demo is split into two parts. The first part, that I'm releasing today, gets us to the point of a running Chrome browser plugin that executes some basic accessibility tests created entirely by Claude. The second part, to come next week, is where we will create our own much more detailed, and correct, accessibility tests looking at user interaction.

## File and Video Links

All the content created in the videos are available in GitHub (you will see Claude create the repository for us) and can be found at <https://github.com/bobdodd/Demo-Interactive-Elements>

The YouTube video of part 1 can be found, with automated captions, at <https://www.youtube.com/watch?v=liGZNFiR14w>

## The Goal

I wanted to give people an idea of how easy, and occasionally frustrating it can be to use tools such as Claude to create code. You will find it goes from thoughtful and clever through to deeply frustrating.

For example if you ask Claude to create a modal dialog you will get a different answer to telling it to create an accessible modal dialog because it doesn't value or prioritize accessibility in its coding at all. You will find that when you tell it something is inaccessible it will enthusiastically agree and attempt to fix the issue but Claude won't proactively do that.

I also wanted to show how you can build actual real tools that can help with accessibility testing; to encourage you to experiment and go further than the frustrations of existing commercial test tools. Claude will help and enable you, but you do need a very clear idea of what you want to test, and what the difference is between pass and fail.

## The Demo Environment

There are some great development platforms for working with AI generation. For this demo I went for the most basic free environment I could. I use the Anthropic Claude plugin for Microsoft Visual Studio Code, and nothing else. It's easy to set up and more than good enough for what we do in the demo.

The demo is done on a Mac laptop, but the same environment works on Windows. For windows I do suggest you enable the Linux runtime to give Claude lots of command-line tools to use in building, testing and debugging. Claude is very tool-based in its work and it commands local tools on your desktop, and you will see it make assumptions about tools I have that are incorrect and then work around the holes.

I work by starting Claude in an empty folder in VS Code, and telling it to create our project in GitHub. For this to work easily, you need to have already installed the GitHub CLI, and logged in to GitHub. Claude will take you through the steps if necessary and may push you to do work manually if needed.

## The Initial Prompt

The initial description of the task I gave to Claude is below. It was a single long prompt, but with whitespace for readability:

> I want to create an accessibility testing extension for the chrome browser that runs in the devtools environment.
>
> It will test for a number of accessibility touchpoints and the architecture needs to allow me to add more touchpoints as I go.
>
> We will be starting off looking at the keyboard accessibility of interactive elements on a web page.
>
> The target audience for this tool is web developers with little knowledge of accessibility and the language used when reporting issues and describing solutions should be in their language, not that of accessibility professionals.
>
> For the UI I want a Heading of Demo a11y Tool and a big Start Test button, with results presented below that are categorized first by accessibility touchpoint and then alphabetically.
>
> Each issue we find will have a meaningful title, a description of the issue, why that is important for accessibility, who it is likely to impact, how big that impact is likely to be (high, medium, low), which WCAG success criteria are at risk, and suggestions on how to remediate the issue.
>
> We will have three general categories of issue: fail, warning, info. For now, let's add an info issue to say that we have started testing keyboard accessibility.

## What we built

We constructed a Chrome version 3 browser extension that lives in the devtools section of the Chrome browser. If you are used to testing with WAVE, you will be used to choosing the WAVE button on the browser ribbon. For our tool, you must first open the devtools sidebar and then choose the test tool. You will find that by the end of part 1 of the video, we have a working extension that runs some tests. The tests are created by Claude and they will give you an idea of what happens if you give AI tools agency: they will build code you never asked for but may need.

## Feedback from Claude

After I recorded and uploaded the video to YouTube, I gave the caption file to Claude 4 to analyze. I asked it to consider the effectiveness of my approach and how my prompting could be improved. That feedback is available in the FEEDBACK markup file in the GitHub repository. The response was long and thoughtful, and the most impactful suggestions were to be more structured in what I said to Claude: very specifically creating a clear workflow with validation checkpoints. You will find that you do need those validation checkpoints to force Claude to pause after remediating or creating content for you to test; it has a habit of pushing its own changes directly into GitHub without giving the option to test.

## Discussion and Conclusion

Talking aloud through the build experience is a little strange, and the process felt a little artificial. I guess needing to think ahead about what the next step will be and what to say makes conscious what I do unconsciously. The only way I can explain this, is to encourage you to try thinking about your breathing, breath by breath as you do it. The coding and development reality when the camera is not running, is definitely smoother.

Hopefully watching me code, mistakes and all, with Claude 4 will encourage readers to try themselves, whether that is creating test tools or just fun plugins for their browser.

Part 2 next week will get into the weeds of testing with Claude.
