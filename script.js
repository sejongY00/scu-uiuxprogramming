// 5주차: 분실·습득 제보 — 이메일을 확인하고 처리 결과를 화면에 알려 줍니다.
// 6주차: click(테마·제보 보내기)·input(글자 수)·change(제보 종류) 이벤트와 기능 탭을 추가합니다.
// 7주차: 물건 정보 → 장소·연락 → 확인 → 완료로 이어지는 단계별 제보 흐름을 추가합니다.
console.log("JavaScript가 연결되었습니다.");

// 1. 변하지 않는 값은 const로 저장합니다.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const itemInfoLimit = 30;
const itemInfoWarningLength = 25;

// 제보 종류(분실/습득)마다 달라지는 문구입니다.
const reportTypes = {
  lost: {
    label: "분실",
    buttonText: "분실 제보 보내기",
    message: "잃어버린 물건의 특징과 연락받을 이메일을 입력해 주세요.",
    placeholder: "예: 검은색 에어팟 케이스"
  },
  found: {
    label: "습득",
    buttonText: "습득 등록하기",
    message: "주운 물건의 특징과 연락받을 이메일을 입력해 주세요.",
    placeholder: "예: 학생회관 앞에서 주운 파란 우산"
  }
};

// 2. 제보 전후로 바뀌는 상태는 let으로 저장합니다.
let isReported = false; // Boolean: 접수 여부
let reportCount = 0; // Number: 이번 방문에서 접수한 제보 수

// 3. JavaScript가 바꿀 요소를 id로 찾습니다.
const themeButton = document.querySelector("#themeButton");
const reportTypeSelect = document.querySelector("#reportType");
const itemInfoInput = document.querySelector("#itemInfo");
const itemInfoCount = document.querySelector("#itemInfoCount");
const emailInput = document.querySelector("#email");
const reportButton = document.querySelector("#reportButton");
const reportMessage = document.querySelector("#reportMessage");

// 자료형을 예상한 대로 쓰고 있는지 Console에서 확인합니다.
console.log(typeof reportTypes.lost.message, typeof reportCount, typeof isReported); // string number boolean

// ---------- click: 화면 테마 바꾸기 ----------

// 4. 버튼을 누를 때마다 dark 클래스를 켜고 끄고, 버튼 문구도 같은 상태에 맞춥니다.
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

// ---------- input: 물건 특징 글자 수 ----------

// 5. 글자를 쓰거나 지울 때마다 글자 수를 보여 주고, 한도에 가까워지면 색을 바꿉니다.
function handleItemInfoInput() {
  const currentLength = itemInfoInput.value.length;

  itemInfoCount.textContent = currentLength + " / " + itemInfoLimit;
  itemInfoCount.classList.toggle("is-near-limit", currentLength >= itemInfoWarningLength);
}

// ---------- change: 제보 종류 선택 ----------

// 6. 분실/습득을 고르면 버튼 문구·안내 문구·입력 예시·버튼 색이 함께 바뀝니다.
function handleReportTypeChange() {
  const type = reportTypes[reportTypeSelect.value];

  itemInfoInput.placeholder = type.placeholder;
  reportButton.classList.toggle("is-found", reportTypeSelect.value === "found");
  isReported = false;
  reportButton.disabled = false;
  reportButton.textContent = type.buttonText;
  showMessage(type.message, "", null);
}

// ---------- 5주차: 제보 보내기 ----------

// 7. 이메일에 문제가 있으면 안내 문구를, 없으면 빈 문자열을 반환합니다.
function checkEmail(email) {
  if (email === "") {
    return "이메일을 입력해 주세요.";
  }
  if (email.includes("@") === false) {
    return "이메일에는 @가 들어가야 해요. 예: name@example.com";
  }
  if (emailPattern.test(email) === false) {
    return "이메일 형식을 확인해 주세요. 예: name@example.com";
  }
  return "";
}

// 8. 접수 완료 문구를 반환합니다. 학교 메일(.ac.kr)이면 문구가 달라집니다.
function makeReportMessage(typeLabel, email, count) {
  if (email.toLowerCase().endsWith(".ac.kr") === true) {
    return typeLabel + " " + count + "번째 제보가 접수되었습니다. 학교 메일로 연락드릴게요.";
  }
  return typeLabel + " " + count + "번째 제보가 접수되었습니다. 입력하신 메일로 연락드릴게요.";
}

// 9. 안내 문구와 문제가 있는 입력창 스타일을 상태에 맞게 바꿉니다.
function showMessage(text, state, problemField) {
  reportMessage.textContent = text;
  reportMessage.classList.remove("is-error", "is-success");
  itemInfoInput.classList.remove("is-error");
  emailInput.classList.remove("is-error");

  if (state === "error") {
    reportMessage.classList.add("is-error");
    problemField.classList.add("is-error");
  } else if (state === "success") {
    reportMessage.classList.add("is-success");
  }
}

// 10. 버튼을 누른 순간 실행할 동작입니다.
function sendReport(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막습니다.

  const itemInfo = itemInfoInput.value.trim();
  const email = emailInput.value.trim();
  const emailProblem = checkEmail(email);

  if (itemInfo === "") {
    isReported = false;
    showMessage("물건 특징을 입력해 주세요.", "error", itemInfoInput);
    itemInfoInput.focus();
    return;
  }

  if (emailProblem !== "") {
    isReported = false;
    showMessage(emailProblem, "error", emailInput);
    emailInput.focus();
    return;
  }

  isReported = true;
  reportCount = reportCount + 1;
  showMessage(
    makeReportMessage(reportTypes[reportTypeSelect.value].label, email, reportCount),
    "success",
    null
  );
  reportButton.textContent = "접수 완료";
  reportButton.disabled = true; // 같은 제보가 반복되지 않게 막습니다.
}

// 11. 접수 뒤 내용을 고치면 새 제보로 보고 버튼을 다시 켭니다.
function resetReport() {
  if (isReported === true) {
    isReported = false;
    reportButton.textContent = reportTypes[reportTypeSelect.value].buttonText;
    reportButton.disabled = false;
    showMessage(reportTypes[reportTypeSelect.value].message, "", null);
  }
}

// ---------- 탭: 주요 기능 전환 ----------

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// 12. 모든 탭과 패널의 선택 상태를 해제합니다.
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

// 13. 누른 탭과 data-target으로 연결된 패널 하나만 활성화합니다.
function activateTab(clickedTab) {
  const targetPanel = document.querySelector(clickedTab.dataset.target);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

// 14. 이벤트와 함수를 연결합니다.
themeButton.addEventListener("click", handleThemeClick);
itemInfoInput.addEventListener("input", handleItemInfoInput);
itemInfoInput.addEventListener("input", resetReport);
reportTypeSelect.addEventListener("change", handleReportTypeChange);
reportButton.addEventListener("click", sendReport);
emailInput.addEventListener("input", resetReport);

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// ---------- 7주차: 단계별 제보 흐름 ----------

// 15. 흐름에서 쓰는 고정 값입니다.
const flowStepNames = ["물건 정보", "장소·연락", "제보 확인"];
const flowDateLabels = {
  lost: "잃어버린 날짜",
  found: "주운 날짜"
};
const flowTotalSteps = flowStepNames.length;

// 16. 흐름 안에서 바뀌는 상태입니다. 0은 아직 시작하지 않은 상태, 4는 완료 상태입니다.
let flowStep = 0;

const flowStart = document.querySelector("#flowStart");
const flowPanel = document.querySelector("#flowPanel");
const flowForm = document.querySelector("#flowForm");
const flowProgress = document.querySelector("#flowProgress");
const flowStepItems = document.querySelectorAll(".flow-steps li");
const flowSections = document.querySelectorAll(".flow-step");
const flowTypeGroup = document.querySelector("#flowTypeGroup");
const flowCategory = document.querySelector("#flowCategory");
const flowItem = document.querySelector("#flowItem");
const flowItemCount = document.querySelector("#flowItemCount");
const flowBuilding = document.querySelector("#flowBuilding");
const flowPlace = document.querySelector("#flowPlace");
const flowDate = document.querySelector("#flowDate");
const flowDateLabel = document.querySelector("#flowDateLabel");
const flowKeepField = document.querySelector("#flowKeepField");
const flowKeep = document.querySelector("#flowKeep");
const flowEmail = document.querySelector("#flowEmail");
const flowSummary = document.querySelector("#flowSummary");
const flowDoneSummary = document.querySelector("#flowDoneSummary");
const flowDoneMessage = document.querySelector("#flowDoneMessage");

function padNumber(number) {
  return String(number).padStart(2, "0");
}

// 오늘 날짜를 yyyy-mm-dd로 만듭니다. 오늘 이후 날짜는 고를 수 없게 막습니다.
function getToday() {
  const now = new Date();
  return now.getFullYear() + "-" + padNumber(now.getMonth() + 1) + "-" + padNumber(now.getDate());
}

// 17. 지금 입력·선택된 값을 한 곳에 모읍니다.
function getFlowValues() {
  const checkedType = flowForm.querySelector('input[name="flowType"]:checked');

  return {
    type: checkedType === null ? "" : checkedType.value,
    category: flowCategory.value,
    item: flowItem.value.trim(),
    building: flowBuilding.value,
    place: flowPlace.value.trim(),
    date: flowDate.value,
    keep: flowKeep.value,
    email: flowEmail.value.trim()
  };
}

// 18. 단계마다 빠진 값이나 잘못된 값을 찾아 {field, message} 목록으로 돌려줍니다.
function checkFlowStep(step) {
  const values = getFlowValues();
  const problems = [];

  if (step === 1) {
    if (values.type === "") {
      problems.push({ field: flowTypeGroup, message: "분실인지 습득인지 하나를 골라 주세요." });
    }
    if (values.category === "") {
      problems.push({ field: flowCategory, message: "물건 분류를 목록에서 골라 주세요." });
    }
    if (values.item === "") {
      problems.push({ field: flowItem, message: "물건 특징을 입력해 주세요. 색이나 모양을 적으면 찾기 쉬워요." });
    }
  }

  if (step === 2) {
    if (values.building === "") {
      problems.push({ field: flowBuilding, message: "건물을 목록에서 골라 주세요." });
    }
    if (values.date === "") {
      problems.push({ field: flowDate, message: "날짜를 선택해 주세요. 정확히 모르면 가장 가까운 날을 골라 주세요." });
    } else if (values.date > getToday()) {
      problems.push({ field: flowDate, message: "오늘 이후 날짜는 고를 수 없어요. 오늘이나 지난 날짜로 바꿔 주세요." });
    }
    if (values.type === "found" && values.keep === "") {
      problems.push({ field: flowKeep, message: "물건을 맡겨 둔 곳을 골라 주세요." });
    }
    const emailProblem = checkEmail(values.email);
    if (emailProblem !== "") {
      problems.push({ field: flowEmail, message: emailProblem });
    }
  }

  return problems;
}

// 19. 오류 문구와 빨간 표시를 지웁니다. 범위(root) 안의 것만 지웁니다.
function clearFlowErrors(root) {
  root.querySelectorAll(".field-error, .step-error").forEach(function (message) {
    message.textContent = "";
  });
  root.querySelectorAll(".is-error").forEach(function (field) {
    field.classList.remove("is-error");
    field.removeAttribute("aria-invalid");
  });
}

// 20. 문제가 있는 항목마다 이유와 고치는 방법을 보여 주고, 첫 항목으로 포커스를 옮깁니다.
function showFlowProblems(section, problems) {
  problems.forEach(function (problem) {
    const wrapper = problem.field.closest(".flow-field");

    wrapper.querySelector(".field-error").textContent = problem.message;
    problem.field.classList.add("is-error");
    if (problem.field.tagName !== "FIELDSET") {
      problem.field.setAttribute("aria-invalid", "true");
    }
  });

  section.querySelector(".step-error").textContent =
    "확인이 필요한 항목이 " + problems.length + "개 있어요. 빨간 안내를 보고 고친 뒤 다시 눌러 주세요.";

  const firstField = problems[0].field;
  const focusTarget = firstField.tagName === "FIELDSET" ? firstField.querySelector("input") : firstField;
  focusTarget.focus();
}

// 21. 확인·완료 화면의 목록을 입력값으로 채웁니다. 확인 화면에는 항목별 수정 버튼을 붙입니다.
function fillSummary(listElement, withEditButtons) {
  const values = getFlowValues();
  const rows = [
    { label: "제보 종류", value: reportTypes[values.type].label, step: 1 },
    { label: "물건 분류", value: values.category, step: 1 },
    { label: "물건 특징", value: values.item, step: 1 },
    { label: "건물", value: values.building, step: 2 },
    { label: "상세 장소", value: values.place === "" ? "입력하지 않음" : values.place, step: 2 },
    { label: flowDateLabels[values.type], value: values.date, step: 2 }
  ];

  if (values.type === "found") {
    rows.push({ label: "맡겨 둔 곳", value: values.keep, step: 2 });
  }
  rows.push({ label: "이메일", value: values.email, step: 2 });

  listElement.textContent = "";
  rows.forEach(function (row) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");

    term.textContent = row.label;
    detail.textContent = row.value;
    wrapper.append(term, detail);

    if (withEditButtons === true) {
      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.className = "text-button edit-button";
      editButton.dataset.step = row.step;
      editButton.textContent = "수정";
      editButton.setAttribute("aria-label", row.label + " 수정");
      detail.append(editButton);
    }
    listElement.append(wrapper);
  });
}

// 22. 단계를 바꿉니다. 해당 단계만 보이고, 진행 표시와 안내 문구가 함께 바뀝니다.
function showFlowStep(step) {
  flowStep = step;
  flowSections.forEach(function (section) {
    section.hidden = Number(section.dataset.step) !== step;
  });

  flowStepItems.forEach(function (item, index) {
    item.classList.toggle("is-current", index + 1 === step);
    item.classList.toggle("is-done", index + 1 < step);
    if (index + 1 === step) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  flowPanel.classList.toggle("is-done", step === 4);
  flowProgress.textContent = step <= flowTotalSteps
    ? step + " / " + flowTotalSteps + " · " + flowStepNames[step - 1]
    : "제보 완료";

  if (step === 2) {
    updateFlowTypeView();
  }
  if (step === 3) {
    fillSummary(flowSummary, true);
  }

  const heading = flowSections[step - 1].querySelector("h3");

  heading.focus({ preventScroll: true });
  flowPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 23. 제보 종류에 따라 날짜 문구와 보관 장소 입력 칸을 바꿉니다.
function updateFlowTypeView() {
  const type = getFlowValues().type;

  flowDateLabel.innerHTML = (type === "" ? "날짜" : flowDateLabels[type]) + ' <span class="required">(필수)</span>';
  flowKeepField.hidden = type !== "found";
  if (type !== "found") {
    clearFlowErrors(flowKeepField);
  }
}

// 24. 시작 버튼: 흐름 화면을 열고 첫 단계로 이동합니다.
function handleFlowStart() {
  flowPanel.hidden = false;
  flowStart.hidden = true;
  flowDate.max = getToday();
  showFlowStep(1);
}

// 25. 다음 버튼: 현재 단계의 필수값을 검사해 통과해야만 다음 단계로 넘어갑니다.
function handleFlowNext(event) {
  const step = Number(event.currentTarget.dataset.step);
  const section = flowSections[step - 1];
  const problems = checkFlowStep(step);

  clearFlowErrors(section);
  if (problems.length > 0) {
    showFlowProblems(section, problems);
    return;
  }
  showFlowStep(step + 1);
}

// 26. 이전 버튼: 입력값은 그대로 두고 앞 단계만 보여 줍니다.
function handleFlowBack(event) {
  const step = Number(event.currentTarget.dataset.step);

  clearFlowErrors(flowSections[step - 1]);
  showFlowStep(step - 1);
}

// 27. 확인 화면의 수정 버튼: 해당 항목이 있는 단계로 돌아갑니다.
function handleSummaryEdit(event) {
  const editButton = event.target.closest(".edit-button");

  if (editButton !== null) {
    showFlowStep(Number(editButton.dataset.step));
  }
}

// 28. 완료 버튼: 다시 한 번 검사한 뒤 접수번호와 완료 화면을 보여 줍니다.
function handleFlowSubmit() {
  for (let step = 1; step <= 2; step = step + 1) {
    const problems = checkFlowStep(step);

    if (problems.length > 0) {
      showFlowStep(step);
      showFlowProblems(flowSections[step - 1], problems);
      return;
    }
  }

  const values = getFlowValues();

  reportCount = reportCount + 1;
  flowDoneMessage.textContent =
    "접수번호 LF-" + String(reportCount).padStart(3, "0") + " · " +
    makeReportMessage(reportTypes[values.type].label, values.email, reportCount);
  fillSummary(flowDoneSummary, false);
  showFlowStep(4);
}

// 29. 다시 시작: 입력·선택·오류·진행 상태를 모두 처음으로 되돌립니다.
function handleFlowRestart() {
  flowForm.reset();
  clearFlowErrors(flowForm);
  flowItemCount.textContent = "0 / " + itemInfoLimit;
  flowItemCount.classList.remove("is-near-limit");
  flowSummary.textContent = "";
  flowDoneSummary.textContent = "";
  flowDoneMessage.textContent = "";
  updateFlowTypeView();
  showFlowStep(1);
}

// 30. 입력하거나 고르면 그 항목의 오류 안내를 바로 지웁니다.
function handleFlowFieldChange(event) {
  const wrapper = event.target.closest(".flow-field");
  const section = event.target.closest(".flow-step");

  if (wrapper !== null) {
    clearFlowErrors(wrapper);
  }
  if (section !== null && section.querySelectorAll(".field-error:not(:empty)").length === 0) {
    section.querySelector(".step-error").textContent = "";
  }
  if (event.target.name === "flowType") {
    updateFlowTypeView();
  }
}

function handleFlowItemInput() {
  const currentLength = flowItem.value.length;

  flowItemCount.textContent = currentLength + " / " + itemInfoLimit;
  flowItemCount.classList.toggle("is-near-limit", currentLength >= itemInfoWarningLength);
}

// 31. 입력창에서 Enter를 누르면 현재 단계의 진행 버튼을 누른 것과 같게 처리합니다.
function handleFlowKeydown(event) {
  if (event.key === "Enter" && event.target.tagName === "INPUT" && event.target.type !== "radio") {
    event.preventDefault();
    flowSections[flowStep - 1].querySelector(".primary-button").click();
  }
}

// 32. 이벤트와 함수를 연결합니다.
flowStart.addEventListener("click", handleFlowStart);
flowItem.addEventListener("input", handleFlowItemInput);
flowForm.addEventListener("input", handleFlowFieldChange);
flowForm.addEventListener("change", handleFlowFieldChange);
flowForm.addEventListener("keydown", handleFlowKeydown);
flowForm.addEventListener("submit", function (event) {
  event.preventDefault();
});
flowSummary.addEventListener("click", handleSummaryEdit);
document.querySelectorAll(".flow-next").forEach(function (button) {
  button.addEventListener("click", handleFlowNext);
});
document.querySelectorAll(".flow-back").forEach(function (button) {
  button.addEventListener("click", handleFlowBack);
});
document.querySelector("#flowSubmit").addEventListener("click", handleFlowSubmit);
document.querySelector("#flowRestart").addEventListener("click", handleFlowRestart);
document.querySelector("#flowRestartTop").addEventListener("click", handleFlowRestart);
