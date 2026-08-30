---
title: 'The Right to Shape Sound: How Accessibility Research Is Rethinking Music Composition and Performance'
publishedAt: '2026-05-06'
tags: []
---

# The Right to Shape Sound: How Accessibility Research Is Rethinking Music Composition and Performance

## Music is an inherently aural art form — so why is music technology so deeply inaccessible, and what does the research say about changing that?

Music should be one of the most accessible creative domains. It is fundamentally about sound, not sight. Yet the tools used to compose, produce, notate, learn, and perform music have become overwhelmingly visual. Digital audio workstations display waveforms, EQ curves, and mixing boards as graphical interfaces. Sheet music is a visual notation system. Music education relies on watching a teacher's hands. And performance increasingly involves lighting, staging, and visual media that assume a sighted, hearing audience.

The result is a paradox that the research documents clearly: an art form built on sound has been made inaccessible to the very people — blind musicians, deaf performers, people with motor impairments — whose relationship to sound and embodiment could transform it.

This article examines what researchers have found across 29 peer-reviewed papers on music, composition, and performance accessibility. The work reveals creative ingenuity from disabled musicians that far outpaces what the technology industry provides, and a growing body of evidence about what accessible music-making could look like.

## The Software Landscape Is Bleak

The most comprehensive picture of what blind and visually impaired musicians face comes from Payne et al. [2020], who interviewed 11 blind and visually impaired composers, producers, and songwriters. Their finding is stark: only 3 of 83 reviewed accessible digital musical instruments target visual impairments. Products like Dancing Dots' Sonar and Lime lag behind mainstream alternatives in features, often require specific (and sometimes outdated) operating systems and screen readers, and cannot keep pace with the rapid update cycles of mainstream DAWs.

Screen reader support varies dramatically across DAWs. Pro Tools and Logic offer native support, while REAPER requires community-developed accessibility scripts (OSARA) [Saha & Piper, 2020]. Even when interfaces are technically screen-reader-readable, they fail to provide the speed and efficiency needed for professional work. Saha and Piper [2020] describe the challenge of comparing audio levels across 70 tracks sequentially through screen reader announcements versus the instant visual overview a sighted producer gets from a mixing board display. Participants described "hitting expressive ceilings where accessibility features could not cover all use cases" [Payne et al., 2020].

Sighted assistance remains a near-universal requirement. Blind composers preparing visual scores need sighted collaborators for layout decisions. Producers need help with visual mixing interfaces. Even screen-reader-proficient musicians encounter workflows — like spatial audio panning or visual EQ adjustment — where no non-visual alternative exists [Payne et al., 2020; Saha & Piper, 2020].

A systematic literature review of 54 papers on music technology for BLV people [Zhang et al., 2025] confirmed these gaps and organised existing work into six categories: music notation, music composition, music education, music performance, music listening, and multi-purpose systems. The review found that research attention has focused primarily on notation and listening, with significantly less work on the embodied, interactive processes of learning, performing, and producing.

## The Audio Channel Conflict

One of the most specific and underappreciated barriers in accessible music production is that screen readers deliver information through audio — the same channel through which musicians listen to their work. Karpodini [2022] described this as a fundamental conflict: screen readers overlap with audio content, causing cognitive overload during the precise moments when a producer needs to hear their mix most clearly.

Karpodini et al. [2025] tested vibrotactile feedback patterns (Tactons) as an alternative for conveying equaliser settings. Six blind and visually impaired music producers compared three methods: screen reader alone, screen reader with haptics, and haptics alone. All three achieved recognition accuracy above 94% with no significant difference. But haptics alone received an "Excellent" SUS usability score (90.28) compared to "Good" for the screen reader methods (72.55 and 74.17). All six participants expressed strong positive preference for haptics, describing the audio channel freedom as transformative for their workflow. One participant noted: "I can listen to the music while I'm reading the EQ — I couldn't do that before."

The finding has implications beyond music. Any domain where blind users need to simultaneously monitor audio content and receive interface feedback — video editing, podcasting, audio engineering — faces the same channel conflict.

## Composing Without Seeing the Score

Commercial notation software relies on graphical interfaces and produces only visual print scores, creating a double barrier: blind musicians cannot use the tools, and they cannot share their compositions with sighted performers in the format performers expect.

Payne et al. [2022] built SoundCells, a text-based music notation web application, and conducted a six-week study with six blind and visually impaired musicians who used it to compose original works culminating in a live professional performance. SoundCells uses ABC text — an ASCII-based notation syntax — as input and simultaneously generates braille music, MIDI playback, and standard visual print scores. All six participants successfully composed original music despite diverse backgrounds. Participants engaged deeply with multiple output modalities in complementary ways: music playback for real-time verification, braille displays for navigation and tracking position in complex scores, text-to-speech for error identification, and one low-vision participant used the visual score display for confirmation.

The emotional impact was notable: participants described feelings of pride, independence, and creative fulfilment at composing and hearing professional performances of their own work — experiences many had not previously been able to access [Payne et al., 2022].

Payne and An [2025] investigated the distinct challenges facing low vision musicians — who fall between sighted print readers and braille music users. No single notation solution works for this population. Most participants used mainstream score-reading apps (particularly forScore) on tablets, adapting standard PDFs through pinch-to-zoom, contrast adjustment, and colour annotation. The forScore Reflow feature, which reformats sheet music into a continuous scrollable line, was described by one participant as a "game-changer." Creating true Modified Stave Notation (MSN) — enlarged notation with colour-coded elements and simplified layouts — is extremely laborious, with one TVI estimating it can take an hour per page. The research reveals that access barriers extend beyond the score itself into physical performance contexts: dark rehearsal rooms, light-coloured music stands, and the social pressure to not use devices on stage.

## Learning Music Through Touch

The question of how blind and low-vision people learn to play instruments — not just read scores — has received increasing attention.

Lu [2022] outlined a research programme investigating how wearable technologies with vibrotactile feedback can support BLV music learners, motivated by findings that many music teachers feel underprepared to teach BLV students — lacking knowledge of sight conditions, learning processes, and accessibility technologies.

Lu et al. [2023] conducted co-design workshops with 10 BLV music teachers and learners at the FMDG Music School in New York, including two deafblind participants. They identified three categories of vibrotactile feedback applications. Vibrotactile alerts could signal when to start and stop playing, indicate whose turn it is during improvisation, and allow teachers to discreetly correct students without interrupting the music. Variations in intensity and pattern could communicate musical concepts like dynamics and articulation. And feedback placed near body parts involved in producing sound could support technical guidance, such as teaching fingering patterns.

Material aesthetics emerged as genuinely important — not a secondary concern. Sound dampening was critical because vibration motors produce buzzing noise that interferes with music. Breathability and malleability affected willingness to wear devices during extended practice. The finding that material experiences evoke positive emotions which increase long-term engagement challenges the "purely functional approach that dominates AT design" [Lu et al., 2023].

Lu et al. [2024] went further, exploring how multimodal assistive technologies combining sound, vibration, and touch can improve music reading and memorisation. They found that matching specific modalities to specific types of complexity worked best: vibrations for tempo and dynamics (temporal information), audio for pitch and chords (musical content), and touch for navigation within scores (structural information). The paper introduced the term "mnemonic anchors" — sensory elements that help musicians build memory around musical passages — and found participants wanted the ability to customise which modalities conveyed which information.

Anken et al. [2025] built XRMusic4VIP, an extended reality system that addresses the specific challenge of simultaneously reading sheet music and playing keyboard instruments. Using Meta Quest 3 in AR passthrough mode, virtual sheet music appears as a continuous scrolling band above a real keyboard. One participant said: "It could make playing the piano fun again. Honestly, I had given up because you had to learn everything by heart." Customisability of the display was the highest-rated feature (M=4.63/5).

## Dance as Accessible Music

Music and movement are inseparable, and research is beginning to address how dance — the physical expression of music — can be made accessible.

Silva et al. [2025] built a multi-sensory system combining spatialised audio and haptic feedback to support contemporary dance learning for BLV people. The system uses motion tracking to compare teacher and student hand positions, providing real-time corrective feedback through spatial sound (panning to indicate direction) and vibration (intensity increasing as hands diverge). BLV dancers developed personal strategies for engaging with feedback — some prioritised sound for orientation and used haptics for confirmation, others reversed the approach. Teachers reported the system gave them "instructional freedom" by reducing the need to explain everything verbally.

Barbareschi and Inakage [2022] interviewed 17 wheelchair-using artists across seven countries, including dancers, musicians, and DJs. A key finding: the transition to wheelchair use, initially resisted due to self-stigma, was ultimately experienced as freedom — and in some cases generated unique creative capabilities. Dancers described choreographic possibilities that exist only because of the wheelchair, not despite it. Musicians and DJs who modified their wheelchairs with instrument mounts and performance equipment viewed these adaptations not as compensating for loss but as creating something new.

## When the Musician Cannot Hear

Deaf and hard-of-hearing musicians' relationship with music is fundamentally different from hearing musicians' — but it is a relationship, not an absence.

Cavdir et al. [2025] documented 15 months of technology-mediated music performance by a mixed-hearing team at CymaSpace, a Deaf-owned music and culture institution in Portland, Oregon. The team — comprising Deaf, Hard of Hearing, Deaf/Blind, and hearing members — developed custom technologies including audio-reactive LED systems embedded in instruments and wearable 3D-printed masks that map frequency and amplitude to light and colour, vibrotactile vests that let musicians feel individual instrument signals on their bodies, and a glove-based controller (GeLu) designed to complement rather than interfere with sign language.

The study defines "sonic agency" as the right and ability to shape sound regardless of whether one can hear it — a concept that reframes musical accessibility from passive consumption to active creation. Three key challenges emerged: misalignment of musical expectations between hearing and Deaf co-performers, unfamiliarity with abstract musical concepts like tempo and time signatures among Deaf musicians who lacked early music education, and limitations of existing technologies not designed by or for DHH musicians. In response, the team developed strategies including prioritising Deaf-composed music, returning to somatic approaches like heartbeat-based rhythms, and using graphic scores as accessible documentation [Cavdir et al., 2025].

Iijima et al. [2022] explored how DHH people could play musical instruments through smartphones using whole-body gestures. A gesture elicitation study with 11 DHH participants found that gestures most participants found natural also had the highest agreement rates, and that spending more time designing a gesture correlated with it being rated easier to use — suggesting deliberation improves quality.

## Performing with a Body That Changes

The most striking paper in this collection may be the Brain Body Jockey project [Barbareschi et al., 2024], which documents a collaboration between a professional VDJ with advanced ALS and a team of researchers to create brain-controlled robotic arms for live music performance. The artist, who had lost nearly all mobility, composes and performs music using a gaze-based interface. The robotic arms were not designed to compensate for lost function but to extend the artist's body and enhance stage presence.

All 13 interviewed audience members described experiencing a feeling of fusion and connection, with 11 linking their own body movements to the robotic arm gestures. The artist described the arms as extensions of his body. The paper introduces the concept of "relative virtuosity" — the idea that artistic mastery cannot be separated from the specific body through which it is expressed. A musician performing through brain-controlled robotic arms is not a diminished version of an able-bodied performer; they are a different kind of performer, with different expressive possibilities [Barbareschi et al., 2024].

Ilsar and Kenning [2020] demonstrated that existing digital musical instruments can be rapidly adapted for inclusive music-making through thoughtful mapping rather than ground-up redesign. The AirSticks — gestural controllers designed for expert percussionists — were adapted for Alessio, a teenage boy with leukodystrophy, by limiting all buttons to trigger the same note initially, then progressively introducing complexity. Within one session, he progressed to performing publicly. For Peter, who lives with advanced dementia, the same controllers were adjusted so that any movement produced a pleasing sound, enabling musical interaction when other forms of communication had become difficult.

Ragone [2020] built OSMoSIS, an interactive system that maps body movements to musical sounds through motion capture, enabling children with autism to engage with music therapy without needing to touch any physical instrument. Children displayed notable increases in engagement when the sonification system was activated, and some spontaneously composed movement sequences to explore sound patterns.

## Disabled Creatives as Sophisticated Users

Several papers examine how disabled musicians and artists relate to creative tools more broadly, revealing practices that challenge assumptions about what disabled users need.

Bennett et al. [2024] interviewed 10 disabled creatives including musicians and found a rich ecosystem of access hacks: a musician who developed keyboard macros to compensate for limited hand dexterity, audio engineers who memorised entire mixing board layouts to compensate for inaccessible visual interfaces. When adopting generative AI, participants used it in targeted ways but drew firm boundaries — describing AI-generated work that bypassed their embodied process as "not really mine."

Brody et al. [2025] studied 12 artists with disabilities across media including music and found that they viewed tools as "interdependent relations" rather than isolated instruments. Wheelchairs, human assistants, and community networks were considered creative tools as fundamental as cameras or paintbrushes. Participants rejected the notion of "adapting" tools for disabilities, describing modifications as tinkering and creative expression rooted in crip maker traditions.

Zhang et al. [2023] surveyed 165 BLV content creators and found high interest in music and audio creation across all vision levels, with the key barriers being inaccessible creation tools and societal bias that questioned whether BLV people could or should produce creative content. Participants described needing sighted assistance for tasks that tools should handle independently — evaluating visual aspects of content, navigating multi-layer menus, and producing output in formats that sighted collaborators expect.

## What the Research Points Toward

Across these 29 papers, several findings are consistent.

**The tools are the barrier, not the art form.** Music is inherently multisensory — it involves sound, touch, movement, timing, and emotion. The visual dominance of music technology is a design choice, not a necessity. When researchers build alternatives — vibrotactile feedback for EQ settings [Karpodini et al., 2025], text-based composition [Payne et al., 2022], AR sheet music [Anken et al., 2025], brain-controlled performance [Barbareschi et al., 2024] — disabled musicians use them effectively and enthusiastically.

**Multimodal is better than unimodal.** The most valued systems provide multiple channels of feedback and let users choose which to use. Sound for pitch, vibration for tempo, touch for navigation — matched to what each modality conveys best [Lu et al., 2024]. Haptics alone can match screen reader accuracy while freeing the audio channel for actual music [Karpodini et al., 2025].

**Material and aesthetic quality matters.** Wearable music technology that buzzes audibly, feels uncomfortable, or looks clinical will not be worn during performance [Lu et al., 2023]. Disabled artists care about the aesthetic quality of their tools, not just their function [Brody et al., 2025]. This challenges the "functional first, aesthetics later" approach that dominates assistive technology design.

**Community-designed technology outperforms external design.** DHH musicians building their own instruments at CymaSpace [Cavdir et al., 2025], blind engineers contributing accessibility scripts for REAPER [Saha & Piper, 2020], wheelchair-using dancers creating choreographic possibilities that exist only because of the chair [Barbareschi & Inakage, 2022] — the research consistently shows that disabled musicians are not passive recipients of access but active agents whose creative practices should drive design.

**The distinction between compensating and creating matters.** Brain-controlled robotic arms are not a diminished form of performance — they are a different form [Barbareschi et al., 2024]. Deaf-composed music using heartbeat-based rhythms is not an adaptation of hearing music — it is its own thing [Cavdir et al., 2025]. The most productive framing is not "how do we make existing music tools accessible?" but "what new forms of music-making become possible when disabled musicians lead?"

---

*This article draws on 29 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2020 and 2025.*
