let idMainTimerAnimation = null;
let idLapAnimation = null;
let millisecondsPassed = 0;
let startTime = 0;
const timeLapContainer = [];
const lapsNodeList = document.getElementsByClassName("lap-container_lap");
const mainTimeEl = document.querySelector("#mainTime");

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
  lapContainer = document.querySelector(".lap-container");
  lapContainer.insertBefore(
    createLapContainer(`lap ${lapsNodeList.length + 1}`, "00:00.00"),
    lapContainer.firstChild
  );
  startTimer(lapContainer.firstChild.lastChild);
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

const startTimer = (htmlElement, idAnimation) => {
  if (millisecondsPassed) {
    startTime = Date.now() + millisecondsPassed;
  } else {
    startTime = Date.now();
  }

  return changeTime(startTime, htmlElement, idAnimation);
};

const changeButtonText = (textValue, textClass, target) => {
  target.className = `controllers__${textClass}`;
  target.innerHTML = textValue;
};

const stopTimer = () => {
  millisecondsPassed = startTime - Date.now();

  window.cancelAnimationFrame(idMainTimerAnimation);
  window.cancelAnimationFrame(idLapAnimation);
};

document
  .querySelector("#rightButton")
  .addEventListener("mouseup", ({ target }) => {
    const leftButton = document.querySelector("#leftButton");
    if (target.innerHTML === "Start") {
      changeButtonText("Stop", "stop", target);
      changeButtonText("Lap", "lap", leftButton);
      renderLap();
      startTimer(mainTimeEl, "main");
    } else {
      changeButtonText("Start", "start", target);
      changeButtonText("Reset", "lap", leftButton);
      stopTimer();
    }
  });
