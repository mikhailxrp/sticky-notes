const colorNotes = [
  "#abf736",
  "#ad4cdd",
  "#fa79ab",
  "#9400D3",
  "#DC143C",
  "#00FF00",
  "#FFFF00",
  "#ffff00",
  "#ff4500",
  "#ff1493",
];

// углы поворота заметки
const angelsRotation = [-3, -4, -5, -6, -7, -8, -9, -10, 3, 4, 5, 6, 7, 8, 9, 10];

// button add
const addBtnList = document.querySelectorAll(".plus_btn");
// modal-window
const modalWindow = document.querySelector("#modal");
// modal-close
const modalClose = document.querySelector("#modal-close");
// textarea
const textarea = document.querySelector(".area");
// button-add-sticky
const addSticky = document.querySelector(".btn-add-sticky");
// sticky-container
const stickyContainer = document.querySelector("#sticky-container");

// color background sticky
let colorIndex;
let angleRandom;
let bgColor;
// список для хранения закладок
let stickyList = [];

/****************************************** 
получаю массив из localStorage
******************************************/
if (localStorage.getItem("sticky")) {
  stickyList = JSON.parse(localStorage.getItem("sticky"));

  stickyList.forEach((sticky) => {
    renderSticky(sticky);
  });
}

/***************************************
появление/скрытие модального окна
***************************************/
addBtnList.forEach((btn) => {
  btn.addEventListener("click", addNote);
});

function addNote() {
  bgColor = setBackgroundSticky();
  modalWindow.style.background = `${bgColor}`;
  modalWindow.classList.add("show-modal");
}

// закрытие модалки
modalClose.onclick = function () {
  modalWindow.classList.remove("show-modal");
};

/*************************
событие добавления задачи
*************************/
addSticky.onclick = function (event) {
  addNewSticky();
  modalWindow.classList.remove("show-modal");
};

stickyContainer.addEventListener("click", deleteSticky);
stickyContainer.addEventListener("click", editSticky);
/************************************** 
Добавление закладки в массив и ее рендер на странице
**************************************/

// функция добавления заметку в список заметок
function addNewSticky() {
  let noteText = textarea.value;

  // одна заметка
  const newSticky = {
    text: noteText,
    id: Date.now(),
    color: bgColor,
    angle: setRandomAngle(),
  };

  // рендер разметки заметки
  renderSticky(newSticky);

  // добавляю заметку в массив заметок
  stickyList.push(newSticky);
  saveToLocalStorage();

  textarea.value = "";
}

function renderSticky(sticky) {
  const stickyHtml = ` <li class="sticky__item" id="${sticky.id}" 
                           style="background: ${sticky.color}; 
                           transform: rotate(${sticky.angle + "deg"})" draggable="true">
                          <div class="action-inner">
                            <span class="edit">
                              <img src="./img/pencil.svg" alt="pen" data-action="edit"/>
                            </span>
                            <span class="close" data-action="delete"></span>
                          </div>
                          <textarea name="item" disabled class="area" value="">${sticky.text}</textarea>
                          <button class="btn-edit-sticky hidden">изменить</button>
                       </li>
                      `;
  stickyContainer.insertAdjacentHTML("beforeend", stickyHtml);
}

function setBackgroundSticky() {
  colorIndex = Math.floor(Math.random() * colorNotes.length);
  return colorNotes[colorIndex];
}

function setRandomAngle() {
  angleRandom = Math.floor(Math.random() * angelsRotation.length);
  return angelsRotation[angleRandom];
}

function deleteSticky(e) {
  if (e.target.dataset.action != "delete") return;
  const parentNode = e.target.closest(".sticky__item");

  const id = Number(parentNode.id);

  const indexSticky = stickyList.findIndex((item) => {
    if (item.id === id) {
      return true;
    }
  });

  stickyList.splice(indexSticky, 1);
  saveToLocalStorage();

  parentNode.remove();
}

function editSticky(e) {
  const parentNode = e.target.closest(".sticky__item");
  const editBtn = parentNode.querySelector(".btn-edit-sticky");
  const text = parentNode.querySelector(".area");

  if (e.target.dataset.action != "edit") return;

  text.removeAttribute("disabled");
  editBtn.classList.remove("hidden");

  const id = Number(parentNode.id);

  stickyList.findIndex((item) => {
    if (item.id === id) {
      editBtn.addEventListener("click", function () {
        item.text = text.value;
        saveToLocalStorage();
        text.setAttribute("disabled", true);
        editBtn.classList.add("hidden");
      });
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem("sticky", JSON.stringify(stickyList));
}

// появление шапки сайта
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  header.classList.toggle("header-sticky", window.scrollY > window.innerHeight);
});
