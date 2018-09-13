const screenDiv = document.querySelector('.screen');
const btnContainer = document.querySelector('.buttons');

let inpStr = "", // string storing accumulated input
    resultSoFar = null, // number result of previous calculations
    operation = ""; // string storing current operation (e.g. '*', '/')

const operInpArr = ['÷', '×', '-', '+'];

// the screen can accommodate max 15 characters/digits
// any number longer than 15 chars must be truncated before display
// floats will be sliced to a length of 15 char
// non-float numbers larger than 15 chars will be converted to exponent expressions (e.g. 123.45 * 10^23)
const renderVisual = n => {
  if (typeof n === "string") {
    if (n.includes(".")) {
      return n.slice(0, 15);
    } else {
      n = Number(n);
    }
  }
  if (n < 999999999999999) {
    return String(n).slice(0, 15);
  } else {
    let power = 0;
    while (n > 999999) {
      n /= 10;
      power++;
    }
    if (power > 99) {
      clearAll();
      return "u kidding me?!";
    } else {
      return `${String(n.toFixed(2))}*10^${power}`;
    }
  }
}

// if current number input underway, then input so far will be displayed
// if last button clicked was an operation button, then result so far will be displayed
const updateScreen = () => {
  if(inpStr) {
    screenDiv.textContent = renderVisual(inpStr);
  } else if(resultSoFar) {
    if(resultSoFar === "x/0 = infinity") {
      screenDiv.textContent = resultSoFar;
      resultSoFar = null;
    } else {
      screenDiv.textContent = renderVisual(resultSoFar);
    }
  } else {
    screenDiv.textContent = '0';
  }
}

const clearAll = () => {
  inpStr = operation = "";
  resultSoFar = null;
  updateScreen();
}

const computeResult = () => {
  if (inpStr === "0" && operation === "/") {
    return "x/0 = infinity";
  } else {
    return eval(resultSoFar + operation + inpStr);
  }
}

btnContainer.addEventListener('click', function(e) {
  // console.log(e.target.textContent);
  if(e.target.tagName === 'BUTTON') {
    let newInp = e.target.textContent;
    if (!isNaN(newInp)) {
      inpStr += newInp;
      updateScreen();
    } 
    if (newInp === '←') {
      inpStr = inpStr.slice(0, inpStr.length - 1);
      updateScreen();
    }
    if (newInp === 'C') {
      clearAll();
      updateScreen();
    } 
    if (newInp === '=' && resultSoFar && inpStr) {
      resultSoFar = computeResult();
      inpStr = "";
      operation = "";
      updateScreen();
    } 
    if (operInpArr.includes(newInp)) {
      if (newInp === "×") newInp = "*";
      if (newInp === "÷") newInp = "/";
      if (resultSoFar) {
        resultSoFar = computeResult();
        inpStr = "";
        operation = newInp;
        updateScreen();
      } else if (inpStr) {
        resultSoFar = Number(inpStr);
        inpStr = "";
        operation = newInp;
        updateScreen();
      }
    }
  }
})

updateScreen();