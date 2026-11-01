// Rebuilds the page from the modules the visitor switches on.

// One word for each module, used to name a custom role.
const MODULE_NAMES = {
  lowlevel: "Low-level",
  linux: "Linux",
  gpu: "GPU",
  security: "Security",
  devops: "DevOps",
  cloud: "Cloud",
  server: "Server",
  backend: "Backend",
  frontend: "Frontend",
};

// One sentence for each module, used to describe a custom role.
const MODULE_TEXT = {
  lowlevel: "I write C, C++ and Assembly, and I like knowing what the machine is really doing.",
  linux: "I study Linux from the inside, and I built a small container runtime to learn namespaces and cgroups.",
  gpu: "I have written NVIDIA CUDA kernels that split work across GPU threads.",
  security: "I did a cybersecurity internship and won hackathons with security tools.",
  devops: "I build Jenkins pipelines that package and deploy Docker containers.",
  cloud: "I use AWS and create its infrastructure as code with Terraform.",
  server: "I deploy applications to Linux servers and keep them running.",
  backend: "I build APIs and background jobs with Django, FastAPI and PostgreSQL.",
  frontend: "I build interfaces with React, Next.js and TypeScript.",
};

const ALL = Object.keys(MODULE_NAMES);

const PRESETS = {
  all: {
    title: "Jack of All Trades",
    modules: ALL,
    text: "I have worked across the whole stack, from Assembly and Linux containers to AWS pipelines, security tools and React dashboards. I am not a master of any of them yet. I learn by building, and I can move to wherever the problem is.",
  },
  system: {
    title: "System Software Engineer",
    modules: ["lowlevel", "linux"],
    text: "I write software close to the hardware: Linux utilities in C, Assembly programs and a small container runtime. My goal is to become a Linux kernel developer, so I am studying memory management, scheduling and device drivers next.",
  },
  gpu: {
    title: "GPU Programmer",
    modules: ["lowlevel", "gpu"],
    text: "I have learned NVIDIA CUDA through hands-on kernels: GPU memory allocation, data transfer and running work across GPU threads. My C and C++ background helps me see what the hardware is doing.",
  },
  security: {
    title: "Security Engineer",
    modules: ["security"],
    text: "I did vulnerability assessment, threat analysis and security audits as a cybersecurity intern at Hackers InfoTech. My hackathon wins also came from security tools: secure data wiping, ransomware analysis and phishing detection.",
  },
  devops: {
    title: "DevOps Engineer",
    modules: ["devops", "cloud", "server"],
    text: "I have built pipelines where Jenkins deploys Docker containers and Terraform creates the AWS infrastructure they run on. I also deploy applications to Linux servers and keep them running.",
  },
  cloud: {
    title: "Cloud Engineer",
    modules: ["cloud"],
    text: "I work with AWS services including EC2, S3, RDS, Lambda and IoT Core, and I use Terraform to create networks, servers and storage as code.",
  },
  server: {
    title: "Server Administrator",
    modules: ["server"],
    text: "I am comfortable on the Linux command line. I have deployed applications to a VPS and run web servers with Docker, Nginx and Cloudflare Tunnel.",
  },
  backend: {
    title: "Backend Developer",
    modules: ["backend"],
    text: "I have built APIs and background jobs with Django, Django REST Framework, Celery, Redis, FastAPI and PostgreSQL, and I worked on the backend of an attack surface management platform.",
  },
  frontend: {
    title: "Frontend Developer",
    modules: ["frontend"],
    text: "I build interfaces with React, Next.js, TypeScript and Tailwind CSS, from security dashboards to a 3D symposium website and a Spotify personality app.",
  },
  fullstack: {
    title: "Full Stack Developer",
    modules: ["backend", "frontend"],
    text: "I work on both sides of a web app: Django and FastAPI APIs with PostgreSQL behind them, and React or Next.js interfaces in front. I have shipped this mix in hackathons and during my internship.",
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const moduleInputs = $$("#modules input");
const presetInputs = $$("#presets input");
const showAll = { projects: false, topics: false };

function selectedModules() {
  return moduleInputs.filter((input) => input.checked).map((input) => input.value);
}

function findPreset(modules) {
  const key = [...modules].sort().join();
  return Object.keys(PRESETS).find((id) => [...PRESETS[id].modules].sort().join() === key);
}

function customTitle(modules) {
  if (modules.length === 0) return "No modules enabled";
  if (modules.length > 3) return `Generalist Engineer (${modules.length} modules)`;
  const names = modules.map((id) => MODULE_NAMES[id]);
  if (names.length === 1) return `${names[0]} Engineer`;
  return `${names.slice(0, -1).join(", ")} + ${names[names.length - 1]} Engineer`;
}

function customText(modules) {
  if (modules.length === 0) return "Switch on at least one module to see my work.";
  return modules.slice(0, 3).map((id) => MODULE_TEXT[id]).join(" ");
}

// Shows matching items first, best match on top, and hides or dims the rest.
function filterList(name, modules) {
  const list = $(`[data-filter="${name}"]`);
  const items = [...list.children];
  items.forEach((item, index) => {
    if (item.dataset.order === undefined) item.dataset.order = index;
    const tags = item.dataset.m.split(" ");
    item.dataset.score = tags.filter((tag) => modules.includes(tag)).length;
  });

  // With every module on, nothing is more relevant, so keep the written order.
  const byScore = modules.length < ALL.length;
  items
    .sort((a, b) => (byScore ? b.dataset.score - a.dataset.score : 0) || a.dataset.order - b.dataset.order)
    .forEach((item) => list.append(item));

  let matches = 0;
  items.forEach((item) => {
    const match = Number(item.dataset.score) > 0;
    if (match) matches++;
    item.classList.toggle("is-off", !match);
    item.hidden = !match && !showAll[name];
  });

  const more = $(`[data-more="${name}"]`);
  const hiddenCount = items.length - matches;
  more.hidden = hiddenCount === 0;
  more.textContent = showAll[name]
    ? "Hide items outside this configuration"
    : `Show ${hiddenCount} more outside this configuration`;
  return matches;
}

function shareUrl(presetId, modules) {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  if (presetId === "all") return url.href;
  if (presetId) url.searchParams.set("role", presetId);
  else url.searchParams.set("m", modules.join("."));
  return url.href;
}

function render() {
  const modules = selectedModules();
  const presetId = findPreset(modules);
  const preset = PRESETS[presetId];
  const title = preset ? preset.title : customTitle(modules);

  $("#role").textContent = title;
  $("#summary").textContent = preset ? preset.text : customText(modules);
  document.title = `Madhan P | ${title}`;
  presetInputs.forEach((input) => { input.checked = input.value === presetId; });

  const projects = filterList("projects", modules);
  const topics = filterList("topics", modules);

  const line = (key, value) => `<span class="k">${key}</span>=${value}`;
  $("#dotconfig").innerHTML = [
    line("CONFIG_ROLE", `"${title}"`),
    line("CONFIG_MODULES", `"${modules.join(" ")}"`),
    line("CONFIG_PROJECTS", projects),
    line("CONFIG_TOPICS", topics),
  ].join("\n");

  try {
    history.replaceState(null, "", shareUrl(presetId, modules) + location.hash);
  } catch (error) {
    // Some browsers block this on a local file. The page still works.
  }
  $("#status").textContent = "";
}

function setModules(modules) {
  moduleInputs.forEach((input) => { input.checked = modules.includes(input.value); });
  render();
}

function readUrl() {
  const params = new URLSearchParams(location.search);
  const role = params.get("role");
  if (role && PRESETS[role]) return PRESETS[role].modules;
  if (params.has("m")) return params.get("m").split(".").filter((id) => MODULE_NAMES[id]);
  return ALL;
}

moduleInputs.forEach((input) => input.addEventListener("change", render));

presetInputs.forEach((input) => input.addEventListener("change", () => {
  setModules(PRESETS[input.value].modules);
}));

// Up and down arrows move through the modules, like menuconfig.
$("#modules").addEventListener("keydown", (event) => {
  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
  if (!step) return;
  event.preventDefault();
  const index = moduleInputs.indexOf(document.activeElement);
  moduleInputs[(index + step + moduleInputs.length) % moduleInputs.length].focus();
});

$("#config").addEventListener("submit", (event) => event.preventDefault());

$("#reset").addEventListener("click", () => setModules(ALL));

$("#share").addEventListener("click", async () => {
  const status = $("#status");
  const url = location.href.split("#")[0];
  try {
    await navigator.clipboard.writeText(url);
    status.textContent = "Link copied";
  } catch (error) {
    status.textContent = url;
  }
});

$$("[data-more]").forEach((button) => button.addEventListener("click", () => {
  showAll[button.dataset.more] = !showAll[button.dataset.more];
  render();
}));

setModules(readUrl());
