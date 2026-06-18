import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function SwitchAndMagnifierSupport() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <MapsSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p>
              <small>
                <Link href="/maps/terminal-map">
                  &larr; Terminal map
                </Link>
              </small>
            </p>
            <h1>Switch access and magnifier support</h1>
            <p className="lede">
              Two assistive-technology populations interact with the
              terminal map in ways that are easy to assume and harder
              to verify: people who navigate by <em>switch</em>, and
              low-vision people who use a <em>screen magnifier</em>.
              Both depend on how the platform handles keyboard focus
              and programmatic focus changes &mdash; and the answer,
              in both cases, is &ldquo;it varies.&rdquo; This page
              records what that variation actually looks like, and
              what it means for the map.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Switch access, skip-links, and scan order</h2>
            <p>
              This is a nuanced area where theory and practice diverge.
              Skip links &mdash; including the map&rsquo;s
              skip-to-pier links &mdash; work by moving focus (and
              sometimes scroll position) to a target when activated.
              For keyboard and screen-reader users that is effective,
              because their navigation follows DOM focus. Switch
              scanning is different, and the short answer is that in
              most cases scanning does <em>not</em>{" "}automatically jump
              to the target in a useful way. It depends heavily on the
              switch-access software.
            </p>

            <h3>How the main platforms behave</h3>
            <ul>
              <li>
                <strong>iOS Switch Control</strong>{" "}does follow
                programmatic focus shifts, so activating a skip link
                moves focus to the target and scanning should resume
                there. It works reasonably well in practice, though the
                sudden context shift can be disorienting without
                auditory feedback.
              </li>
              <li>
                <strong>Android Switch Access</strong>{" "}is more
                problematic. It scans by visually walking the UI
                element tree, and its response to programmatic focus
                changes has historically been inconsistent: the scan
                may not resume at the target, and can restart from the
                top or carry on from where it was.
              </li>
              <li>
                <strong>Windows</strong>, with a Bluetooth switch
                driving software such as Grid 3, Communicator, or
                Tecla, typically routes through the keyboard and focus
                model, so a skip link that moves DOM focus should be
                followed. It generally works, but the behaviour is
                mediated by whichever AAC or scanning package is in
                use, and varies accordingly.
              </li>
            </ul>

            <h3>The deeper problem</h3>
            <p>
              Even when scanning does follow the focus jump, skip links
              carry usability friction for switch users. The link sits
              early in the scan order, so the user has to wait for it to
              come around &mdash; cognitively and physically effortful.
              There is no preview or confirmation of what is being
              skipped to. If they miss it, they have paid a timing cost
              and must wait for the next scan cycle. The load of
              anticipating the link in the sequence adds up across a
              page.
            </p>

            <h3>What helps switch users more</h3>
            <p>
              Landmark regions &mdash; <code>main</code>,{" "}
              <code>nav</code>, and the rest &mdash; combined with
              switch software that supports landmark-navigation
              shortcuts (some do, many do not) or item grouping, reduce
              the scan distance more elegantly than a skip link. On iOS,
              Switch Control&rsquo;s scanning groups can be configured
              to skip whole regions. Proper heading structure helps too,
              where the scanning software exposes a heading-jump mode.
            </p>
            <p>
              The practical implication is that skip links remain worth
              implementing &mdash; a low-cost, high-value win for
              keyboard and screen-reader users &mdash; but should not be
              counted on as the primary navigation accommodation for
              switch users. That population benefits more from good
              landmark structure, reduced overall DOM clutter, and
              logical grouping of interactive elements early in the scan
              order. The terminal map provides the first (landmarks and{" "}
              <kbd>F6</kbd>{" "}region cycling) but, because it draws
              everything as SVG, works against the second: its high
              node count is exactly the clutter that lengthens a switch
              scan. That tension is recorded honestly in the
              terminal map&rsquo;s limitations.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Magnifiers and focus tracking</h2>
            <p>
              The same &ldquo;it varies&rdquo; applies to whether a
              screen magnifier moves its viewport to follow keyboard
              focus &mdash; which matters for the map&rsquo;s
              &ldquo;Find on map&rdquo; button, which centres a result
              and moves focus to it. Here, though, the pattern is
              clearer than with switch access.
            </p>

            <h3>Magnifiers that reliably follow focus</h3>
            <ul>
              <li>
                <strong>Windows Magnifier</strong> (built-in) tracks
                focus well in most cases, following the caret in text
                fields and keyboard focus on interactive elements. Its
                &ldquo;Follow the keyboard cursor&rdquo; and
                &ldquo;Follow the text insertion point&rdquo; settings
                need to be enabled &mdash; they are on by default but
                can be turned off. Tracking can lag on heavy pages, or
                when focus moves programmatically without a user
                gesture.
              </li>
              <li>
                <strong>ZoomText / Fusion</strong> (Freedom Scientific)
                is probably the most robust of any, with independent
                settings for tracking focus, caret, and mouse, and
                better handling of programmatic focus shifts than most.
                Fusion announces focus changes through its speech layer,
                a hybrid magnifier/screen-reader character that helps
                orientation after a jump.
              </li>
              <li>
                <strong>SuperNova</strong> (Dolphin) also tracks focus
                reliably, with configurable tracking modes, to a similar
                standard.
              </li>
            </ul>

            <h3>Weaker or conditional focus tracking</h3>
            <ul>
              <li>
                <strong>macOS Zoom</strong> (built-in) follows keyboard
                focus within native AppKit apps reasonably, and Safari
                web content is generally fine, but it falls down on
                programmatic focus changes in web apps &mdash; focus
                moved by JavaScript does not always pull the viewport
                across, particularly outside Safari.
              </li>
              <li>
                <strong>iOS / iPadOS Zoom</strong>{" "}follows focus when
                used with a keyboard, but only if the app exposes focus
                to the accessibility layer; purely touch-driven apps
                that surface no keyboard focus give Zoom nothing to
                track.
              </li>
              <li>
                <strong>Android Magnification</strong>{" "}is the weakest of
                the mainstream options &mdash; primarily gesture-driven,
                with limited focus-following, and it does not reliably
                track keyboard- or switch-driven focus.
              </li>
            </ul>

            <h3>The common failure mode</h3>
            <p>
              What breaks nearly every magnifier is focus moving to an
              off-screen or visually hidden element, or landing
              somewhere that does not visually reflow the page. A skip-
              link target that is technically in the viewport but at a
              position the user is not currently viewing can leave the
              magnifier either not moving (the element is, after all,
              &ldquo;visible&rdquo;) or snapping to a jarring location.
              This is why skip-link targets should sit at the actual
              start of meaningful content, and why a visible focus style
              matters especially for magnifier users.
            </p>

            <h3>What it means for the map</h3>
            <p>
              On the desktop, ZoomText/Fusion and SuperNova are the
              reliable baseline, Windows Magnifier is acceptable, and
              macOS Zoom is adequate for native apps and basic web use.
              On mobile, and especially on Android, magnifiers should
              not be relied on to follow focus automatically &mdash;
              those users more often pan manually. So the{" "}
              &ldquo;Find on map&rdquo; button does not depend on
              focus-following: its value is that it moves the result to
              a known, repeatable place &mdash; the centre of the
              viewport &mdash; that a magnifier user can reach
              predictably whether or not the viewport follows focus.
            </p>
            <p>
              It also raises the bar for the visible focus indicator. A
              magnification user who does <em>not</em>{" "}get automatic
              viewport tracking still has to be able to find where focus
              landed, which means the indicator has to be large enough
              and high-contrast enough to be found on its own &mdash;
              the concern of WCAG 2.2 success criterion 2.4.13, Focus
              Appearance.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/maps/terminal-map">Terminal map</Link>{" "}
                &mdash; the demo these notes are about.
              </li>
              <li>
                <Link href="/maps">Maps</Link> &mdash; the wider
                accessible maps work.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
