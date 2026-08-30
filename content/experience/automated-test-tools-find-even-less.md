---
title: 'Automated accessibility test tools find even less than expected'
publishedAt: '2025-04-29'
originUrl: 'https://www.linkedin.com/pulse/automated-accessibility-test-tools-find-even-less-than-robert-dodd-pk7be'
originLabel: 'LinkedIn'
tags:
  - 'accessible name'
  - 'automated testing'
  - 'WCAG'
  - 'ARIA roles'
  - 'commercial tools'
  - 'Carnforth'
---

I find myself increasingly asking what value do I get out of existing commercial accessibility testing tools? What do they catch? What do they not catch? I ask because I want to improve on the results, and I also want to know what exactly I need to manually inspect a web page for. So let's start with some numbers. The typical coverage claim for automated accessibility testing is 30-50%. Who makes those claims?

1. WebAIM (Web Accessibility In Mind) has noted in their research that automated tools can detect approximately 30% of WCAG failures (based on analysis of their annual web accessibility surveys).
2. The World Wide Web Consortium (W3C) states in their "Selecting Web Accessibility Evaluation Tools" resource that automated tools can only test for a portion of accessibility guidelines, typically estimating 30-50% coverage.
3. Karl Groves, a prominent accessibility expert, has published research indicating that automated testing catches approximately 40% of accessibility issues.
4. U.S. General Services Administration (GSA) documentation on Section 508 testing indicates that automated tools typically identify around one-third of potential accessibility issues.
5. Deque Systems, creators of the axe accessibility testing engine, acknowledges that automation can detect about 30-40% of WCAG success criteria.

Of those, the information I have seen presented at conferences is that of Karl Groves, and the number is based on his own tool, Tenon, now owned by Level Access. I would recommend Karl's presentations on this subject, and on research he did into the relationship between the number and type of issues found in automation, and those found through manual inspection. A number of his talks are free on YouTube.

## Accessible Name

More generally than Tenon, I did wonder where the number lies, so I set out to test one specific thing: the accessible name of elements (the text announced by a screen-reader if the element has keyboard focus).

I'm interested in the accessible name, because if when focus lands on an element the user needs to interact with, the user hears nothing other than "button", "link", "clickable", "slider", "image" etc; the user is stuck with a mystery box. Do you click on it in hope? Do you read around it and guess? Accessible Name is kind of core to page accessibility.

Accessible Name is something that is in most cases deterministic, calculable, and 100% testable. We can test:

* If no accessible name is given at all.
* If there is an accessible name but it is only whitespace.
* If there is an accessible name but it seems to be only punctuation.
* If there is an accessible name but the value is suspect for its context of use on the page.
* If there is an accessible name but the implementation is bad practice for accessibility.
* If there is an accessible name given by referencing another element but the ref is broken.
* If there is an accessible name given by referencing another element that fails the above tests.
* If all of the above true for both HTML elements e.g. `<button>` but also for `<div role="button">`

So I asked the question, what do commercial tools catch for a wide range of interactive and important elements? Buttons, links, images, iframes, forms and their controls. Do they always catch all of these potential issues? Do they avoid false positives of some well-written uses?

## Test approach

I created a set of HTML pages, each covering a different element type that contained a number of passing and failing tests. Each page is documented to make it human readable, showing the code used, and explaining the purpose of the test. The initial 6 pages have 164 failing (tests expecting failure to be reported) tests. They are currently available on a test site: <https://a11ybob.com/demos/accessible-names-test-suite/index.html>

With the pages in place, I then ran a number of commercial free and paid tools on the pages and inspected the results that were reported by the tools, looking in particular at the failing tests (I have never heard anyone mention testing for passing cases, so I assume the coverage numbers are for failing tests only).

Taking a simplistic approach, I compared the number of caught fails by page, and across pages. This is simplistic as tests for suspect values do not cover all suspect values, and may include false positives in extreme edge cases. I am also not weighing the importance of the issues found, only how many.

## Results

The score per automated testing tool, per page, varied widely between pages/content types, and consequently across the site as a whole. The overall score for one tool, for example, was 36% of test cases reported. Some were even less, some more.

Part of the low score, for some tools at least, was due to them not recognizing and testing elements created using aria roles rather than semantic HTML.

I am specifically avoiding giving scores to individual commercial tools. All 5 that I tested scored badly, but that was only 5 test tools, and the importance is the variation: this was not a competition between tools, more an indication of the variation and limitations of the tools used.

Why not try it yourself, open your browser and test? Only look at the accessible names related results, and then read on into the discussion below. Remember to read the test pages and ensure you agree with the test is valid though, you may hold strong opinions and need to copy and edit the page before testing.

## Discussion

The scores produced by the testing were surprisingly low, even allowing for some tests for suspect content being a little basic, and the lack of support for aria roles was disappointing.

The scores are particularly surprising given that calculation of accessible name is defined by the W3C and can easily be applied. My initial assumption was that automated testing would simply apply that calculation to each interactive element and to each non-text element that is not hidden from the accessibility tree, and report when there is nothing other than whitespace. I expected some to be more clever and look at the content of that name based on context of use, but the basic question "Will a screen-reader user hear anything?" would always merit a report if the answer was no. That is not the case.

The scoring system used here is also very basic: a simple pass/fail for each test in the web page. In reality the impact on the user will vary with the content depending on context of use. Missing alt text on a descriptive image is not typically as important as naming the submit button on a form, just as an example. It would be interesting to grade the tests in terms of typical impact to say, low, medium, high, and then compare the scores between the tools.

The six HTML pages created do not cover all types of interactive elements on a web page. Missing tests would include any element on the page with an explicit tabindex attribute (so it can receive focus), interactive elements created using specialized roles e.g. slider, spin button, switch etc. We also need to be aware of the interactive roles in SVG that may come into play with interactive maps, charts, and graphs. Since aria roles have already been missed by some test tools, we have to assume that these additional role-based elements would reduce the final scores even further.

We also need to consider how frequently any of these tests are likely to find failing content. There are a large number of edge cases in that list of 8 tests given earlier. For example, use of aria roles instead of HTML semantic elements may be an edge case for many modern websites out there today, but if the site is old, or the approach to providing accessibility is to fix after release, then those applied roles may not be such edge cases.

We also have to think about what WCAG chapters the issues are reported against. Largely it is 4.1.2 Name, Role, Value, because that is where accessible name existence is largely measured. Content quality comes from 3.3.2 Labels or instructions and 2.4.6 Headings and labels. There can be others though that are not success criteria. Use of implicit labels for example causes issues with Dragon Naturally Speaking, and has for many years, and that I would expect to fail against 5.2.4 Only Accessibility-Supported Ways of Using Technology as implicit labels break notable voice control tools. I cannot remember seeing any mention of chapter 5 conformance requirements in statements of test coverage.

Accessible Name is also only one, if important, touchpoint for automated accessibility testing. Given the low scores, that may not bode well for other touchpoints. Problems with accessible name do not necessarily infer there will be similar issues elsewhere, but it does suggest that testable edge cases, at least, are going to be missing throughout.

## Conclusion

Looking at the low scores across all five automated accessibility test tools that were tried, we may need to add caveats to that claim of 30%-50% coverage. Perhaps we now say that typical test coverage is 30%-50% of commonly occurring detectable accessibility issues?

Given the limited coverage we have, it is somewhat depressing to know that tools are not even testing all of the edge cases, or properly supporting Aria roles. There is much room for improvement.

Accessible Name is only one possible touchpoint of many to consider with automation, and it will be interesting to compare coverage for others e.g. animation, colour usage, dialogs, headings etc. and see if detailed testing with roles and edge cases are covered any better.

In terms of my original goals, there are already improvements that can be made, and I will share my work on that in future posts.
