const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const intervals = new WeakMap();

function StartScramble(el) {
  const target = el;
  const original = (el.dataset && el.dataset.value) ? el.dataset.value : el.textContent;
  let iteration = 0;

  if (intervals.has(target)) clearInterval(intervals.get(target));
  const id = setInterval(() => {
    target.innerText = target.innerText
      .split("")
      .map((ch, i) => {
        if (i < iteration) return original[i] || "";
        return letters[Math.floor(Math.random() * letters.length)];
      }).join("");
    if (iteration >= original.length) {
      clearInterval(id);
      intervals.delete(target);
      target.innerText = original;
    }
    iteration += 1 / 3;
  }, 30);

  intervals.set(target, id);
}

function StopScramble(el) {
  if (intervals.has(el)) {
    clearInterval(intervals.get(el));
    intervals.delete(el);
  }

  if (el.dataset && el.dataset.value) el.innerText = el.dataset.value;
}

document.querySelectorAll(".nav_links a, .logo").forEach(el => {
  el.addEventListener("mouseover", () => StartScramble(el));
  el.addEventListener("focus", () => StartScramble(el)); // keyboard accessibility
  el.addEventListener("mouseleave", () => StopScramble(el));
  el.addEventListener("blur", () => StopScramble(el));
});

const nav = document.querySelector("nav");
const underline = document.querySelector(".underline");
const nav_links = document.querySelectorAll(".nav_links a");
const hamburger = document.querySelector(".hamburger");
const ul = document.querySelector(".nav_links");

function MoveUnderlineTo(el) {
  if (!el) {
    underline.style.opacity = 0;
    return;
  }

  const el_rect = el.getBoundingClientRect();
  const nav_rect = nav.getBoundingClientRect();

  underline.style.width = Math.round(el_rect.width) + "px";
  underline.style.left = Math.round(el_rect.left - nav_rect.left) + "px";

  const top_pos = Math.round(el_rect.bottom - nav_rect.top - underline.offsetHeight);
  underline.style.top = top_pos + "px";

  underline.style.opacity = 1;
}

function GetActiveHref() {
  const saved = localStorage.getItem("activeLink");
  if (saved) return saved;

  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}

function ApplyActiveFromHref() {
  const href = GetActiveHref();
  let found = null;
  nav_links.forEach(a => {
    if (a.getAttribute("href") === href) {
      a.classList.add("active");
      found = a;
    } else {
      a.classList.remove("active");
    }
  });
  return found;
}

nav_links.forEach(a => {
  a.addEventListener("mouseenter", () => MoveUnderlineTo(a));
  a.addEventListener("focus", () => MoveUnderlineTo(a));
  a.addEventListener("click", (e) => {

    localStorage.setItem("activeLink", a.getAttribute("href"));

    nav_links.forEach(x => x.classList.remove("active"));
    a.classList.add("active");
  });
});

nav.addEventListener("mouseleave", () => {
  const active = document.querySelector(".nav_links a.active");
  MoveUnderlineTo(active);
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  ul.classList.toggle("active");
  
  setTimeout(() => {
    const active = document.querySelector(".nav_links a.active") || document.querySelector(`.nav_links a[href="${GetActiveHref()}"]`);
    MoveUnderlineTo(active);
  }, 320);
});

window.addEventListener("DOMContentLoaded", () => {
  const active = ApplyActiveFromHref();
  if (active) {
    setTimeout(() => MoveUnderlineTo(active), 30);
  } else {
    underline.style.opacity = 0;
  }
});

window.addEventListener("resize", () => {
  const active = document.querySelector(".nav_links a.active") || document.querySelector(`.nav_links a[href="${GetActiveHref()}"]`);
  if (active) MoveUnderlineTo(active);
});

//- Barni: Posts

function StringFitsFilter(str, filter) {
  let match = true;
  let filter_upper = filter.toUpperCase();
  let filter_substrings = filter_upper.split(/[ _*]+/);
  let str_upper = str.toUpperCase();
  let minimum_index = 0;

  for (let i = 0; i < filter_substrings.length; ++i) {
    if (filter_substrings[i].length > 0) {
      let index_of_substring = str_upper.indexOf(filter_substrings[i], minimum_index);
      if (index_of_substring < 0 || index_of_substring < minimum_index) {
        match = false;
        break;
      }
      minimum_index = index_of_substring + filter_substrings[i].length - 1;
    }
  }

  return match;
}

function UpdateListByFilter(menu_id, filter_id) {
  let ul = document.getElementById(menu_id);
  let li = ul.getElementsByTagName("li");
  let input = document.getElementById(filter_id);
  let filter = input.value.toUpperCase();
  for (let i = 0; i < li.length; i++) {
    if (filter.length > 0) {
      let a = li[i].getElementsByTagName("a")[0];
      if (StringFitsFilter(a.innerHTML, filter)) {
        li[i].style.display = "";
      }
      else {
        li[i].style.display = "none";
      }
    }
    else {
      li[i].style.display = "";
    }
  }
}

function SearchInput(event, lister_idx) {
  UpdateListByFilter("lister_" + lister_idx, "lister_search_" + lister_idx);
}

function SearchKeyDown(event, lister_idx) {
  UpdateListByFilter("lister_" + lister_idx, "lister_search_" + lister_idx);
}

function CalculateBlogPostReadTime(content) {
  var words_per_minute = 200;
  var word_count = content.split(/\s+/).length;
  var read_time = Math.ceil(word_count / words_per_minute);
  return read_time + ' min read';
}

function OnBlogLoad() {
  let ul = document.getElementById("lister_0");
  let li = ul.getElementsByTagName("li");
  for (let i = 0; i < li.length; i++) {
    let a = li[i].getElementsByTagName("a")[0];
    fetch(a.href)
      .then(response => response.text())
      .then(data => {
        var content = new DOMParser().parseFromString(data, 'text/html').querySelector('body').innerText;
        var read_time = CalculateBlogPostReadTime(content);
        let rt = li[i].getElementsByClassName("lister_item_read_time")[0];
        rt.innerHTML = read_time;
      })
      .catch(error => console.error('Error fetching post content:', error));
  }
}

function OnBlogPostLoad() {
  var content = document.querySelector('body').innerText;
  var read_time = CalculateBlogPostReadTime(content);
  let rt = document.getElementsByClassName("read_time")[0];
  rt.innerHTML = read_time;
}