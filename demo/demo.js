"use strict";
(function () {
  var root = document.querySelector(".demo-layout");
  if (!root) return;
  document.body.classList.add("demo-js");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".demo-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".demo-panel"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(step) {
    tabs.forEach(function (t) { var on = t.getAttribute("data-step") === step; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
    panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-step") === step); });
    clearMarks();
  }
  function clearMarks() {
    Array.prototype.forEach.call(document.querySelectorAll(".is-source"), function (el) { el.classList.remove("is-source"); });
    Array.prototype.forEach.call(document.querySelectorAll(".req-item.is-picked, .wb-table tr.is-picked"), function (el) { el.classList.remove("is-picked"); });
  }
  function mark(ids, picked) {
    clearMarks();
    if (picked) picked.classList.add("is-picked");
    var first = null;
    ids.split(" ").forEach(function (id) { var el = document.getElementById(id); if (el) { el.classList.add("is-source"); if (!first) first = el; } });
    if (first) {
      var pane = document.querySelector(".demo-doc");
      if (pane && pane.scrollHeight > pane.clientHeight + 4) {
        var top = pane.scrollTop + (first.getBoundingClientRect().top - pane.getBoundingClientRect().top) - 24;
        pane.scrollTop = Math.max(0, top);
      }
    }
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-step")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-src]"), function (el) {
    el.addEventListener("click", function () { mark(el.getAttribute("data-src"), el); });
  });

  var run = document.querySelector("[data-run]");
  var progress = document.querySelector(".demo-progress");
  var order = ["requirements", "gaps", "workbook", "asme"];
  var labels = ["Reading 2 documents and indexing 16 items", "Extracting requirements with sources", "Checking gaps and conflicts", "Drafting the quotation workbook", "Running ASME checks in the engine"];
  if (run) run.addEventListener("click", function () {
    run.disabled = true; progress.hidden = false; root.classList.add("is-running");
    var i = 0, delay = reduce ? 0 : 700;
    (function next() {
      if (i < labels.length) {
        progress.textContent = labels[i] + "...";
        if (i > 0) show(order[i - 1]);
        i += 1; setTimeout(next, delay);
      } else {
        progress.textContent = "Done. 11 requirements, 4 questions, 7 workbook lines, 2 ASME checks passed.";
        root.classList.remove("is-running"); show("requirements"); run.disabled = false;
        run.innerHTML = 'Run again <span aria-hidden="true">↗</span>';
      }
    })();
  });
})();

(function () {
  var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      chips.forEach(function (x) { x.classList.toggle("is-on", x === c); });
      Array.prototype.forEach.call(document.querySelectorAll(".req-list li"), function (li) {
        li.hidden = !(f === "all" || li.getAttribute("data-status") === f);
      });
    });
  });
  var steps = Array.prototype.slice.call(document.querySelectorAll(".run-steps li"));
  var prog = document.querySelector(".demo-progress");
  if (!steps.length || !prog || !window.MutationObserver) return;
  var map = ["Reading", "Extracting", "Checking", "Drafting", "Running"];
  new MutationObserver(function () {
    var t = prog.textContent || "";
    if (t.indexOf("Done") === 0) { steps.forEach(function (s) { s.classList.remove("is-active"); s.classList.add("is-done"); }); document.querySelector(".run-steps").classList.add("is-complete"); return; }
    var k = -1; map.forEach(function (m, i) { if (t.indexOf(m) === 0) k = i; });
    if (k < 0) return;
    document.querySelector(".run-steps").classList.remove("is-complete");
    steps.forEach(function (s, i) { s.classList.toggle("is-done", i < k); s.classList.toggle("is-active", i === k); });
  }).observe(prog, { childList: true, characterData: true, subtree: true });
})();
