---
title: 'Getting There: What Accessibility Research Reveals About Navigation and Wayfinding'
publishedAt: '2026-05-06'
tags: []
---

# Getting There: What Accessibility Research Reveals About Navigation and Wayfinding

## Moving through the world — indoors, outdoors, in transit, and online — remains one of the deepest accessibility challenges, and the research is showing why individual tools cannot solve it alone

Getting from one place to another is something most people do without thinking about it. You glance at a sign, cross a road, find a room number, tap a transit map, scroll through a menu. Each of these micro-tasks involves visual information processed automatically. For people with visual impairments, motor disabilities, cognitive differences, or combinations of these, every one of those tasks must be handled deliberately, often using multiple tools, and frequently with incomplete information.

Accessibility research on navigation and wayfinding spans outdoor travel, indoor orientation, public transit, museums and cultural spaces, housing, and virtual environments. This article examines what researchers have found across 64 peer-reviewed papers published between 2020 and 2025 — work that reveals not just technical challenges but the social, institutional, and infrastructural dimensions of accessible movement.

## No Single Tool Is Enough

One of the clearest findings across the research is that blind and visually impaired travellers do not rely on a single navigation tool. They orchestrate ecosystems.

Kameswaran et al. [2020] studied how 23 people with visual impairments use navigation technologies in daily life and found distinct patterns of combination. Google Maps was valued for route planning and turn-by-turn directions, but participants noted it lacked ambient environmental information. BlindSquare and Microsoft Soundscape filled this gap by providing points-of-interest announcements and spatial audio cues that built "survey knowledge" — understanding of what surrounds the user rather than just the next turn. Participants strategically combined tools based on context: using one app for orientation, another for direction, and sometimes a third for identifying specific objects or reading signs.

Zeidieh [2024] formalised this insight into a five-pillar framework for technologically interdependent travel, drawn from over a decade of first-person experience. Successful travel requires addressing fundamentally different information needs at different stages — preparation, transportation, navigation, orientation, and environmental evaluation — and existing technologies tend to serve only one or two pillars well. The author documents constantly switching between tools, sometimes using three or four simultaneously. His paper's title — "Seven Stitches Later" — references a real injury from walking into a low-hanging tree branch, underscoring physical risks that technology papers rarely acknowledge.

Zeidieh and Seo [2025] tested commercially available voice and video-capable language models (ChatGPT, Gemini, Google Lens) for real-world navigation and found both promise and significant gaps. A "just-in-time prompting" technique — pre-prompting the AI with context and a trigger phrase — produced reliable results when users stopped and pointed their camera at items of interest. But continuous walking-and-checking was unreliable because models sample individual frames rather than truly processing continuous video, missing spatial context and temporal changes. The authors concluded that VVLMs are best used as "consultation tools at deliberate moments" rather than continuous navigation aids.

Chang et al. [2025] evaluated ChatGPT's Advanced Voice with Video feature with eight blind and visually impaired participants across nine real-world scenarios and found that it performed well on static visual scenes — reading labels, identifying objects — but could not provide live descriptions of dynamic scenes despite claiming it could. It only responded to explicit queries in a turn-taking pattern, forcing users to repeatedly ask what was happening. Sycophantic behaviour was also documented: when participants challenged a correct answer, the model sometimes reversed itself, eroding trust in accurate responses.

## The Built Environment Is Broken — and Poorly Documented

Research on urban accessibility reveals that the physical infrastructure itself is a fundamental barrier, and that the data needed to navigate it barely exists.

Froehlich et al. [2022] framed urban accessibility as a "wicked problem" and documented striking gaps. Of 178 US cities studied, only 60% had open data portals, only 34% included sidewalk information, and far fewer tracked accessibility features like crosswalks (19%), curb ramps (17%), or audible crossing controls (7%). In a study of 401 government agencies, only 54 (13%) had published ADA transition plans and only seven met minimum ADA criteria. Seattle's first comprehensive sidewalk audit cost $400,000 to survey just 1,500 miles of sidewalks — making traditional auditing economically unsustainable at city scale. The authors argue that AI-powered tools using computer vision and crowdsourcing can automate barrier detection, noting that Project Sidewalk alone has collected over 500,000 crowdsourced labels across multiple cities.

Sharif et al. [2022] addressed a specific manifestation of this gap: the difference between a transit station being theoretically accessible (having elevators) and practically accessible (elevators actually working). UnlockedMaps visualises real-time elevator status across six North American transit systems. Pilot studies with 34 participants, including wheelchair users and pregnant people, showed consistently high ratings (M=6.2/7 for usefulness). A critical design choice was collecting and publicly releasing historical elevator outage data — something no transit authority provides — enabling disability advocates to hold agencies accountable.

Hwang et al. [2025] applied computer vision to aerial imagery to detect disability parking spaces at scale, finding that despite ADA mandates requiring 4-8% of parking to be accessible, no large-scale assessment had previously been conducted. Interview participants described creative workarounds — carrying signs to protect their spaces, parking across multiple spots, relying on family members as drivers — and strongly wanted real-time, reliable information about parking availability and accessible routes from parking to building entrances.

Miyata et al. [2023] tested gamification to motivate crowdsourced accessibility data collection, finding that without gamification, contribution rates differed significantly between high- and low-motivation participants, but with gamification, the motivation gap was substantially reduced — low-motivation participants increased their contributions to levels comparable with high-motivation users.

## Indoor Navigation Remains Largely Unsolved

GPS does not work indoors, and this creates one of the most persistent daily challenges for people with visual impairments.

Engel et al. [2020] surveyed 106 people with visual impairments about travelling to unknown buildings and found a substantial information gap, particularly for indoor orientation. The primary strategy for finding rooms is asking other people (53% of low-vision participants, 41% of blind participants), though both groups would prefer textual descriptions or maps. Building geometry was the most frequently cited challenge — asymmetric layouts, non-orthogonal corridors, and open-plan spaces were significantly more difficult to navigate than regular grid layouts.

Abraham [2022] documented the practical challenges of deploying a BLE beacon-based wayfinding system in a three-story campus building, serving not just blind users but also wheelchair users, people who are hard of hearing, and those with cognitive disabilities. Ceiling-mounted beacons in corridor centres provided the best proximity detection in narrow corridors, while wall mounting was preferred for large open spaces. The system's multi-modal feedback — audio, text, vibration, and visual — allowed different users to choose their preferred channel.

Ren et al. [2023] built RouteNav, an iOS wayfinding app for transit hubs that avoids the need for any external infrastructure by fusing GPS with inertial dead reckoning and machine learning-based pedestrian tracking. Seven blind participants (ages 59-74) navigated routes of up to 495 metres through underground tunnels, crosswalks, ramps, and fence openings. All completed the routes, but experimenter intervention was needed at "challenge points" — areas where the system's positioning accuracy degraded.

Fusco and Coughlan [2020] developed an indoor localisation system that detects Exit signs using computer vision — signs that are legally mandated in virtually all commercial buildings worldwide — to anchor positioning. The approach requires no custom infrastructure, but depends on line-of-sight to signs, which is not always available in complex building layouts.

Garfias and Namboodiri [2024] built MABLESim, a simulation framework for studying how people with different disabilities navigate indoor spaces. Simulation results showed that blind individuals needed roughly four times as long as non-disabled individuals to navigate larger, more complex buildings, compared to three times as long in simpler buildings — demonstrating that building complexity disproportionately impacts people with disabilities.

## Museums Are a Testing Ground for What Access Could Look Like

Museums occupy a distinctive position in the research: they are controlled environments where researchers can test multisensory approaches that would be impractical on a public street.

Wang et al. [2024] conducted the first direct comparison of two smartphone-based museum guide paradigms for blind visitors at Miraikan in Tokyo. Spatialized sound navigation — where a bell sound emanates from the direction of the next exhibit — was more effective and preferred over turn-by-turn instructions. Five of seven participants needed additional assistance with turn-by-turn navigation, while only one needed help with spatialized sound. Spatialized sound produced smoother, curved walking trajectories, while turn-by-turn users exhibited zigzag patterns with frequent stops. But participants unanimously wanted a hybrid approach combining immersive navigation with direct control over information.

Wang et al. [2025] designed an immersive tactile workshop at Miraikan structured around the International Space Station exhibition. The workshop progressed from simplified tactile orientation materials to full-body exploration of the actual exhibition. Participants preferred conversational AI over human guides for certain tasks, citing perceived objectivity and user control — a finding with implications well beyond museums. Staff emphasised that accessibility skills require hands-on experience, not just manuals.

Butler et al. [2023] worked across two major exhibitions at the Bendigo Art Gallery over multiple years and found that portable tactile cards were the most consistently valued artefact — serving as information anchors that visitors could carry through the gallery, building confidence and facilitating dialogue with guides. Pre-visit engagement was identified as critically important: participants who had advance exposure to themes and materials engaged more deeply.

Wang et al. [2022] developed BentoMuseum, a 3D-printed interactive museum map system with a layered design for multi-floor buildings. Participants using the system completed spatial orientation tasks more accurately and with greater confidence than those relying solely on verbal descriptions.

Yuru et al. [2023] studied the problem from the curators' side — 22 experienced curators in China — and identified a vicious cycle: low blind and low-vision attendance leads to reduced accessibility investment, which further discourages BLV visitors.

Ahmetovic et al. [2021] built MusA, an AR application for museum visitors with low vision that overlays high-contrast contours on paintings, achieving a SUS score of 92. Participants reported they would visit museums more frequently if the tool were available.

## Wheelchair Users Need Information That Does Not Exist

For wheelchair users, the navigation problem is less about wayfinding and more about knowing whether a destination is physically accessible before arriving — information that current systems do not reliably provide.

Chi et al. [2023] conducted the first user research with people with limited mobility on using virtual tours to remotely assess indoor accessibility. Fourteen wheelchair users annotated 489 accessibility concerns across four scanned environments, identifying both stationary configurations (wall heights, corridor widths) and dynamic configurations (how doors open, range of motion required). Virtual tours scored higher than both in-person assessment and photo assessment on feasibility. But participants identified critical gaps: physical properties like object weight, surface textures, and the force required to open doors cannot be conveyed visually.

Pei et al. [2023] built Embodied Exploration, a VR system where wheelchair users assess environments through personalised avatars encoding their wheelchair width, armrest height, and seated eye height. Participants could feel their virtual wheelchair scraping against furniture and check clearances. One participant noted he was "confident that my legs would not fit under the table" when his virtual armrest visibly collided with the table edge. The system achieved the highest confidence scores (6.68/7) compared to photos (5.95) and virtual tours (6.35). The core insight: accessibility is deeply personal — two wheelchair users with different chairs may reach opposite conclusions about the same environment.

Yildiz et al. [2024] documented the navigation challenges of relocating internationally with a mobility disability and found that housing platform filters reduce accessibility to a binary wheelchair-focused category, failing to represent the diversity of access needs. The author suggests customisable filters listing specific features — elevators, handle types, counter heights — rather than a single "accessible" checkbox.

## Navigation Is Social, Not Just Technical

A recurring finding challenges the assumption that navigation technology should aim for individual independence.

Kameswaran et al. [2024] studied how people with visual impairments navigate indoor environments in India and found that help-seeking was not a last resort but a primary and skilled practice. Participants described reading social cues to identify willing helpers, managing helpers' behaviour, and strategically choosing when to accept or decline help based on trust, safety, and social dynamics. The paper challenges Western-centric assumptions that frame independence as the primary goal of assistive technology, arguing that help should be understood as a "skilled, socially constructed practice" rather than a deficit.

Nagraj et al. [2021] studied 14 blind navigators in Bangalore and found that the white cane remained the dominant and most trusted navigational tool, far outweighing any digital technology. A striking finding was the practice of "interlocking" — groups of blind individuals linking arms to navigate together, combining one person's route knowledge with another's obstacle detection — a collaborative strategy that no individual app could replicate. Technology played a smaller role than in comparable high-income country studies due to cost barriers, language barriers in English-centric apps, and incomplete mapping data.

Bandukda et al. [2020] studied blind and partially sighted people's experiences with outdoor leisure activities and found that participants relied heavily on sighted companions to research destinations, expressing frustration at being excluded from decision-making. The PLACES framework they developed reframes blind people as active contributors to planning rather than passive recipients of assistance.

Bandukda et al. [2021] examined how orientation and mobility training shapes self-efficacy and found it is not a static outcome but an evolving belief shaped by life transitions — deteriorating vision, moving to new environments, becoming parents. This challenges navigation technology that assumes a fixed baseline of ability and confidence.

## Orientation and Mobility Training in Different Contexts

Research from India highlights how O&M training and navigation function differently outside high-income settings.

Asave et al. [2024] studied 12 O&M trainers across urban and rural India and found they fulfilled roles far beyond instruction — simultaneously serving as educators, counsellors, advocates, and resource identifiers. A significant portion of their work involved combating social stigma, particularly in rural areas where families sometimes resist sending children with visual impairments for training. Trainers in rural areas adopted creative, context-appropriate strategies: using farm objects as training landmarks, teaching children to navigate by the sound of water in agricultural channels. The paper reports that navigation apps requiring accurate GPS, reliable internet, and English interfaces are largely unusable for their clients.

Hong and Coughlan [2024] compared VR training against verbal instructions for teaching blind people to use a walk-light detector app at traffic intersections. Both groups achieved similar detection accuracy, but the VR group developed deeper understanding of camera manipulation — they moved cameras more slowly and maintained better orientation after initial detection. However, the VR training was perceived as harder because the virtual environment lacked real-world cues like traffic sounds and ground textures.

## Navigating Information, Not Just Space

Several papers extend the concept of wayfinding beyond physical movement to information navigation.

Mohanbabu et al. [2025] built Task Mode, a Chrome extension that uses GPT-4o to dynamically filter web content based on user-specified goals. Screen reader users completed tasks 52% faster with Task Mode (mean 102 seconds versus 211 seconds), and the task completion time gap between screen reader users and sighted users decreased from 2x to 1.2x. The approach addresses a fundamental disparity: sighted users can visually skim a webpage in seconds, while screen reader users must navigate sequentially through all elements.

Jordan et al. [2024] developed five personas representing the diverse range of screen reader experiences, challenging the assumption that screen reader users form a homogeneous group. Power users employ dozens of keyboard shortcuts and navigate by headings and landmarks, while other users navigate almost exclusively by tabbing through links and reading linearly — missing content that is not directly in the tab order. The personas reveal that screen reader proficiency exists on a wide spectrum driven by age of vision loss, formal training, and cognitive style.

Karimi et al. [2023] studied the under-explored practice of texting while walking outdoors by people who are blind and visually impaired and identified nine types of situational information they need simultaneously — location, landmarks, obstacles, bus schedule, ETA, distance, weather, unfamiliar sounds, and traffic — demonstrating the cognitive load of combining communication and navigation.

## Deafblind Navigation: When Both Primary Senses Are Absent

Gay et al. [2020] presented a haptic wearable vest for people with deafblindness — conveying directional cues through vibration motors at the waist, proximity through vibration frequency, and semantic commands through tapping motors on the shoulders. Five individuals with deafblindness completed an indoor navigation route without human assistance. One participant said the vest enabled them to "navigate confidently in a new environment for the first time without the direct support of another person." The hands-free design is critical: deafblind users need their hands for canes, guide dogs, or communicating through tactile sign language.

Nasser et al. [2020] explored thermal feedback through a white-cane grip — using hot and cold sensations rather than vibration for directional cues — and found cold stimuli were perceived significantly more accurately and quickly than warm stimuli across all grip positions. The approach addresses a real limitation of vibrotactile feedback: the physical turbulence from tapping a cane on the ground can mask vibration signals.

## What the Research Keeps Finding

Across outdoor travel, indoor wayfinding, transit, museums, housing, and information navigation, several findings recur.

**The data does not exist.** Of 178 US cities, only 34% include sidewalk information in their open data [Froehlich et al., 2022]. No transit authority provides historical elevator outage data [Sharif et al., 2022]. No large-scale assessment of disability parking has been conducted [Hwang et al., 2025]. Housing platforms reduce accessibility to a single checkbox [Yildiz et al., 2024]. Accessible navigation depends on accessible information, and that information is systematically absent.

**No single tool works.** Users combine multiple technologies for different stages of travel [Kameswaran et al., 2020; Zeidieh, 2024], and AI navigation aids work best as consultation tools at deliberate moments rather than continuous assistance [Zeidieh & Seo, 2025]. Systems designed for one disability often fail at intersections — elevators serve wheelchair users but their status information serves nobody if it is not publicly available.

**Navigation is social.** Help-seeking is a skilled practice, not a failure of independence [Kameswaran et al., 2024]. Blind travellers navigate in groups through interlocking [Nagraj et al., 2021]. Pre-visit information sharing, companion planning, and staff training shape the navigation experience as much as any app.

**Context determines everything.** Navigation apps designed in well-maintained Western cities do not transfer to Indian cities where footpaths are non-existent and GPS is unreliable [Nagraj et al., 2021; Asave et al., 2024]. A system that works for a totally blind user may not serve someone with residual vision, who falls between sighted infrastructure and blindness services [Cassidy & Branham, 2024]. And self-efficacy — the confidence to navigate — fluctuates with life transitions, fatigue, and environmental complexity [Bandukda et al., 2021].

**Accessibility is personal.** Two wheelchair users may reach opposite conclusions about the same environment [Chi et al., 2023; Pei et al., 2023]. Five screen reader users may employ five fundamentally different navigation strategies [Jordan et al., 2024]. The research consistently shows that fixed accessibility categories — "wheelchair accessible," "screen reader compatible" — are too coarse to capture individual needs, and that customisation and personalisation are not luxuries but necessities.

---

*This article draws on 64 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2020 and 2025.*
