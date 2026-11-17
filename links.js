/* Click map: screen id -> [visible text, target screen id, options].
   options: nth (index among matches, negative counts from the end),
   up (climb n parents), wide (climb until at least this many px wide). */
(function () {
  var HEADER = [["Search by name or serial number", "4BIL-0"], ["TwinScape", "3NIR-1"], ["Instruments", "3NIR-1", { nth: 0 }], ["Watchlists", "3MDG-1", { nth: 0 }], ["LM", "3P3T-1", { nth: 0 }]];
  var TABS = [["Overview", "3W3M-1"], ["Health", "3L2N-2"], ["Quality", "3O41-1"], ["Software", "3NVQ-1"], ["Settings", "3UOR-1"]];
  var HEALTH = [["Readbacks", "3L2N-2"], ["Hardware diagnostics", "3OA7-1"]];
  var QUALITY = [["Calibration", "3O41-1"], ["Proteomics QC", "3OJ9-1"], ["Metabolomics QC", "4BY8-0"]];
  var REMORA = [["Health", "3OEL-1"], ["Settings", "4CN8-0"], ["Overview", "3OEL-1"], ["Readbacks", "4CEN-0"], ["LC procedures", "4CHO-0"]];
  var SETTINGS = [["Instrument", "3UOR-1"], ["Email alerts", "3OUA-1"]];
  var ROW = { wide: 1300 };
  var NAMES = ["Clownfish", "Bubble Fish", "Lobster", "Octopus", "Seahorse", "Starfish", "Nautilus"].map(function (n) { return [n, "3W3M-1", ROW]; })
    .concat([["Remora", "3OEL-1", ROW]]);
  var LIST = [["Add instrument", "414Q-0"], ["Needs attention", "3NIR-1"], ["All", "3LXP-2"], ["Retired", "44X4-0"],
    ["Table", "3NIR-1"], ["Compare", "3MOS-1"], ["info", "49VW-0"], ["All watchlists", "4CQ9-0"]].concat(NAMES);
  var WATCH = [["Table", "3MDE-1"], ["Compare", "3MDF-1"]].concat(NAMES);
  var CHILLER = [["Chiller watch", "3MOV-1", { nth: 0 }]].concat(WATCH);
  var INSTR_SETTINGS = [["Rename instrument", "418G-0"], ["Remove", "3UXJ-1", { nth: 0 }], ["Invite a person", "3UVB-1"],
    ["Retire instrument", "418W-0", { nth: -1 }], ["Remora", "3OEL-1"], ["Proteomics Core", "3MDE-1"]];
  var ALERTS = [["How alerts are sent", "3UKO-1"], ["On", "46AQ-0", { nth: 0 }]];
  var ADD = [["Look up", "4164-0"], ["Cancel", "3NIR-1"]];
  var L = {
    "3W3M-1": [["Watchlists", "4C7N-0", { nth: -1, up: 0 }], ["Remora", "3OEL-1"], ["Proteomics Core", "3MDE-1"], ["Device temperature 2", "3L2N-2", { nth: 0 }], ["Mobility calibration", "3O41-1", { nth: 0 }]].concat(TABS),
    "3L2N-2": TABS.concat(HEALTH), "3LB4-2": TABS.concat(HEALTH), "3LHW-2": TABS.concat(HEALTH), "3LQR-2": TABS.concat(HEALTH),
    "3OA7-1": TABS.concat(HEALTH, [["Report", "4C3C-0"]]),
    "4C3C-0": TABS.concat(HEALTH, [["All runs", "3OA7-1"]]), "4BY8-0": TABS.concat(QUALITY),
    "4C7N-0": [["Proteomics Core", "3W3M-1", { nth: -1 }], ["Metabolomics Lab", "3W3M-1"], ["Structural Biology Lab", "3W3M-1"], ["Chiller watch", "3W3M-1"], ["New watchlist", "3MDH-1"], ["@outside", "3W3M-1"]],
    "4CC7-0": TABS.concat([["Remora", "3OEL-1"], ["Proteomics Core", "3MDE-1"]]), "3O41-1": TABS.concat(QUALITY), "3OJ9-1": TABS.concat(QUALITY), "3NVQ-1": TABS,
    "3UOR-1": TABS.concat(SETTINGS, INSTR_SETTINGS), "4431-0": TABS.concat(SETTINGS, INSTR_SETTINGS),
    "3UXJ-1": TABS.concat(SETTINGS, [["Undo", "3UOR-1"]], INSTR_SETTINGS),
    "3OUA-1": TABS.concat(SETTINGS, ALERTS), "3UKO-1": TABS.concat(SETTINGS, [["How alerts are sent", "3OUA-1"]]),
    "46AQ-0": TABS.concat(SETTINGS, [["Off", "3OUA-1", { nth: 0 }], ["How alerts are sent", "3UKO-1"]]),
    "3OEL-1": [["Bubble Fish", "3W3M-1"], ["Open Bubble Fish", "3W3M-1"]].concat(REMORA), "4CEN-0": REMORA, "4CHO-0": REMORA,
    "4CN8-0": REMORA.concat([["Bubble Fish", "3W3M-1"], ["Open settings of Bubble Fish", "3UOR-1"]]),
    "3UVB-1": [["Cancel", "3UOR-1"], ["Send invitation", "4431-0"], ["@outside", "3UOR-1"]],
    "418G-0": [["Cancel", "3UOR-1"], ["Save name", "3UOR-1"], ["@outside", "3UOR-1"]],
    "418W-0": [["Cancel", "3UOR-1"], ["Retire instrument", "44I4-0", { nth: -1 }], ["@outside", "3UOR-1"]],
    "3NIR-1": LIST,
    "44X4-0": [["Bubble Fish", "4CC7-0", ROW]].concat(LIST),
    "4BIL-0": [["Bubble Fish", "3W3M-1", { nth: 0, up: 2 }], ["Clownfish", "3W3M-1", { nth: 0, up: 2 }], ["fish", "4BNV-0"], ["@outside", "3NIR-1"]],
    "4BNV-0": [["zebra", "4BIL-0"], ["@outside", "3NIR-1"]],
    "4CQ9-0": [["All watchlists", "3LXP-2"], ["Proteomics Core", "3MDE-1", { nth: -1 }], ["Chiller watch", "X-CHILLER"], ["@outside", "3LXP-2"]],
    "4CVJ-0": [["Cancel", "3MDE-1"], ["Save changes", "3MDE-1"]],
    "4BTR-0": [["Open Instruments", "3NIR-1"]],
    "4BVE-0": [["How to connect an instrument", "4CXO-0"], ["How email alerts are sent", "3UKO-1"], ["Keyboard shortcuts", "4BX3-0"]],
    "4CXO-0": [["Help", "4BVE-0"], ["Add instrument", "414Q-0", { nth: -1 }]],
    "4BX3-0": [["Close", "3NIR-1"], ["@outside", "3NIR-1"]],
    "4BXT-0": [["Continue", "3NIR-1"]], "3LXP-2": LIST, "3MOT-1": LIST, "44I4-0": LIST, "44CR-0": LIST, "4204-1": LIST, "3M6S-2": LIST,
    "3M6R-2": LIST.concat([["Show all instruments", "3LXP-2"]]),
    "49VW-0": [["info", "3NIR-1"]].concat(LIST.filter(function (l) { return l[0] !== "info"; })),
    "3MOS-1": [["Add instrument", "414Q-0"], ["Needs attention", "3NIR-1"], ["All", "3LXP-2"], ["Table", "3NIR-1"]],
    "3M6T-2": [["Add instrument", "414Q-0", { nth: -1 }]],
    "3MOU-1": [["Try again", "3NIR-1"], ["Add instrument", "414Q-0"]],
    "3MDE-1": WATCH, "3MDF-1": WATCH.slice(0, 2), "3NRR-1": WATCH.slice(0, 2),
    "3MDG-1": [["Proteomics Core", "3MDE-1"], ["Chiller watch", "X-CHILLER"], ["New watchlist", "3MDH-1"], ["@outside", "3NIR-1"]],
    "3MDI-1": [["New watchlist", "3MDH-1"], ["@outside", "3NIR-1"]],
    "3MDH-1": [["Cancel", "3NIR-1"], ["Save watchlist", "43Q0-1"]],
    "4730-0": [["Cancel", "3NIR-1"], ["Save watchlist", "43Q0-1"]],
    "3MDJ-1": [["Chiller watch", "3MOV-1", { nth: 0 }], ["Add instruments", "3MDH-1"]],
    "43Q0-1": CHILLER, "X-CHILLER": CHILLER,
    "3MOV-1": [["Rename", "4196-0"], ["Add or remove instruments", "4CVJ-0"], ["Delete watchlist", "3MOW-1"], ["@outside", "X-CHILLER"]],
    "4196-0": [["Cancel", "X-CHILLER"], ["Save name", "X-CHILLER"], ["@outside", "X-CHILLER"]],
    "3MOW-1": [["Cancel", "X-CHILLER"], ["Delete watchlist", "44CR-0"], ["@outside", "X-CHILLER"]],
    "3OW2-1": [["Add instrument", "414Q-0", { nth: -1 }], ["Add your instruments", "414Q-0"], ["Make a watchlist", "3MDH-1"], ["Choose your alerts", "3OUA-1"], ["How to connect an instrument", "4CXO-0"]],
    "414Q-0": ADD, "3XG9-0": ADD,
    "4164-0": [["Cancel", "3NIR-1"], ["@auto", "3P1Q-1", { delay: 1400 }]],
    "3P1Q-1": ADD.concat([["Add instrument", "4204-1", { nth: -1 }]]),
    "3XHR-0": ADD.concat([["Open Octopus", "3W3M-1"]]),
    "3P3T-1": [["Clownfish", "3W3M-1", { up: 2 }], ["Bubble Fish", "3W3M-1", { up: 2 }], ["Lobster", "3LQR-2", { up: 2 }],
      ["Add instrument", "414Q-0", { nth: -1 }], ["Settings", "4BTR-0"], ["Help", "4BVE-0"], ["Keyboard shortcuts", "4BX3-0"], ["Sign out", "4BXT-0"], ["@outside", "3NIR-1"]]
  };
  window.PROTO_HEADER = HEADER;
  window.PROTO_LINKS = L;
})();
