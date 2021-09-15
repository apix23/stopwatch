let idMainTimerAnimation = null;
let idLapAnimation = null;
let millisecondsPassed = 0;
let startTime = 0;
const timeLapContainer = [];
const lapsNodeList = document.getElementsByClassName("lap-container_lap");
const mainTimeEl = document.querySelector("#mainTime");
const lapContainerEl = document.querySelector("ul");

const createLapContainer = (numberLapContent, timeLapContent) => {
  const lapEl = document.createElement("li");
  const numberLapEl = document.createElement("span");
  const timeLapEl = document.createElement("span");
  lapEl.classList.add("lap-container_lap");
  timeLapEl.classList.add("timer");
  timeLapEl;
  numberLapEl.innerText = numberLapContent;
  timeLapEl.innerText = timeLapContent;

  lapEl.appendChild(numberLapEl);
  lapEl.appendChild(timeLapEl);

  return lapEl;
};

const renderLap = () => {
  lapContainerEl.insertBefore(
    createLapContainer(`lap ${lapsNodeList.length + 1}`, "00:00.00"),
    lapContainerEl.firstChild
  );
  startTimer(lapContainerEl.firstChild.lastChild, false);
};

function leftFillNum(num) {
  return num.toString().padStart(2, 0);
}

const timeFormatter = (timeInMilliseconds) => {
  const minutes = leftFillNum(Math.trunc(timeInMilliseconds / 60000));
  const seconds = leftFillNum(Math.trunc((timeInMilliseconds % 60000) / 1000));
  const centiSeconds = leftFillNum(
    Math.trunc(((timeInMilliseconds % 60000) % 1000) / 10)
  );
  return [minutes, seconds, centiSeconds];
};

const printTime = (htmlElement, timeValues) => {
  [minutes, seconds, centiSeconds] = timeValues;
  htmlElement.innerHTML = `${minutes}:${seconds}.${centiSeconds}`;
};

const changeTime = (startTime, htmlElement, idAnimation) => {
  const currentTime = Date.now();
  const milliseconds = currentTime - startTime;
  printTime(htmlElement, timeFormatter(milliseconds));

  if (idAnimation === "main") {
    idMainTimerAnimation = window.requestAnimationFrame(() =>
      changeTime(startTime, htmlElement, idAnimation)
    );
  } else {
    idLapAnimation = window.requestAnimationFrame(() =>
      changeTime(startTime, htmlElement, idAnimation)
    );
  }
};

const startTimer = (htmlElement, isMainTime, idAnimation) => {
  if (millisecondsPassed && isMainTime) {
    startTime = Date.now() + millisecondsPassed;
  } else {
    startTime = Date.now();
  }

  changeTime(startTime, htmlElement, idAnimation);
};

const changeButtonText = (textValue, textClass, target) => {
  target.className = `controllers__${textClass}`;
  target.innerHTML = textValue;
};

const stopTimer = (idLap, idMain) => {
  millisecondsPassed = startTime - Date.now();

  if (idMain) window.cancelAnimationFrame(idMain);

  if (idLap) window.cancelAnimationFrame(idLapAnimation);
};

document
  .querySelector("#rightButton")
  .addEventListener("mouseup", ({ target }) => {
    const leftButton = document.querySelector("#leftButton");
    if (target.innerHTML === "Start") {
      changeButtonText("Stop", "stop", target);
      changeButtonText("Lap", "lap", leftButton);

      if (!millisecondsPassed) {
        renderLap();
      } else {
        startTimer(lapContainerEl.firstChild.lastChild, true);
      }

      startTimer(mainTimeEl, true, "main");
    } else {
      changeButtonText("Start", "start", target);
      changeButtonText("Reset", "lap", leftButton);
      stopTimer(idLapAnimation, idMainTimerAnimation);
    }
  });

document
  .querySelector("#leftButton")
  .addEventListener("mouseup", ({ target }) => {
    if (target.innerHTML === "Lap") {
      stopTimer(idLapAnimation);
      renderLap();
    } else {
      startTime = 0;
      millisecondsPassed = 0;
      mainTimeEl.innerHTML = "00:00.00";
      lapContainerEl.innerHTML = "";
    }
  });
