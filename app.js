"use strict";
const K = "eventify-static-v1",
  $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const uid = () => Math.random().toString(36).slice(2, 9);
const when = (d, h) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(h)}:00`;
};
const fmt = (v) =>
  v
    ? new Date(v).toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

function seed() {
  return {
    session: null,
    picks: {},
    users: [
      {
        id: "u1",
        name: "Admin",
        email: "admin@school.edu",
        pw: "admin123",
        role: "admin",
      },
      {
        id: "u2",
        name: "Sam Scorekeeper",
        email: "score@school.edu",
        pw: "score123",
        role: "scorekeeper",
      },
      {
        id: "u3",
        name: "Student Demo",
        email: "student@school.edu",
        pw: "student123",
        role: "student",
      },
    ],
    teams: [
      { id: "rp", name: "Red Phoenix", color: "#DC2626", captain: "Ana Reyes" },
      { id: "bt", name: "Blue Titans", color: "#2563EB", captain: "Ben Cruz" },
      {
        id: "gv",
        name: "Green Vipers",
        color: "#16A34A",
        captain: "Carla Diaz",
      },
      { id: "gh", name: "Gold Hawks", color: "#CA8A04", captain: "Dan Lim" },
    ],
    sports: [
      { id: "bb", name: "Basketball", type: "Team", scoring: "scored" },
      { id: "vb", name: "Volleyball", type: "Team", scoring: "scored" },
      { id: "ch", name: "Chess", type: "Individual", scoring: "winner" },
    ],
    athletes: [
      ["a1", "Ana Reyes", "rp", ["bb", "vb"], "Women"],
      ["a2", "Ben Cruz", "bt", ["bb"], "Men"],
      ["a3", "Carla Diaz", "gv", ["vb", "bb"], "Women"],
      ["a4", "Dan Lim", "gh", ["ch"], "Men"],
      ["a5", "Eli Tan", "rp", ["ch"], "Men"],
      ["a6", "Faye Gomez", "bt", ["vb"], "Women"],
      ["a7", "Gabe Ortiz", "gv", ["ch", "bb"], "Men"],
      ["a8", "Hana Sy", "gh", ["bb", "vb"], "Women"],
      ["a9", "Ivan Ruiz", "rp", ["bb"], "Men"],
      ["a10", "Jia Wu", "gh", ["ch"], "Women"],
    ].map(([id, name, team, sports, gender], i) => ({
      id,
      name,
      team,
      sports,
      gender,
      no: "2024-" + String(i + 1).padStart(3, "0"),
    })),
    matches: [
      {
        id: "m1",
        sport: "bb",
        a: "rp",
        b: "gh",
        when: when(-2, 8),
        venue: "Main Gym",
        sk: "u2",
        res: { s1: 62, s2: 55, st: "approved", w: "rp" },
        live: null,
      },
      {
        id: "m2",
        sport: "bb",
        a: "bt",
        b: "gv",
        when: when(-2, 10),
        venue: "Main Gym",
        sk: "u2",
        res: { s1: 48, s2: 52, st: "approved", w: "gv" },
        live: null,
      },
      {
        id: "m3",
        sport: "bb",
        a: "rp",
        b: "gv",
        when: when(-1, 8),
        venue: "Main Gym",
        sk: "u2",
        res: { s1: 70, s2: 64, st: "pending", w: "rp" },
        live: null,
      },
      {
        id: "m4",
        sport: "vb",
        a: "bt",
        b: "gh",
        when: when(1, 10),
        venue: "Court B",
        sk: "",
        res: null,
        live: null,
      },
      {
        id: "m5",
        sport: "bb",
        a: "bt",
        b: "gh",
        when: when(0, 9),
        venue: "Main Gym",
        sk: "u2",
        res: null,
        live: { s1: 21, s2: 18 },
      },
      {
        id: "m6",
        sport: "vb",
        a: "rp",
        b: "gh",
        when: when(3, 13),
        venue: "Court B",
        sk: "u2",
        res: null,
        live: null,
      },
      {
        id: "m7",
        sport: "ch",
        a: "a4",
        b: "a10",
        when: when(-2, 13),
        venue: "Library",
        sk: "u2",
        res: { s1: 0, s2: 0, st: "approved", w: "a4" },
        live: null,
      },
      {
        id: "m8",
        sport: "ch",
        a: "a5",
        b: "a7",
        when: when(0, 10),
        venue: "Library",
        sk: "u2",
        res: null,
        live: { s1: 0, s2: 0 },
      },
    ],
    news: [
      {
        id: "n1",
        title: "Opening ceremony at 7:30 AM",
        body: "Teams assemble at the oval. Wear your team color.",
      },
      {
        id: "n2",
        title: "Scorekeepers: submit within 15 minutes of the final whistle",
        body: "Admins review results in the order they arrive.",
      },
    ],
  };
}
let D;
try {
  D = JSON.parse(localStorage.getItem(K));
} catch (e) {}
if (!D) D = seed();
D.picks = D.picks || {};
D.athletes.forEach((a) => {
  if (!a.sports) {
    a.sports = a.sport ? [a.sport] : [];
    delete a.sport;
  }
});
D.sports.forEach((s) => {
  s.scoring = s.scoring || (s.type === "Individual" ? "winner" : "scored");
});
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(D));
  } catch (e) {}
};
const me = () => D.users.find((u) => u.id === D.session);
let PREV = {},
  SF = "",
  MODAL = null,
  FS = "",
  AF = { q: "", team: "", sport: "", gender: "" };

const T = (i) => D.teams.find((t) => t.id === i),
  S = (i) => D.sports.find((s) => s.id === i),
  A = (i) => D.athletes.find((a) => a.id === i);
const scored = (sp) => S(sp)?.scoring !== "winner";
const tn = (i) => {
  const t = T(i);
  return t
    ? `<span class="dot" style="background:${esc(t.color)}"></span>${esc(t.name)}`
    : '<span class="mute">Removed team</span>';
};
const pnPlain = (sp, i) =>
  S(sp)?.type === "Individual"
    ? A(i)?.name || "Removed"
    : T(i)?.name || "Removed";
const pn = (sp, i) =>
  S(sp)?.type === "Individual"
    ? A(i)
      ? `${esc(A(i).name)} <small>${esc(T(A(i).team)?.name || "")}</small>`
      : '<span class="mute">Removed</span>'
    : tn(i);
const status = (m) =>
  m.res
    ? m.res.st === "approved"
      ? "Completed"
      : m.res.st === "pending"
        ? "Pending"
        : "Rejected"
    : m.live
      ? "Live"
      : "Scheduled";
const pill = (s) => `<span class="st ${s}">${s}</span>`;
const winnerOf = (m) =>
  m.res
    ? m.res.w || (m.res.s1 > m.res.s2 ? m.a : m.res.s2 > m.res.s1 ? m.b : null)
    : null;
const resText = (m) =>
  scored(m.sport)
    ? `${m.res.s1} - ${m.res.s2}`
    : `Won by ${pnPlain(m.sport, winnerOf(m))}`;
const sportNames = (a) =>
  a.sports
    .map((s) => S(s)?.name)
    .filter(Boolean)
    .join(", ") || "No sports yet";

// Placement points per sport: champion 60, 1st runner-up 30, 2nd runner-up 20, 3rd runner-up 10.
const PTS = [60, 30, 20, 10],
  PL = ["Champion", "1st runner-up", "2nd runner-up", "3rd runner-up"];
const owner = (sp, i) => (S(sp).type === "Individual" ? A(i)?.team : i);
function parts(sp) {
  const s = S(sp);
  if (!s) return [];
  if (s.type === "Individual")
    return D.athletes.filter((a) => a.sports.includes(sp)).map((a) => a.id);
  const ids = new Set([
    ...D.athletes.filter((a) => a.sports.includes(sp)).map((a) => a.team),
    ...D.matches.filter((m) => m.sport === sp).flatMap((m) => [m.a, m.b]),
  ]);
  return D.teams.map((t) => t.id).filter((i) => ids.has(i));
}
function win(sp, key, a, b, r) {
  if (!a || !b) return r === 0 ? a || b || null : null;
  const p = D.picks[sp]?.[key];
  if (p === a || p === b) return p;
  const m = D.matches.find(
    (m) =>
      m.sport === sp &&
      m.res &&
      m.res.st === "approved" &&
      winnerOf(m) &&
      ((m.a === a && m.b === b) || (m.a === b && m.b === a)),
  );
  return m ? winnerOf(m) : null;
}
// Single elimination plus a match between the semifinal losers for 2nd runner-up.
function bracket(sp) {
  const P = parts(sp),
    n = P.length;
  if (n < 2) return null;
  let size = 2;
  while (size < n) size *= 2;
  let o = [1];
  while (o.length < size) o = o.flatMap((x) => [x, o.length * 2 + 1 - x]);
  const seeds = [...P, ...Array(size - n).fill(null)];
  let cur = Array.from({ length: size / 2 }, (_, i) => [
    seeds[o[2 * i] - 1],
    seeds[o[2 * i + 1] - 1],
  ]);
  const rounds = [];
  for (let r = 0; ; r++) {
    const ms = cur.map((p, i) => {
      const key = r + "-" + i;
      return { key, r, a: p[0], b: p[1], w: win(sp, key, p[0], p[1], r) };
    });
    rounds.push(ms);
    if (ms.length === 1) break;
    cur = Array.from({ length: ms.length / 2 }, (_, i) => [
      ms[2 * i].w,
      ms[2 * i + 1].w,
    ]);
  }
  let third = null;
  if (rounds.length >= 2) {
    const semi = rounds[rounds.length - 2],
      real = semi.filter((m) => m.a && m.b),
      lo = semi.map((m) =>
        m.a && m.b && m.w ? (m.w === m.a ? m.b : m.a) : null,
      );
    if (real.length === 2)
      third = {
        key: "3p",
        r: 1,
        a: lo[0],
        b: lo[1],
        w: win(sp, "3p", lo[0], lo[1], 1),
      };
    else if (real.length === 1 && lo.some(Boolean)) {
      const l = lo.find(Boolean);
      third = { key: "3p", r: 0, a: l, b: null, w: l };
    }
  }
  return { rounds, third };
}
function placements(sp) {
  const br = bracket(sp);
  if (!br) return [];
  const f = br.rounds[br.rounds.length - 1][0],
    out = [];
  if (f.w) {
    out.push([f.w, 0]);
    const l = f.w === f.a ? f.b : f.a;
    if (l) out.push([l, 1]);
  }
  const t = br.third;
  if (t && t.w) {
    out.push([t.w, 2]);
    const l = t.w === t.a ? t.b : t.a;
    if (l) out.push([l, 3]);
  }
  return out;
}
function standings(sp) {
  const t = {};
  D.teams.forEach((x) => (t[x.id] = { id: x.id, pts: 0, list: [] }));
  D.sports
    .filter((s) => !sp || s.id === sp)
    .forEach((s) =>
      placements(s.id).forEach(([id, p]) => {
        const o = t[owner(s.id, id)];
        if (o) {
          o.pts += PTS[p];
          o.list.push(`${s.name}: ${PL[p]}`);
        }
      }),
    );
  return Object.values(t).sort(
    (x, y) => y.pts - x.pts || T(x.id).name.localeCompare(T(y.id).name),
  );
}

// Animated standings graph. The bar scale is the most points a team could earn (a champion in every sport), so no bar is full unless a team wins everything.
function chartH(sp) {
  const rows = standings(sp),
    max = (sp ? 1 : Math.max(1, D.sports.length)) * PTS[0];
  return (
    `<ol class="chart" data-stagger>${rows.map((r) => `<li><div class="c-name">${tn(r.id)}<small>${esc(r.list.join(", ") || "No placements yet")}</small></div><div class="c-track" aria-hidden="true"><div class="bar" data-id="${esc(r.id)}" data-w="${Math.round((r.pts / max) * 100)}" style="width:${PREV[r.id] ?? 0}%;background:${esc(T(r.id).color)}"></div></div><b class="c-val">${r.pts}<span class="sr"> points</span></b></li>`).join("")}</ol>` +
    (rows.every((r) => !r.pts)
      ? '<p class="empty">No placements yet. Points are awarded as each sport’s bracket finishes.</p>'
      : "")
  );
}
const growBars = () =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      $$(".bar[data-w]").forEach((b) => {
        b.style.width = b.dataset.w + "%";
        PREV[b.dataset.id] = +b.dataset.w;
      }),
    ),
  );
function stagger(root) {
  if (!root) return;
  const c = $$("[data-stagger]", root);
  if (root.matches("[data-stagger]")) c.push(root);
  c.forEach((x) =>
    [...x.children].forEach((el, i) => {
      el.classList.remove("pop");
      void el.offsetWidth;
      el.style.setProperty("--i", Math.min(i, 14));
      el.classList.add("pop");
    }),
  );
}

const table = (heads, rows, empty = "Nothing here yet.", ids = []) =>
  rows.length
    ? `<div class="scroll"><table><thead><tr>${heads.map((h) => `<th${h[0] === "#" ? ' class="n"' : ""}>${esc(h.replace(/^#/, ""))}</th>`).join("")}</tr></thead><tbody data-stagger>${rows.map((r, j) => `<tr${ids[j] ? ` data-id="${esc(ids[j])}"` : ""}>${r.map((c, i) => `<td${heads[i] && heads[i][0] === "#" ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : `<div class="empty">${empty}</div>`;
const matchLabel = (m) =>
  `${pn(m.sport, m.a)} vs ${esc(pnPlain(m.sport, m.b))}<br><small>${esc(S(m.sport)?.name || "")}</small>`;
const scheduleT = (l) =>
  table(
    ["Match", "When", "Venue", "Status"],
    l.map((m) => [matchLabel(m), fmt(m.when), esc(m.venue), pill(status(m))]),
    "No matches here.",
  );
const newsH = () =>
  D.news.length
    ? `<div data-stagger>${D.news
        .slice()
        .reverse()
        .map(
          (n) =>
            `<p style="margin:0 0 12px"><b>${esc(n.title)}</b><br><span class="mute">${esc(n.body)}</span></p>`,
        )
        .join("")}</div>`
    : '<div class="empty">No announcements yet.</div>';
const upcoming = () =>
  D.matches.filter((m) => !m.res).sort((a, b) => a.when.localeCompare(b.when));
const opts = (l, cur, all) =>
  (all ? `<option value="">${all}</option>` : "") +
  l
    .map(
      ([v, t]) =>
        `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(t)}</option>`,
    )
    .join("");

// Live scoreboards for the home hero.
function boardsH() {
  const live = D.matches.filter((m) => m.live && !m.res);
  if (!live.length) {
    const n = upcoming()[0];
    return `<div class="board"><div class="tag">No matches live right now</div>${n ? `<p class="on-deep">Next: ${esc(pnPlain(n.sport, n.a))} vs ${esc(pnPlain(n.sport, n.b))}<br><small>${fmt(n.when)}, ${esc(n.venue)}</small></p>` : ""}</div>`;
  }
  return `<div class="boards" data-stagger>${live
    .slice(0, 4)
    .map((m) => {
      const sc = scored(m.sport);
      return `<div class="board"><div class="tag live-tag">${esc(S(m.sport)?.name)}, ${esc(m.venue)}</div><div class="row"><div><div class="tm">${esc(pnPlain(m.sport, m.a))}</div>${sc ? `<div class="num score">${m.live.s1}</div>` : ""}</div><div class="num vs">VS</div><div><div class="tm">${esc(pnPlain(m.sport, m.b))}</div>${sc ? `<div class="num score">${m.live.s2}</div>` : ""}</div></div></div>`;
    })
    .join(
      "",
    )}${live.length > 4 ? `<p class="on-deep">+${live.length - 4} more live</p>` : ""}</div>`;
}

// Brackets
function bracketH(sp) {
  const br = bracket(sp);
  if (!br)
    return '<p class="empty">A bracket needs at least two participants.</p>';
  const adm = me()?.role === "admin",
    ind = S(sp).type === "Individual",
    R = br.rounds;
  const nm = (i) =>
    i
      ? ind
        ? `${esc(A(i)?.name || "?")} <small>${esc(T(A(i)?.team)?.name || "")}</small>`
        : tn(i)
      : "";
  const slot = (m, id) => {
    const cls =
        "slot" +
        (id && m.w === id ? " won" : "") +
        (m.w && id && m.w !== id ? " lost" : ""),
      txt = id
        ? nm(id)
        : `<span class="mute">${m.r === 0 ? "Bye" : "To be decided"}</span>`;
    return adm && m.a && m.b && id
      ? `<button class="${cls}" data-act="pick" data-sp="${sp}" data-key="${m.key}" data-w="${esc(id)}" aria-pressed="${m.w === id}">${txt}</button>`
      : `<div class="${cls}">${txt}</div>`;
  };
  const box = (m) => `<div class="bm">${slot(m, m.a)}${slot(m, m.b)}</div>`;
  const rn = (c) =>
      c === 1
        ? "Final"
        : c === 2
          ? "Semifinals"
          : c === 4
            ? "Quarterfinals"
            : `Round of ${c * 2}`,
    pl = placements(sp);
  return `<div class="bracket">${R.map((ms, x) => `<div class="round"><h3>${rn(ms.length)}</h3><div class="ms" data-stagger>${ms.map(box).join("")}</div>${x === R.length - 1 && br.third ? `<h3>2nd runner-up match</h3>${box(br.third)}` : ""}</div>`).join("")}</div>${pl.length ? `<ul class="podium" data-stagger>${pl.map(([id, p]) => `<li><span>${PL[p]}</span><b>${nm(id)}</b><span>${PTS[p]} pts</span></li>`).join("")}</ul>` : ""}${adm ? "<small>Admins: select a name to advance them. Select again to undo.</small>" : ""}`;
}
function sportBody(sp) {
  const ind = S(sp).type === "Individual",
    pt = parts(sp);
  const g = D.teams
    .map((t) => ({
      t,
      as: D.athletes.filter((a) => a.team === t.id && a.sports.includes(sp)),
    }))
    .filter((x) => x.as.length || (!ind && pt.includes(x.t.id)));
  return `<h3>Participants</h3>${g.length ? `<div class="groups" data-stagger>${g.map((x) => `<div class="grp"><b>${tn(x.t.id)}</b>${x.as.length ? `<ul>${x.as.map((a) => `<li>${esc(a.name)}</li>`).join("")}</ul>` : "<small>No athletes registered yet</small>"}</div>`).join("")}</div>` : '<p class="empty">Nobody is registered yet.</p>'}<h3>Bracket</h3>${bracketH(sp)}`;
}

// Pop-up window
function endForm(x) {
  const sc = scored(x.sport),
    c = x.live ||
      (x.res && x.res.st !== "approved" ? x.res : null) || { s1: 0, s2: 0 },
    nm = [pnPlain(x.sport, x.a), pnPlain(x.sport, x.b)];
  return `<form class="mb" data-f="end" data-i="${x.id}">${sc ? `<div class="score-in"><div><label for="e1">${esc(nm[0])}</label><input id="e1" name="s1" type="number" min="0" value="${c.s1}" data-end></div><span class="num" style="font-size:28px">-</span><div><label for="e2">${esc(nm[1])}</label><input id="e2" name="s2" type="number" min="0" value="${c.s2}" data-end></div></div>` : `<fieldset class="checks"><legend>Who won?</legend>${[x.a, x.b].map((id, j) => `<label class="chk"><input type="radio" name="w" value="${esc(id)}" data-end${x.res?.w === id ? " checked" : ""}>${esc(nm[j])}</label>`).join("")}</fieldset>`}<p id="endres" role="status"></p><button class="btn" id="endgo" disabled>End match</button></form>`;
}
function endPreview(f) {
  const x = D.matches.find((m) => m.id === f.dataset.i);
  if (!x) return null;
  const fd = new FormData(f);
  let w = null,
    msg = "";
  if (scored(x.sport)) {
    const a = fd.get("s1"),
      b = fd.get("s2");
    if (a === "" || b === "" || +a < 0 || +b < 0) msg = "Enter both scores.";
    else if (+a === +b) msg = "Scores are tied. Someone has to win.";
    else w = +a > +b ? x.a : x.b;
  } else {
    w = fd.get("w");
    if (!w) msg = "Pick the winner.";
  }
  $("#endres", f).innerHTML = w
    ? `Winner: <b>${esc(pnPlain(x.sport, w))}</b>`
    : esc(msg);
  $("#endgo", f).disabled = !w;
  return w;
}
function modalHtml() {
  const m = MODAL;
  if (!m) return "";
  const head = (t, s) =>
    `<div class="mh"><div><h2>${t}</h2>${s ? `<small>${s}</small>` : ""}</div><button class="btn ghost" data-act="close">Close</button></div>`;
  if (m.type === "sport") {
    const s = S(m.id);
    return s
      ? head(
          esc(s.name),
          `${s.type} sport, ${scored(s.id) ? "scored" : "winner is picked, no scores"}`,
        ) + `<div class="mb">${sportBody(s.id)}</div>`
      : "";
  }
  if (m.type === "team") {
    const t = T(m.id);
    if (!t) return "";
    const as = D.athletes.filter((a) => a.team === t.id);
    return (
      head(tn(t.id), `Captain: ${esc(t.captain)}`) +
      `<div class="mb">${as.length ? `<ul class="roster" data-stagger>${as.map((a) => `<li><span>${esc(a.name)}</span><small>${esc(sportNames(a))}</small></li>`).join("")}</ul>` : '<p class="empty">No athletes on this team yet.</p>'}</div>`
    );
  }
  if (m.type === "end") {
    const x = D.matches.find((y) => y.id === m.id);
    return x
      ? head(
          "End match",
          `${esc(pnPlain(x.sport, x.a))} vs ${esc(pnPlain(x.sport, x.b))}`,
        ) + endForm(x)
      : "";
  }
  return "";
}
function openModal() {
  const d = $("#dlg");
  d.innerHTML = modalHtml();
  if (!d.open) d.showModal();
  stagger(d);
  const f = $('form[data-f="end"]', d);
  if (f) endPreview(f);
}
function closeModal() {
  MODAL = null;
  const d = $("#dlg");
  if (d.open) d.close();
}
$("#dlg").addEventListener("close", () => {
  MODAL = null;
});
$("#dlg").addEventListener("click", (e) => {
  if (e.target.id === "dlg") closeModal();
});

function athletesList() {
  const q = AF.q.trim().toLowerCase();
  const l = D.athletes.filter(
    (a) =>
      (!q ||
        a.name.toLowerCase().includes(q) ||
        a.no.toLowerCase().includes(q)) &&
      (!AF.team || a.team === AF.team) &&
      (!AF.sport || a.sports.includes(AF.sport)) &&
      (!AF.gender || a.gender === AF.gender),
  );
  return (
    `<p class="mute" role="status">${l.length} of ${D.athletes.length} athletes</p>` +
    table(
      ["Name", "Student no.", "Team", "Category", "Sports"],
      l.map((a) => [
        esc(a.name),
        esc(a.no),
        tn(a.team),
        esc(a.gender),
        esc(sportNames(a)),
      ]),
      "No athletes match. Try a different search or clear the filters.",
    )
  );
}

// Admin CRUD definitions: [key, label, type, options()]
const teamO = () => D.teams.map((t) => [t.id, t.name]),
  sportO = () => D.sports.map((s) => [s.id, s.name]),
  skO = () => [
    ["", "Unassigned"],
    ...D.users
      .filter((u) => u.role === "scorekeeper")
      .map((u) => [u.id, u.name]),
  ];
const partO = (sp) =>
  S(sp)?.type === "Individual"
    ? D.athletes
        .filter((a) => a.sports.includes(sp))
        .map((a) => [a.id, `${a.name} (${T(a.team)?.name || ""})`])
    : teamO();
const ENT = {
  teams: {
    l: "Team",
    f: [
      ["name", "Team name"],
      ["color", "Color", "color"],
      ["captain", "Captain"],
    ],
  },
  athletes: {
    l: "Athlete",
    f: [
      ["name", "Full name"],
      ["team", "Team", "select", teamO],
      ["no", "Student number"],
      [
        "gender",
        "Category",
        "select",
        () => ["Men", "Women", "Mixed"].map((x) => [x, x]),
      ],
      ["sports", "Sports", "checks", sportO],
    ],
  },
  sports: {
    l: "Sport",
    f: [
      ["name", "Sport name"],
      [
        "type",
        "Type",
        "select",
        () => [
          ["Team", "Team"],
          ["Individual", "Individual"],
        ],
      ],
      [
        "scoring",
        "Scoring",
        "select",
        () => [
          ["scored", "Uses scores"],
          ["winner", "No scores, the winner is picked"],
        ],
      ],
    ],
  },
  matches: {
    l: "Match",
    f: [
      ["sport", "Sport", "select", sportO],
      ["a", "Side A", "select", () => partO(FS)],
      ["b", "Side B", "select", () => partO(FS)],
      ["when", "Date and time", "datetime-local"],
      ["venue", "Venue"],
      ["sk", "Scorekeeper", "select", skO],
    ],
  },
  news: {
    l: "Announcement",
    f: [
      ["title", "Title"],
      ["body", "Details", "textarea"],
    ],
  },
};
let EDIT = {};
const show = (f, v) => {
  const [, , t, o] = f;
  if (t === "select")
    return esc((o().find((x) => x[0] === v) || ["", ""])[1] || "-");
  if (t === "checks")
    return esc(
      o()
        .filter((x) => (v || []).includes(x[0]))
        .map((x) => x[1])
        .join(", ") || "-",
    );
  if (t === "color")
    return `<span class="dot" style="background:${esc(v)}"></span>${esc(v)}`;
  if (t === "datetime-local") return fmt(v);
  return esc(v);
};
const field = (f, v) => {
  const [k, l, t = "text", o] = f;
  const i = "f-" + k;
  if (t === "checks")
    return `<fieldset class="checks"><legend>${l}</legend>${
      o()
        .map(
          ([a, b]) =>
            `<label class="chk"><input type="checkbox" name="${k}" value="${esc(a)}"${(v || []).includes(a) ? " checked" : ""}>${esc(b)}</label>`,
        )
        .join("") || '<span class="mute">Add a sport first.</span>'
    }</fieldset>`;
  const inp =
    t === "select"
      ? `<select name="${k}" id="${i}">${opts(o(), v)}</select>`
      : t === "textarea"
        ? `<textarea name="${k}" id="${i}" rows="3" required>${esc(v)}</textarea>`
        : `<input name="${k}" id="${i}" type="${t}" value="${esc(v ?? (t === "color" ? "#2563EB" : ""))}"${t === "text" || t === "datetime-local" ? " required" : ""}>`;
  return `<label for="${i}">${l}</label>${inp}`;
};
const TABS = [
  ["admin", "Overview"],
  ["admin/results", "Review results"],
  ["admin/matches", "Matches"],
  ["admin/teams", "Teams"],
  ["admin/athletes", "Athletes"],
  ["admin/sports", "Sports"],
  ["admin/news", "Announcements"],
  ["admin/users", "Accounts"],
];
const tabs = (cur) =>
  `<div class="tabs">${TABS.map(([h, l]) => `<a href="#${h}"${h === cur ? ' class="on"' : ""}>${l}</a>`).join("")}</div>`;

function manage(k) {
  const E = ENT[k],
    ed = EDIT[k] && D[k].find((x) => x.id === EDIT[k]);
  if (k === "matches") FS = ed ? ed.sport : S(FS) ? FS : D.sports[0]?.id || "";
  const btn = (act, txt, cls, x) =>
    `<button class="btn ${cls}" data-act="${act}" data-k="${k}" data-i="${x.id}">${txt}</button>`;
  const rows = D[k].map((x) =>
    k === "matches"
      ? [
          matchLabel(x),
          fmt(x.when),
          esc(x.venue),
          esc(D.users.find((u) => u.id === x.sk)?.name || "-"),
          pill(status(x)) +
            (x.res
              ? ` <small>${esc(resText(x))}</small>`
              : x.live && scored(x.sport)
                ? ` <small>${x.live.s1} - ${x.live.s2}</small>`
                : ""),
          (!x.res && !x.live ? btn("golive", "Start", "ghost", x) : "") +
            (!x.res || x.res.st !== "approved"
              ? btn("end", "End match", "ok", x)
              : "") +
            (x.res ? btn("clearres", "Clear result", "ghost", x) : "") +
            btn("edit", "Edit", "ghost", x) +
            btn("del", "Delete", "no", x),
        ]
      : [
          ...E.f.map((f) => show(f, x[f[0]])),
          btn("edit", "Edit", "ghost", x) + btn("del", "Delete", "no", x),
        ],
  );
  const heads =
    k === "matches"
      ? ["Match", "When", "Venue", "Scorekeeper", "Status", ""]
      : [...E.f.map((f) => f[1]), ""];
  return (
    tabs("admin/" + k) +
    `<div class="grid xgrid"><div class="card"><h2>${ed ? "Edit" : "Add"} ${E.l.toLowerCase()}</h2><form data-f="ent" data-k="${k}">${E.f.map((f) => field(f, ed ? ed[f[0]] : "")).join("")}<button class="btn">Save ${E.l.toLowerCase()}</button>${ed ? `<button type="button" class="btn ghost" data-act="cancel" data-k="${k}">Cancel</button>` : ""}</form></div>
 <div class="card">${table(
   heads,
   rows,
   "Nothing here yet.",
   D[k].map((x) => x.id),
 )}${D[k].length ? `<button class="btn no" data-act="clear" data-k="${k}">Clear all ${E.l.toLowerCase()}s</button>` : ""}</div></div>`
  );
}
function remove(k, ids) {
  const has = (x) => ids.includes(x);
  D[k] = D[k].filter((x) => !has(x.id));
  if (k === "teams") {
    D.athletes = D.athletes.filter((x) => !has(x.team));
    D.matches = D.matches.filter((m) => !has(m.a) && !has(m.b));
  }
  if (k === "athletes")
    D.matches = D.matches.filter((m) => !has(m.a) && !has(m.b));
  if (k === "sports") {
    D.matches = D.matches.filter((m) => !has(m.sport));
    D.athletes.forEach((x) => (x.sports = x.sports.filter((s) => !has(s))));
    ids.forEach((i) => delete D.picks[i]);
  }
}
const pendingH = () => {
  if (me()?.role !== "admin") return "";
  const p = D.matches.filter((m) => m.res && m.res.st === "pending");
  return p.length
    ? `<div class="card"><h2>Waiting for approval</h2>${table(
        ["Match", "Result", ""],
        p.map((m) => [
          matchLabel(m),
          `<b>${esc(resText(m))}</b>`,
          `<button class="btn ok" data-act="approve" data-i="${m.id}">Approve</button>`,
        ]),
        "",
        p.map((m) => m.id),
      )}</div>`
    : "";
};
const selF = (a, cur, all, l) =>
  `<select data-af="${a}" aria-label="${l}">${opts(l === "Filter by team" ? teamO() : l === "Filter by sport" ? sportO() : ["Men", "Women", "Mixed"].map((x) => [x, x]), cur, all)}</select>`;

function scoreCard(m) {
  const sc = scored(m.sport),
    l = m.live,
    nm = [pnPlain(m.sport, m.a), pnPlain(m.sport, m.b)];
  const bump = (s, j) =>
    `<div class="bump"><span>${esc(nm[j])}</span><button class="btn ghost" data-act="bump" data-i="${m.id}" data-s="${s}" data-d="-1" aria-label="Subtract one point from ${esc(nm[j])}">-1</button><b class="num live-n">${l ? l["s" + s] : 0}</b><button class="btn" data-act="bump" data-i="${m.id}" data-s="${s}" data-d="1" aria-label="Add one point to ${esc(nm[j])}">+1</button></div>`;
  return `<div class="card"><h2>${esc(nm[0])} vs ${esc(nm[1])}</h2><small>${esc(S(m.sport)?.name)}, ${fmt(m.when)}, ${esc(m.venue)}${m.res ? " (rejected, submit again)" : ""}</small>
 ${l ? (sc ? bump(1, 0) + bump(2, 1) : '<p class="mute">In progress.</p>') : `<button class="btn ghost" data-act="golive" data-i="${m.id}">Go live</button>`}
 <form data-f="score" data-i="${m.id}">${sc ? `<div class="score-in"><input name="s1" type="number" min="0" value="${l ? l.s1 : 0}" aria-label="Final score for ${esc(nm[0])}"><span class="num" style="font-size:28px">-</span><input name="s2" type="number" min="0" value="${l ? l.s2 : 0}" aria-label="Final score for ${esc(nm[1])}"></div>` : `<fieldset class="checks"><legend>Winner</legend>${[m.a, m.b].map((id, j) => `<label class="chk"><input type="radio" name="w" value="${esc(id)}" required>${esc(nm[j])}</label>`).join("")}</fieldset>`}<button class="btn">Submit final result</button></form></div>`;
}

const V = {
  home() {
    return `<section class="hero"><div><h1>Every match, score, and ranking in one place.</h1><p>Follow the intramurals. Schedules, official results, and standings update as soon as an admin approves them.</p></div>${boardsH()}</section>
 <div class="grid" data-stagger><div class="card"><h2>Team standings</h2>${chartH()}</div><div class="card"><h2>Upcoming matches</h2>${scheduleT(upcoming().slice(0, 5))}</div><div class="card"><h2>Announcements</h2>${newsH()}</div></div>`;
  },
  sports: () =>
    `<div class="grid xgrid" data-stagger>${D.sports.map((s) => `<button class="card tile" data-act="open" data-m="sport" data-i="${s.id}"><b>${esc(s.name)}</b><small>${s.type} sport, ${parts(s.id).length} ${s.type === "Team" ? "teams" : "athletes"}</small></button>`).join("") || '<div class="empty">No sports yet.</div>'}</div>`,
  teams: () =>
    `<div class="grid xgrid" data-stagger>${D.teams.map((t) => `<button class="card tile" data-act="open" data-m="team" data-i="${t.id}"><b>${tn(t.id)}</b><small>Captain: ${esc(t.captain)}, ${D.athletes.filter((a) => a.team === t.id).length} athletes</small></button>`).join("") || '<div class="empty">No teams yet.</div>'}</div>`,
  athletes: () =>
    `<div class="card"><div class="filters"><input type="search" data-af="q" value="${esc(AF.q)}" placeholder="Search name or student number" aria-label="Search athletes">${selF("team", AF.team, "All teams", "Filter by team")}${selF("sport", AF.sport, "All sports", "Filter by sport")}${selF("gender", AF.gender, "All categories", "Filter by category")}<button class="btn ghost" data-act="clearf">Clear</button></div><div id="al">${athletesList()}</div></div>`,
  schedule: () => `<div class="card">${scheduleT(upcoming())}</div>`,
  results: () =>
    `<div class="card">${table(
      ["Match", "Result", "When"],
      D.matches
        .filter((m) => m.res && m.res.st === "approved")
        .map((m) => [
          matchLabel(m),
          `<b class="num" style="font-size:22px">${esc(resText(m))}</b>`,
          fmt(m.when),
        ]),
      "No official results yet.",
    )}</div>`,
  standings: () =>
    `<div class="grid xgrid" data-stagger><div class="card"><select data-sf aria-label="Filter standings by sport">${opts(sportO(), SF, "All sports")}</select><div id="chart">${chartH(SF)}</div></div>${pendingH()}</div>`,
  news: () => `<div class="card">${newsH()}</div>`,
  login(sub) {
    const up = sub === "new";
    return `<div class="card login"><h2>${up ? "Create student account" : "Sign in"}</h2>
 <form data-f="${up ? "register" : "login"}">${up ? field(["name", "Full name"], "") : ""}${field(["email", "Email", "email"], "")}${field(["pw", "Password", "password"], "")}<button class="btn">${up ? "Create account" : "Sign in"}</button></form>
 <p><a href="#login${up ? "" : "/new"}">${up ? "I already have an account" : "Create a student account"}</a></p>
 ${up ? "" : "<small>Demo accounts: admin@school.edu / admin123, score@school.edu / score123, student@school.edu / student123</small>"}</div>`;
  },
  student() {
    const u = me();
    return `<h2>Welcome, ${esc(u.name)}</h2><div class="stats" data-stagger><div class="stat"><div class="num">${upcoming().length}</div><span>Upcoming matches</span></div><div class="stat"><div class="num">${D.matches.filter((m) => status(m) === "Completed").length}</div><span>Official results</span></div></div>
 <div class="grid" data-stagger><div class="card"><h2>Standings</h2>${chartH()}</div><div class="card"><h2>Announcements</h2>${newsH()}</div><div class="card"><h2>Schedule</h2>${scheduleT(upcoming())}</div></div>`;
  },
  scorekeeper() {
    const u = me(),
      mine = D.matches.filter((m) => m.sk === u.id),
      open = mine.filter((m) => !m.res || m.res.st === "rejected");
    return `<h2>My matches</h2><div class="grid xgrid" data-stagger>${open.map(scoreCard).join("") || '<div class="card empty">All your matches are submitted. Nothing to enter right now.</div>'}</div>
 <div class="grid"><div class="card"><h2>Match history</h2>${table(
   ["Match", "Result", "Status"],
   mine
     .filter((m) => m.res)
     .map((m) => [matchLabel(m), `<b>${esc(resText(m))}</b>`, pill(status(m))]),
   "No submissions yet.",
 )}</div></div>`;
  },
  admin(sub) {
    if (!sub)
      return (
        tabs("admin") +
        `<div class="stats" data-stagger><div class="stat"><div class="num">${D.teams.length}</div><span>Teams</span></div><div class="stat"><div class="num">${D.athletes.length}</div><span>Athletes</span></div><div class="stat"><div class="num">${D.sports.length}</div><span>Sports</span></div><div class="stat"><div class="num">${D.matches.length}</div><span>Matches</span></div><div class="stat"><div class="num">${D.matches.filter((m) => m.live && !m.res).length}</div><span>Live now</span></div><div class="stat"><div class="num" style="color:var(--accent-ink)">${D.matches.filter((m) => m.res && m.res.st === "pending").length}</div><span>Awaiting review</span></div></div>
 <div class="grid xgrid" data-stagger><div class="card"><h2>Standings</h2>${chartH()}</div><div class="card"><h2>Data</h2><p class="mute">Clear every team, athlete, sport, match, and announcement, or go back to the sample data. Accounts are kept.</p><button class="btn no" data-act="wipe">Clear all data</button><button class="btn ghost" data-act="restore">Restore sample data</button></div></div>`
      );
    if (sub === "results") {
      const p = D.matches.filter((m) => m.res && m.res.st === "pending");
      return (
        tabs("admin/results") +
        `<div class="card">${table(
          ["Match", "Result", "Scorekeeper", ""],
          p.map((m) => [
            matchLabel(m),
            `<b class="num" style="font-size:24px">${esc(resText(m))}</b>`,
            esc(D.users.find((u) => u.id === m.sk)?.name || "-"),
            `<button class="btn ok" data-act="approve" data-i="${m.id}">Approve</button><button class="btn no" data-act="reject" data-i="${m.id}">Reject</button>`,
          ]),
          "Nothing waiting. New submissions show up here.",
          p.map((m) => m.id),
        )}</div>`
      );
    }
    if (sub === "users")
      return (
        tabs("admin/users") +
        `<div class="card"><p class="mute">Public sign-up only creates students. Promote scorekeepers here.</p>${table(
          ["Name", "Email", "Role"],
          D.users.map((u) => [
            esc(u.name),
            esc(u.email),
            u.id === D.session
              ? esc(u.role)
              : `<select data-role="${u.id}" aria-label="Role for ${esc(u.name)}">${["student", "scorekeeper", "admin"].map((r) => `<option${r === u.role ? " selected" : ""}>${r}</option>`).join("")}</select>`,
          ]),
        )}</div>`
      );
    return ENT[sub] ? manage(sub) : V.admin("");
  },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const canStore = (() => {
  try {
    localStorage.setItem("__t", "1");
    localStorage.removeItem("__t");
    return true;
  } catch (e) {
    return false;
  }
})();
let ready = false,
  FLASH = null,
  LAST = "",
  SYNC = "",
  syncT,
  pending = 0;
const SYNC_TXT = { saving: "Saving…", saved: "Saved", error: "Not saved" };
const fail = (f, m) => {
  f.classList.remove("shake");
  void f.offsetWidth;
  f.classList.add("shake");
  toast(m, "error");
};
function toast(t, kind = "") {
  const e = $("#toast");
  e.textContent = t;
  e.className = "toast " + kind;
  e.hidden = false;
  void e.offsetWidth;
  e.classList.add("in");
  clearTimeout(toast.h);
  toast.h = setTimeout(() => {
    e.classList.remove("in");
    setTimeout(() => {
      if (!e.classList.contains("in")) e.hidden = true;
    }, 260);
  }, 2400);
}
function setSync(s) {
  SYNC = s;
  const e = $("#sync");
  if (e) {
    e.textContent = SYNC_TXT[s] || "";
    e.dataset.s = s;
  }
  clearTimeout(syncT);
  if (s === "saved") syncT = setTimeout(() => setSync(""), 1600);
}
// Stand-in for a server call. Swap this for fetch() when you add a backend.
async function sync() {
  await wait(350);
  if (!canStore) return true;
  try {
    localStorage.setItem(K, JSON.stringify(D));
    return true;
  } catch (e) {
    return false;
  }
}
// Optimistic update: change the UI first, save in the background, undo if the save fails.
async function commit(mutate, msg, flash) {
  const snap = JSON.stringify(D);
  mutate();
  FLASH = flash || null;
  render();
  if (msg) toast(msg);
  pending++;
  setSync("saving");
  const ok = await sync();
  pending--;
  if (!ok) {
    D = JSON.parse(snap);
    FLASH = null;
    render();
    toast("Couldn’t save, so the change was undone", "error");
  }
  if (!pending) setSync(ok ? "saved" : "error");
}
const skeleton = () =>
  `<div class="grid" aria-busy="true" aria-label="Loading">${[0, 1, 2, 3].map(() => '<div class="card"><div class="sk" style="width:40%"></div><div class="sk"></div><div class="sk"></div><div class="sk" style="width:70%"></div></div>').join("")}</div>`;

function render() {
  const [r0, sub] = location.hash.slice(1).split("/");
  const r = V[r0] ? r0 : "home",
    u = me();
  const need = {
    admin: u && u.role === "admin",
    scorekeeper: u && u.role === "scorekeeper",
    student: !!u,
  };
  if (r in need && !need[r]) {
    location.hash = "login";
    return;
  }
  const pub = [
    "home",
    "sports",
    "teams",
    "athletes",
    "schedule",
    "results",
    "standings",
    "news",
  ];
  const label = {
    home: "Home",
    sports: "Sports",
    teams: "Teams",
    athletes: "Athletes",
    schedule: "Schedule",
    results: "Results",
    standings: "Standings",
    news: "News",
  };
  $("#nav").innerHTML =
    `<a class="logo" href="#home">Event<b>ify</b></a>${pub.map((p) => `<a href="#${p}"${p === r ? ' class="on"' : ""}>${label[p]}</a>`).join("")}${u ? `<a href="#${u.role}"${r === u.role ? ' class="on"' : ""}>Dashboard</a><button data-act="logout">Sign out</button>` : `<a href="#login"${r === "login" ? ' class="on"' : ""}>Sign in</a>`}<span id="sync" class="sync" role="status" data-s="${SYNC}">${SYNC_TXT[SYNC] || ""}</span>`;
  const app = $("#app");
  if (!ready) {
    app.innerHTML = skeleton();
    return;
  }
  const key = r + "/" + (sub || ""),
    moved = key !== LAST;
  LAST = key;
  if (moved) PREV = {};
  app.innerHTML = V[r](sub);
  if (moved) {
    window.scrollTo(0, 0);
    stagger(app);
  }
  growBars();
  if (MODAL) {
    if (moved) closeModal();
    else {
      const h = modalHtml();
      if (!h) closeModal();
      else {
        const d = $("#dlg");
        if (d.open) d.innerHTML = h;
      }
    }
  }
  if (FLASH) {
    const el = $(`[data-id="${FLASH}"]`);
    if (el) el.classList.add("flash");
    FLASH = null;
  }
}

function arm(a) {
  if (a.dataset.armed) return true;
  a.dataset.armed = 1;
  const t = a.textContent;
  a.textContent = "Tap again to confirm";
  setTimeout(() => {
    if (a.isConnected) {
      delete a.dataset.armed;
      a.textContent = t;
    }
  }, 3500);
  return false;
}
const mt = (i) => D.matches.find((x) => x.id === i);
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-act]");
  if (!a) return;
  const { act, k, i } = a.dataset;
  if (act === "logout") {
    D.session = null;
    save();
    location.hash = "home";
    render();
    return;
  }
  if (act === "edit") {
    EDIT[k] = i;
    render();
    return;
  }
  if (act === "cancel") {
    EDIT[k] = null;
    render();
    return;
  }
  if (act === "open") {
    MODAL = { type: a.dataset.m, id: i };
    openModal();
    return;
  }
  if (act === "end") {
    MODAL = { type: "end", id: i };
    openModal();
    return;
  }
  if (act === "close") {
    closeModal();
    return;
  }
  if (act === "clearf") {
    AF = { q: "", team: "", sport: "", gender: "" };
    render();
    return;
  }
  if (act === "golive") {
    commit(() => {
      mt(i).live = { s1: 0, s2: 0 };
    }, "Match is live");
    return;
  }
  if (act === "bump") {
    const s = "s" + a.dataset.s,
      d = +a.dataset.d;
    commit(() => {
      const l = mt(i).live;
      l[s] = Math.max(0, l[s] + d);
    });
    return;
  }
  if (act === "pick") {
    const { sp, key, w } = a.dataset;
    commit(() => {
      const p = (D.picks[sp] = D.picks[sp] || {});
      if (p[key] === w) delete p[key];
      else p[key] = w;
    }, "Bracket updated");
    return;
  }
  if (act === "del") {
    if (arm(a)) commit(() => remove(k, [i]), "Deleted");
    return;
  }
  if (act === "clear") {
    if (arm(a))
      commit(
        () =>
          remove(
            k,
            D[k].map((x) => x.id),
          ),
        "Cleared",
      );
    return;
  }
  if (act === "clearres") {
    commit(() => {
      mt(i).res = null;
    }, "Result cleared");
    return;
  }
  if (act === "wipe") {
    if (arm(a))
      commit(() => {
        ["teams", "athletes", "sports", "matches", "news"].forEach(
          (x) => (D[x] = []),
        );
        D.picks = {};
      }, "All data cleared");
    return;
  }
  if (act === "restore") {
    if (arm(a))
      commit(() => {
        const s = seed();
        ["teams", "athletes", "sports", "matches", "news", "picks"].forEach(
          (x) => (D[x] = s[x]),
        );
      }, "Sample data restored");
    return;
  }
  if (act === "approve" || act === "reject")
    commit(
      () => {
        mt(i).res.st = act === "approve" ? "approved" : "rejected";
      },
      act === "approve" ? "Approved" : "Rejected",
    );
});
document.addEventListener("input", (e) => {
  const t = e.target,
    f = t.closest("[data-af]");
  if (f) {
    AF[f.dataset.af] = f.value;
    const al = $("#al");
    al.innerHTML = athletesList();
    stagger(al);
    return;
  }
  if (t.matches("[data-sf]")) {
    SF = t.value;
    $("#chart").innerHTML = chartH(SF);
    growBars();
    return;
  }
  if (t.matches("[data-end]")) {
    endPreview(t.form);
    return;
  }
  if (t.id === "f-sport" && t.form?.dataset.k === "matches") {
    FS = t.value;
    ["a", "b"].forEach((n) => {
      $("#f-" + n).innerHTML = opts(partO(FS), "");
    });
  }
});
document.addEventListener("change", (e) => {
  const s = e.target.closest("[data-role]");
  if (s)
    commit(() => {
      D.users.find((u) => u.id === s.dataset.role).role = s.value;
    }, "Role updated");
});
document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target,
    fd = new FormData(f),
    g = (n) => String(fd.get(n) || "").trim(),
    b = f.querySelector(".btn"),
    t = f.dataset.f;
  if (t === "login" || t === "register") {
    if (t === "register" && g("pw").length < 6)
      return fail(f, "Use at least 6 characters");
    const label = b.textContent,
      undo = () => {
        b.classList.remove("busy");
        b.disabled = false;
        b.textContent = label;
      };
    b.classList.add("busy");
    b.disabled = true;
    b.textContent = t === "login" ? "Signing in…" : "Creating account…";
    await wait(450);
    const email = g("email").toLowerCase();
    if (t === "login") {
      const u = D.users.find(
        (x) => x.email.toLowerCase() === email && x.pw === g("pw"),
      );
      if (!u) {
        undo();
        return fail(f, "Email or password is wrong");
      }
      D.session = u.id;
      save();
      location.hash = u.role;
    } else {
      if (D.users.some((x) => x.email.toLowerCase() === email)) {
        undo();
        return fail(f, "That email already has an account");
      }
      const u = {
        id: uid(),
        name: g("name"),
        email: g("email"),
        pw: g("pw"),
        role: "student",
      };
      D.users.push(u);
      D.session = u.id;
      save();
      location.hash = "student";
    }
    return;
  }
  if (t === "score") {
    const m = mt(f.dataset.i);
    let res;
    if (scored(m.sport)) {
      const s1 = parseInt(g("s1"), 10),
        s2 = parseInt(g("s2"), 10);
      if (!(s1 >= 0 && s2 >= 0)) return fail(f, "Enter scores of 0 or more");
      if (s1 === s2)
        return fail(f, "Scores can’t be tied. Someone has to win.");
      res = { s1, s2, st: "pending", w: s1 > s2 ? m.a : m.b };
    } else {
      if (!g("w")) return fail(f, "Pick the winner");
      res = { s1: 0, s2: 0, st: "pending", w: g("w") };
    }
    commit(() => {
      const x = mt(m.id);
      x.res = res;
      x.live = null;
    }, "Submitted for approval");
    return;
  }
  if (t === "end") {
    const w = endPreview(f);
    if (!w) return fail(f, "Pick a winner first");
    const m = mt(f.dataset.i),
      sc = scored(m.sport);
    const res = {
        s1: sc ? +g("s1") : 0,
        s2: sc ? +g("s2") : 0,
        st: "approved",
        w,
      },
      name = pnPlain(m.sport, w);
    closeModal();
    commit(() => {
      const x = mt(m.id);
      x.res = res;
      x.live = null;
    }, `Match ended. ${name} wins`);
    return;
  }
  if (t === "ent") {
    const k = f.dataset.k,
      E = ENT[k],
      o = {};
    E.f.forEach(([n, , ty]) => (o[n] = ty === "checks" ? fd.getAll(n) : g(n)));
    if (k === "matches") {
      if (!o.a || !o.b || o.a === o.b)
        return fail(f, "Pick two different sides");
      const ok = partO(o.sport).map((x) => x[0]);
      if (!ok.includes(o.a) || !ok.includes(o.b))
        return fail(f, "Pick sides registered in this sport");
    }
    if (k === "teams" && !/^#[0-9a-f]{6}$/i.test(o.color)) o.color = "#2563EB";
    const editing = EDIT[k],
      nid = editing || uid();
    commit(
      () => {
        if (editing) {
          Object.assign(
            D[k].find((x) => x.id === editing),
            o,
          );
          EDIT[k] = null;
        } else
          D[k].push({
            id: nid,
            ...o,
            ...(k === "matches" ? { res: null, live: null } : {}),
          });
      },
      "Saved",
      nid,
    );
  }
});
addEventListener("hashchange", render);
render();
setTimeout(() => {
  ready = true;
  render();
  if (!canStore)
    toast("Changes won’t be kept after you close this tab", "error");
}, 450);
