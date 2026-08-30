---
title: 'Extended Reality and Accessibility: What 51 Research Papers Tell Us About Making Virtual and Augmented Worlds Inclusive'
publishedAt: '2026-05-06'
tags: []
---

# Extended Reality and Accessibility: What 51 Research Papers Tell Us About Making Virtual and Augmented Worlds Inclusive

## The promise is immense. The barriers are real. Here is where the research stands.

Virtual reality lets you box in a gym, explore a museum, or attend a meeting — all from your living room. Augmented reality overlays information on the real world through your phone or smart glasses. Together, these extended reality (XR) technologies are reshaping how we work, learn, socialise, and play. But for the estimated one billion people worldwide who live with disabilities, XR presents a paradox: it could be the most transformative accessibility technology ever created, or it could become the next frontier of digital exclusion.

This article draws on 51 peer-reviewed papers from the A11y Paradise database — all presented at the ACM SIGACCESS Conference on Computers and Accessibility (ASSETS) or related ACM venues between 2017 and 2025 — to map what accessibility researchers have discovered, built, and tested across the XR landscape. The picture that emerges is one of extraordinary creativity by research teams solving problems that mainstream XR developers have largely ignored.

## The Assumption That VR Is Visual

The most fundamental barrier in virtual reality is the assumption that users can see. VR headsets display stereoscopic visual content through lenses pressed against the face. The entire interaction model — from setting up a play space to manipulating virtual objects — is designed around vision. For blind and low-vision (BLV) users, this creates an experience that one researcher described as "talking into a void."

And yet, a remarkable body of work demonstrates that VR can be made meaningfully accessible to people who cannot see.

At the University of Washington, Melanie Kneitmix and Jacob Wobbrock introduced "scene reading" — a paradigm that extends the familiar concept of touch-based screen reading from 2D interfaces into 3D virtual environments. Their SceneVR system streams the live view from a Meta Quest 2 headset onto an iPad, allowing BLV users to explore virtual scenes by dragging a finger across the touchscreen. As users touch different areas, spatial audio announces what objects are beneath their finger, positioned in 3D space to convey location. The system supports progressive disclosure through object hierarchies, so users can drill into complex scenes without being overwhelmed. Twelve BLV adults completed 95% of tasks successfully with high satisfaction scores.

In Lisbon, researchers adapted the arcade game Speed-of-Light for blind players, replacing visual prompts with three non-visual techniques: speech feedback, sonification using 3D spatial audio, and grid-based coordinates. Fifteen blind participants successfully located and tapped virtual targets — demonstrating that spatial interaction in VR is possible without vision. The finding that speech feedback was intuitive but too verbose, while sonification was engaging but hard to learn, illustrates a recurring theme: there is no single best approach, and users need options.

The most physically demanding accessible VR application may be PunchPulse, an open-source boxing exergame designed by a team at the University of Illinois that included BLV co-designers throughout a seven-month process. Using a clock-based directional audio system ("Enemy at 3 o'clock, two steps away"), the game eliminated visual dependency while maintaining genuine physical intensity. All six user study participants reached moderate-to-vigorous physical activity thresholds — significant given that 53% of BLV people identify as physically inactive compared to 27% of the general population.

## Navigating Social VR Without Sight

Gaming is one thing; socialising is another. Social VR platforms like VRChat, Rec Room, and Meta Horizon Worlds rely heavily on avatar-mediated nonverbal cues — eye contact, head nods, gestures, spatial proximity — to facilitate natural conversation. For BLV users, these visual social signals are entirely inaccessible.

Researchers at Cornell and Cornell Tech attacked this problem directly, designing accessible alternatives for eye contact, head nodding, and head shaking. Each behaviour was mapped to spatial audio earcons positioned in 3D space and controller vibration patterns. The results were dramatic: BLV participants' accuracy in detecting who was paying attention to them jumped from 53% (near chance) to 83% when cues were enabled. Participants reported that the cues transformed their VR experience from isolating to engaging, with several noting they used the system not only for real-time conversation support but also as a tool for learning social norms they had never had access to — understanding how frequently sighted people make eye contact and how nodding patterns signal agreement.

A complementary system called VRBubble, from the University of Michigan, divided the virtual space around a user into proxemic zones — intimate, conversation, and social bubbles — and provided spatial audio feedback when avatars entered, exited, or moved between zones. The approach drew on Hall's proxemic theory and gave BLV users peripheral awareness of nearby avatars that sighted users take for granted through peripheral vision. Twelve legally blind participants showed significantly reduced avatar estimation errors compared to a baseline, though the system became cognitively overwhelming with more than about five simultaneous avatars.

The broader challenge of guiding BLV users through virtual environments was explored through a sighted guide system developed at Cornell. Sixteen BLV participants explored virtual parks with a sighted guide who could describe, navigate, and even modify the environment on behalf of the user. The most innovative feature was "Shared Movement" — inspired by physical sighted guidance, it allowed BLV users to grab the guide's avatar arm to move together through virtual space. Participants rated the experience 4.8 out of 5 for usefulness, though some worried about creating dependency. When asked about AI-powered guides, participants were positive but cautious: they wanted AI guides as primary tools with human backup.

## When Sound Is the Barrier

For deaf and hard-of-hearing (DHH) users, VR presents the inverse problem: immersive environments rely heavily on spatial audio for situational awareness, alerts, and atmosphere, and that information disappears entirely for people who cannot hear it.

SoundVizVR, developed at Rochester Institute of Technology, tackled this with a Unity plugin that visualises sound information using two complementary layers. Sound-Characteristic Indicators show where sounds come from and how loud they are through on-object markers and a mini-map radar, while Sound-Type Indicators convey what kind of sound is playing through icons or text labels. The full mini-map combined with on-object indicators achieved 95% sound localisation accuracy compared to just 24% with no visualisation.

A different approach came from SoundHapticVR, which converts spatial audio into vibrotactile feedback delivered through actuators mounted on the VR headset strap around the user's head. Through three progressive studies with DHH participants, the researchers established that a five-transducer configuration with frequency equalisation — adjusting vibration amplitude per head location since the forehead is far more sensitive than the back of the skull — provides effective directional sound information. Participants could both locate sound sources and distinguish between different types of sounds through distinct haptic patterns.

Perhaps the most paradigm-shifting contribution came from SoundModVR, which challenged the prevailing approach of substituting audio with visual or haptic alternatives. The authors argued that deafness occurs on a spectrum — many DHH people have partial hearing and benefit more from having control over audio itself than from replacing it. They designed 18 sound modification tools allowing users to boost important sounds and reduce background noise, shift frequencies into audible ranges, and add spatial indicators showing the direction of off-screen sounds. The tools were tested across five diverse VR scenarios, from a noisy coffee shop to a horror game. A key insight: sound modification is not just an accessibility feature — several participants noted that hearing users might also benefit from audio customisation, reinforcing the curb-cut effect.

## AR Smart Glasses: The Promise and the Reality

Augmented reality smart glasses have been heralded as transformative assistive technology — and for good reason. For DHH users, AR glasses could display real-time captions in the user's field of view while maintaining eye contact with the speaker. For people with low vision, they could enhance and simplify the visual world in real time.

Two deaf researchers at RIT evaluated Access on Demand, an AR application delivering real-time captioning and ASL interpretation through Vuzix Blade smart glasses. The most significant benefit they found was "glanceability" — the ability to view captions while maintaining eye contact with the speaker, eliminating the constant gaze-shifting between speaker and captioning screen. Conversation partners found interactions more natural when the DHH person could look directly at them.

But the reality check was sobering. Battery life was about one hour. The glasses generated noticeable heat. One-handed ASL was required because the other hand held a phone in presenter mode, effectively preventing two-way communication. Caption positioning was fixed in the centre of the field of view, blocking the speaker's face. The bulky form factor drew unwanted attention. For users with cochlear implants or hearing aids, the thick frames caused physical interference.

For people with cerebral visual impairment (CVI) — where the brain cannot properly process visual information despite the eyes functioning normally — smart glasses show more immediate promise. CVI is now the leading cause of visual impairment in children in developed countries, yet a scoping review of 110 vision-based assistive technology papers found virtually none addressed it. Standard low-vision accommodations like magnification can actually worsen visual overload for people with CVI because the problem is neurological, not optical. In an eight-month co-design study using Apple Vision Pro, researchers developed scene simplification features that highlighted relevant objects while suppressing visual clutter, dramatically improving the experience for co-designers with CVI. One described it as "recreating what vision would feel like without CVI."

For people with low vision (as distinct from CVI), head-mounted displays show strong potential as customisable vision enhancement systems. The ForeSee system offered five enhancement methods — magnification, contrast, edge enhancement, black/white reversal, and text extraction — controlled via speech commands or smartwatch gestures. A critical finding: more than 70% of participants used magnification, but they combined it with different enhancements and at different levels depending on the task. Three participants with the same diagnosed condition chose entirely different enhancement combinations, demonstrating that diagnosis alone is a poor predictor of what actually helps.

## The Controller Problem

For people with motor impairments, VR's physical interaction requirements create barriers before any virtual content is even loaded. A landmark 2020 study by Microsoft Research documented seven accessibility barriers spanning the entire VR experience: setting up a VR system (plugging cables, inserting batteries), putting on headsets (wrestling heavy devices over the head), adjusting head straps (unreachable knobs, interference with wheelchair headrests), cord management (entanglement with wheelchair wheels), manipulating dual controllers (impossible for one-handed users), inaccessible controller buttons (too small, too close together, too smooth for poor grip), and maintaining controller view (holding arms elevated for extended periods).

The title quote from that paper captures a devastating truth: "I just went into it assuming that I wouldn't be able to have the full experience."

Subsequent research has focused on making VR interaction work for people who cannot use standard controllers. A 2023 study compared six locomotion techniques with 19 participants who had spinal cord injury, muscular dystrophy, cerebral palsy, arthritis, and other conditions. Teleport was fastest and most accurate, but the most striking finding was that accessibility alone did not determine preference. Seven participants preferred a technique that differed from their most comfortable one. Some actively wanted techniques that pushed their physical abilities — one appreciated exercising an underused hand; others felt Teleport was "too easy" and "like cheating."

The Nearmi framework decomposed navigation into four configurable components — representation, display, selection, and transition — yielding 48 possible combinations. Seventeen participants with limited mobility collectively identified 13 unique preferred configurations, underscoring that no single accessible mode can serve this diverse population.

Most recently, a 2025 study provided the first empirical data on freehand gesture accessibility for people with upper limb motor impairments. The finding that pinching — the most widely used gesture across Meta Quest, Apple Vision Pro, and Microsoft HoloLens — is also the most problematic gesture for users with motor impairments has major implications for the entire XR industry. Five participants performed pinching by pressing their thumb against the side of a straightened index finger rather than tip-to-tip, which the system simply did not recognise. Median pain scores for participants with impairments during pinch gestures were 1.50 versus 0.00 for controls. Physical measurements did not reliably predict interaction difficulties, meaning standard assessments alone cannot determine which adaptations a user needs.

## Walking in VR With a Mobility Impairment

Head-mounted displays obstruct peripheral vision of the real world, causing gait disturbances that are particularly dangerous for people who rely on visual cues for balance. A study with 25 participants with multiple sclerosis and 25 without found that simple visual overlays — static crosshair textures that move with the user's view — significantly improved walking velocity, step length, and stride length for the MS group. Crucially, the same overlays had no effect on participants without mobility impairments, meaning they can be offered as an accessibility option without affecting other users.

For wheelchair users, VR offers an entirely different kind of promise: the ability to remotely assess the accessibility of physical environments before visiting. The Embodied Exploration system allowed wheelchair users to navigate high-fidelity digital replicas of real spaces using personalised avatars that encoded their wheelchair width, armrest height, and seated eye height. Participants could feel their virtual wheelchair scraping against furniture, check whether armrests would clear under tables, and verify what could be seen from a seated position. One participant noted he was "confident that my legs would not fit under the table" when his virtual armrest visibly collided with the table edge — information that photos, videos, or ADA labels could never convey.

## Identity in Virtual Spaces

Beyond functional access, XR raises profound questions about identity and self-representation for disabled users. A series of studies from 2022 to 2024 has examined how people with disabilities navigate avatar design and disability disclosure in social VR.

A systematic review of 15 major social VR platforms found disability representation in avatars was virtually non-existent. Only Meta Avatars offered disability-related features, limited to hearing devices for DHH users. No platforms provided features representing visual impairments, mobility disabilities, or other conditions. The avatar customisation process itself was largely inaccessible to blind users — no screen reader support, no alternative text for design interfaces.

When researchers gave 26 participants with real-world disabilities access to inclusive avatars in VRChat for one week — including both visible disability signifiers (wheelchairs, canes) and invisible disability visualisations (chronic pain auras, ADHD represented by orbiting objects) — the experience was both empowering and dangerous. Participants with invisible disabilities reported that avatars gave them a way to disclose their condition on their own terms. But six of ten participants experienced ableist harassment including mocking, avatar invasion, and being told to "just get over it." Despite this, nine of ten wanted to continue using disability-signifying avatars.

A complementary study focused specifically on people with invisible disabilities found three distinct disclosure patterns: Activists who wanted public avatar representations as advocacy, Non-Disclosers who viewed disability as private, and Situational Disclosers — the majority — who wanted context-dependent control. Participants proposed creative representations leveraging VR's unique affordances: energy-level indicators that dim as fatigue increases, facial expressions that automatically reflect pain levels, and symbolic accessories recognisable to others with the same condition but not to the general public — a form of "insider" signalling.

A 2025 study with 16 physically disabled participants added another dimension: context matters enormously. In games, fantasy avatars and barrier-free worlds were acceptable and even desired. In social VR, realistic self-representation and realistic environments — including disability-relevant features like elevators alongside stairs — were strongly preferred. The researchers proposed a three-layer framework (physical, digital, experiential) for understanding VR accessibility, emphasising that the layers interact in complex ways that cannot be addressed individually.

## AR Beyond the Headset

While much attention focuses on headsets, some of the most immediately practical XR accessibility work uses smartphone-based augmented reality — technology already in millions of pockets.

RASSAR uses iPhone LiDAR sensors and computer vision to semi-automatically identify indoor accessibility issues, scanning a room in about 106 seconds compared to 10 minutes for manual auditing. The system detects 20 types of accessibility and safety issues including inaccessible object dimensions, risky item placement, and missing assistive devices.

AIGuide solves the "last meter problem" for blind users — the gap between knowing an object exists and physically reaching it. Using ARKit's 3D object detection, the app guides the user's hand from detection to grasping through multimodal directional feedback: speech for direction, beeping for proximity, and haptic taps for confirmation. Ten blind participants achieved over 94% success rates in finding and picking up grocery items in their homes.

For museum visitors with low vision, MusA uses augmented reality to overlay high-contrast contours on paintings, highlighting the region being described in a structured audio guide. It achieved a System Usability Scale score of 92 and, perhaps more importantly, participants said they would visit museums more frequently if the tool were available.

And for visually impaired musicians, XRMusic4VIP uses Meta Quest 3 in AR passthrough mode to display virtual sheet music as a continuous scrolling band above a real keyboard, eliminating the need to memorise small sections before playing. One participant said: "It could make playing the piano fun again. Honestly, I had given up because you had to learn everything by heart."

## XR for Autism, Neurodiversity, and Mental Health

Extended reality is also opening new possibilities for neurodivergent users. A low-cost VR platform called VISTA used Google Cardboard-style headsets to deliver therapeutic attention exercises to neurodiverse children, with one child showing over 800% improvement in visual attention scores on the most complex tasks. The function-centred design approach — grouping users by observed behavioural characteristics rather than diagnostic labels — offers a model that accessibility practitioners could adopt more broadly.

For autistic children, CustomAR allows therapists to create personalised AR experiences targeting skills like choice-making, daily living, and emotion recognition, with a crucial "freeze" feature that captures the AR experience on screen when a child moves away from the target image — addressing the practical reality of limited attention and wandering behaviour.

A large-scale survey of over 200 autistic adults identified sound and light as the two primary sensory stress triggers, with 38% expressing interest in augmented reality and 33% in VR as potential stress management tools. The finding that autistic adults want existing familiar devices enhanced rather than replaced by new form factors provides a clear design direction: build stress management features into smartphones and headphones rather than requiring adoption of novel hardware.

For people with obsessive-compulsive disorder, researchers proposed augmented reality approaches to compulsion prevention — using visual barriers to interrupt checking behaviours or grey-scale filters to encourage avoidance-based exposure — grounded in evidence-based therapeutic principles.

## Sign Language in Virtual Worlds

Several research threads address how sign language — a visual-spatial language — functions in XR environments.

At Gallaudet University, a majority-Deaf team created SAIL, the first ASL instructional system for immersive VR. Using motion capture from a native Deaf signer, the system teaches introductory ASL vocabulary through a signing avatar, with LEAP Motion tracking allowing learners to see digital representations of their own hands as they imitate signs.

Research on sign language interpreter rendering in VR 360-degree content found that fixed-position rendering (interpreter attached to the 360 sphere) produced significantly higher presence scores than always-visible rendering (interpreter as a heads-up display), but fixed-position blocked content. Simple arrow guides were dramatically more usable than radar-style minimaps for directing users to the active speaker, with SUS scores of 92.8 versus 63.1.

For hearing families with deaf children — over 90% of DHH children are born to hearing families — CoSignPlay offers a collaborative approach to learning non-manual signs in ASL. Inspired by "group narrative," a Deaf community storytelling activity, the system lets two players jointly control a 3D avatar: one handling facial expressions while the other performs manual signs. This reduces the cognitive load of learning a visual-spatial language while grounding the technology in Deaf cultural practice.

And empirical research on ASL animation timing challenged the assumption that replicating human signing speed is always ideal. DHH participants preferred faster signs with slower transitions between signs — an unexpected finding that improved their ability to distinguish when a sign was being performed versus when the avatar was transitioning.

## The Lived Experience Lens

One of the most powerful papers in this collection is an autoethnography by Atieh Taheri, a disabled researcher with Spinal Muscular Atrophy. Among her three projects, Virtual Steps asked a question most accessibility research would not: what would it feel like to walk, as someone who has never walked? The VR-based walking simulation was not about rehabilitation or functional gain but about emotional and imaginative exploration of bodily experience. Reviewers questioned the work; Taheri argues it represents a form of epistemic resistance — asserting the legitimacy of knowledge that is often dismissed as too personal for conventional research.

Her paper identifies a gap that applies across all the work reviewed here: the difference between technical sufficiency and experiential adequacy. A system can be functionally complete yet fail to provide the embodied sense of control and agency that makes interaction meaningful. This insight — that accessibility is about experience, not just access — is perhaps the most important lesson from a decade of XR accessibility research.

## What the Research Tells Us

Across these 51 papers, several consistent themes emerge.

**Customisation is not optional — it is essential.** Whether it is locomotion techniques for motor-impaired users, sound modification tools for DHH users, or vision enhancement settings for low-vision users, the research consistently shows that no single accessible mode can serve diverse populations. Even users with the same diagnosis need different configurations. XR platforms must build personalisation into their core architecture.

**Multimodal feedback works.** The most successful accessibility solutions provide information through multiple sensory channels simultaneously — spatial audio plus haptic vibration, speech plus visual overlays, sound plus touch plus text. Users want to choose and combine modalities based on their own needs and context.

**Accessibility and enjoyment are not opposites.** Users with disabilities do not simply want the easiest possible interaction. They want agency, challenge, variety, and fun. Some wheelchair users felt Teleport was "too easy." BLV boxers framed physical exertion as part of the game's appeal. Disabled gamers want the same range of experience as everyone else.

**Identity matters as much as function.** Avatar representation, disability disclosure, and self-expression in virtual spaces are not secondary to functional access — they are central to the experience. Platforms that provide inclusive avatar options while giving users control over what to disclose, when, and to whom, create spaces where disabled users can genuinely belong.

**Hardware is still the bottleneck.** Controllers are too heavy, buttons too small, headsets interfere with hearing aids and wheelchair headrests, batteries die too fast, and hand tracking does not recognise how many disabled people actually move their hands. Until XR hardware manufacturers build accessibility into their physical products, software solutions will remain workarounds.

**The field is maturing rapidly.** The progression from the first exploratory studies in 2020 (documenting barriers, interviewing users) to the sophisticated systems being tested in 2024-2025 (haptic head-based spatial sound, scene reading on iPads, personalised wheelchair assessment) shows a research community moving from "can this work?" to "how do we make it work well?"

## What Comes Next

The 51 papers reviewed here represent an extraordinary burst of creativity and rigour. But they also reveal gaps. Very few studies include participants with multiple disabilities. Most evaluations use small sample sizes in controlled settings. The commercial XR industry has adopted almost none of these innovations as standard features. And the lived experience of disabled XR users — their desires, frustrations, and creative adaptations — remains underrepresented in the design process, despite growing recognition that disabled researchers and designers produce fundamentally better accessibility solutions.

The stakes are high. As VR and AR move from gaming peripherals to platforms for work, education, healthcare, and social connection, the decisions made now about accessibility will determine whether a billion people are included or excluded from the next generation of digital life. The research exists. The question is whether the industry will use it.

---

*This article draws on literature reviews in the A11y Paradise database (a11ybob.com), an open-source accessibility training resource. All research cited was presented at the ACM SIGACCESS Conference on Computers and Accessibility (ASSETS) or related ACM venues between 2017 and 2025.*
