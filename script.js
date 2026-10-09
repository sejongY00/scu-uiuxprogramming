// 5주차: 분실·습득 제보 — 이메일을 확인하고 처리 결과를 화면에 알려 줍니다.
console.log("JavaScript가 연결되었습니다.");

// 1. 변하지 않는 값은 const로 저장합니다.
const defaultButtonText = "제보 보내기";
const defaultMessage = "연락받을 이메일을 입력하고 제보를 보내 주세요.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 2. 제보 전후로 바뀌는 상태는 let으로 저장합니다.
let isReported = false; // Boolean: 접수 여부
let reportCount = 0; // Number: 이번 방문에서 접수한 제보 수

// 3. JavaScript가 바꿀 요소를 id로 찾습니다.
const emailInput = document.querySelector("#email");
const reportButton = document.querySelector("#reportButton");
const reportMessage = document.querySelector("#reportMessage");

// 자료형을 예상한 대로 쓰고 있는지 Console에서 확인합니다.
console.log(typeof defaultMessage, typeof reportCount, typeof isReported); // string number boolean

// 4. 이메일에 문제가 있으면 안내 문구를, 없으면 빈 문자열을 반환합니다.
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

// 5. 접수 완료 문구를 반환합니다. 학교 메일(.ac.kr)이면 문구가 달라집니다.
function makeReportMessage(email, count) {
  if (email.toLowerCase().endsWith(".ac.kr") === true) {
    return count + "번째 제보가 접수되었습니다. 학교 메일로 연락드릴게요.";
  }
  return count + "번째 제보가 접수되었습니다. 입력하신 메일로 연락드릴게요.";
}

// 6. 안내 문구와 입력창 스타일을 상태에 맞게 바꿉니다.
function showMessage(text, state) {
  reportMessage.textContent = text;
  reportMessage.classList.remove("is-error", "is-success");
  emailInput.classList.remove("is-error");

  if (state === "error") {
    reportMessage.classList.add("is-error");
    emailInput.classList.add("is-error");
  } else if (state === "success") {
    reportMessage.classList.add("is-success");
  }
}

// 7. 버튼을 누른 순간 실행할 동작입니다.
function sendReport(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막습니다.

  const email = emailInput.value.trim();
  const problem = checkEmail(email);

  if (problem !== "") {
    isReported = false;
    showMessage(problem, "error");
    emailInput.focus();
    return;
  }

  isReported = true;
  reportCount = reportCount + 1;
  showMessage(makeReportMessage(email, reportCount), "success");
  reportButton.textContent = "접수 완료";
  reportButton.disabled = true; // 같은 제보가 반복되지 않게 막습니다.
}

// 8. 접수 뒤 이메일을 고치면 새 제보로 보고 버튼을 다시 켭니다.
function resetReport() {
  if (isReported === true) {
    isReported = false;
    reportButton.textContent = defaultButtonText;
    reportButton.disabled = false;
    showMessage(defaultMessage, "");
  }
}

// 9. 이벤트와 함수를 연결합니다.
reportButton.addEventListener("click", sendReport);
emailInput.addEventListener("input", resetReport);
