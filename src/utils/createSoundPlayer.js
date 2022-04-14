export default (src) => {
    const audio = new Audio(src);
    audio.load();

    return {
      play: () => {
        try {
          audio.play();
        } catch (_e) {}
      },
      stop: () => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (_e) {}
      },
    }
}