const calculatorButtons = document.querySelectorAll(".calculator__button");
const calculatorOutputComputation = document.querySelector(
  ".calculator__interface-inputs"
);

const equalButton = document.querySelector(".calculator__button-equal");
const clearEntryButton = document.querySelector(
  ".calculator__button-clear-entry"
);
const clearButton = document.querySelector(".calculator__button-clear");

const numberREGEX = /^[0-9]$/;

const operatorSymbolsREGEX = /[\+\-÷×]/;

//JS decided to do a little bit of trolling and not letting me get the already filtered array so I had to make a copy AND only then filter it
let numberButtons = Array.from(calculatorButtons);

numberButtons = numberButtons.filter((button) => {
  return numberREGEX.test(button.outerText);
});

console.log("Number buttons", numberButtons);

let computationButtons = Array.from(calculatorButtons);

computationButtons = computationButtons.filter((button) => {
  return operatorSymbolsREGEX.test(button.outerText);
});

console.log("Operator buttons", computationButtons);

// -------------------------------------------------------------------------------------------------------------

let concatenatedValues = "";

function initialiseCalculator() {
  for (numberButton of numberButtons) {
    numberButton.addEventListener("click", computeNumbers);
  }
  for (operatorButton of computationButtons) {
    operatorButton.addEventListener("click", handleOperators);
  }
}

initialiseCalculator();

equalButton.addEventListener("click", () => {
  console.log("EQUAL button clicked");
});

/* 

1. When the user clicks opens the calculator and hits "0" → Nothing should happen

2. When the user clicks the "-" operator, the minus sign should appear 

3. When the user tries to divide by "0", the calculator should output an error message

*/
function computeNumbers(e) {
  let valueOfButton = e.target.outerText;

  if (calculatorOutputComputation.outerText === "0") {
    //Avoids user spamming zeros
    concatenatedValues = "";
  }
  concatenatedValues += valueOfButton;

  console.log(valueOfButton, concatenatedValues);

  calculatorOutputComputation.textContent = concatenatedValues;
}

function handleOperators(e) {
  let operatorButtonValue = e.target.outerText;
  console.log("operatorButtonValue = ", operatorButtonValue);

  if (!concatenatedValues && operatorButtonValue === "-") {
    //When the user immediatly presses the minus operator, it adds
    concatenatedValues += operatorButtonValue;
    calculatorOutputComputation.textContent = concatenatedValues;
    return;
  } else if (!concatenatedValues) {
    return;
  } else if (concatenatedValues.slice(-1).match(operatorSymbolsREGEX)) {
    //To avoid the user spamming the operatoe buttons
    console.log(
      "concatenatedValues.slice(0, -1) + operatorButtonValue = ",
      concatenatedValues.slice(0, -1) + operatorButtonValue
    );
    concatenatedValues = concatenatedValues.slice(0, -1) + operatorButtonValue;
    calculatorOutputComputation.textContent = concatenatedValues;
  } else {
    concatenatedValues += operatorButtonValue;
    calculatorOutputComputation.textContent = concatenatedValues;
  }
}
