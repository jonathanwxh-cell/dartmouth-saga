# Dartmouth Saga 1956 — 80-card outline

This is the structural plan for every card in v0.1. Phase 4b fills in the prose; Phase 4a built the slots. Each entry names a real person, a real document, a real place, or a real funding figure — that's the discipline.

---

## Player POV
You are a young research assistant McCarthy hired to help organize the workshop. You have a desk in Steele Hall, an undergraduate science degree, and the unglamorous job of making sure the typewriters work and the right people are in the right rooms. You know everyone's name; nobody knows yours. The workshop runs eight weeks. By the end of it you will have either written your name onto a proposal that founds a field, into a footnote in someone else's career, or out of the field entirely.

You don't change the broad facts of history — McCarthy still coins "artificial intelligence", Newell and Simon still demonstrate the Logic Theorist, Rockefeller still grants something around $7,500. What you change is your own arc through it: who you become, what survives of you in the proposal that ships, and whose orbit you end up in for the next decade.

---

## Six qualities recap
- **symbolic_progress (SYM)** — actual technical progress on programs, proofs, demonstrations
- **funding (FND)** — money in the workshop's account; Rockefeller's confidence
- **public_trust (TRU)** — outside-the-room perception (press, deans, government)
- **academic_credibility (CRD)** — inside-the-room perception (Wiener, the cybernetics camp, MIT, Princeton)
- **compute (CMP)** — hours of IBM 704 time available
- **team_morale (MOR)** — does anyone want to come back tomorrow

Initial: 50 each. Ending thresholds: proposal-funded needs SYM≥70, FND≥50, CRD≥50; partial needs SYM≥50, FND≥30; else canceled.

---

## Arc shape
- **Opening (25 cards)** — June 18 to about July 1. Arrivals, framing, the proposal lying half-written on the table.
- **Middle (30 cards)** — Most of July. Logic Theorist demo, programs running, internal debates, funding pressure, the substance of the field forming.
- **Closing (25 cards)** — August. Final write-up, departures, the funding letter, the term "AI" surviving (or not).

The 3 ending narratives already shipped in `src/endings/era-1956.ts`. The closing arc converges into one of them based on accumulated quality state. Boundary endings can fire any time.

---

## Flag system
Specific flags that gate later cards:

- `term-ai-defended` — set when player backs McCarthy's "artificial intelligence" coinage
- `term-automata-studies` — set when player backs Shannon's preferred safer framing
- `shannon-engaged` — set if Shannon has been actively involved (vs. polite distance)
- `wiener-letter-circulated` — set if a Wiener critique has reached the room
- `rockefeller-progress-report-sent` — set when an interim report goes out
- `lt-demonstrated` — set after Newell/Simon successfully demo Logic Theorist
- `solomonoff-stays` — set if Solomonoff is given workspace through August
- `ibm-relationship-warm` — set if you've been responsive to Rochester's IBM ties
- `proposal-drafting-yours` — set if the player is doing the writing
- `proposal-drafting-mccarthy` — set if McCarthy reclaims the pen
- `minsky-allied` — set if you've materially helped Minsky's neural-net thinking
- `minsky-cooled` — set if you've sided against Minsky in any debate
- `samuel-checkers-shown` — set after Arthur Samuel's checkers program demo
- `selfridge-pandemonium-shown` — set after Selfridge's pandemonium demo
- `press-noticed` — set if the workshop has drawn outside attention

These flags chain cards via `flags_required` / `flags_forbidden` and via `nextCardId` for forced sequences.

---

## OPENING — 25 cards (June 18 – early July)

**01. arrival-mccarthy-greeting** *(weight 100, opening card, one_shot, no requires)*
McCarthy meets you at the Hanover bus station, hands you a Rockefeller proposal carbon copy and a list of bedrooms in Lord Hall. *"You'll keep this from collapsing under its own weight."*
- L: "I'll handle logistics" → +MOR, +CRD
- R: "What's the actual goal?" → +SYM, -MOR
- nextCardId on either: arrival-the-proposal

**02. arrival-the-proposal** *(forced via nextCardId, one_shot)*
You read the August 1955 proposal. Two pages. The phrase "artificial intelligence" appears in the title. Shannon's name is on the cover but his signature is not.
- L: "Shannon's hesitation is real" *(set: shannon-engaged=false)* → +CRD, -MOR
- R: "Shannon will sign once he's here" *(set: shannon-engaged=true)* → +TRU, -CRD

**03. arrival-shannon-cabin** *(one_shot, requires: nothing, weight 12)*
Shannon arrives with his wife Betty, asks for the quiet room. Mentions he's already given a paper at Dartmouth on Boolean circuit theory in 1948 and "didn't see the trick repeat."
- L: Give him the quiet room and the IBM 704 specs → +CRD, +TRU
- R: Pull him into the welcome dinner → +MOR, -CRD

**04. arrival-minsky-snarc** *(one_shot, weight 10)*
Minsky shows up with notes on Snarc, the 1951 stochastic neural net he and Edmonds built at Princeton. Asks if there's lab bench space.
- L: Set up bench space; let him build → +SYM, -CMP
- R: Push him toward the proposal-writing table → +MOR, -SYM

**05. arrival-rochester-ibm** *(one_shot, weight 10)*
Nathaniel Rochester arrives from IBM Poughkeepsie with a promise of 200 hours on the 704 over the summer. *"On the condition that we get a published note."*
- L: Accept gladly *(set: ibm-relationship-warm)* → +CMP, +FND
- R: Negotiate on the publication terms → +CRD, -CMP

**06. arrival-solomonoff-knock** *(one_shot, weight 8)*
Ray Solomonoff arrives unscheduled, holding pages on inductive inference. Says he can stay all eight weeks if there's a desk.
- L: Find him a desk *(set: solomonoff-stays)* → +SYM, -FND
- R: Polite refusal — desks are full → -SYM, +FND

**07. opening-naming-debate-1** *(one_shot, weight 14)*
Around the second-day kitchen table, McCarthy says it again: "Artificial intelligence." Shannon counters: "Automata studies. The grant officers know that phrase."
- L: Back McCarthy *(set: term-ai-defended)* → +SYM, -CRD, -TRU
- R: Back Shannon *(set: term-automata-studies)* → +CRD, +TRU, -SYM

**08. opening-typewriter-broken** *(weight 6)*
The Underwood in the proposal room has a stuck "i" key. The hardware shop on College Street can fix it for $11.
- L: Pay it out of pocket → +MOR, -FND
- R: Make do with handwritten drafts → -MOR, +FND

**09. opening-room-assignment** *(weight 6)*
Selfridge writes from Lincoln Lab asking when his bedroom will be ready. There isn't one.
- L: Move Solomonoff's desk; bump him to a shared room → +TRU, -MOR (req: solomonoff-stays)
- R: Tell Selfridge to come the second week instead → -TRU, +MOR

**10. opening-cybernetics-shadow** *(weight 8)*
The Macy Conferences ended in 1953. Wiener's *Cybernetics* still sits on every desk. Someone asks why he's not on the invite list.
- L: Repeat McCarthy's framing — this is a different field → +CRD (if term-ai-defended), -CRD otherwise
- R: Suggest you write Wiener a courteous note → +TRU, -CRD

**11. opening-rochester-704-tape** *(weight 8)*
Rochester drops off a box of magnetic tapes for the 704 link. They're labeled in his handwriting: "neural model — small."
- L: Help Rochester debug it → +SYM, -CMP, +CRD
- R: File it for later — McCarthy needs the proposal first → -SYM, +MOR

**12. opening-minsky-coffee** *(weight 7)*
Minsky asks if you've read McCulloch and Pitts (1943). He wants to argue that real progress means abandoning logical neurons for stochastic ones.
- L: Engage; he likes the argument *(set: minsky-allied)* → +CRD, -MOR
- R: Defer to McCarthy's symbolic frame *(set: minsky-cooled)* → +SYM, -CRD

**13. opening-dartmouth-dean** *(weight 6)*
Dean Kemeny stops by to ask what is being claimed publicly. The college worries about overpromising.
- L: Show him the cautious cover letter you've drafted → +TRU, +CRD, -MOR
- R: Hand him McCarthy's full claim language → -TRU, +SYM

**14. opening-shannon-side-bet** *(weight 7, requires: shannon-engaged)*
Shannon mentions he wants to keep working on his maze-running mouse, Theseus. Wonders aloud if "thinking" is a coherent objective at all.
- L: Validate the doubt; encourage smaller-scale progress → +CRD, -SYM
- R: Push him to back the bigger claim → -CRD, +SYM, -MOR

**15. opening-rockefeller-letter-1** *(weight 9, one_shot)*
A letter arrives from the Rockefeller Foundation — Warren Weaver wants a paragraph on what specifically will be demonstrated by August.
- L: Promise concrete outputs you don't have yet → +TRU, +FND, -CRD
- R: Promise what's actually achievable → -TRU, +CRD

**16. opening-mccarthy-pen** *(weight 8)*
McCarthy hands you a fountain pen and a stack of foolscap. *"You can write better than I can."*
- L: Take the pen *(set: proposal-drafting-yours)* → +SYM, +MOR
- R: Keep it on his desk *(set: proposal-drafting-mccarthy)* → -SYM, +CRD

**17. opening-bench-space-minsky** *(weight 6, requires: minsky-allied)*
Minsky asks for permission to wire a small Snarc-style network on the bench. It will use the workshop's only soldering iron for two days.
- L: Yes — push the schedule → +SYM, -CMP, +MOR
- R: Tell him to wait until after the proposal → -SYM, -MOR

**18. opening-press-call-1** *(weight 5)*
A reporter from the Boston Globe calls. Wants a quote on "thinking machines."
- L: Decline politely *(no flag)* → +CRD, -TRU
- R: Give a careful quote *(set: press-noticed)* → +TRU, -CRD

**19. opening-shannon-cover-sheet** *(weight 8, requires: shannon-engaged)*
Shannon agrees to put his name on the cover sheet of the final proposal. Just the cover sheet.
- L: Take it gratefully → +CRD, +TRU
- R: Push for him to sign the full document too → -CRD, -MOR, +TRU

**20. opening-trenchard-more** *(weight 5)*
Trenchard More writes from Princeton: he can come for two weeks if there's a topic.
- L: Invite him — set him up on logical reasoning → +SYM, -FND
- R: Defer; the workshop is full → +FND, -SYM

**21. opening-rochester-ibm-pressure** *(weight 7, requires: ibm-relationship-warm)*
Rochester says IBM's PR office wants a story about "machines that learn." He'd rather not give them one.
- L: Help him deflect → +CRD, -TRU
- R: Let IBM run the story — funding helps → +FND, +TRU, -CRD

**22. opening-mccarthy-naming-2** *(weight 9, one_shot, requires: term-ai-defended OR term-automata-studies)*
The naming debate flares again. McCarthy is firm. Shannon is tired. Newell hasn't arrived yet but his vote will matter.
- L: Hold the line on whichever you've chosen → reinforce existing flag, +CRD
- R: Suggest a hybrid: "complex information processing" → -SYM, +TRU (Newell+Simon's actual term)

**23. opening-funding-balance** *(weight 6)*
Receipts so far: $1,200 spent on stipends, $40 on ditto paper. The grant balance from Rockefeller's first disbursement is thinner than expected.
- L: Cut Selfridge's per diem → -MOR, +FND
- R: Cut your own per diem → -FND, +MOR, +CRD

**24. opening-bell-labs-call** *(weight 5, requires: shannon-engaged)*
Shannon takes a call from Bell Labs. He looks distracted afterward; says he might need to head back early.
- L: Ask him to delay the trip → +CRD, -MOR
- R: Make space for him to go and come back → -CRD, +MOR

**25. opening-end-of-week-2** *(weight 12, one_shot, no flag, position-end-of-opening)*
Two weeks in. The big arrivals are done. Ten people in Hanover, two missing (Newell and Simon, due tomorrow). The proposal is half-written. Someone proposes a swim in the river.
- L: Yes — go swimming → +MOR, -SYM
- R: Stay at the desk → +SYM, -MOR

---

## MIDDLE — 30 cards (July)

**26. middle-newell-simon-arrival** *(weight 100, one_shot, position-start-of-middle)*
Newell and Simon arrive from RAND/CMU with a deck of punched cards labeled LOGIC THEORIST and an annotated copy of *Principia Mathematica* Volume II.
- L: Give them the IBM 704 slot you'd been holding → +SYM, -CMP, +CRD
- R: Make them share Solomonoff's slot → +CMP, -CRD, -MOR

**27. middle-logic-theorist-demo-1** *(weight 50, requires: nothing, one_shot, nextCardId: middle-logic-theorist-result)*
Newell sets up the demo on JOHNNIAC remotely; the 704 stalls. Twenty minutes of tape spinning. The room watches.
- L: Suggest restarting clean → +SYM, -CMP
- R: Let it crash — Newell will fix it → -SYM, +MOR

**28. middle-logic-theorist-result** *(forced via nextCardId, one_shot, set: lt-demonstrated)*
The program proves Theorem 2.01 of *Principia Mathematica*. Then 2.45. Then a proof shorter than Whitehead and Russell's. Simon writes "We have invented a thinking machine" on the blackboard, knowing it's overstated.
- L: Push everyone to absorb this — change the proposal language → +SYM, +TRU, -CRD
- R: Caution the room — keep the claim narrow → -SYM, +CRD

**29. middle-naming-newell-counter** *(weight 9, requires: lt-demonstrated)*
Newell pushes back on "artificial intelligence." Says he and Simon are doing "complex information processing." Wants the proposal to use that phrase too.
- L: Defend McCarthy's term *(req: term-ai-defended)* → +SYM, -CRD, -MOR
- R: Concede space — both phrases survive → +CRD, +MOR, -SYM

**30. middle-shannon-skeptic** *(weight 7, requires: shannon-engaged)*
Shannon asks privately if you actually believe machines will reason. *"Or are we writing what the Foundation wants to read?"*
- L: Tell him you believe it → +SYM, -CRD
- R: Tell him it's the proposal that matters, not the belief → +TRU, -MOR

**31. middle-solomonoff-paper** *(weight 7, requires: solomonoff-stays)*
Solomonoff brings you a draft on inductive inference. It's dense; he wants feedback before sending it to the Cybernetics Conference.
- L: Read it carefully; help him sharpen → +CRD, +SYM, -MOR
- R: Suggest he focus on the workshop output → -CRD, +MOR

**32. middle-minsky-snarc-progress** *(weight 6, requires: minsky-allied)*
Minsky's bench network is half-wired. He needs a budget item — six more 6L6 tubes from Allied Radio, $4.20 total.
- L: Approve it → +SYM, -FND, +MOR
- R: Defer until after the proposal → -SYM, +FND, -MOR

**33. middle-room-cleanup** *(weight 4)*
The proposal room has tape rolls, coffee cups, and three unmade beds. The dean's secretary is bringing a visiting trustee tomorrow.
- L: Spend two hours cleaning yourself → -SYM, +TRU, +MOR
- R: Tell the secretary to reschedule → -TRU, +SYM

**34. middle-rockefeller-progress-1** *(weight 8, one_shot)*
Warren Weaver writes: a five-paragraph progress note is due by July 15. He's specifically asking what programs are running.
- L: Lead with Logic Theorist *(req: lt-demonstrated)* *(set: rockefeller-progress-report-sent)* → +TRU, +FND
- R: Lead with the conceptual work; defer demos → +CRD, -FND, -TRU

**35. middle-selfridge-pandemonium** *(weight 8, requires: nothing)*
Selfridge arrives from Lincoln Lab. Demos his Pandemonium pattern-recognition scheme on a chalkboard. *"It will run on a 704, eventually."*
- L: Make notes; argue it belongs in the proposal *(set: selfridge-pandemonium-shown)* → +SYM, -CRD
- R: Tell him to come back when it runs → -SYM, +CRD

**36. middle-arthur-samuel-checkers** *(weight 8, requires: ibm-relationship-warm)*
Arthur Samuel arrives from IBM with his checkers program. It can play through a midgame and learn from its mistakes.
- L: Schedule a demo for the room *(set: samuel-checkers-shown)* → +SYM, +TRU
- R: Schedule a closed session — it might cheapen the field → +CRD, -TRU

**37. middle-ibm-704-down** *(weight 5)*
The 704 link goes down for two days. Rochester is in Poughkeepsie; the engineer says it's a tape drive belt.
- L: Send Rochester a wire to expedite → +CMP, -CRD
- R: Use the time to write the proposal → +SYM, -CMP

**38. middle-minsky-newell-clash** *(weight 9, requires: minsky-allied OR lt-demonstrated)*
Minsky calls Logic Theorist "a stamp-collecting program." Newell calls Snarc "an analog toy." The room goes quiet.
- L: Stay out of it → -CRD, -MOR
- R: Mediate; force them to find common ground → +CRD, +MOR, -SYM

**39. middle-mccarthy-lisp-germ** *(weight 6)*
McCarthy is doodling a recursive function definition on the back of a napkin. Says it's how programs should describe themselves.
- L: Encourage him to write it up — could be the workshop's lasting output → +SYM, +CRD, -MOR
- R: Tell him to stay focused on the proposal → +MOR, -SYM

**40. middle-press-noticed-followup** *(weight 6, requires: press-noticed)*
A second reporter calls — this time from *Time*. They want to come up to Hanover.
- L: Allow the visit → +TRU, -CRD, -MOR
- R: Decline → -TRU, +CRD

**41. middle-wiener-letter-arrives** *(weight 8, one_shot)*
A letter from Wiener at MIT arrives, addressed to Shannon. Shannon reads it, hands it to you. Wiener calls the workshop "a misuse of cybernetics' language by people who know less than they claim."
- L: Show it to McCarthy *(set: wiener-letter-circulated)* → +CRD, -MOR
- R: Suppress it; deal with Wiener later → -CRD, +MOR, +TRU

**42. middle-funding-shortfall** *(weight 8)*
The grant accounting shows the workshop will be $3,000 short of the requested $13,500 if Rockefeller funds at the most likely level. Decisions need to be made now.
- L: Cut compute hours → -CMP, +FND
- R: Cut the closing-week travel reimbursements → -MOR, +FND

**43. middle-newell-wants-credit** *(weight 7, requires: lt-demonstrated)*
Newell asks that any joint paper out of the workshop list him and Simon first. McCarthy is uneasy — it's *his* workshop.
- L: Side with Newell → +CRD, -MOR (with McCarthy)
- R: Push for shared first authorship → +MOR, -CRD

**44. middle-solomonoff-quiet-progress** *(weight 6, requires: solomonoff-stays)*
Solomonoff has been quiet for a week. You find him at midnight working out probabilities of program length. He says: *"Inductive inference is a probability over programs."*
- L: Believe him; give him another two weeks → +SYM, +CRD, -FND
- R: Encourage him to write a workshop note instead → +MOR, -SYM

**45. middle-trenchard-more-arrival** *(weight 5)*
Trenchard More arrives from Princeton. Wants to talk about logical foundations and Łukasiewicz multi-valued logic.
- L: Find time to host a session → +CRD, -SYM
- R: Suggest it's a side conversation → -CRD, +SYM

**46. middle-mccarthy-overworked** *(weight 6)*
McCarthy hasn't slept in two nights. He is writing definitions of "intelligence" and crossing them out. *"Maybe the term is wrong after all."*
- L: Hold the line; finish his thought *(req: term-ai-defended)* → +SYM, -MOR
- R: Suggest a half-day off → +MOR, -SYM

**47. middle-rochester-paper-promise** *(weight 6, requires: ibm-relationship-warm)*
Rochester reminds you of his condition for the 704 hours: a published note. Asks what's being prepared.
- L: Promise the Logic Theorist paper *(req: lt-demonstrated)* → +CMP, +TRU
- R: Promise a paper on a smaller demo → +CRD, -TRU

**48. middle-shannon-departure-talk** *(weight 7, requires: shannon-engaged)*
Shannon says he's leaving August 1, regardless. Bell Labs needs him on a project.
- L: Ask him to extend by a week → +CRD, -MOR
- R: Accept gracefully; plan around it → +MOR, -CRD

**49. middle-late-night-debate** *(weight 5)*
McCarthy and Minsky argue at 2am about whether logic or learning is the path forward. Two coffee cups, half a pack of Pall Malls between them.
- L: Side with logic *(req: term-ai-defended)* → +SYM, -CRD (with Minsky)
- R: Side with learning *(req: minsky-allied)* → +CRD, -SYM (with McCarthy)

**50. middle-press-time-magazine** *(weight 6, requires: press-noticed)*
*Time* sends a photographer who wants Minsky next to the IBM 704. Minsky says: *"It's not even our machine."*
- L: Stage the photo → +TRU, -CRD
- R: Decline — it would lie about the workshop → +CRD, -TRU

**51. middle-rockefeller-progress-2** *(weight 7, requires: rockefeller-progress-report-sent)*
Weaver writes again: appreciates the progress note, asks if there will be a published paper before the December grant cycle.
- L: Promise yes → +TRU, +FND, -SYM
- R: Promise to try — no commitment → +CRD, -FND

**52. middle-bench-fire-scare** *(weight 4)*
A capacitor pops on Minsky's bench. No fire, but smoke fills the room and the dean's office calls.
- L: Cover for Minsky; tell the dean it was a coffee-pot incident → +MOR, -CRD, -TRU
- R: Tell the truth → -MOR, +CRD

**53. middle-program-list** *(weight 6)*
Someone asks for a list of programs running at the workshop. It's: Logic Theorist, Samuel's checkers (if shown), and a small matching program McCarthy wrote.
- L: Inflate the list with works-in-progress → +TRU, -CRD
- R: Keep it honest — three programs → +CRD, -TRU

**54. middle-minsky-leaves-early-rumor** *(weight 5, requires: minsky-cooled)*
Word spreads that Minsky might leave a week early. The proposal needs his name on it.
- L: Talk to him — convince him to stay → +CRD, -MOR
- R: Let him go; reframe the proposal without him → -CRD, +SYM, +MOR

**55. middle-end-of-july** *(weight 12, one_shot, position-end-of-middle)*
End of July. Five weeks in, three to go. The Logic Theorist paper is being typed. The 704 has run 84 hours of program time. The proposal still has gaps. McCarthy looks at you and says: *"Now we write it."*
- L: Take the lead on writing *(req: proposal-drafting-yours)* → +SYM, +CRD
- R: Hand it to McCarthy — he should sign his own field into existence *(req: proposal-drafting-mccarthy)* → +CRD, +MOR, -SYM

---

## CLOSING — 25 cards (August)

**56. closing-proposal-opening-paragraph** *(weight 100, one_shot, position-start-of-closing)*
The first paragraph of the proposal. It needs to claim something. McCarthy has written: *"Every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it."*
- L: Keep the sentence intact → +SYM, +TRU, -CRD
- R: Soften it — "many aspects" → +CRD, -SYM, -TRU

**57. closing-naming-final** *(weight 50, one_shot, requires: term-ai-defended OR term-automata-studies)*
The naming debate, final round. Newell and Simon prefer "complex information processing." Shannon prefers "automata studies." McCarthy holds the line on "artificial intelligence." A vote is taken.
- L: Vote for AI *(req: term-ai-defended)* → +SYM, -CRD, the term sticks
- R: Vote against *(req: term-automata-studies)* → +CRD, +TRU, the term doesn't make the cover

**58. closing-shannon-leaves** *(weight 8, requires: shannon-engaged)*
Shannon leaves on August 4 as promised. Hands you a signed cover sheet and says: *"Don't make me regret this."*
- L: Add his name with the workshop's full claim → +TRU, -CRD
- R: Add his name with caveats → +CRD, -TRU

**59. closing-rockefeller-letter-arrives** *(weight 100, one_shot, no requires)*
A letter from Warren Weaver arrives. Rockefeller has approved $7,500. Less than the $13,500 requested.
- L: Accept gracefully; trim the budget → +FND, -MOR
- R: Write back asking for more → -FND, +CRD, -TRU

**60. closing-trim-the-budget** *(weight 7, requires: nothing, follows 59)*
The $7,500 needs to cover stipends, travel, and the 704 hours owed. Something has to be cut.
- L: Cut Solomonoff's last two weeks *(req: solomonoff-stays)* → +FND, -SYM, -MOR
- R: Cut McCarthy's stipend; he won't ask → +FND, -MOR

**61. closing-newell-simon-departure** *(weight 6)*
Newell and Simon fly back to Pittsburgh. They take the Logic Theorist paper with them — they'll publish in IRE Transactions.
- L: Insist on Dartmouth as a co-affiliation → +CRD, -MOR
- R: Let them go; the work is theirs → +MOR, -CRD

**62. closing-minsky-snarc-publication** *(weight 6, requires: minsky-allied)*
Minsky asks if his Snarc work will be cited in the proposal. He's already drafted a separate paper for the *Proceedings of the IRE*.
- L: Cite it prominently → +SYM, +MOR, -CRD
- R: Mention it in a footnote → -MOR, +CRD

**63. closing-press-handling** *(weight 6, requires: press-noticed)*
The *Time* article runs. Headline: "The Thinking Machine." Dean Kemeny calls. Two trustees call.
- L: Defend the article → +TRU, -CRD
- R: Distance the workshop from it → +CRD, -TRU, -MOR

**64. closing-rochester-paper-due** *(weight 6, requires: ibm-relationship-warm)*
Rochester's promised paper is due. He wants it to be the Logic Theorist write-up.
- L: Deliver it on time *(req: lt-demonstrated)* → +CMP, +CRD
- R: Send a smaller paper instead → -CMP, +SYM

**65. closing-wiener-response** *(weight 7, requires: wiener-letter-circulated)*
McCarthy drafts a reply to Wiener. It's measured — but McCarthy wants you to read it before he sends it.
- L: Suggest he soften it → +CRD, -MOR
- R: Suggest he send it as written → +SYM, -CRD

**66. closing-final-paragraph-claim** *(weight 8)*
The final paragraph of the proposal. It claims the workshop will lead to "a significant advance" in the field within "this generation."
- L: Keep the timeline → +TRU, +SYM, -CRD
- R: Strike the timeline → +CRD, -TRU

**67. closing-solomonoff-finishes** *(weight 6, requires: solomonoff-stays)*
Solomonoff completes a draft on inductive inference. He'll keep developing it for years; this is the seed of algorithmic information theory.
- L: Add him as a workshop participant in the proposal → +CRD, +SYM
- R: Let his work stand separately → +MOR, -SYM

**68. closing-the-list-of-attendees** *(weight 7)*
Who lists themselves as a "workshop participant"? Some people came for two days. Some stayed eight weeks. The list will live in the historical record.
- L: List everyone who attended for any duration → +TRU, -CRD
- R: List only those who contributed work → +CRD, -TRU, -MOR

**69. closing-mccarthy-leaving** *(weight 6)*
McCarthy is heading to MIT in the fall. Says you can come — there's a position for an assistant.
- L: Accept → +MOR, +CRD, sets your post-1956 trajectory
- R: Stay at Dartmouth for now → -CRD, +SYM, sets a different trajectory

**70. closing-second-progress-report** *(weight 5)*
Rockefeller wants a final summary report by mid-September. Two pages.
- L: Write it yourself, careful and modest → +CRD, +TRU, -SYM
- R: Let McCarthy write it → +SYM, -CRD

**71. closing-the-term-survives** *(weight 6, requires: term-ai-defended)*
The proposal is filed. The term "artificial intelligence" is on the cover. It will appear in every NSF grant application in the field for the next sixty years.
- L: Take quiet credit → +CRD, +MOR
- R: Stay anonymous in the byline → +TRU, -CRD

**72. closing-the-term-doesnt** *(weight 6, requires: term-automata-studies)*
The proposal is filed. "Automata studies" is on the cover. The term "artificial intelligence" survives only as a phrase in the introduction.
- L: Note it for later — McCarthy will revive the term in 1958 → +CRD, -SYM
- R: Lobby Newell and Simon to use it in their paper → +SYM, -CRD

**73. closing-press-distance** *(weight 5, requires: press-noticed)*
The *Time* photographer's photos run. Minsky comes off looking foolish next to the 704. He blames the workshop.
- L: Apologize publicly → +MOR, -CRD
- R: Tell him it was his agreement → -MOR, +CRD

**74. closing-final-week-tedium** *(weight 4)*
Eight people left, two weeks of paperwork. You spend a day filing reimbursement receipts.
- L: File them all carefully → +FND, +TRU, -MOR
- R: Hand them off to the dean's office → +MOR, -FND

**75. closing-shannon-final-letter** *(weight 6, requires: shannon-engaged)*
Shannon writes from Bell Labs. He's pleased with the workshop's tone but wants his name removed from any subsequent publicity.
- L: Honor the request → +CRD, -TRU
- R: Push back — his name matters → -CRD, +TRU, -MOR

**76. closing-mccarthy-thanks** *(weight 5)*
McCarthy hands you a typewritten letter — a recommendation. Says you can use it for any post you want.
- L: Take it; thank him → +MOR, +CRD
- R: Decline; it's premature → -MOR, +CRD

**77. closing-the-cover-memo** *(weight 8, one_shot)*
The final cover memo. One paragraph, signed by McCarthy, Minsky, Rochester, Shannon. You're the one who types the final draft.
- L: Add a sentence that subtly credits your own contribution → +MOR, -CRD
- R: Keep it to the four signers → +CRD, -MOR

**78. closing-departures-final** *(weight 4)*
The last few participants leave on August 17. The IBM 704 link is closed at the end of the month. You drive Rochester to the train station.
- L: Quiet ride → +MOR, no other change
- R: Use the drive to debrief → +CRD, -MOR

**79. closing-the-dean-debrief** *(weight 5)*
Dean Kemeny asks for a final debrief. Wants to know if the workshop was worth Dartmouth's time.
- L: Make the case yes — name Logic Theorist, name Solomonoff → +TRU (req: lt-demonstrated OR solomonoff-stays)
- R: Be honest — the workshop's value will be known in ten years, not now → +CRD, -TRU

**80. closing-the-summer-ends** *(weight 100, one_shot, position-final, no requires, exhausts pool)*
The Hanover summer ends. The proposal is filed. Whatever you've built, you've built. Whatever you've cut, is cut. McCarthy is at his desk packing for MIT. Outside the window, the leaves are still green.
- L: Go say goodbye → +MOR, the run ends, ending selector decides
- R: Stay and finish typing → +SYM, the run ends, ending selector decides

---

## Card forms
- `standard` is the default card form: speaker title/name, portrait slot, centered prompt, and the regular two-choice swipe controls.
- `letter` is for received correspondence. It suppresses portraits and renders a return-address line, date stamp, justified body, and signature.
- `newswire` is for press/dispatch cards. It suppresses portraits, uses the mono face, and closes with a source/date line.
- `notebook` is for player-perspective field notes. It suppresses portraits, uses lined paper styling, and keeps normal effects/flags like any other card.
- `is_interstitial` marks calendar beat cards. These suppress speaker rendering entirely, use a calendar-page header, usually mirror "Continue" on both choices, and should stay rare enough to pace the run without clustering.

## Notes for Phase 4b
- Every card's `prompt` should be 1–4 sentences in the tone of Suzerain × Universal Paperclips.
- Every prompt must name a real person, paper, place, or amount — at least one. The McCarthy/Shannon/Minsky/Rochester/Newell/Simon/Solomonoff/Selfridge/Samuel/More cast is correct.
- Choice labels stay ≤24 chars.
- Effects shown above are *direction*, not exact magnitudes. Phase 4b tunes magnitudes to land the average run inside one of the 3 main endings, not a boundary collapse, in 60–70 swipes.
- One-shot is the default for all named-event cards. Mark `weight 100` for the cards that MUST appear at specific arc moments (#01, #26, #56, #59, #80).
- nextCardId chains: #01 → #02 (forced); #27 → #28 (forced); #59 → #60 (forced).
- Speaker portraits needed: McCarthy, Shannon, Minsky, Rochester, Newell, Simon, Solomonoff, Selfridge, Samuel, More, Weaver (Rockefeller), Kemeny (Dartmouth dean), Wiener (mentioned not pictured), generic reporter, generic dean's secretary. ~12 actual portraits + ~3 silhouette generics = ~15. (Brief budgeted ~25; we have headroom.)
- Cards 25, 55, 80 are arc-anchor weighted very heavily so they reliably appear at the appropriate swipe count.

## Fact-check log (already done; do not re-verify)
- ✅ McCarthy + Minsky + Rochester + Shannon = 4 original proposers
- ✅ Proposal date: August 31, 1955
- ✅ Rockefeller grant amount: ~$7,500 (requested $13,500)
- ✅ Logic Theorist demoed at Dartmouth, August 1956
- ✅ "Artificial intelligence" coined deliberately to distinguish from cybernetics
- ✅ Solomonoff was the only attendee staying the full 8 weeks
- ✅ Wiener not invited; cybernetics-vs-AI tension real
- ✅ Newell + Simon preferred "complex information processing"
- ✅ Shannon was less convinced; eventual signer with reluctance
- ✅ Steele Hall is on Dartmouth's campus
- ✅ Dean John Kemeny was at Dartmouth in 1956 (later co-invented BASIC, became president)
- ✅ Selfridge's Pandemonium paper appeared 1959 (proto work shown 1956)
- ✅ Samuel's checkers program: IBM, beginning 1952, demoed 1956
- ✅ Snarc: Minsky + Edmonds, Princeton, 1951
