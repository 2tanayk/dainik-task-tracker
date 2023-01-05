let todayDate = new Date();
let date = new Date();
let seekedDate = new Date();

let currentFirstDay = getFirstDay(
  todayDate.getFullYear(),
  todayDate.getMonth()
);
let daysInCurMonth = getDaysInMonth(
  todayDate.getFullYear(),
  todayDate.getMonth()
);
let calArr = [];
let selectedCell = null;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let themeDropDown = document.querySelector(".theme-dropdown-container");
let themeSwitchBtn = document.querySelector(".palette-icon-container");
let themeDropDownCloseIcon = document.querySelector(".cross-icon");
let todayBtn = document.getElementById("today-btn");
let searchBar = document.getElementById("search-input");
let prevMonthSwitch = document.getElementById("prev-switch");
let nxtMonthSwitch = document.getElementById("nxt-switch");
let prevTodoSwitch = document.getElementById("prev-todo");
let nxtTodoSwitch = document.getElementById("next-todo");
let addTodoEntryBtn = document.getElementById("add-todo-btn");
let inputTodoEntryContainer = document.querySelector(".input-todo-entry");
let inputTitleTextarea = document.getElementById("input-title-textarea");
let inputDescTextarea = document.getElementById("input-description-textarea");
let addBtn = document.getElementById("add-btn");
let cancelBtn = document.getElementById("cancel-btn");

let curTheme = loadSavedTheme();
setTheme(curTheme);

themeSwitchBtn.addEventListener("click", function (e) {
  themeDropDown.style.display = "flex";

  let curThemeThumbnail = themeDropDown.querySelector(`#${curTheme}`);

  if (curThemeThumbnail.lastElementChild.firstElementChild) {
    return;
  }

  let checkIcon = document.createElement("i");
  checkIcon.classList.add("fa-solid");
  checkIcon.classList.add("fa-check");

  curThemeThumbnail.lastElementChild.append(checkIcon);
});

themeDropDownCloseIcon.addEventListener("click", function (e) {
  themeDropDown.style.display = "none";
});

themeDropDown.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("theme-col-box") ||
    e.target.classList.contains("bg-col-box")
  ) {
    let curThemeThumbnail = e.target.closest(".theme-thumbnail");
    console.log("setting theme to:", curThemeThumbnail.id);
    let check = themeDropDown.querySelector(".fa-check");
    check.remove();
    curThemeThumbnail.lastElementChild.append(check);

    setTheme(curThemeThumbnail.id);
  }
});

todayBtn.addEventListener("click", function (e) {
  console.log("going back to today");
  seekedDate = new Date();

  createTodoBodySkeleton(seekedDate);
  loadEntriesForDate(seekedDate);

  if (!nxtTodoSwitch.classList.contains("disable")) {
    nxtTodoSwitch.classList.add("disable");
  }
});

prevTodoSwitch.addEventListener("click", function (e) {
  console.log("fetching prev todo entries");
  // let curDate=seekedDate.getDate()
  // let curMonth=seekedDate.getMonth()
  // let curYear=seekedDate.getFullYear()

  seekedDate.setDate(seekedDate.getDate() - 1);

  createTodoBodySkeleton(seekedDate);
  loadEntriesForDate(seekedDate);

  nxtTodoSwitch.classList.remove("disable");
});

nxtTodoSwitch.addEventListener("click", function (e) {
  console.log("fetching nxt todo entries");

  seekedDate.setDate(seekedDate.getDate() + 1);

  createTodoBodySkeleton(seekedDate);
  loadEntriesForDate(seekedDate);

  if (isDateToday(seekedDate, seekedDate.getDate())) {
    nxtTodoSwitch.classList.add("disable");
  }
});

addTodoEntryBtn.addEventListener("click", function (e) {
  addTodoEntryBtn.style.display = "none";
  inputTodoEntryContainer.style.display = "flex";
});

inputTitleTextarea.addEventListener("input", function (e) {
  console.log(inputTitleTextarea.value);

  if (inputTitleTextarea.value.trim() === "") {
    addBtn.classList.add("disable");
  } else {
    addBtn.classList.remove("disable");
  }
});

addBtn.addEventListener("click", function (e) {
  // console.log(inputTitleTextarea.value.trim(), inputDescTextarea.value.trim())
  let curTitle = inputTitleTextarea.value.trim();
  let curDesc = inputDescTextarea.value.trim();

  let curTodoHeader = document.querySelector(".entry-header");
  let day = curTodoHeader.getAttribute("data-day");
  let month = curTodoHeader.getAttribute("data-month");
  let year = curTodoHeader.getAttribute("data-year");

  let curDate = new Date(year, month, day);
  let uid = saveNewEntryToLocalStorage(curDate, curTitle, curDesc);

  createTodoEntry(curTitle, curDesc, uid, "pending");

  inputTitleTextarea.value = "";
  inputDescTextarea.value = "";
  inputTodoEntryContainer.style.display = "none";
  addTodoEntryBtn.style.display = "flex";
});

cancelBtn.addEventListener("click", function (e) {
  inputTodoEntryContainer.style.display = "none";
  addTodoEntryBtn.style.display = "flex";
});

let calBody = document.querySelector(".calendar-body");
let calHeader = document.querySelector(".month-year-name");

calHeader.innerText = `${
  monthNames[todayDate.getMonth()]
} ${todayDate.getFullYear()}`;

createCalendarEntries(currentFirstDay, daysInCurMonth);
console.log(calArr);

populateCalendar();

prevMonthSwitch.addEventListener("click", function (e) {
  console.log("prev click");
  let curMonth = date.getMonth();

  if (curMonth != 0) {
    date = getFirstDay(date.getFullYear(), date.getMonth() - 1);
  } else {
    date = getFirstDay(date.getFullYear() - 1, 11);
  }

  clearContents(calBody);
  calHeader.innerText = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  let daysInPrevMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

  createCalendarEntries(date, daysInPrevMonth);
  console.log(calArr);
  populateCalendar();

  nxtMonthSwitch.classList.remove("disable");
});

nxtMonthSwitch.addEventListener("click", function (e) {
  console.log("nxt click");

  let curMonth = date.getMonth();

  if (curMonth < 11) {
    date = getFirstDay(date.getFullYear(), date.getMonth() + 1);
  } else {
    date = getFirstDay(date.getFullYear() + 1, 0);
  }

  clearContents(calBody);
  calHeader.innerText = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  let daysInNxtMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

  createCalendarEntries(date, daysInNxtMonth);
  console.log(calArr);
  populateCalendar();

  if (
    date.getFullYear() === todayDate.getFullYear() &&
    date.getMonth() == todayDate.getMonth()
  ) {
    nxtMonthSwitch.classList.add("disable");
  }
});

let todoContainer = document.querySelector(".todo-container");
let todoHeader = document.querySelector(".entry-header");
let todoDoneContainer = document.querySelector(".done-container");
let todoPendingContainer = document.querySelector(".pending-container");

createTodoBodySkeleton(todayDate);
loadEntriesForDate(todayDate);

searchBar.addEventListener("keyup", function (e) {
  console.log(e.target.value);
  let todoEntryElementsArray = Array.from(
    document.getElementsByClassName("todo-text")
  );
  console.log(todoEntryElementsArray);

  if (!todoEntryElementsArray) {
    console.log("there are 0 entries!");
    return;
  }

  const searchQuery = e.target.value.toLowerCase();

  todoEntryElementsArray.forEach(function (item) {
    let title = item.firstElementChild.innerText.toLowerCase();
    let description = item.lastElementChild.innerText.toLowerCase();

    let todoEntry = item.parentElement;
    let todoEditor = todoEntry.nextElementSibling;
    let hr = todoEditor.nextElementSibling;

    if (title.includes(searchQuery) || description.includes(searchQuery)) {
      todoEntry.style.display = "flex";
      todoEditor.style.display = "none";
      hr.style.display = "block";
    } else {
      todoEntry.style.display = "none";
      todoEditor.style.display = "none";
      hr.style.display = "none";
    }
  });
});

searchBar.addEventListener("focusout", function (e) {
  createTodoBodySkeleton(seekedDate);
  loadEntriesForDate(seekedDate);
});

todoContainer.addEventListener("click", function (e) {
  console.log("todoContainer clicked!", e.target);

  if (e.target.classList.contains("fa-pen")) {
    console.log("edit btn clicked");
    let todoEntry = e.target.closest(".todo-entry");
    let todoEditEntry = todoEntry.nextElementSibling;
    let todoEntryText = todoEntry.children[1];
    let todoEditTitle =
      todoEditEntry.getElementsByClassName("edit-title-text")[0];
    let todoEditDesc = todoEditEntry.getElementsByClassName(
      "edit-description-text"
    )[0];
    let saveBtn = todoEditEntry.getElementsByClassName("edit-save-btn")[0];

    console.log(saveBtn, todoEditTitle, todoEditDesc);

    let title = todoEntryText.children[0].innerText;
    let description = todoEntryText.children[1].innerText;

    let titleNode = todoEditEntry.children[0].children[0].children[0];
    let descNode = todoEditEntry.children[0].children[1].children[0];

    console.log(todoEntry, todoEditEntry, titleNode.value, descNode.value);

    titleNode.value = title;
    descNode.value = description;

    todoEditTitle.addEventListener("input", function (e) {
      console.log(todoEditTitle.value);

      if (todoEditTitle.value.trim() === "") {
        saveBtn.classList.add("disable");
      } else {
        saveBtn.classList.remove("disable");
      }
    });

    todoEntry.style.display = "none";
    todoEditEntry.style.display = "flex";
  } else if (e.target.classList.contains("fa-trash")) {
    console.log("delete btn clicked");
    let todoEntry = e.target.closest(".todo-entry");
    let todoEditEntry = todoEntry.nextElementSibling;
    let horizontalRule = todoEditEntry.nextElementSibling;
    let curTodoHeader = e.target.closest(".todo-container").firstElementChild;
    let curDateStr = `${curTodoHeader.getAttribute(
      "data-day"
    )}-${curTodoHeader.getAttribute("data-month")}-${curTodoHeader.getAttribute(
      "data-year"
    )}`;
    let uid = todoEntry.getAttribute("data-uid");
    let status = todoEntry.parentElement.getAttribute("data-status");

    deleteEntryFromLocalStorage(curDateStr, status, uid);

    todoEntry.remove();
    todoEditEntry.remove();
    horizontalRule.remove();
  } else if (e.target.classList.contains("edit-cancel-btn")) {
    console.log(e.target);
    let todoEditEntry = e.target.closest(".edit-todo-entry");
    let todoEntry = todoEditEntry.previousElementSibling;

    todoEditEntry.style.display = "none";
    todoEntry.style.display = "flex";
  } else if (e.target.classList.contains("edit-save-btn")) {
    let curTodoEditor = e.target.closest(".edit-todo-entry");
    let curTodoEditTitle =
      curTodoEditor.getElementsByClassName("edit-title-text")[0];
    let curTodoEditDesc = curTodoEditor.getElementsByClassName(
      "edit-description-text"
    )[0];

    console.log(curTodoEditTitle.value, curTodoEditDesc.value);

    let curTodoEntry = curTodoEditor.previousElementSibling;
    let curTodoTitleText = curTodoEntry.getElementsByClassName("title")[0];
    let curTodoDescText = curTodoEntry.getElementsByClassName("description")[0];
    let curTodoHeader = e.target.closest(".todo-container").firstElementChild;
    let curDateStr = `${curTodoHeader.getAttribute(
      "data-day"
    )}-${curTodoHeader.getAttribute("data-month")}-${curTodoHeader.getAttribute(
      "data-year"
    )}`;
    let status = curTodoEntry.parentElement.getAttribute("data-status");
    let uid = curTodoEntry.getAttribute("data-uid");

    curTodoTitleText.innerText = curTodoEditTitle.value;
    curTodoDescText.innerText = curTodoEditDesc.value;

    updateEntryInLocalStorage(
      curDateStr,
      curTodoEditTitle.value,
      curTodoEditDesc.value,
      status,
      uid
    );

    curTodoEditor.style.display = "none";
    curTodoEntry.style.display = "flex";
  } else if (
    e.target.classList.contains("custom-check") ||
    e.target.classList.contains("fa-check")
  ) {
    console.log(e.target.tagName);
    let curTodoHeader = e.target.closest(".todo-container").firstElementChild;
    console.log("curTodoHeader", curTodoHeader);
    let curDateStr = `${curTodoHeader.getAttribute(
      "data-day"
    )}-${curTodoHeader.getAttribute("data-month")}-${curTodoHeader.getAttribute(
      "data-year"
    )}`;

    if (e.target.tagName === "I" || e.target.firstElementChild) {
      console.log("div is checked", e.target.firstChild);

      let todoEntry = e.target.closest(".todo-entry");
      let todoEditEntry = todoEntry.nextElementSibling;
      let hr = todoEditEntry.nextElementSibling;

      let curUid = todoEntry.getAttribute("data-uid");
      updateStatusInLocalStorage(curDateStr, "done", curUid);

      todoEntry.remove();
      todoEditEntry.remove();
      hr.remove();

      todoPendingContainer.append(todoEntry);
      todoPendingContainer.append(todoEditEntry);
      todoPendingContainer.append(hr);

      clearContents(e.target);
      if (e.target.tagName === "I") {
        e.target.remove();
      }
    } else {
      console.log("div is unchecked");

      let todoEntry = e.target.closest(".todo-entry");
      let todoEditEntry = todoEntry.nextElementSibling;
      let hr = todoEditEntry.nextElementSibling;

      let curUid = todoEntry.getAttribute("data-uid");
      updateStatusInLocalStorage(curDateStr, "pending", curUid);

      console.log(todoEntry, todoEditEntry, hr);

      todoEntry.remove();
      todoEditEntry.remove();
      hr.remove();

      todoDoneContainer.append(todoEntry);
      todoDoneContainer.append(todoEditEntry);
      todoDoneContainer.append(hr);

      let checkIcon = document.createElement("i");
      checkIcon.classList.add("fa-solid");
      checkIcon.classList.add("fa-check");

      e.target.append(checkIcon);
    }
  }
});

let calContainer = document.querySelector(".calendar-container");

calContainer.addEventListener("click", function (e) {
  console.log("calContainer clicked", e.target);

  if (e.target.classList.contains("date-cell")) {
    console.log("date cell clicked!");
    let cDate = parseInt(e.target.innerText);
    let cMonth = parseInt(calBody.getAttribute("data-month"));
    let cYear = parseInt(calBody.getAttribute("data-year"));

    let sDate = new Date(cYear, cMonth, cDate);

    console.log("Date", sDate, typeof cDate);

    if (
      cYear === todayDate.getFullYear() &&
      cMonth === todayDate.getMonth() &&
      cDate > todayDate.getDate()
    ) {
      console.log("future date seek not allowed!");
      return;
    }

    if (!isDateToday(sDate, sDate.getDate())) {
      nxtTodoSwitch.classList.remove("disable");
    } else {
      if (!nxtTodoSwitch.classList.contains("disable")) {
        nxtTodoSwitch.classList.add("disable");
      }
    }

    seekedDate = sDate;

    createTodoBodySkeleton(seekedDate);
    loadEntriesForDate(seekedDate);
  }
});

function deleteEntryFromLocalStorage(storageKey, status, uid) {
  console.log(storageKey, status, uid);

  let curEntryObj = JSON.parse(localStorage.getItem(storageKey));

  if (status === "pending") {
    delete curEntryObj.pending[uid];
  } else {
    delete curEntryObj.done[uid];
  }

  localStorage.setItem(storageKey, JSON.stringify(curEntryObj));
}

function updateEntryInLocalStorage(storageKey, title, desc, status, uid) {
  console.log(storageKey, title, desc, status, uid);

  let curEntryObj = JSON.parse(localStorage.getItem(storageKey));

  let newEntry = { title: title, description: desc };
  if (status === "pending") {
    curEntryObj.pending[uid] = newEntry;
  } else {
    curEntryObj.done[uid] = newEntry;
  }

  localStorage.setItem(storageKey, JSON.stringify(curEntryObj));
}

function updateStatusInLocalStorage(storageKey, status, uid) {
  console.log(storageKey);
  let curEntryObj = JSON.parse(localStorage.getItem(storageKey));

  console.log(curEntryObj);

  let alteredEntry = null;

  if (status === "pending") {
    alteredEntry = curEntryObj.pending[uid];
    delete curEntryObj.pending[uid];
    curEntryObj.done[uid] = alteredEntry;
  } else {
    alteredEntry = curEntryObj.done[uid];
    delete curEntryObj.done[uid];
    curEntryObj.pending[uid] = alteredEntry;
  }

  localStorage.setItem(storageKey, JSON.stringify(curEntryObj));
}

function saveNewEntryToLocalStorage(date, title, desc) {
  let dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  console.log("saving", title, desc, "for date", dateStr);

  let savedEntries = localStorage.getItem(dateStr);
  let uid = "id" + new Date().getTime();
  let newEntry = { title: title, description: desc };

  if (savedEntries) {
    let oldEntries = JSON.parse(savedEntries);
    oldEntries.pending[uid] = newEntry;

    localStorage.setItem(dateStr, JSON.stringify(oldEntries));
  } else {
    let obj = {
      done: {},
      pending: {},
    };

    obj.pending[uid] = newEntry;

    localStorage.setItem(dateStr, JSON.stringify(obj));
  }

  return uid;
}

function createTodoBodySkeleton(date) {
  clearContents(todoHeader);
  clearContents(todoDoneContainer);
  clearContents(todoPendingContainer);

  let labelFirst = document.createElement("h3");
  let labelSecond = document.createElement("h5");
  let labelThird = document.createElement("h5");

  let horizontalRuleDone = document.createElement("hr");
  let horizontalRulePending = document.createElement("hr");

  let labelDone = document.createElement("h4");
  labelDone.innerText = "Done";
  let labelPending = document.createElement("h4");
  labelPending.innerText = "Overdue";

  if (isDateToday(date, date.getDate())) {
    labelFirst.innerText = "Today";
    labelSecond.innerHTML = `&#x2022; ${date.getDate()}${nth(
      date.getDate()
    )} ${monthNames[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`;
    labelThird.innerHTML = `&#x2022; ${dayNames[date.getDay()]}`;

    labelPending.innerText = "Pending";
  } else if (isDateYesterday(date, date.getDate())) {
    labelFirst.innerText = "Yesterday";
    labelSecond.innerHTML = `&#x2022; ${date.getDate()}${nth(
      date.getDate()
    )} ${monthNames[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`;
    labelThird.innerHTML = `&#x2022; ${dayNames[date.getDay()]}`;
  } else {
    labelFirst.innerHTML = `${date.getDate()}${nth(
      date.getDate()
    )} ${monthNames[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`;
    labelSecond.innerHTML = `&#x2022; ${dayNames[date.getDay()]}`;
  }

  todoHeader.setAttribute("data-day", date.getDate());
  todoHeader.setAttribute("data-month", date.getMonth());
  todoHeader.setAttribute("data-year", date.getFullYear());

  todoHeader.append(labelFirst);
  todoHeader.append(labelSecond);
  todoHeader.append(labelThird);

  todoDoneContainer.append(labelDone);
  todoDoneContainer.append(horizontalRuleDone);

  todoPendingContainer.append(labelPending);
  todoPendingContainer.append(horizontalRulePending);
}

function loadEntriesForDate(date) {
  let dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  let curEntries = localStorage.getItem(dateStr);

  if (!curEntries) {
    return;
  }

  let curEntriesObj = JSON.parse(curEntries);
  console.log(curEntriesObj);

  for (var key in curEntriesObj.done) {
    if (!curEntriesObj.done.hasOwnProperty(key)) {
      continue;
    }
    const { title, description } = curEntriesObj.done[key];

    createTodoEntry(title, description, key, "done");
  }

  for (var key in curEntriesObj.pending) {
    if (!curEntriesObj.pending.hasOwnProperty(key)) {
      continue;
    }

    const { title, description } = curEntriesObj.pending[key];

    createTodoEntry(title, description, key, "pending");
  }
}

function createTodoEntry(title, description, uid, status) {
  console.log("creating todo entry:");
  console.log(title, description);

  let todoEntryContainer = document.createElement("div");
  todoEntryContainer.setAttribute("data-uid", uid);
  todoEntryContainer.classList.add("todo-entry");

  let todoCheckbox = document.createElement("div");
  todoCheckbox.classList.add("custom-check");

  if (status === "done") {
    let checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid");
    checkIcon.classList.add("fa-check");
    todoCheckbox.append(checkIcon);
  }

  todoEntryContainer.append(todoCheckbox);

  let todoTextContainer = document.createElement("div");
  todoTextContainer.classList.add("todo-text");

  let todoTitle = document.createElement("div");
  todoTitle.classList.add("title");
  todoTitle.innerText = title;

  let todoDescription = document.createElement("div");
  todoDescription.classList.add("description");
  todoDescription.innerText = description;

  todoTextContainer.append(todoTitle);
  todoTextContainer.append(todoDescription);

  todoEntryContainer.append(todoTextContainer);

  let todoCrud = document.createElement("div");
  todoCrud.classList.add("todo-crud");

  let iconContainerFirst = document.createElement("span");
  let editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid");
  editIcon.classList.add("fa-pen");
  iconContainerFirst.append(editIcon);

  let iconContainerSecond = document.createElement("span");
  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid");
  deleteIcon.classList.add("fa-trash");
  iconContainerSecond.append(deleteIcon);

  todoCrud.append(iconContainerFirst);
  todoCrud.append(iconContainerSecond);

  todoEntryContainer.append(todoCrud);

  if (status === "pending") {
    todoPendingContainer.append(todoEntryContainer);
    createCorrespondingTodoEditor(status);
  } else {
    todoDoneContainer.append(todoEntryContainer);
    createCorrespondingTodoEditor(status);
  }
}

function createCorrespondingTodoEditor(status) {
  let todoEditContainer = document.createElement("div");
  todoEditContainer.classList.add("edit-todo-entry");

  let editEntryTextContainer = document.createElement("div");
  editEntryTextContainer.classList.add("edit-entry-container");

  let titleEditContainer = document.createElement("div");
  titleEditContainer.classList.add("edit-todo-title");

  let titleEditTextarea = document.createElement("textarea");
  titleEditTextarea.rows = 1;
  titleEditTextarea.placeholder = "Chore name";
  titleEditTextarea.classList.add("edit-title-text");

  let descEditContainer = document.createElement("div");
  titleEditContainer.classList.add("edit-todo-description");

  let descEditTextarea = document.createElement("textarea");
  descEditTextarea.rows = 1;
  descEditTextarea.placeholder = "Chore description";
  descEditTextarea.classList.add("edit-description-text");

  titleEditContainer.append(titleEditTextarea);
  descEditContainer.append(descEditTextarea);

  editEntryTextContainer.append(titleEditContainer);
  editEntryTextContainer.append(descEditContainer);

  let btnContainer = document.createElement("div");
  btnContainer.classList.add("save-cancel-btns");

  let cancelBtn = document.createElement("span");
  cancelBtn.classList.add("edit-cancel-btn");
  cancelBtn.innerText = "Cancel";

  let saveBtn = document.createElement("span");
  saveBtn.classList.add("edit-save-btn");
  saveBtn.innerText = "Save";

  btnContainer.append(cancelBtn);
  btnContainer.append(saveBtn);

  todoEditContainer.append(editEntryTextContainer);
  todoEditContainer.append(btnContainer);

  let hr = document.createElement("hr");

  if (status === "pending") {
    todoPendingContainer.append(todoEditContainer);
    todoPendingContainer.append(hr);
  } else {
    todoDoneContainer.append(todoEditContainer);
    todoDoneContainer.append(hr);
  }
}

function getFirstDay(year, month) {
  return new Date(year, month, 1);
}

function getDaysInMonth(year, month) {
  var d = new Date(year, month + 1, 0);
  return d.getDate();
}

function createCalendarEntries(date, days) {
  calBody.setAttribute("data-month", date.getMonth());
  calBody.setAttribute("data-year", date.getFullYear());

  calArr = [];
  let dayOfMonth = 1;
  let tmp = [];

  for (let i = 0; i <= 6; i++) {
    if (i < date.getDay()) {
      tmp.push("-");
    } else {
      tmp.push(dayOfMonth++);
    }
  }

  calArr.push(tmp);

  let ct = 0;

  while (ct < 3) {
    tmp = [];

    for (let i = 0; i <= 6; i++) {
      tmp.push(dayOfMonth++);
    }

    calArr.push(tmp);
    ct++;
  }

  tmp = [];

  for (let i = 0; i <= 6; i++) {
    if (dayOfMonth > days) {
      tmp.push("-");
    } else {
      tmp.push(dayOfMonth++);
    }
  }

  calArr.push(tmp);

  if (dayOfMonth <= days) {
    tmp = [];

    for (let i = 0; i <= 6; i++) {
      if (dayOfMonth > days) {
        tmp.push("-");
      } else {
        tmp.push(dayOfMonth++);
      }
    }

    calArr.push(tmp);
  }
}

function populateCalendar() {
  for (let i = 0; i < calArr.length; i++) {
    let row = document.createElement("div");
    row.classList.add("calendar-row");
    for (let j = 0; j < 7; j++) {
      let cell = document.createElement("div");
      cell.classList.add("calendar-cell");

      if (typeof calArr[i][j] === "string") {
        cell.innerText = 11;
        cell.classList.add("invisible");
      } else {
        cell.innerText = calArr[i][j];
        cell.classList.add("date-cell");

        if (isDateToday(date, calArr[i][j])) {
          cell.style.fontWeight = "bold";
          cell.classList.add("today-cell");
        }
      }
      row.append(cell);
    }
    calBody.append(row);
  }
}

function loadSavedTheme() {
  let savedTheme = localStorage.getItem("theme");
  return savedTheme ? savedTheme : "theme-default";
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  curTheme = theme;
  document.documentElement.className = theme;
}

function nth(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function isDateToday(date, day) {
  return (
    date.getFullYear() === todayDate.getFullYear() &&
    date.getMonth() == todayDate.getMonth() &&
    parseInt(day) === todayDate.getDate()
  );
}

function isDateYesterday(date, day) {
  return (
    date.getFullYear() === todayDate.getFullYear() &&
    date.getMonth() == todayDate.getMonth() &&
    parseInt(day) === todayDate.getDate() - 1
  );
}

// function selectCell(cell) {
//   cell.classList.add("select-cell");
//   selectedCell = cell;
// }

// function unselectCell() {
//   if (selectedCell) {
//     console.log("selected cell is still part of DOM", selectedCell);
//     selectedCell.classList.remove("select-cell");
//   }
// }

function clearContents(parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}
