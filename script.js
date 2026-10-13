// 5주차: 분실·습득 제보 — 이메일을 확인하고 처리 결과를 화면에 알려 줍니다.
// 6주차: click(테마·제보 보내기)·input(글자 수)·change(제보 종류) 이벤트와 기능 탭을 추가합니다.
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
