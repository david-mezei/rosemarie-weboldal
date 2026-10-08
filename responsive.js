document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector("#main-navigation");

  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü megnyitása");
  };

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });


  // Egyedi lejátszók: egyszerre csak egy felvétel szólhat.
  const audioPlayers = Array.from(
    document.querySelectorAll(".music-card")
  );

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${mins}:${secs}`;
  };

  audioPlayers.forEach((card) => {
    const audio = card.querySelector(".music-audio");
    const button = card.querySelector(".audio-play");
    const icon = button.querySelector("span");
    const progress = card.querySelector(".audio-progress");
    const current = card.querySelector(".audio-current");
    const duration = card.querySelector(".audio-duration");

    const setPlaying = (playing) => {
      icon.textContent = playing ? "||" : "▶";
      button.setAttribute(
        "aria-label",
        playing ? "Szünet" : "Lejátszás"
      );
      button.setAttribute("aria-pressed", String(playing));
    };

    const updateProgress = () => {
      current.textContent = formatTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String(
          Math.round((audio.currentTime / audio.duration) * 1000)
        );
      }
    };

    audio.addEventListener("loadedmetadata", () => {
      duration.textContent = formatTime(audio.duration);
      updateProgress();
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));

    audio.addEventListener("ended", () => {
      setPlaying(false);
      progress.value = "0";
      current.textContent = "0:00";
    });

    button.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      audioPlayers.forEach((otherCard) => {
        const otherAudio = otherCard.querySelector(".music-audio");
        if (otherAudio !== audio) otherAudio.pause();
      });

      try {
        await audio.play();
      } catch {
        setPlaying(false);
        button.setAttribute("aria-label", "A felvétel nem tölthető be");
      }
    });

    progress.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
          (Number(progress.value) / 1000) * audio.duration;
      }
    });
  });

});
