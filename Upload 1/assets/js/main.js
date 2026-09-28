/* =========================================================
   Shared header, footer and small interactions.
   To change the menu or footer on EVERY page, edit NAV / FOOTER below.
   ========================================================= */

(function () {
  const body = document.body;
  const root = body.dataset.root || "";      // "" on top-level pages, "../" inside /projects
  const page = body.dataset.page || "";      // used to highlight the current menu item

  // ---- Edit the menu here -------------------------------------------------
  const PROJECTS = [
    { id: "claw",    num: "01", title: "Arcade Claw Machine",     href: "projects/claw-machine.html" },
    { id: "climber", num: "02", title: "Suction Wall Climber",    href: "projects/wall-climber.html" },
    { id: "arm",     num: "03", title: "Robotic Arm",             href: "projects/robotic-arm.html" },
    { id: "print",   num: "04", title: "3D Design & Printing",    href: "projects/3d-printing.html" },
    { id: "lock",    num: "05", title: "Remote Door Lock",        href: "projects/door-lock.html" },
    { id: "robot",   num: "06", title: "Robotics & Other Builds", href: "projects/robotics.html" }
    // Add new projects here, e.g.
    // { id: "newthing", num: "07", title: "New Project", href: "projects/new-project.html" }
  ];

  const isProject = PROJECTS.some(p => p.id === page);

  const header = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="${root}index.html">
          <strong>Justin Bobesich</strong>
          <span>Engineering | Design | Building</span>
        </a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
        <nav class="nav" id="nav" aria-label="Main">
          <div class="dd">
            <button aria-expanded="false" ${isProject ? 'aria-current="page"' : ""}>Projects</button>
            <div class="dd-menu">
              ${PROJECTS.map(p => `<a href="${root}${p.href}" ${p.id === page ? 'aria-current="page"' : ""}><span class="label num">${p.num}</span>${p.title}</a>`).join("")}
            </div>
          </div>
          <a href="${root}index.html#process" >Process</a>
          <a href="${root}about.html#timeline">Timeline</a>
          <a href="${root}about.html" ${page === "about" ? 'aria-current="page"' : ""}>About</a>
        </nav>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <span>© <span id="yr"></span> Justin Bobesich · Alberta, Canada</span>
        <span>Designed and built by Justin Bobesich</span>
      </div>
    </footer>`;
  // ------------------------------------------------------------------------

  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.outerHTML = header;
  if (footerSlot) footerSlot.outerHTML = footer;
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Projects dropdown
  const dd = document.querySelector(".nav .dd");
  if (dd) {
    const btn = dd.querySelector("button");
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", () => { dd.classList.remove("open"); btn.setAttribute("aria-expanded", false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") dd.classList.remove("open"); });
  }

  // Lightbox: any <img> inside .gallery, .stages or .prints opens full size
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `<button type="button">Close ✕</button><img alt=""><p></p>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p");
  const close = () => lb.classList.remove("open");
  lb.addEventListener("click", e => { if (e.target !== lbImg) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  document.querySelectorAll(".gallery img, .stages img, .prints img").forEach(img => {
    img.addEventListener("click", () => {
      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt;
      const cap = img.closest("figure")?.querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : img.alt;
      lb.classList.add("open");
    });
  });

  // Highlight the current section in the project-page side menu
  const tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map([...tocLinks].map(a => [a.getAttribute("href").slice(1), a]));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          tocLinks.forEach(a => a.classList.remove("active"));
          map.get(en.target.id)?.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
  }

})();
