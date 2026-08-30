---
title: 'Where Are the Deafblind Users in Digital Accessibility Research?'
publishedAt: '2026-05-06'
tags: []
---

# Where Are the Deafblind Users in Digital Accessibility Research?

## What the academic literature tells us about an overlooked population — and the researchers working to change that

If you work in digital accessibility, you are probably familiar with the standard categories: blind and low vision users, deaf and hard of hearing users, users with motor impairments, users with cognitive disabilities. Our standards, our testing tools, and our research are largely organized around these discrete groups. But what happens when someone lives at the intersection of two or more of these categories — when a person is both deaf and blind?

The answer, according to a growing body of research presented at the ACM SIGACCESS Conference on Computers and Accessibility (ASSETS), is that the field has largely failed them.

This article draws on literature reviews in the A11y Paradise database to examine what digital accessibility research has done — and has not done — to investigate barriers and propose solutions for people with deafblindness. The picture that emerges is one of creative innovation by individual research teams working against a backdrop of systemic neglect in how the field conceptualizes disability itself.

## The Scale of the Problem

Deafblindness is not simply "deafness plus blindness." It is a distinct condition where the combination of sight and hearing loss means that one sense cannot compensate for the limitations of the other. This has profound implications for technology access. Most assistive technologies rely on cross-modal substitution: screen readers convert visual information to audio for blind users; captions convert audio to text for deaf users. But when both primary senses are compromised, these standard approaches collapse.

Research presented at ASSETS 2022 and 2023 by Arthur Theil and colleagues puts the scale of this gap into sharp focus. Their literature survey of 836 papers published at ASSETS and CHI from 1994 to 2019 found that only 7% focused on multiple disability communities and just 1% focused on users with multiple disabilities. This is, as they note, "starkly out of proportion with reality": a 2016 UK survey found that nearly 75% of people with disabilities live with more than one type of long-term impairment, and over 20% live with at least three.

The consequences are tangible. Over 51% of people living with three or more impairments reported that current assistive technologies do not adequately address their needs. People with deafblindness specifically report that technologies designed for either visual or hearing impairments alone do not effectively serve them. And the problem extends beyond technology into community: many individuals with multiple disabilities feel rejected by single-impairment disability communities for being "different," creating social isolation that compounds technological exclusion.

## Haptic Innovation: Communicating Through Touch

The most direct response to the deafblind accessibility gap has come through haptic technology — systems that communicate information through the sense of touch.

A 2020 demonstration at ASSETS by James Gay, Moritz Umfahrer, Arthur Theil, and colleagues from the EU-funded SUITCEYES project presented a haptic wearable vest designed specifically for people with deafblindness. The vest uses vibrotactile feedback to convey three types of navigational information: directional cues via five vibration motors distributed across the waist area, proximity information through vibration frequency (faster pulses mean closer objects), and semantic commands via tapping motors on the shoulders that communicate "go" and "stop" using social haptic gestures adapted from established communication practices in the deafblind community.

Five individuals with deafblindness tested the system in a gamified evaluation where they played "secret agents" following a researcher through an indoor route. All five were able to follow directional cues and complete the route without human assistance. The participant feedback was striking. One person noted that "as a person living with deafblindness, you always need one hand free to touch your intervener," but the haptic vest enabled them to "navigate confidently in a new environment for the first time without the direct support of another person." Another said the distance feedback "calmed me down... I knew that everything was ok."

This hands-free design is critical. Deafblind users typically need their hands for carrying a cane, touching a guide dog, or communicating with an intervener through tactile sign language. Any technology that occupies the hands creates a direct conflict with essential daily activities.

The COVID-19 pandemic added unexpected relevance to this work: enabling deafblind people to perceive safe distances from others without requiring physical contact became suddenly important for everyone, but especially for people who had previously relied on touch-based social interaction.

## Haptic Technology Beyond Navigation

The potential of haptic approaches extends well beyond wayfinding. Research on vibrotactile feedback for blind and low-vision music learning, presented at ASSETS 2023 by Leon Lu and colleagues, included two deafblind participants among their ten co-designers — a rare instance of deafblind inclusion in a study not specifically focused on deafblindness. The study explored how vibration patterns could communicate musical concepts like dynamics, articulation, and timing cues, enabling musicians to receive instructional information through their bodies rather than through sight or sound.

Similarly, the Sonic Agency study published at ASSETS 2025 documented a 15-month group autoethnography of technology-mediated music performance by a mixed-hearing team that included a Deaf/Blind member. The ensemble developed multimodal performance systems integrating audio-reactive visual displays, vibrotactile vests, and gestural interfaces. Their concept of "sonic agency" — the right and ability to shape sound regardless of whether one can hear it — extends naturally to deafblind experience, where engagement with music and sound happens entirely through vibration and visual feedback.

These studies suggest that the touch-based communication channel, while underexplored in mainstream accessibility work, offers rich possibilities for conveying complex information to people with dual sensory impairments.

## The Privacy and Policy Paradox

Technology alone cannot solve accessibility problems if social policy prevents that technology from reaching the people who need it. This is the central argument of a 2021 ASSETS paper by Sarah Woodin and Arthur Theil examining the regulation of personal cameras for people with deafblindness.

Drawing from interviews with 79 people with deafblindness and family members across five European countries, the researchers found that none had access to personal cameras for person or object recognition, despite many seeing face recognition as potentially transformative for understanding their social environment — identifying who is nearby, whether someone is speaking to them, or navigating public spaces independently.

The barriers are multiple and reinforcing. Cost is prohibitive: face recognition technology runs to thousands of pounds and is not funded by social services. The regulatory landscape is fragmented and hostile: GDPR applies across Europe but implementation varies by country; the EU AI Act bans real-time biometric surveillance with narrow exceptions; and no regulations anywhere provide accommodations for disabled users of personal cameras. Meanwhile, disabled people have been disproportionately targeted by exploitative data practices — the browser company Brave reported that private companies were embedding surveillance on UK council websites where disabled people sought help. This history of exploitation has led some disabled people's organisations to prioritise campaigns against biometric data misuse over access to face recognition technology.

The result is a paradox: the same technology that could enable deafblind independence — wearable cameras with face and object recognition — is caught in a regulatory framework that treats it primarily as a surveillance risk. The researchers argue that technical innovation alone is insufficient. Without engagement with social policy frameworks, promising assistive technologies will remain inaccessible due to cost, regulation, or lack of awareness among decision-makers who control approved equipment lists.

A separate 2024 analysis of assistive technology privacy policies reinforces this concern. Kirk Crawford and colleagues examined 18 AT privacy policies — including the UbiDuo, a communication device specifically designed for deafblind users — and found that none included protections specific to individuals with disabilities. Technologies designed explicitly for disabled users offered no disability-specific privacy safeguards, even though their users may share particularly sensitive personal data through everyday use.

## AI Fairness and Sensory Augmentation

The fairness challenges facing AI-powered assistive technology are especially acute for deafblind users. A 2020 paper by Leah Findlater and colleagues examines what happens when AI systems augment sensory abilities — precisely the kind of technology that deafblind people most need.

Their analysis identifies a fundamental problem: the training data and internal representations used by AI sensing systems are inherently inaccessible to their target users. A blind person cannot visually inspect what an image classifier sees, and a deaf person cannot listen to what a sound classifier hears. For someone who is both deaf and blind, there is essentially no independent way to verify AI outputs, creating a dangerous trust dynamic. Users may place too much faith in AI sensing results precisely because they cannot independently verify accuracy.

The paper also highlights the layered decision-making embedded in these systems. Who decides what labels to use when training an image recognition model? Who decides what sounds are important enough to alert a user about? Who decides how to frame information about the people and objects in someone's environment? These design choices, which profoundly shape how users perceive the world, are typically made without input from the people who depend on these systems most.

For deafblind users, these concerns are compounded. If an AI system's primary output modality (visual display or audio) is inaccessible, the alternative modalities (haptic, braille) may convey even less information about system uncertainty or errors, making informed trust even harder to achieve.

## The Cross-Disability Perspective

Several recent studies illuminate the deafblind experience not through dedicated research but through cross-disability approaches that reveal how deafblindness intersects with broader patterns.

A 2025 study of smart home technology usage by Rebecca Moore and Jason Wiese analyzed Reddit discussions across disability-focused communities and found that the same technology serving as a convenience for non-disabled users can be essential for disabled users — and that needs diverge sharply across disability types. Deaf users rely on visual alerts and video doorbells; visually impaired users depend on voice control. For someone who is both deaf and visually impaired, neither accommodation works, and the study's finding that voice control "proves unreliable for users with speech differences or deaf users" highlights how single-modality solutions fail at intersections.

Research from Kenya on smartphones as assistive technology for people with sensory disabilities found that Live Transcribe and TalkBack are "genuinely life-changing" for deaf and blind users respectively in contexts where sign language interpreters and braille materials are unavailable. But the study's framework — which separates BPS (blind or partially sighted) and DHH (deaf or hard of hearing) participants — does not address what happens for people who are both, an omission that mirrors the field's broader single-impairment bias.

The 2025 study on disabled innovators of accessibility technology by Aashaka Desai and colleagues offers a different lens. Their finding that the most effective accessibility technologies often come from disabled creators themselves — people whose lived experience gives them insight into "little things" that non-disabled designers miss — raises an important question: where are the deafblind technologists, and what might they create if given resources and platforms?

## A Research Agenda in Formation

The work of Arthur Theil and colleagues across ASSETS 2022 and 2023 represents the most sustained effort to move the field beyond single-impairment thinking. Their workshops on designing accessible systems for users with multiple impairments have brought together researchers from HCI, disability studies, engineering, medical humanities, and social work to confront the gap directly.

Their diagnosis is clear: accessibility research relies on "rigid impairment categories" that fail to match lived experience. The majority of technical work at top accessibility venues "rarely includes users with more than one impairment in empirical studies." The six research questions they have identified span theory (are frameworks like Universal Design adequate for multidimensional needs?), technology (how can interaction modalities be adapted for users with challenges across multiple abilities?), and methodology (how do we conduct research with participants who have complex communication needs?).

These are not abstract concerns. The 122,559 students in the US alone who receive special education accommodations for profound or multiple impairments represent a population that current accessibility approaches are not designed to serve.

## What Needs to Change

The research in this database points to several concrete directions.

**Design for intersection, not addition.** Deafblindness is not "deaf accessibility plus blind accessibility." Haptic and tactile interfaces — like the SUITCEYES navigation vest — represent genuinely new interaction paradigms rather than adaptations of existing visual or auditory approaches. More investment in touch-based communication systems, braille-integrated interfaces, and vibrotactile feedback is needed.

**Include deafblind participants.** The haptic music learning study that included two deafblind co-designers demonstrates that inclusion is possible and yields richer results. Researchers should actively recruit participants with multiple impairments rather than screening for single-impairment purity.

**Engage with policy.** The camera regulation research shows that even when technical solutions exist, policy barriers can prevent adoption. Accessibility researchers and advocates need to be present in regulatory conversations about AI, biometrics, and data protection to ensure that disability access needs are not sacrificed to surveillance concerns.

**Address privacy with specificity.** If zero assistive technology privacy policies include disability-specific protections, the industry has work to do. Deafblind users of camera-based, haptic, or AI-powered tools deserve policies that acknowledge the sensitivity of the data these tools necessarily collect.

**Support deafblind innovation.** The disabled innovators research demonstrates that the most impactful accessibility technologies often come from within disability communities. Creating pathways for deafblind people to lead technology development — not just participate as test subjects — could transform the field.

**Adopt multidisciplinary methods.** The workshops on multiple impairments make a compelling case that HCI alone cannot solve these problems. Disability studies, social policy, medical humanities, and lived experience must all be at the table.

## Conclusion

The digital accessibility field has made remarkable progress for people with single categories of impairment. Screen readers, captions, voice control, and switch access have transformed what is possible. But for people who live at the intersections — and deafblind people represent one of the most challenging and underserved of those intersections — we are still in the early stages.

The research reviewed here shows pockets of genuine innovation: haptic vests that enable independent navigation, vibrotactile systems that communicate music through the body, and frameworks that challenge the field to think beyond discrete impairment categories. But it also reveals systemic gaps: a publication record where only 1% of papers address multiple disabilities, a regulatory environment that treats assistive cameras as surveillance tools, and a privacy landscape where no assistive technology company has thought to protect its disabled users specifically.

The researchers working on these problems — many of whom are themselves disabled or have direct connections to deafblind communities — are building the foundations for a more inclusive approach. The question is whether the broader accessibility community will follow their lead, or continue designing for one impairment at a time while the majority of disabled people fall through the gaps.

---

*This article draws on literature reviews in the A11y Paradise database (a11ybob.com), an open-source accessibility training resource. All research cited was presented at the ACM SIGACCESS Conference on Computers and Accessibility (ASSETS) or related ACM venues between 2020 and 2025.*
