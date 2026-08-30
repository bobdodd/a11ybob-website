---
title: 'Seeing Data Differently: How Accessibility Research Is Rethinking Charts, Graphs, and Visual Information'
publishedAt: '2026-05-06'
tags: []
---

# Seeing Data Differently: How Accessibility Research Is Rethinking Charts, Graphs, and Visual Information

## Data visualisation is one of the most persistent accessibility challenges — and researchers are moving beyond alt text to multimodal, interactive, and community-driven approaches that reimagine what access to data means

Charts, graphs, dashboards, and diagrams are everywhere. They drive business decisions, shape policy debates, track pandemics, and populate every scientific paper, news article, and earnings report. They are also, for the most part, images — flat, unlabelled pictures that screen readers cannot interpret and that convey their meaning through colour, spatial relationships, and visual patterns that assume sight.

The accessibility of data visualisation is not a niche concern. When COVID-19 case data was published primarily through visual dashboards, blind and low-vision users were cut off from life-and-death information [Siu et al., 2021]. When data science notebooks in Jupyter and Google Colab are inaccessible to screen readers, blind data scientists are excluded from one of the fastest-growing professional domains [Potluri et al., 2023]. When academic papers present findings as charts without adequate alt text, the research itself becomes a barrier to participation.

This article examines what researchers have found across approximately 80 peer-reviewed papers on data visualisation accessibility. The work spans screen reader interaction, sonification, tactile graphics, multimodal systems, AI-generated descriptions, dashboard navigation, and the critical question of who gets to create accessible data representations — not just consume them.

## The Screen Reader Gap

The starting point for understanding data visualisation accessibility is what happens when a blind person encounters a chart with a screen reader.

Sharif et al. [2021] conducted the first comprehensive study of screen-reader users' experiences with online data visualisations and found profound barriers. Most charts on the web are rendered as flat images — often with no alt text at all, or with alt text so generic ("Figure 3: Results") that it conveys nothing. Even when charts are rendered as SVG or HTML with ARIA markup, screen readers provide only sequential, element-by-element access to what sighted users perceive as spatial relationships. Comparing two bars in a bar chart requires navigating to each bar separately, remembering the first value, and mentally computing the difference — a task that takes a sighted user a glance.

Siu et al. [2021] documented the impact of this gap during COVID-19, when dashboards tracking cases, deaths, hospitalisations, and vaccine distribution became essential public information. The authors found that most COVID dashboards were completely inaccessible to screen readers, and even those with some accessible elements lacked the interactive features (filtering, zooming, comparing) that sighted users relied on to interpret trends.

Potluri et al. [2023] examined data science notebooks — the primary working environment for analysts and researchers — and found systematic inaccessibility. Notebook interfaces failed to provide screen reader access to code outputs, visualisations, or interactive widgets. The study revealed that the tools at the centre of modern data work were not designed to be used by blind data scientists at any stage of the workflow.

## Beyond Alt Text

Alt text for charts is necessary but insufficient. Several papers examine its limitations and propose alternatives.

Chintalapati et al. [2022] analysed a dataset of alt texts from HCI publications — the accessibility research community's own papers — and found that descriptions of scientific figures were often generic, omitted key data points, and failed to convey the patterns and relationships that the figures were designed to communicate. Williams et al. [2022] conducted a related analysis and proposed guidelines for higher-quality alt text in computing publications, noting that the field studying accessibility often fails at basic accessibility in its own outputs.

Hsueh et al. [2023] argued that the problem runs deeper than quality. Their paper applies crip technoscience as a critical framework and proposes that current approaches to visualisation accessibility treat access as a technical problem to be solved by specialists, positioning blind and low-vision people as passive recipients. They identify four qualities that accessible data visualisation should have: access should be collective (created and maintained by communities), accessible (welcoming participation), interdependent (relying on networks rather than individual tools), and crip (centring disabled creativity). One speculative design concept, the Participatory Screen Reader, reimagines alt text as a collective negotiation — a community feature where BLV users and their networks collaboratively create, tag, vote on, and browse descriptions rather than accepting whatever a single author provides.

## Sonification: Turning Data Into Sound

Sonification — mapping data values to sound properties like pitch, volume, and rhythm — is the most established non-visual approach to data access. But recent research shows it is both more powerful and more complex than simple pitch-mapping suggests.

Sharif et al. [2023] improved the VoxLens tool for extracting information from online data visualisations and achieved a striking result: screen-reader users using VoxLens achieved 5.6% higher accuracy than sighted users without tools, effectively closing 62% of the performance gap identified in prior research. Users also completed tasks 22% faster than with the original version and 50% faster than sighted users without tools. The finding that well-designed accessibility tools can produce performance parity — and in some cases superiority — challenges deficit-based assumptions about data access.

Sharif et al. [2025] extended this work to examine user agency, finding that BLV users want control over how they access data — choosing between sonification, data tables, text descriptions, and combinations depending on the task. No single modality served all purposes: sonification was valued for detecting trends and patterns, text descriptions for specific values, and data tables for comparison tasks.

Brown et al. [2023] compared natural language descriptions with vibro-audio (combined vibration and sonification) for STEM learning and found that each modality served different learning goals. Natural language was better for communicating specific data relationships, while vibro-audio supported intuitive pattern recognition. The finding reinforces that multimodal approaches — not single-modality solutions — are needed.

Ramôa and Müller [2025] built a melodic audio-tactile interface for exploring line charts through tactile graphic readers. Their melodic UI achieved four times the correct task completion rate compared to tap-to-hear (8.15 out of 9 tasks versus 2.05, p < 0.001) without increasing interaction time. The system maps data values to musical pitch as users trace chart lines with their fingers on a tactile display, creating a continuous audio representation of the data shape.

Aljedaani et al. [2024] built a fully automated pipeline from chart image to audible output using deep learning for chart classification and text extraction, requiring no manual intervention — a step toward making the millions of inaccessible chart images on the web retroactively accessible.

## Tactile Graphics: Making Data Physical

Tactile graphics — raised-line representations that can be explored by touch — represent a fundamentally different approach: making data physical rather than translating it into another temporal modality like sound.

Holloway et al. [2022] explored refreshable tactile displays that can dynamically change their surface, demonstrating that animated tactile graphics — where a pattern changes over time, like a moving average across months — could convey temporal data trends. The study found that both blind and sighted users could accurately interpret basic animations, though complex multi-element animations challenged tactile perception.

Jiao et al. [2025] developed Tactile Data Comics — step-by-step presentations combining sequential tactile graphics with verbal narration. Rather than presenting all data at once (which overwhelms tactile perception) or providing only a text summary (which loses spatial information), the system guides users through a narrative arc: setup, complication, resolution. The approach draws on the data comics framework from visualisation research, adapting it for non-visual exploration.

Race et al. [2023] addressed a gap in who creates tactile graphics. Their paper, titled "Designing While Blind," developed nonvisual tools and workflows so that blind practitioners can create their own tactile graphics rather than depending on sighted designers. The work challenges the assumption that tactile graphics must flow from sighted creator to blind consumer.

Seehorn et al. [2025] explored machine embroidery as a fabrication method for tactile graphics, finding that embroidered textures can be optimised for both legibility and aesthetic quality — producing graphics that are expressive, durable, and fabric-based rather than requiring specialised printing equipment.

Johnson et al. [2022] developed low-cost tactile colouring pages using a cutting machine, showing that accessible tactile materials do not require expensive specialised equipment — an important finding for schools and families in resource-constrained settings.

Tsutsui et al. [2025] combined 3D-printed tactile models with a conversational AI "Touch and Talk" system where BLV users can ask questions about what they are touching. Nine of ten participants preferred storytelling narration for structured learning, though spatial guidance proved challenging: when the system said "the right horn," users were confused about whose right was being referenced.

## Dashboards and Complex Data Interfaces

Individual charts are only part of the problem. Real-world data access often involves dashboards — multi-chart interfaces with filters, KPIs, and interactive queries.

Arjun et al. [2023] built Azimuth, a prototype that converts JSON-based dashboard specifications into web-based dashboards optimised for screen reader navigation, accompanied by automatically generated textual descriptions. Three of five BLV participants completed all eight targeted tasks, with correct response rates ranging from 86% to 100%. The finding that dashboards — not just individual charts — can be made screen-reader-navigable is significant for workplaces where dashboards are the primary data interface.

Jiang et al. [2023] studied how BLV people perform daily data analysis — splitting expenses, computing averages, tracking portfolios — and found five distinct analytical approaches. Critically, BLV analysts spent substantial time on "overview obtaining" — traversing spreadsheet elements to understand structure before engaging with content — a stage that sighted users handle through a visual scan in seconds. The serial nature of screen reader interaction meant that column comparison required either horizontal alternating traversal (for adjacent columns) or vertical full-column traversal (for distant columns), both cognitively demanding.

## Low Vision: The Overlooked Middle

Most data visualisation accessibility research focuses on blind screen reader users. People with low vision — who may use screen magnifiers, residual sight, or a combination of visual and non-visual strategies — face distinct challenges that research is only beginning to address.

Prakash et al. [2024] conducted what they describe as virtually the first study of how low-vision screen magnifier users perceive bar charts. They found that magnification's visual side effects — blurring at high zoom levels and reduced contrast — significantly impacted task completion. When bars being compared were spatially separated, accuracy declined because users had to pan between locations, losing visual context. The researchers recommend chart designs that place comparison elements close together, use high-contrast colours, and provide numerical labels directly on bars to reduce the need for panning.

Lee et al. [2020] built TableView, a browser extension enabling efficient access to web data records for screen magnifier users, addressing the challenge that complex data tables lose their structure when viewed through a narrow magnification window.

## AI and Large Language Models Meet Data

The arrival of generative AI has introduced new possibilities and new risks for data visualisation accessibility.

Seo et al. [2024] investigated how BLV users interact with LLMs to interpret data visualisations, building on the MAIDR (Multimodal Access and Interactive Data Representation) framework. They found that participants exhibited diverse modal preferences — some relied on sonification for initial exploration then used the LLM for specific questions, while others went directly to the AI chat. A critical trust-but-verify dynamic emerged: participants valued LLMs for natural language explanations but needed additional modalities (sonification, data tables) to verify the AI's claims. The complementary relationship between AI interpretation and direct data access modalities suggests that LLMs should augment, not replace, existing multimodal tools.

Sharif et al. [2024] studied the challenges faced by creators of accessible data visualisations and found that even developers who wanted to make their charts accessible lacked adequate tools, standards, and knowledge. The gap between intention and execution points to systemic barriers in the tooling ecosystem — not just individual developer awareness.

## Creating, Not Just Consuming

Several papers challenge the assumption that BLV people are only data consumers.

Lee et al. [2024] built AltCanvas, a generative AI-powered illustration tool that enables BLV users to create visual content through a tile-based spatial interface. The system combines text-to-image generation with tactile and sonification feedback, allowing users to compose images by placing and arranging tiles representing visual elements. The work demonstrates that BLV people can be visual content creators, not just consumers of accessible alternatives.

Greef et al. [2021] examined how tactile graphics are created collaboratively between blind and sighted colleagues, documenting an "interdependent workflow" where each contributor brings different perceptual expertise. The study found that remote collaboration tools disrupted these workflows because they were designed for sighted-only use, making the act of creating accessible content itself inaccessible.

Potluri et al. [2022] built CodeWalk, a system for facilitating shared awareness in mixed-ability collaborative software development that included sonification of code structure — giving blind developers ambient awareness of their codebase through sound, complementing the detailed but sequential access provided by screen readers.

## What the Research Reveals

Across sonification, tactile graphics, screen reader interaction, dashboards, LLM integration, and creative tools, several findings are consistent.

**Alt text is necessary but nowhere near sufficient.** Charts need multiple forms of access — sonification for pattern detection, data tables for specific values, text descriptions for context, tactile graphics for spatial understanding — because different tasks require different modalities [Sharif et al., 2025]. The research community's own publications often fail at basic alt text quality for figures [Chintalapati et al., 2022; Williams et al., 2022].

**Well-designed tools can close the performance gap.** VoxLens users achieved higher accuracy than sighted users without tools [Sharif et al., 2023]. This finding — that accessibility tools can produce performance parity or superiority, not just "good enough" access — challenges the framing of accessibility as inherently compromised.

**Multimodal is consistently better than unimodal.** Sonification plus text plus data tables outperforms any single modality. Melodic tracing outperforms tap-to-hear by a factor of four [Ramôa & Müller, 2025]. Tactile data comics outperform static tactile displays. LLMs augment but should not replace direct data access modalities [Seo et al., 2024]. The research consistently supports layered, user-controlled access rather than single-channel solutions.

**The creation side is as important as the consumption side.** Blind people want to create data visualisations, tactile graphics, and visual content — not just consume accessible versions of what sighted people make [Race et al., 2023; Lee et al., 2024]. Interdependent creation workflows where blind and sighted collaborators contribute different expertise produce better results than either working alone [Greef et al., 2021].

**Low vision is underserved.** Most research targets blind screen reader users, leaving the larger population of people with low vision — who use magnification, residual sight, and hybrid strategies — with little evidence-based design guidance [Prakash et al., 2024].

**Data access is a civic and professional necessity, not a nice-to-have.** When pandemic dashboards are inaccessible, blind people cannot assess their own risk [Siu et al., 2021]. When data science tools exclude blind analysts, an entire profession is gatekept [Potluri et al., 2023]. When academic figures lack meaningful descriptions, researchers are excluded from the literature in their own field [Chintalapati et al., 2022]. The stakes of data visualisation accessibility are practical and immediate.

---

*This article draws on approximately 80 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2015 and 2025.*
