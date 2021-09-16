const { log: c } = console;

let idMainTimerAnimation = null;
let idLapAnimation = null;
let millisecondsPassed = 0;
let startTime = 0;
let timeLapContainer = [];
const lapsNodeList = document.getElementsByClassName("lap-container_lap");
const mainTimeEl = document.querySelector("#mainTime");
const lapContainerEl = document.querySelector("ul");

const createLapElement = (numberLapContent, timeLapContent) => {
  const lapEl = document.createElement("li");
  const numberLapEl = document.createElement("span");
  const timeLapEl = document.createElement("span");

  lapEl.classList.add("lap-container_lap");
  timeLapEl.classList.add("timer");

  numberLapEl.innerText = numberLapContent;
  timeLapEl.innerText = timeLapContent;

  lapEl.appendChild(numberLapEl);
  lapEl.appendChild(timeLapEl);

  return lapEl;
};

const emptyLapsEraser = () => {
  const emptyLapEl = document.querySelector(".lap-container__empty-lap");
  if (emptyLapEl) {
    emptyLapEl.remove();
  }
};

const findBiggerAndLowerTime = () => {
  const lapstimesSorted = [...timeLapContainer].sort(
    (a, b) => b.millisecondsPassed - a.millisecondsPassed
  );

  const { id: idBigestLap } = lapstimesSorted[0];
  const { id: idLowestLap } = lapstimesSorted[lapstimesSorted.length - 1];
  const position = lapsNodeList.length - 1;

  return [
    lapsNodeList[position - idBigestLap],
    lapsNodeList[position - idLowestLap],
  ];
};

const removeColorLetterClasses = () => {
  const previusBiggestTime = document.querySelector(
    ".lap-container__letter-red"
  );
  const previusLowestTime = document.querySelector(
    ".lap-container__letter-green"
  );
  if (previusBiggestTime && previusLowestTime) {
    previusBiggestTime.classList.remove("lap-container__letter-red");
    previusLowestTime.classList.remove("lap-container__letter-green");
  }
};

const paintLines = () => {
  if (lapsNodeList.length > 2) {
    const [BiggestTime, LowestTime] = findBiggerAndLowerTime();
    BiggestTime.classList.add("lap-container__letter-red");
    LowestTime.classList.add("lap-container__letter-green");
  }
};

/*!!!!!Check this function with the team, ask about the destructuring, is it necessary? what would be the acceptable way to do it */
const renderLap = () => {
  removeColorLetterClasses();
  emptyLapsEraser();
  const lapNumber = lapsNodeList.length + 1;
  const lapEl = createLapElement(`lap ${lapNumber}`, "00:00.00");
  const { lastChild: lapTimeEl } = lapEl;

  lapContainerEl.insertBefore(lapEl, lapContainerEl.firstChild);

  paintLines();
  startTimer(lapTimeEl, false);
};

function addLeftZero(num) {
  return num.toString().padStart(2, 0);
}
//!!Question about this function, line 49, would it be better to send it as an object instead of an array? or is the same?
const timeFormatter = (timeInMilliseconds) => {
  const minutes = addLeftZero(Math.trunc(timeInMilliseconds / 60000));
  const seconds = addLeftZero(Math.trunc((timeInMilliseconds % 60000) / 1000));
  const centiSeconds = addLeftZero(
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
    startTime = Date.now() - millisecondsPassed;
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
  millisecondsPassed = Date.now() - startTime;

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
    if (target.className === "controllers__disabled") return null;
    if (target.innerHTML === "Lap") {
      stopTimer(idLapAnimation);
      timeLapContainer.push({
        millisecondsPassed,
        id: lapsNodeList.length - 1,
      });
      renderLap();
    }
    if (target.innerHTML === "Reset") {
      changeButtonText("Lap", "disabled", leftButton);
      startTime = 0;
      timeLapContainer = [];
      millisecondsPassed = 0;
      mainTimeEl.innerHTML = "00:00.00";
      lapContainerEl.innerHTML = `<li class="lap-container__empty-lap"></li>
      <li class="lap-container__empty-lap"></li>
      <li class="lap-container__empty-lap"></li>
      <li class="lap-container__empty-lap"></li>
      <li class="lap-container__empty-lap"></li>
      <li class="lap-container__empty-lap"></li>`;
    }
  });

/*   if (
      target.innerHTML === "Lap" &&
      target.className !== "controllers__disabled"
    ) {
      stopTimer(idLapAnimation);
      renderLap();
    } else {
      changeButtonText("Lap", "disabled", leftButton);
      startTime = 0;
      millisecondsPassed = 0;
      mainTimeEl.innerHTML = "00:00.00";
      lapContainerEl.innerHTML = "";
    }
   */
