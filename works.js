(function(){
  "use strict";
  const storageKey = "manjil-works";
  const form = document.getElementById("uploadForm");
  const gallery = document.getElementById("worksGallery");
  const emptyState = document.getElementById("emptyState");
  const count = document.getElementById("galleryCount");
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  const ringLabel = document.getElementById("cursorLabel");
  let works = JSON.parse(localStorage.getItem(storageKey) || "[]");

  function save(){ localStorage.setItem(storageKey, JSON.stringify(works)); }
  function render(){
    gallery.innerHTML = "";
    emptyState.hidden = works.length > 0;
    count.textContent = String(works.length).padStart(2,"0") + " WORKS";
    works.forEach(function(work, index){
      const entry = document.createElement("article");
      entry.className = "work-entry";
      entry.innerHTML = '<div class="work-entry-media"><img src="' + work.image + '" alt="' + escapeHtml(work.title) + '"></div><div class="work-entry-info"><h3 class="work-entry-title">' + escapeHtml(work.title) + '</h3><div class="work-entry-meta"><span>' + escapeHtml(work.type) + '</span><span>' + escapeHtml(work.year) + '</span></div>' + (work.description ? '<p class="work-entry-description">' + escapeHtml(work.description) + '</p>' : '') + '<button class="delete-work" type="button" data-index="' + index + '">REMOVE PROJECT</button></div>';
      gallery.appendChild(entry);
    });
  }
  function escapeHtml(value){ const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
  form.addEventListener("submit", function(event){
    event.preventDefault();
    const file = document.getElementById("projectImage").files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      works.unshift({title:document.getElementById("projectTitle").value.trim(),type:document.getElementById("projectType").value,year:document.getElementById("projectYear").value,description:document.getElementById("projectDescription").value.trim(),image:reader.result});
      save(); render(); form.reset(); document.getElementById("projectYear").value = "2026";
    };
    reader.readAsDataURL(file);
  });
  gallery.addEventListener("click", function(event){
    if(!event.target.classList.contains("delete-work")) return;
    works.splice(Number(event.target.dataset.index), 1); save(); render();
  });
  document.querySelectorAll("a,button").forEach(function(element){
    element.addEventListener("mouseenter", function(){ring.classList.add("grow");ringLabel.textContent="OPEN";cursor.classList.add("hide");});
    element.addEventListener("mouseleave", function(){ring.classList.remove("grow");cursor.classList.remove("hide");});
  });
  let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
  window.addEventListener("mousemove", function(event){x=event.clientX;y=event.clientY;});
  function animateCursor(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;cursor.style.transform="translate("+x+"px,"+y+"px) translate(-50%,-50%)";ring.style.transform="translate("+rx+"px,"+ry+"px) translate(-50%,-50%)";requestAnimationFrame(animateCursor);}
  if(!window.matchMedia("(pointer: coarse)").matches) animateCursor();
  window.addEventListener("scroll", function(){document.getElementById("nav").classList.toggle("scrolled",scrollY>40);});
  document.getElementById("burger").addEventListener("click", function(){document.getElementById("navLinks").classList.toggle("open");});
  render();
})();