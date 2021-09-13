const changeBtnText = (textValue, textClass, target) => {
  target.className = `controllers__${textClass}`;
  target.innerHTML = textValue;
};

document
  .querySelector("#rightButton")
  .addEventListener("mouseup", ({ target }) => {
    const leftButton = document.querySelector("#leftButton");
    if (target.innerHTML === "Start") {
      changeBtnText("Stop", "stop", target);
      changeBtnText("Lap", "lap", leftButton);
    } else {
      changeBtnText("Start", "start", target);
      changeBtnText("Reset", "lap", leftButton);
    }
  });
