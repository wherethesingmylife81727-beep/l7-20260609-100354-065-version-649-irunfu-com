(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    if (slides.length > 1) {
      var index = 0;
      var activate = function (next) {
        slides[index].classList.remove("active");
        if (dots[index]) {
          dots[index].classList.remove("active");
        }
        index = next;
        slides[index].classList.add("active");
        if (dots[index]) {
          dots[index].classList.add("active");
        }
      };
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          activate(dotIndex);
        });
      });
      window.setInterval(function () {
        activate((index + 1) % slides.length);
      }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    document.querySelectorAll("[data-filter-root]").forEach(function (root) {
      var input = root.querySelector("[data-filter-input]");
      var typeSelect = root.querySelector("[data-filter-type]");
      var regionSelect = root.querySelector("[data-filter-region]");
      var list = root.nextElementSibling;
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];
      var empty = list ? list.parentElement.querySelector(".empty-filter") : null;

      if (input && query) {
        input.value = query;
      }

      var apply = function () {
        var words = input ? input.value.trim().toLowerCase() : "";
        var typeValue = typeSelect ? typeSelect.value : "";
        var regionValue = regionSelect ? regionSelect.value : "";
        var shown = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-tags") || ""
          ].join(" ").toLowerCase();
          var matchText = !words || haystack.indexOf(words) !== -1;
          var matchType = !typeValue || (card.getAttribute("data-type") || "").indexOf(typeValue) !== -1 || (card.getAttribute("data-tags") || "").indexOf(typeValue) !== -1;
          var matchRegion = !regionValue || (card.getAttribute("data-region") || "").indexOf(regionValue) !== -1;
          var visible = matchText && matchType && matchRegion;
          card.style.display = visible ? "" : "none";
          if (visible) {
            shown += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", shown === 0);
        }
      };

      [input, typeSelect, regionSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  });
})();
