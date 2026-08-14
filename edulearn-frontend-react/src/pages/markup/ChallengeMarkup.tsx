/* Generated from edulearn-frontend/challenge.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
import type { CSSProperties } from 'react';

export default function ChallengeMarkup() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="48%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
        </defs>
      </svg>
      {' '}
      <main className="wrap">
        <section className="hero">
          <div className="mono rv" style={{ animationDelay: ".05s" }}>
            <span style={{ color: "var(--cream)" }}>
              Arena
            </span>
          </div>
          <h1 className="rv" style={{ animationDelay: ".12s", marginTop: "14px" }}>
            {"One question. "}
            <em>
              Every hour.
            </em>
          </h1>
          <p className="hero__sub rv" style={{ animationDelay: ".2s" }}>
            The whole school sees the same question at the same time. 45 seconds on the clock — nobody can google that fast.
          </p>
          <div className="hero__chips rv" style={{ animationDelay: ".28s" }}>
            <span className="chip">
              <span className="dot" />
              Next drop at the top of every hour
            </span>
            {' '}
            <span className="chip">
              <span className="dot" />
              45s window — too fast to cheat
            </span>
          </div>
        </section>
        <section className="split">
          <div>
            <div className="play rv" style={{ animationDelay: ".34s" }} id="playCard" />
            <div className="hist" id="histWrap" style={{ display: "none" }}>
              <h3>
                Past drops
              </h3>
              <div id="histList" />
            </div>
          </div>
          <aside className="panel">
            <div className="pcard rv" style={{ animationDelay: ".42s" }}>
              <div className="pcard__eyebrow">
                Your stats
              </div>
              <div className="bignum" id="statPoints">
                0
              </div>
              <div className="mono" style={{ margin: "2px 0 14px" }}>
                Total points
              </div>
              <div className="statrow">
                <span>
                  Current streak
                </span>
                <b id="statStreak">
                  0
                </b>
              </div>
              <div className="statrow">
                <span>
                  Best streak
                </span>
                <b id="statBest">
                  0
                </b>
              </div>
              <div className="statrow">
                <span>
                  Accuracy
                </span>
                <b id="statAcc">
                  —
                </b>
              </div>
              <div className="statrow">
                <span>
                  Hours played
                </span>
                <b id="statPlayed">
                  0
                </b>
              </div>
            </div>
            <div className="pcard rv" style={{ animationDelay: ".5s" }}>
              <div className="pcard__eyebrow" id="lbEyebrow">
                This hour’s leaderboard
              </div>
              <div className="lb" id="lbList" />
            </div>
            <div className="pcard rv" style={{ animationDelay: ".58s" }}>
              <div className="pcard__eyebrow">
                How it works
              </div>
              <div className="how">
                <div className="how__row">
                  <span className="how__num">
                    1
                  </span>
                  <span>
                    A question drops every hour — the same one for everyone.
                  </span>
                </div>
                <div className="how__row">
                  <span className="how__num">
                    2
                  </span>
                  <span>
                    45 seconds to answer. Speed is the anti-cheat.
                  </span>
                </div>
                <div className="how__row">
                  <span className="how__num">
                    3
                  </span>
                  <span>
                    Points for speed, streak bonus for showing up every hour.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>
        {/* Most-asked Class 7 questions — a colourful reference bank, subject by
         subject, of the questions that come up again and again in exams. */}
        <section className="faq">
          <div className="faq__head">
            <h2 className="sect-title rv" style={{ animationDelay: ".1s" }}>
              Questions that come up again & again
            </h2>
            <p className="faq__sub rv" style={{ animationDelay: ".16s" }}>
              The Class 7 questions your exams love to repeat — keep them handy, quiz a friend, and walk into the Arena ready. Straight from the NCERT chapters.
            </p>
          </div>
          <div className="faq__grid">
            {/* SCIENCE */}
            <article
              className="faqc rv"
              style={{ '--sa': "var(--teal)", animationDelay: ".2s" } as CSSProperties}
            >
              <div className="faqc__hd">
                <span className="faqc__ic">
                  🔬
                </span>
                <div>
                  <div className="faqc__name">
                    Science
                  </div>
                  <div className="faqc__tag">
                    Most repeated
                  </div>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q1
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Why does a metal spoon feel colder than a wooden one?
                  </div>
                  <span className="faqq__from">
                    Heat Transfer in Nature
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q2
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Give two differences between a physical and a chemical change.
                  </div>
                  <span className="faqq__from">
                    Physical & Chemical Changes
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q3
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Draw the symbols for a cell, a bulb and a switch in a circuit.
                  </div>
                  <span className="faqq__from">
                    Electricity: Circuits
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q4
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    What happens to blue and red litmus in an acid and in a base?
                  </div>
                  <span className="faqq__from">
                    Acidic, Basic & Neutral
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q5
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Name the process by which green plants make their own food.
                  </div>
                  <span className="faqq__from">
                    Life Processes in Plants
                  </span>
                </div>
              </div>
            </article>
            {/* MATHS */}
            <article
              className="faqc rv"
              style={{ '--sa': "var(--peri)", animationDelay: ".24s" } as CSSProperties}
            >
              <div className="faqc__hd">
                <span className="faqc__ic">
                  🧮
                </span>
                <div>
                  <div className="faqc__name">
                    Mathematics
                  </div>
                  <div className="faqc__tag">
                    Most repeated
                  </div>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q1
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Solve for x: 3x + 5 = 20.
                  </div>
                  <span className="faqq__from">
                    Simple Equations
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q2
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Add the integers: (−7) + (+3).
                  </div>
                  <span className="faqq__from">
                    Integers
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q3
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Find the area and perimeter of a rectangle 8 cm × 5 cm.
                  </div>
                  <span className="faqq__from">
                    Perimeter and Area
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q4
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    What is the sum of the three angles of a triangle?
                  </div>
                  <span className="faqq__from">
                    The Triangle & its Properties
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q5
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Convert 3/4 into a decimal and a percentage.
                  </div>
                  <span className="faqq__from">
                    Comparing Quantities
                  </span>
                </div>
              </div>
            </article>
            {/* SOCIAL SCIENCE */}
            <article
              className="faqc rv"
              style={{ '--sa': "var(--amber)", animationDelay: ".28s" } as CSSProperties}
            >
              <div className="faqc__hd">
                <span className="faqc__ic">
                  🌍
                </span>
                <div>
                  <div className="faqc__name">
                    Social Science
                  </div>
                  <div className="faqc__tag">
                    Most repeated
                  </div>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q1
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Name any two dynasties that ruled as the Delhi Sultans.
                  </div>
                  <span className="faqq__from">
                    The Delhi Sultans
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q2
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    What is the difference between a manuscript and an inscription?
                  </div>
                  <span className="faqq__from">
                    Tracing Changes
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q3
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Why is Akbar remembered as a great ruler?
                  </div>
                  <span className="faqq__from">
                    The Mughal Empire
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q4
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Name the three domains of the Earth.
                  </div>
                  <span className="faqq__from">
                    Environment
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q5
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    What do we mean by 'equality' in a democracy?
                  </div>
                  <span className="faqq__from">
                    On Equality
                  </span>
                </div>
              </div>
            </article>
            {/* ENGLISH */}
            <article
              className="faqc rv"
              style={{ '--sa': "var(--rose)", animationDelay: ".32s" } as CSSProperties}
            >
              <div className="faqc__hd">
                <span className="faqc__ic">
                  📖
                </span>
                <div>
                  <div className="faqc__name">
                    English
                  </div>
                  <div className="faqc__tag">
                    Most repeated
                  </div>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q1
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    In 'Three Questions', what were the king's three questions?
                  </div>
                  <span className="faqq__from">
                    Three Questions
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q2
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Give one example each of a simile and a metaphor.
                  </div>
                  <span className="faqq__from">
                    Grammar
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q3
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    Change into indirect speech: He said, "I am busy."
                  </div>
                  <span className="faqq__from">
                    Grammar
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q4
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    What is the moral of the lesson 'Fire: Friend and Foe'?
                  </div>
                  <span className="faqq__from">
                    Fire: Friend and Foe
                  </span>
                </div>
              </div>
            </article>
            {/* HINDI */}
            <article className="faqc rv" style={{ '--sa': "#8B5CF6", animationDelay: ".36s" } as CSSProperties}>
              <div className="faqc__hd">
                <span className="faqc__ic">
                  ✍️
                </span>
                <div>
                  <div className="faqc__name">
                    Hindi
                  </div>
                  <div className="faqc__tag">
                    Most repeated
                  </div>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q1
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    'हम पंछी उन्मुक्त गगन के' कविता में पक्षी क्या चाहते हैं?
                  </div>
                  <span className="faqq__from">
                    हम पंछी उन्मुक्त गगन के
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q2
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    संधि किसे कहते हैं? एक उदाहरण दीजिए।
                  </div>
                  <span className="faqq__from">
                    व्याकरण
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q3
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    'मिठाईवाला' कहानी से हमें क्या सीख मिलती है?
                  </div>
                  <span className="faqq__from">
                    मिठाईवाला
                  </span>
                </div>
              </div>
              <div className="faqq">
                <span className="faqq__q">
                  Q4
                </span>
                <div className="faqq__body">
                  <div className="faqq__text">
                    'सूरज' के दो पर्यायवाची शब्द लिखिए।
                  </div>
                  <span className="faqq__from">
                    व्याकरण
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <footer className="wrap footer__base">
        <span className="mono">
          © 2026 BestBrain Learning Pvt. Ltd. · Noida, India
        </span>
      </footer>
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {/* Redesign: look only. Every screen keeps the layout it already has. */}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
    </>
  );
}
