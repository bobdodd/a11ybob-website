---
title: 'Machine Learning and Digital Accessibility: What Works, What Fails, and What Gets Lost in Between'
publishedAt: '2026-05-06'
tags: []
---

# Machine Learning and Digital Accessibility: What Works, What Fails, and What Gets Lost in Between

## AI is simultaneously the most promising tool and the most documented source of harm in recent accessibility research — and the papers reveal exactly where the boundaries fall

Machine learning has entered every corner of digital accessibility. It powers the image descriptions that blind people receive on their phones, the automatic captions that deaf people read in meetings, the speech recognition that voice interface users depend on, the computer vision that detects curb ramps and disability parking spaces, and the large language models that neurodivergent students use to scaffold their executive function. It also fabricates content in image descriptions that blind users cannot verify, reproduces ableist stereotypes in chatbot advice, homogenises personalised communication tools, and systematically excludes people whose bodies, speech, or behaviour fall outside its training data.

This article examines what researchers have found across approximately 235 peer-reviewed papers on machine learning and AI in accessibility, published between 2020 and 2025. The work reveals a technology that is genuinely useful in specific, documented ways — and genuinely harmful in specific, documented ways. The challenge for practitioners is that the same system can be both.

## The Fairness Landscape

Three foundational papers from 2020 mapped the terrain of AI fairness and disability before the generative AI wave arrived.

Guo et al. [2020] produced the most comprehensive risk assessment to date, organising analysis across five AI domains. In computer vision, face recognition may fail for people with Down syndrome or achondroplasia; body recognition may not work for wheelchair users or people with atypical posture — with life-threatening implications if self-driving vehicles cannot detect them. In speech recognition, atypical speech patterns from deaf speakers, people with dysarthria, or those who stutter are systematically excluded from training data. In text processing, simplified language for people with cognitive disabilities may be mistranslated or misclassified. The paper identifies five categories of harm: quality of service degradation, allocation harms (hiring systems filtering out disabled applicants), denigration (flagging disabled users as outliers), stereotyping, and over- or under-representation. A critical technical insight: outlier detection algorithms, used in fraud detection, CAPTCHAs, and crowd-work quality control, systematically disadvantage anyone whose behaviour patterns fall outside statistical norms — which describes many disabled people by definition.

Findlater et al. [2020] examined AI systems that augment sensory abilities and identified a fundamental problem: the training data and internal models are inherently inaccessible to their target users. A blind person cannot visually inspect what an image classifier sees. A deaf person cannot listen to what a sound classifier hears. This creates a dangerous trust dynamic, compounded by layered decision-making — who decides what labels to use in training data, what information to convey, and how to frame it — where disabled users have little visibility or influence.

Kafle et al. [2020] grounded AI fairness in years of building systems for DHH users and found that standard evaluation metrics misalign with disabled users' needs. Word Error Rate — the standard metric for automatic speech recognition — correlated poorly with DHH users' actual comprehension and satisfaction. They also documented a behavioural feedback loop: when ASR-based captioning was deployed in conversations, hearing speakers changed their speech patterns — speaking louder, faster, with non-standard articulation — potentially degrading the very system designed to help. And they warned that AI creates new "ability requirements": to use a voice assistant you must produce recognisable speech, to be detected by autonomous vehicles you must look like a typical pedestrian, to pass AI interview screening you must produce expected facial expressions.

## Documenting Harm at Scale

Venkatasubramanian et al. [2025] searched eight publicly available AI incident databases — containing over 17,700 entries — and extracted 79 documented incidents where AI systems produced negative outcomes for people with disabilities. The resulting taxonomy identifies nine categories of harm:

**Denying vital resources** was the most common (37 incidents), spanning welfare and social services, technology access, and employment. Examples include Medicaid resource allocation models found arbitrary in multiple US states, HireVue screening out candidates with disabilities via facial analysis, and accessibility features being removed from platforms. **Producing inaccurate outputs** (21 incidents) included captioning errors, incorrect image descriptions, and autonomous vehicle failures. **Surveillance or privacy violations** (14 incidents) documented automated emotion recognition in classrooms targeting autistic students and data harvesting from disability-specific platforms. Other categories included perpetuating stereotypes, biased decision-making, reducing autonomy, causing physical harm, creating emotional distress, and enabling exploitation.

The taxonomy reveals that AI harms to disabled people are not hypothetical — they are documented, recurring, and concentrated in systems that control access to resources, employment, and services.

## What AI Gets Right: Specific, Documented Successes

The research also documents genuine utility — specific systems that measurably improve accessibility in specific contexts.

**Captioning and transcription.** Wu et al. [2025] built CARTGPT, combining human CART captioning with GPT-4 to detect and correct errors in real time. It achieved 89.0% word accuracy compared to 83.4% for standard CART — a 5.6% improvement most pronounced for technical content. The system augments rather than replaces human captioners, using AI to catch the errors that time pressure makes inevitable.

**Web navigation.** Mohanbabu et al. [2025] built Task Mode, a Chrome extension using GPT-4o to dynamically filter web content based on user goals. Screen reader users completed tasks 52% faster (mean 102 seconds versus 211 seconds), and the task completion gap between screen reader and sighted users decreased from 2x to 1.2x. Yu et al. [2025] used generative AI to automatically restructure e-commerce HTML for screen readers, reducing Level A WCAG violations from 16 to 1 on Amazon product pages.

**Audio description.** Cheema et al. [2025] built DescribePro, pairing human audio describers with AI-generated baseline descriptions. Novice describers found AI baselines more helpful than professionals did — suggesting AI's primary value is lowering the barrier to entry, not replacing expertise. Shen et al. [2024] built EasyAD, reducing total audio description production time by nearly 50% through automated speech gap detection (85% faster) and dubbing integration (90% faster).

**Image descriptions.** Mohanbabu and Pavel [2024] demonstrated that context-aware image descriptions — which consider the surrounding webpage context, not just the image in isolation — were significantly preferred by BLV users across all quality measures. The same photograph needs different descriptions depending on whether it appears on a company page, a fashion site, or a news article.

**Data visualisation.** Sharif et al. [2023] improved the VoxLens tool to the point where screen-reader users achieved 5.6% higher accuracy than sighted users without tools — closing 62% of the performance gap. Seo et al. [2024] integrated LLMs into the MAIDR data visualisation framework, finding that AI chat complemented sonification and data tables by providing natural language explanations of statistical patterns.

**Speech recognition for atypical speech.** Takashima et al. [2024] showed that self-supervised pre-training on unlabeled disordered speech data reduced phoneme error rates from 30-73% (baseline trained only on typical speech) to 4-13% — approaching the 2-3% achieved for typical speech. The method requires only unlabeled recordings, which are far easier to collect than transcribed data from people with speech disorders.

**Built environment assessment.** Su et al. [2023] built RASSAR, using iPhone LiDAR and computer vision to scan rooms for accessibility issues in 106 seconds compared to 10 minutes for manual auditing. Hwang et al. [2025] applied computer vision to aerial imagery to detect disability parking at scale — the first large-scale assessment despite decades of ADA mandates.

**Cognitive support.** Moore [2025] documented how generative AI tools function as effective executive function support for ADHD — not because they were designed for this purpose, but because conversational scaffolding, step-by-step guidance, and patient repetition align naturally with cognitive accessibility needs. Neurodivergent students described AI as a brainstorming partner, writing tutor, study companion, and administrative assistant [Jamshed et al., 2025].

## What AI Gets Wrong: Specific, Documented Failures

The failures are equally specific and equally documented.

**Overconfident fabrication.** Chen et al. [2025] showed that multimodal LLMs produce fluent, confident image descriptions that fabricate content blind users cannot verify. When they surfaced variations by asking the same model to describe the same image multiple times, users' ability to identify unreliable claims increased by 4.9 times (mean 2.62 claims identified versus 0.53, p < 0.001). Single AI descriptions decreased trust appropriately — but only when users could see that the AI contradicted itself.

**Neurotypical bias.** Hall et al. [2025] analysed 348 chat logs from a GPT-4-powered career chatbot for neurodivergent job-seekers and found systematic misalignment. The chatbot fabricated qualifications, imposed neurotypically-coded language ("thrives in fast-paced environments"), and produced cover letters that misrepresented users' skills. Some users internalised the AI's inauthentic portrayal, believing it reflected their own inadequacy. Haroon et al. [2025] built NeuroBridge to address the inverse problem — training neurotypical people to understand autistic communication — but the finding that AI career tools default to neurotypical norms is a cautionary tale.

**Homogenisation.** Zastudil et al. [2025] found that AI-generated suggestions for visual scene displays (AAC communication tools) homogenised designs across users. Participants configured VSDs 17% faster with AI, but 61.8% of AI suggestions were used without modification, and the AI drew from a narrower conceptual range than human creators. For AAC devices, which are effective precisely because they are personalised, homogenisation undermines the technology's purpose.

**Age bias.** Dewan et al. [2025] administered 1,648 age-bias prompts to ChatGPT and found systematic stereotyping. Technology proficiency stereotypes were most prevalent (175 responses), portraying older adults as "old-timers" who are "overwhelmed" by technology. Cognitive and physical decline stereotypes appeared in 104 responses, associating older adults with being forgetful and "struggling with simple tasks."

**Live video failures.** Chang et al. [2025] evaluated ChatGPT's Advanced Voice with Video feature with eight BVI participants and found it could not provide live descriptions of dynamic scenes despite claiming it could. It processed individual frames, not continuous video, missing spatial context and temporal changes. Sycophantic behaviour emerged: when participants challenged a correct answer, the model sometimes reversed itself, eroding trust in accurate responses.

**Inaccessible code generation.** Two studies examined whether LLMs generate accessible code. Gurita and Vatavu [2025] found that accessibility-agnostic prompts produced code with 58% violation rates. Accessibility-oriented prompts reduced this to 19% — a significant improvement but far from reliable. Aljedaani et al. [2025] tested three LLMs on Android mobile accessibility and found none detected more than 38% of violations identified by automated scanning tools. Code-level fixes were often incorrect: GPT identified the right fix description 68% of the time but generated correctly compilable fixes for only 54%.

## The Human-AI Collaboration Pattern

The most consistent finding across the research is that AI works best when paired with human judgment rather than deployed autonomously.

DescribePro pairs human describers with AI baselines [Cheema et al., 2025]. CARTGPT augments human captioners with AI error correction [Wu et al., 2025]. CapTune lets human caption creators define boundaries within which AI generates variations [Huang et al., 2025]. AccessGuru combines traditional automated testing with LLM-based remediation [Fathallah et al., 2025]. In each case, the human provides quality, nuance, and accountability; the AI provides speed, scale, and consistency.

The pattern breaks down when AI is deployed without human oversight. The career chatbot fabricating qualifications [Hall et al., 2025], the image description confidently producing false content [Chen et al., 2025], the AAC tool homogenising personalised communication [Zastudil et al., 2025] — these failures occur when AI output reaches users without intermediate human verification.

Jamshed et al. [2025] found that neurodivergent students applied a complementary form of human oversight: they used AI output as a starting point but applied their own judgment, editing AI suggestions rather than accepting them wholesale. The students who used AI most effectively were those who treated it as a collaborative tool rather than an authority — but the research also documents that some users, particularly those who are less confident, may lack the critical distance to question AI outputs.

## The Metrics Problem

A recurring finding is that standard AI metrics do not measure what matters for disabled users.

Word Error Rate correlates poorly with DHH comprehension [Kafle et al., 2020]. Participant demographics explain more evaluation variance than technology quality in sign language animation studies [Kacorri et al., 2017]. BLEU scores for sign language translation capture lexical overlap but not whether the translation conveys the spatial and grammatical nuances that make signed communication meaningful [Ahmed, 2025]. Phoneme error rates for speech recognition do not predict whether a voice interface will actually work for a person with dysarthria in a noisy kitchen.

The gap between what AI research measures and what disabled users experience creates a systematic misalignment: systems that perform well on benchmarks may fail in practice, and the people who can identify the gap — disabled users — are often excluded from evaluation.

## AI and the Built Environment

Machine learning is increasingly applied to physical-world accessibility assessment, where the scale of manual auditing makes automation essential.

Froehlich et al. [2022] documented that of 178 US cities, only 34% included sidewalk information in open data, and that Seattle's first comprehensive sidewalk audit cost $400,000. Project Sidewalk has collected over 500,000 crowdsourced accessibility labels, and ML models trained on this data can now automate barrier detection at city scale. Su et al. [2023] applied computer vision to indoor accessibility scanning, reducing assessment time from 10 minutes to 106 seconds per room. Hwang et al. [2025] used aerial imagery to detect disability parking — a problem no one had previously measured at scale.

Gamage et al. [2024] revealed that 110 vision-based assistive technology papers virtually none addressed cerebral visual impairment, despite CVI being the leading cause of childhood visual impairment in developed countries. The review found that standard vision-enhancement techniques like magnification — the dominant approach in vision-based AT — may be counterproductive for CVI because the problem is neurological, not optical. The finding illustrates a broader pattern: ML systems built on assumptions about one population may not transfer to another, even when both populations fall under the same broad category of "visual impairment."

## The Training Data Problem

Several papers document how training data shapes — and limits — what ML systems can do for disabled users.

Guo et al. [2020] noted that ASR training data excludes DHH voices, causing recognition failures for deaf speakers. Takashima et al. [2024] showed that collecting labeled data from people with speech disorders is "extremely resource-intensive," motivating their self-supervised approach using unlabeled recordings. Bragg et al. [2020] found that 93% of deaf participants had privacy concerns about contributing sign language video data, and that visual filters protecting identity also degraded the features ML models need.

Kamikubo et al. [2022] conducted a meta-analysis of 190 accessibility datasets and found that gender skewed 60.1% male, and race and ethnicity data was absent from 84.2% — making it impossible to assess whether ML systems trained on these datasets work equally well across demographic groups. The finding applies to every ML-powered accessibility tool: if the training data does not represent the population, the system's performance for underrepresented groups is unknown.

Kezar et al. [2023] demonstrated the positive alternative: the Sem-Lex Benchmark, containing 84,000 ethically sourced sign language videos with informed consent, showed that incorporating linguistic knowledge (phonological features) improved recognition accuracy — demonstrating that community-involved, linguistically-informed data collection produces better ML models, not just more ethical ones.

## Automated Accessibility Testing

AI is being applied to the compliance side of accessibility — detecting and repairing WCAG violations in web and mobile content.

Fathallah et al. [2025] built AccessGuru, combining traditional testing tools with GPT-4, achieving an 84% violation score decrease and resolving 96% of semantic violations — the type that automated scanners historically cannot detect. Lim et al. [2020] documented Singapore's approach to government e-service testing, finding that the most critical barriers were missing form labels, lack of page-change notifications, and inaccessible CAPTCHAs.

Gurita and Vatavu [2025] found that explicit WCAG requirements in prompts reduced LLM code violations from 58% to 19%. Aljedaani et al. [2025] tested three LLMs on mobile accessibility and found that none detected more than 38% of violations found by automated scanners, and location-pinpointing accuracy was critically poor. Kumar et al. [2025] introduced the first expert-validated benchmark for PDF accessibility evaluation, providing a standardised basis for comparing automated and AI-based approaches.

The pattern: AI testing tools are promising complements to existing automated scanners, particularly for semantic violations, but are not yet reliable enough to replace either automated tools or manual expert review.

## What the Research Reveals

Across fairness analysis, assistive applications, documented harms, automated testing, and training data, the research converges on several findings.

**AI helps most when it augments human capacity.** The successful applications — CARTGPT augmenting captioners, DescribePro assisting audio describers, Task Mode filtering web content, VoxLens enhancing data access — pair AI speed with human judgment. The failures — chatbots fabricating qualifications, image descriptions inventing content, AAC tools homogenising designs — occur when AI operates without human oversight.

**AI creates new ability requirements.** Voice assistants require recognisable speech. Computer vision requires typical body presentation. Interview screening requires expected facial expressions. CAPTCHAs require abilities that outlier-detection algorithms penalise. Each AI-mediated interaction defines what a body must do to participate, and those definitions systematically exclude disabled people whose bodies, speech, or behaviour fall outside narrow norms [Guo et al., 2020; Kafle et al., 2020].

**Standard metrics miss what matters.** WER does not predict DHH comprehension [Kafle et al., 2020]. BLEU scores do not capture sign language nuance [Ahmed, 2025]. Benchmark accuracy does not predict real-world usability for people with disabilities. The research consistently calls for disability-specific evaluation metrics developed with and validated by disabled users.

**Training data determines the ceiling.** Systems trained without disabled people's data fail for disabled people. Systems trained on data collected without consent are ethically compromised and may be linguistically weaker [Kezar et al., 2023]. Demographic data is absent from 84% of accessibility datasets [Kamikubo et al., 2022], making bias impossible to detect, let alone correct.

**Surfacing uncertainty is better than hiding it.** When blind users see that an AI contradicts itself across multiple descriptions, they identify unreliable claims nearly five times more effectively [Chen et al., 2025]. Confidence calibration — helping users understand when to trust AI and when to question it — is a design requirement, not an optional feature.

**The harms are documented and structural.** Seventy-nine incidents across public AI incident databases show that AI harms to disabled people concentrate in systems controlling access to resources, employment, and services [Venkatasubramanian et al., 2025]. These are not bugs to be fixed but patterns that reflect whose needs are centred in AI development and whose are not.

---

*This article draws on approximately 235 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2017 and 2025.*
