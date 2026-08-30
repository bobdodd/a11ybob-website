---
title: 'Web developers, do you know how limited your automated color contrast tests really are?'
publishedAt: '2025-11-15'
originUrl: 'https://www.linkedin.com/pulse/web-developers-do-you-know-how-limited-your-automated-robert-dodd-sxuse'
originLabel: 'LinkedIn'
tags:
  - 'colour contrast'
  - 'WCAG'
  - 'automated testing'
  - 'auditing'
  - 'CSS'
  - 'focus states'
---

Many web developers will be aware of, and use, automated web accessibility tools, both paid and free. Among the many aspects of accessibility that they test for is text contrast.

## Why we test color contrast

Color contrast testing measures the difference in luminance (brightness) between the text color on the page and the background that it is drawn on. There are a number of eye conditions that are impacted when that difference is low, but it is also impacted simply by lighting conditions in the user's environment, bright sunlight reflecting off the page for example. There is an official formula for calculating this: <https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio>

## What gets tested by automation?

### Default case

Typically automated testing tools target currently visible text on a web page, testing the text contrast in the default case where the page has loaded and there is no user interaction happening.

### CSS pseudo-classes (:hover, :focus, :active, :visited)

That means a button or link will get tested just as they are, not as if they have the mouse hovering over them, or have received keyboard focus, or, in the case of links, as if they have been previously visited or are currently active.

Try your preferred automated accessibility checker on: <https://a11ybob.com/demos/color-contrast-test-cases/ErrTextContrastAA_003_pseudoclass_violations.html>

How many issues does it find for you?

### CSS Media Queries (e.g. prefers-contrast)

CSS has many ways to allow a developer to scope color rules for specific contexts (we just covered pseudo-classes above), including media queries to handle high contrast support. These allow developers to define a different color scheme for the page depending on user preference. Typically, existing automated test tools test depending on the current rendering of the page, and it is up to you to set up the browser before testing, and to test for each media query plus the default case yourself. Your own organization may use automated scripting tools such as Selenium to step through lists of settings as part of regression testing to handle this, but if you are just using a browser plugin it is all left up to the tester.

Try your preferred automated accessibility checker on: <https://a11ybob.com/demos/color-contrast-test-cases/ErrTextContrastAA_004_prefers_contrast_violations.html>

How many issues does it find for you?

Note: you may have difficulty testing these settings on some operating system/browser combos as some operating systems tend to force entire themes for high contrast rather than just flag the prefers-contrast query value to the browser. The easiest to test with reliably is Firefox when you set Contrast Control in General Settings to off. A summary of support:

<table>
  <caption>Support for high-contrast media queries across operating systems and browsers</caption>
  <thead>
    <tr>
      <th scope="col">OS / Browser</th>
      <th scope="col">Media query</th>
      <th scope="col">Overrides page colors?</th>
      <th scope="col">Developer control?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">macOS / iOS + Safari / Chrome / Firefox</th>
      <td><code>prefers-contrast: more</code></td>
      <td>No</td>
      <td>Full</td>
    </tr>
    <tr>
      <th scope="row">Windows + any browser</th>
      <td><code>forced-colors: active</code></td>
      <td>Yes</td>
      <td>Limited</td>
    </tr>
    <tr>
      <th scope="row">Firefox (any OS)</th>
      <td><code>prefers-contrast: more</code></td>
      <td>No</td>
      <td>Full</td>
    </tr>
  </tbody>
</table>

### CSS Print Media Query

In the same way that prefers-contrast can impact on text contrast, it is important to remember that we also need to test contrast for the "print" media query. Print is definitely the Cinderella media query in terms of accessibility testing, but printed content must also be accessible. There are many other rules around tangible printed content, see the CNIB Clear Print Guidelines as an example: <https://cnib.ca/sites/default/files/2018-07/CNIB%20Clear%20Print%20Guide.pdf>

Text contrast rules in web page CSS are a necessary part of those guidelines.

## Responsive Design

Another way CSS media queries allow developers to scope color rules for specific contexts is through responsive breakpoints. In theory, at least, you can build a web page that has different colours as the browser width varies. In practice, developers don't do that, but they do add and remove content depending on available screen real estate (adding sidebars for example). This means that we need to test for text contrast at each breakpoint where content changes. As a developer you may know, QA teams need to test at each declared breakpoint.

Try your preferred automated accessibility checker on: <https://a11ybob.com/demos/color-contrast-test-cases/ErrTextContrastAA_005_responsive_breakpoints.html>

How many issues does it find for you across all breakpoints without manually changing breakpoint?

### User and Content Roles

Another variable that can be built into websites is colour themes based on user role or content type. For example a Learning Management system may use different themes for students and professors. Automated testing will test text contrast on the currently rendered page, so if there are multiple themes, you need to manually change user and test content for contrast in each theme it can be displayed within.

## When there should be no answer

It is not always possible for automated testing to measure text contrast. While we may know the text color, the background may be unknown or not be a single constant value. Typical issues are:

* Text is displayed against an image so each pixel around each character may have a different background color.
* Text displayed against a color gradient where again the color of each adjacent background pixel may vary.
* Text displayed in a floating block with a transparent or translucent background where the background color of each adjacent pixel may vary at runtime depending on the rendered page width.
* Text that overflows out of its containing element so that not all text is against the solid background of the parent background. This can happen with poorly designed pages when the user zooms page text.
* Text with a transparent/translucent background that tweens (animates).
* Text whose color, or whose background color, tweens (animates).

Some of these issues are definitely edge cases, for example the color tweening, but a surprising number of web pages do have text bursting out of their `<div>` containers, and text directly on images is a very common mistake.

## Non-text contrast

Before wrapping up, we should also consider other contrast issues that may impact users on a page, the non-text contrast issues. Web accessibility guidelines are more accommodating to designers for non-text contrast requiring only a 3:1 contrast ratio (compare to 4.5:1 for text at WCAG level AA and even higher for AAA) but contrast rules do still exist. Some elements to consider here are:

* CSS focus outlines used to identify which element currently has keyboard focus.
* Borders to buttons and text input fields.
* Other interactive controls (sliders, toggle buttons etc).
* Icons.
* Charts and data visualizations.

Similar constraints to text contrast exist for when we can calculate the contrast using automation and when it requires manual inspection. One of note is focus outline. Outlines wrap around elements, generally not within them, so measuring contrast of an outline requires that all of the visible outline is over a single solid colour, and that can be a challenge to identify.

## Conclusion

Hopefully, what this article has demonstrated is that testing for text contrast can be much more complicated and labour intensive than it may otherwise seem, and that we definitely need our automation tools to help us more than they currently do. We also need to have them only give answers when they are certain that the value can be calculated.

The sections on pseudo classes, media queries, and responsive design should also raise concerns in the minds of testers. Does your current test strategy capture the cases? Do your automated regression tests need to be expanded?

My expectation is that anyone using current automated accessibility test tools who tried the example test fixtures included in this article will have noticed that many issues are missed, and some contrast issues are reported pass/fail when they are not calculable.

Of course, not every missing test feature is critical to testing text contrast on most web pages, but some definitely are. As an auditor, I spend my life writing up contrast issues on hover and focus states that could be so easily picked up by automation but are not. Just as an example.

Finally, what the results of testing against those example fixtures should be shouting to us is that our test tools, good as they are, need significant improvement.
