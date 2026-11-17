(function () {
  var screens = window.PROTO_SCREENS || [], links = window.PROTO_LINKS || {}, header = window.PROTO_HEADER || [];
  var id = document.body.getAttribute("data-screen");
  var byId = {}; screens.forEach(function (s, i) { s.i = i; byId[s.id] = s; });
  var me = byId[id], root = document.querySelector(".artboard > [data-id]");
  function go(t) { if (byId[t]) location.href = byId[t].slug + ".html"; }

  function ownText(el) {
    var s = ""; el.childNodes.forEach(function (n) { if (n.nodeType === 3) s += n.nodeValue; });
    return s.replace(/\s+/g, " ").trim();
  }
  var all = Array.prototype.slice.call(root.querySelectorAll("*"));
  function find(text) { return all.filter(function (el) { return ownText(el) === text; }); }
  function climb(el, o) {
    if (o.up !== undefined) { for (var i = 0; i < o.up && el.parentElement !== root; i++) el = el.parentElement; return el; }
    if (o.wide) { while (el.parentElement !== root && el.getBoundingClientRect().width < o.wide) el = el.parentElement; return el; }
    function quiet(p, c) {
      return Array.prototype.every.call(p.children, function (x) {
        var t = x.textContent.trim(); return x === c || !t || /^[a-z_]+$|^\(?\d+\)?$/.test(t);
      });
    }
    while (el.parentElement && el.parentElement !== root && el.parentElement.children.length <= 3 &&
           el.parentElement.getBoundingClientRect().width < 480 && quiet(el.parentElement, el)) el = el.parentElement;
    return el;
  }
  var outside = null, hotspots = [];
  function bind(spec) {
    var text = spec[0], target = spec[1], o = spec[2] || {};
    if (text === "@outside") { outside = target; return; }
    if (text === "@auto") { setTimeout(function () { go(target); }, o.delay || 1200); return; }
    var m = find(text); if (!m.length) return;
    var el = o.nth === undefined ? null : m[o.nth < 0 ? m.length + o.nth : o.nth];
    (el ? [el] : m).forEach(function (e) {
      var h = climb(e, o);
      if (h.hasAttribute("data-go")) return;
      h.setAttribute("data-go", target); h.classList.add("proto-hot"); hotspots.push(h);
    });
  }
  var hasTopBar = find("TwinScape").length > 0;
  (links[id] || []).forEach(bind);
  if (hasTopBar) header.forEach(bind);

  document.addEventListener("click", function (e) {
    if (e.target.closest(".proto-bar")) return;
    var h = e.target.closest("[data-go]");
    if (h) { e.preventDefault(); go(h.getAttribute("data-go")); return; }
    var inPanel = e.target.closest(".proto-scrim > *, [data-overlay]");
    if (outside && !inPanel) { go(outside); return; }
    document.body.classList.add("proto-flash");
    setTimeout(function () { document.body.classList.remove("proto-flash"); }, 600);
  });

  // Floating prototype toolbar
  var prev = screens[me ? me.i - 1 : -1], next = screens[me ? me.i + 1 : -1];
  var bar = document.createElement("nav");
  bar.className = "proto-bar";
  bar.innerHTML = '<a href="../index.html" title="All screens (Esc)">▦ Screens</a>' +
    '<span class="proto-name"></span>' +
    (prev ? '<a href="' + prev.slug + '.html" title="Previous screen ([)">‹</a>' : '<span class="off">‹</span>') +
    (next ? '<a href="' + next.slug + '.html" title="Next screen (])">›</a>' : '<span class="off">›</span>') +
    '<button type="button" title="Show clickable areas (H)">Hotspots</button>';
  bar.querySelector(".proto-name").textContent = me ? me.name : id;
  var btn = bar.querySelector("button");
  function toggle(on) {
    document.body.classList.toggle("proto-show", on);
    btn.classList.toggle("on", on);
    try { sessionStorage.setItem("proto-hot", on ? "1" : ""); } catch (_) {}
  }
  btn.addEventListener("click", function () { toggle(!document.body.classList.contains("proto-show")); });
  document.body.appendChild(bar);
  try { if (sessionStorage.getItem("proto-hot")) toggle(true); } catch (_) {}
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "h" || e.key === "H") toggle(!document.body.classList.contains("proto-show"));
    else if (e.key === "[" && prev) go(prev.id);
    else if (e.key === "]" && next) go(next.id);
    else if (e.key === "Escape") { if (outside) go(outside); else location.href = "../index.html"; }
  });
})();
