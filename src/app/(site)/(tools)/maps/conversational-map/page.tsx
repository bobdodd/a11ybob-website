import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

const PHONETIC_CODES = `Matching by sound means giving every name a sound-code. The common
encoder, double metaphone, is too coarse — the codes collide:

    Yonge  ->  ANJ  ANK
    Young  ->  ANK
    Wing   ->  ANK          one code, shared by hundreds of words

A precise encoder, Beider-Morse, keeps real sound-alikes together
and lets nonsense fall away:

    Yong   ->  iank  ionk           (the misheard input)
    Yonge  ->  iank  iongi ...      shares "iank" with Yong
    Young  ->  ionk  iunk  ...      shares "ionk" with Yong
    Hong   ->  ank   onk   ...      shares nothing with Yong`;

const SEARCH_RESULT = `You are standing on Yonge Street. You say "Yonge"; speech-to-text
writes "Young". The top matches, with the sound-code and without:

    with phonetic              without (what runs today)
    ------------------------   ------------------------
    Young Drivers of Canada    Young Drivers of Canada
    Young Cafe                 Young Cafe
    Way Young Tech             Way Young Tech
  > Yonge Street               Yonge Street <
    ...                        ...

Identical order. The real word "Young" matches exactly and wins
either way; what puts Yonge on the list at all is that you are
standing on it.`;

const VOICE_FLOW = `A typed question leaves the device once:

    your words + location  ->  language model     (understands, answers)

A spoken question leaves it twice:

    your voice (audio)     ->  speech-to-text      (becomes words)
    your words + location  ->  language model`;

export default function MapsConversationalMap() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <MapsSubNav />

          <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <p>
              <small>
                <Link href="/maps">&larr; Maps</Link>
              </small>
            </p>
            <h1>Conversational map</h1>
            <p className="lede">
              The{" "}
              <Link href="/maps/context-map">Context Map</Link> gives you three
              fixed descriptions: quick, continuous, and detailed. Useful, but
              one size fits all. The Conversational map removes the buttons and
              lets you simply <em>ask</em> &mdash; in plain language, by typing
              or speaking aloud &mdash; about where you are now, or anywhere on
              the map at all.
            </p>
            <p className="muted">
              <small>
                A test, not a finished demo &mdash; the next step past the
                three-button model, being tried out and learned from.
              </small>
            </p>
          </header>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>What it is</h2>
            <p>
              A plain text box. You ask a question &mdash; &ldquo;what&rsquo;s
              near me?&rdquo;, &ldquo;is there a step-free entrance to the
              library?&rdquo;, &ldquo;how far is the CN Tower, and which
              way?&rdquo; &mdash; and it answers from the same map database
              behind the other maps. The fixed descriptions could only ever tell
              you the handful of things they were built to tell you. This lets
              you ask the question you actually have.
            </p>
            <p>
              And it is not limited to where you are standing. Because every
              named place, address and feature in the index can be looked up by
              name, you can ask about <em>anywhere</em> &mdash; what surrounds a
              station across the city, whether a park has accessible paths, how a
              neighbourhood you have never been to is laid out.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>How it works</h2>
            <p>
              Behind the text box, a language model interprets your question and
              decides what to look up &mdash; it does not invent answers, and it
              does not do the geography itself. It calls a small set of map tools
              that query the index and return the facts already worked out:
              what is near a point, what a place contains, the distance and
              direction from one spot to another. The model&rsquo;s job is to
              understand what you asked and put the answer in plain words; every
              distance and direction comes from the map, computed, not guessed.
            </p>
            <p>
              That division is deliberate. Language models are unreliable at
              spatial reasoning &mdash; distances, bearings, what lies between two
              places &mdash; so none of that is left to the model. It chooses the
              questions; the map does the measuring.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Sending your words elsewhere to answer</h2>
            <p>
              Understanding free-form questions needs a capable language model,
              and that runs as a hosted service rather than on the page. So to
              answer you, what you type &mdash; or, if you speak your question,
              the recording of your voice &mdash; together with your current
              location (when you have shared it) is sent over the internet to a
              third-party service to be processed; spoken questions go to a
              separate speech-to-text service first to be turned into words. The
              rest of the site is self-hosted and sends nothing to anyone; this
              one feature is the exception, and the notice before you start says
              so plainly. Do not type or say anything you would not want handled
              that way.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>The same map underneath</h2>
            <p>
              There is still no map to look at. The answers come from the
              OpenSearch index that powers the{" "}
              <Link href="/maps/tiled-toronto-map">tiled Toronto map</Link> and
              the <Link href="/maps/context-map">Context Map</Link> &mdash; every
              shop, crossing, bench and water&rsquo;s edge as a record with its
              position, its kind, and its accessibility detail. The index now
              reaches well beyond Toronto: it covers the whole of Canada, so the
              same question works in St.&nbsp;John&rsquo;s, Yellowknife or
              Victoria as in Cambridge.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Built on OpenStreetMap</h2>
            <p>
              All of the place data comes from{" "}
              <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, the
              crowd-sourced map of the world. Its limitations come straight
              through: a building nobody has traced is missing, a shop that
              changed hands may carry the old name. The map can only ever be as
              current and complete as the data underneath. As on the Context Map,
              it only tells you what <em>is</em> mapped &mdash; silence means
              &ldquo;not mapped&rdquo;, never &ldquo;not there&rdquo;.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>A test, not a tool</h2>
            <p>
              This is unfinished, untested software, and it says so before you
              can use it. Every time you open it you read and accept a notice
              &mdash; that it can be wrong, that it can misjudge distance or
              direction or answer incorrectly, that it sends your words and
              location to an outside service, and that it is{" "}
              <strong>not for navigation or any safety decision</strong>. Keep
              using your usual ways of getting around at all times.
            </p>
            <p className="muted">
              <small>
                You can type your question or speak it aloud and hear the answer
                read back &mdash; with clock-face directions relative to the way
                you are facing, the heading work from the Context Map carried
                straight over.
              </small>
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Try the interactive demo</h2>
            <p>
              <NewTabLink className="pill" href="/demos/conversational-map/viewer.html">
                Open the Conversational map
              </NewTabLink>
            </p>
            <p className="muted">
              <small>
                You will be asked to read and accept the notice, then to allow
                location access. It opens in its own window; close it to come
                back here.
              </small>
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s1)" } as CSSProperties}>
            <h2>Colophon</h2>
            <p>
              A colophon is the note at the back of a book about how it was
              made. Each map in this family gets one, because the decisions
              behind an accessible map &mdash; what to store, what to match,
              what to leave out &mdash; are the interesting part, and worth
              showing rather than burying. Several shaped this one: what it
              borrows from the maps before it, how you speak to it and where that
              sends your voice, why a chatbot is the interface at all, how the
              search copes when a spoken name arrives mis-spelled, and whether to
              put back the unnamed paths and buildings most maps drop.
            </p>

            <h3>Built on the maps before it</h3>
            <p>
              Open the Conversational map, ask a question aloud, and most of what
              happens around the answer is not new. The answer read out in a
              synthetic voice, the clock-face directions relative to the way you
              are facing, the screen kept awake while you listen &mdash; all of
              it is machinery lifted, almost unchanged, from the{" "}
              <Link href="/maps/context-map">Context Map</Link>. These maps are a
              family, not separate builds, and the family shares its parts.
            </p>
            <p>
              Spoken answers use the browser&rsquo;s own built-in speech, with a
              fallback: on a phone with no voice of its own &mdash; a de-Googled
              Android, say &mdash; the answer is written instead into a quiet,
              polite live region, and the reader&rsquo;s own screen reader speaks
              it. The two never sound at once. That arrangement was worked out on
              the Context Map and carried straight over. So was the compass: a
              tilt-compensated reading of the phone&rsquo;s magnetometer turns
              &ldquo;north-east&rdquo; into &ldquo;about two o&rsquo;clock&rdquo;
              &mdash; relative to where you are actually facing, which is what a
              walker needs &mdash; and that is the Context Map&rsquo;s code,
              reused whole.
            </p>
            <p>
              And the screen <strong>wake lock</strong>: ask a question and the
              phone must not lock halfway through reading you the answer, so the
              page holds the screen awake while it is open and in front of you. It
              can only do that while it is the visible tab &mdash; it cannot keep
              the screen on with the phone pocketed or locked, which would need a
              native app, and this is a web page. The same limit, and the same
              code, as the Context Map it came from.
            </p>
            <p>
              None of this is remarkable on its own. It is in the colophon because
              the reuse <em>is</em>{" "}the point: a new idea &mdash; the
              conversation &mdash; resting on settled, tested machinery rather
              than rebuilt from nothing.
            </p>

            <h3>Hearing the question, and where your voice goes</h3>
            <p>
              You can type, but you can also tap once and speak. Tapping starts
              recording; tapping again stops it; the clip is sent off to be turned
              into text; the text is shown and read back to you &mdash; so a
              mishearing is caught by ear before it is acted on &mdash; and then
              it runs exactly as if you had typed it. A short rising tone marks
              the microphone going live and a falling one marks it stopping, so a
              blind user knows the state without watching the screen.
            </p>
            <p>
              Turning speech into text is the one part the page cannot do itself.
              A language model cannot transcribe audio; speech-to-text is always a
              separate service, and here it is{" "}
              <a href="https://deepgram.com/">Deepgram</a>, a hosted one. Which
              means that when you speak your question, the recording of your voice
              leaves the device and goes to an outside company to be transcribed
              &mdash; a second outside service, on top of the model that answers.
            </p>
            <pre>
              <code>{VOICE_FLOW}</code>
            </pre>
            <p>
              Deepgram is the current choice for plain, practical reasons: the
              project already had a key, its models hold up well in noise &mdash;
              a question asked in a crowd, at a march, on a busy street &mdash;
              and being someone else&rsquo;s cloud it puts no load on the small
              server everything else here runs on. The honest preference is to run
              the speech-to-text on my own machine one day, so the audio never
              leaves at all; that needs a bigger box than the site currently sits
              on, so for now it is a hosted service &mdash; openly disclosed, and
              told to you before you start.
            </p>

            <h3>Why a chatbot is the interface</h3>
            <p>
              All of that &mdash; your words leaving the device, twice over for a
              spoken question &mdash; follows from one decision: to make a
              language-model chatbot the interface at all.
            </p>
            <p>
              The <Link href="/maps/context-map">Context Map</Link> answers with
              three fixed buttons: quick, continuous, detailed. They always work,
              they never surprise you, and &mdash; this is the part that matters
              here &mdash; they need no outside help. The descriptions are
              assembled on my own server from my own map data, and nothing about
              your question ever leaves. The price of that is that they can only
              ever tell you the handful of things they were built to tell you.
            </p>
            <p>
              The chatbot trades that property for its opposite. There are no
              fixed questions, so you can ask the one you actually have &mdash;
              &ldquo;is the library&rsquo;s side entrance step-free?&rdquo;,
              &ldquo;where&rsquo;s the nearest bench in the shade?&rdquo; &mdash;
              and to understand a question phrased any way at all takes a model too
              large to run on a phone, or realistically on a small server. So it
              runs as a hosted service, and understanding your question means
              sending it there. The flexibility and the privacy cost are one
              decision seen from two sides; you cannot take the first without the
              second.
            </p>
            <p>
              A language model as an interface carries a second cost: it can be
              confidently wrong. The guard against it is the division of labour
              described further up this page &mdash; the model is allowed to choose
              what to look up and to put the answer into words, and nothing else.
              It never measures a distance or a direction; those come from the map,
              computed. It is handed the facts and asked to phrase them, not asked
              to know them. That does not make it incapable of error &mdash; so the
              map says so plainly, every time you open it &mdash; but it keeps the
              errors to wording, not invented geography.
            </p>
            <p>
              So the chatbot is not free, and it is the one place this site reaches
              outside itself. The rest of the site is self-hosted and sends nothing
              to anyone; this map, to answer a question it was never specifically
              built for, sends your words to a model that can. Whether that trade is
              worth it depends on the question you have &mdash; which is exactly why
              the fixed-button{" "}
              <Link href="/maps/context-map">Context Map</Link> is not being
              retired, but kept alongside it. Two answers to the same need, each
              giving up something different.
            </p>

            <h3>When the map mishears a name</h3>
            <p>
              Ask a question out loud and it goes through speech-to-text first,
              which is good at ordinary words and bad at proper nouns it has
              never seen &mdash; street names most of all. A real example:
              spoken aloud, &ldquo;Hannaford Street&rdquo; came back as
              &ldquo;Hanaford&rdquo;, a letter short, and the street was not
              found.
            </p>
            <p>
              The obvious diagnosis &mdash; the search should match names by
              sound, not spelling &mdash; turned out to be wrong about what had
              actually failed. The spelling-tolerant match had{" "}
              <em>already</em>{" "}found Hannaford Street; the problem was which
              one it picked. With no sense of where the question was being asked
              from, a same-distance look-alike two provinces away &mdash; a
              &ldquo;Handford&rdquo; near Ottawa &mdash; tied the real street
              next to you and won. It was a ranking problem wearing a spelling
              problem&rsquo;s clothes.
            </p>
            <p>
              The fix was to anchor every lookup to where you are standing and
              let closeness break the tie, so the local street wins. With that
              in place, ordinary one- or two-letter mishears are absorbed by the
              spelling-tolerant match anyway &mdash; &ldquo;Spadeena&rdquo; finds
              Spadina, &ldquo;Bathert&rdquo; finds Bathurst &mdash; and the right
              feature beside you comes back.
            </p>
            <p>
              That leaves the harder mishears, where the spoken word lands more
              than a letter or two from the real name. The textbook tool for
              those is <strong>phonetic matching</strong>: index every name by
              how it sounds, and match on the sound. I built it, and measured
              it, before deciding whether to keep it.
            </p>
            <p>
              The common phonetic encoder, double metaphone, proved too coarse
              to help: it reduces a word to a short sound-code, but the codes
              collide, so a search for the misheard word drags in hundreds of
              unrelated names. A precise encoder, Beider-Morse, is far cleaner
              &mdash; it keeps genuine sound-alikes together while letting
              nonsense fall away.
            </p>
            <pre>
              <code>{PHONETIC_CODES}</code>
            </pre>
            <p>
              But clean or not, it changed nothing where it mattered. Stand on
              Yonge Street, say &ldquo;Yonge&rdquo;, and speech-to-text writes
              &ldquo;Young&rdquo;. &ldquo;Young&rdquo; is a real word &mdash;
              there are Young Caf&eacute;s and Young Drivers, and they match it{" "}
              <em>exactly</em>. Phonetic matching pulls Yonge Street into the
              running, but it sits below those exact matches with the sound-code
              or without it.
            </p>
            <pre>
              <code>{SEARCH_RESULT}</code>
            </pre>
            <p>
              So I left phonetic search on the shelf. The honest reason is that
              no sound-code can &mdash; or should &mdash; make &ldquo;Yonge&rdquo;
              beat an exact &ldquo;Young&rdquo;; that would break every real
              search for Young. What actually resolves it is{" "}
              <strong>context</strong>, and the conversational map already has
              it: it knows you are standing on Yonge Street, and can simply say
              so &mdash; &ldquo;you&rsquo;re on Yonge Street; did you mean that,
              or Young Drivers of Canada, two hundred metres away?&rdquo;
              Re-processing every record in the index, for a heavier index and a
              result that reorders nothing, was a cost without a benefit. The
              simpler machinery &mdash; spelling-tolerance, closeness, and the
              model&rsquo;s knowing where you are &mdash; carries it. Phonetic
              search here is a thing I tried, measured, and chose against, which
              is a different thing from one I never thought of.
            </p>

            <h3>Putting the unnamed map back in</h3>
            <p>
              Maps, and map searches especially, are built around names. A named
              street is findable &mdash; you type it and there it is. An unnamed
              service lane, a footpath cutting across a park, a building nobody
              has labelled: these are usually dropped from the searchable map,
              because there is nothing to type to find them.
            </p>
            <p>
              For a sighted reader that loss is invisible &mdash; they see the
              laneway, the alley, the dense row of buildings, named or not.
              Reading the map through description, a blind user gets none of it
              unless it is in the data, and it is exactly the orientation a
              sighted reader has for free: that you are hemmed in by buildings,
              that a footpath cuts off to your left, that this block is dense and
              the next one open. The principle these maps hold to is that the
              non-visual reader gets the <em>same</em>{" "}map the sighted one
              does; the unnamed texture is part of that map, so it has to go back
              in.
            </p>
            <p>
              Putting it back takes care, because there are millions of these
              features and they must not clutter a search for named places. So
              they go in marked description-only, carrying no searchable text
              &mdash; the same way the map already handles unnamed water,
              woodland and parkland: as character that colours a description
              without ever surfacing in a name search. Within that, the two
              kinds are stored differently, by how much detail earns its keep.
            </p>
            <ul>
              <li>
                <strong>Unnamed paths and laneways keep their full shape and
                their accessibility tags.</strong>{" "}An unnamed footpath&rsquo;s
                surface, width and steps are the whole point of an accessible
                map, so they are worth the space &mdash; enough for the map to
                say &ldquo;a footpath about twelve metres to your left&rdquo;.
              </li>
              <li>
                <strong>Anonymous buildings are kept deliberately thin:</strong>{" "}
                a centre point and a coarse size &mdash; small, medium or large
                &mdash; and nothing more, no outline. That is enough to feel a
                place&rsquo;s density (&ldquo;dozens of buildings within a
                hundred metres, a couple of them large&rdquo;) without the index
                ballooning under the sheer number of them.
              </li>
            </ul>
            <p>
              The cost is real but modest, and I measured it rather than
              guessed. Recovering the unnamed features roughly doubles the
              feature count in a dense city, but because the thinned buildings
              are so cheap to store it adds only a few gigabytes across the whole
              of Canada. A deliberate trade: more to keep, in exchange for a map
              that can describe the spaces <em>between</em>{" "}the named things,
              not only the named things themselves.
            </p>
            <p className="muted">
              <small>
                Both decisions are recent. The spelling-tolerant,
                closeness-ranked search is already live; the unnamed features
                are being folded into the map now. This is a test, learned from
                in the open &mdash; the reasoning is written down because a
                decision you can see is one you can argue with.
              </small>
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Source</h2>
            <p>
              GPL-3.0, part of the{" "}
              <Link href="/maps/tiled-toronto-map">tiled Toronto map</Link>{" "}
              project &mdash;{" "}
              <a href="https://github.com/bobdodd/tiled-toronto-map">
                github.com/bobdodd/tiled-toronto-map
              </a>
              . The place data is derived from OpenStreetMap, &copy;
              OpenStreetMap contributors, under ODbL.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
