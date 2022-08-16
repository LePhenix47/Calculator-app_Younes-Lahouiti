const calculatorButtons = document.querySelectorAll(".calculator__button");
const calculatorOutputComputation = document.querySelector(
  ".calculator__interface-inputs"
);

const calculatorOutputSubstringComputation = document.querySelector(
  ".calculator__interface-subtext-inputs"
);

const equalButton = document.querySelector(".calculator__button-equal");
const clearEntryButton = document.querySelector(
  ".calculator__button-clear-entry"
);

const floatingPointButton = document.querySelector(".calculator__button-dot");

const clearButton = document.querySelector(".calculator__button-clear");

const numberREGEX = /[0-9]/;

const operatorSymbolsREGEX = /[+\-÷×]/;
let multiplicationDivisionOperatorsREGEX = /[×÷]/;
let plusMinusOperatorsREGEX = /[+-]/;
const computationSymbolsREGEX = /[+\-÷×\.]/;

const operatorSymbols = {
  plus: "+",
  minus: "-",
  multiplication: "×",
  division: "÷",
};

//JS decided to do a little bit of trolling and not letting me get the already filtered array so I had to make a copy AND only then filter it
let numberButtons = Array.from(calculatorButtons);

let computationButtons = Array.from(calculatorButtons);

// -------------------------------------------------------------------------------------------------------------

let concatenatedValues = "";

function initialiseCalculator() {
  numberButtons = numberButtons.filter((button) => {
    return numberREGEX.test(button.outerText);
  });

  computationButtons = computationButtons.filter((button) => {
    return operatorSymbolsREGEX.test(button.outerText);
  });

  for (numberButton of numberButtons) {
    numberButton.addEventListener("click", computeNumbers);
  }
  for (operatorButton of computationButtons) {
    operatorButton.addEventListener("click", handleOperators);
  }
  equalButton.addEventListener("click", computeEquation);

  floatingPointButton.addEventListener("click", computeFloatingNumbers);

  clearButton.addEventListener("click", reset);

  clearEntryButton.addEventListener("click", removeLastDigit);
}

initialiseCalculator();

/* 

1. When the user clicks opens the calculator and hits "0" → Nothing should happen

2. When the user clicks the "-" operator, the minus sign should appear 

3. When the user tries to divide by "0", the calculator should output an error message

*/

//Is executed whenever the user clicks on a number button
function computeNumbers(e) {
  let valueOfButton = e.target.outerText;

  if (calculatorOutputComputation.outerText === "0") {
    //Avoids user spamming zeros
    concatenatedValues = "";
  }
  concatenatedValues += valueOfButton;

  calculatorOutputComputation.textContent = concatenatedValues;
}

//Is executed whenever the uses presses any math operation button
function handleOperators(e) {
  let operatorButtonValue = e.target.outerText;

  if (!concatenatedValues && operatorButtonValue === operatorSymbols.minus) {
    // === "-"
    //When the user immediatly presses the minus operator, it adds it immediatly
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

// When the "=" button is clicked
function computeEquation() {
  console.log("Equal button clicked!");

  if (computationSymbolsREGEX.test(concatenatedValues.slice(-1))) {
    calculatorOutputSubstringComputation.textContent =
      "Please finish the calculation with a number";
    console.log(numberREGEX.test(concatenatedValues.slice(-1)));
    calculatorOutputSubstringComputation.classList.add("fade-out");
    setTimeout(() => {
      calculatorOutputSubstringComputation.textContent = "";
      calculatorOutputSubstringComputation.classList.remove("fade-out");
    }, 3600);
    return;
  }
  let result = evaluateEquation(concatenatedValues);
  calculatorOutputComputation.textContent = result;
  calculatorOutputSubstringComputation.textContent = concatenatedValues;
}

//When the "." button is clicked
function computeFloatingNumbers() {
  if (!concatenatedValues) {
    return;
  }
  let lastSetOfNumbers = "";
  for (let i = concatenatedValues.length - 1; i >= 0; i--) {
    if (operatorSymbolsREGEX.test(concatenatedValues[i])) {
      break;
    } else {
      lastSetOfNumbers += concatenatedValues[i];
    }
  }
  if (!lastSetOfNumbers.includes(".")) {
    concatenatedValues += ".";
    calculatorOutputComputation.textContent = concatenatedValues;
  }
}

//Function applied whenever the user clicks on the "=" button
//Separates the string while respecting the (PE)MDAS rules
function evaluateEquation(computation) {
  console.log("Type of computation:", typeof computation);
  let isTypeOfEquationString =
    typeof computation === "string" ? computation : computation.toString();
  if (!operatorSymbolsREGEX.test(isTypeOfEquationString.slice(1))) {
    return computation;
  }

  let currentOperator = "";
  let currentOperatorIndex = 0;
  if (multiplicationDivisionOperatorsREGEX.test(computation.slice(1))) {
    for (let i = 1; i < computation.length; i++) {
      if (multiplicationDivisionOperatorsREGEX.test(computation[i])) {
        currentOperator = computation[i];
        currentOperatorIndex = i;
        break;
      }
    }
  } else {
    for (let i = 1; i < computation.length; i++) {
      if (plusMinusOperatorsREGEX.test(computation[i])) {
        currentOperator = computation[i];
        currentOperatorIndex = i;
        break;
      }
    }
  }
  const operands = getIndexes(currentOperatorIndex, computation);
  let currentResult;
  console.log({ currentOperator }, { computation }, { operands });
  switch (currentOperator) {
    case "+":
      currentResult =
        Number(operands.lefthandOperand) + Number(operands.righthandOperand);
      break;
    case "-":
      currentResult =
        Number(operands.lefthandOperand) - Number(operands.righthandOperand);
      break;
    case "×":
      currentResult =
        Number(operands.lefthandOperand) * Number(operands.righthandOperand);
      break;
    case "÷":
      currentResult =
        Number(operands.lefthandOperand) / Number(operands.righthandOperand);
      break;
  }

  let updatedResult = computation.replace(
    computation.slice(operands.startIntervalIndex, operands.endIntervalIndex),
    currentResult.toString()
  );

  if (updatedResult === "Infinity") {
    updatedResult = "Cannot divide by zero";
  }

  if (operatorSymbolsREGEX.test(updatedResult)) {
    evaluateEquation(updatedResult); //We call back our function again
  }

  if (updatedResult.includes(".")) {
    if (updatedResult.split(".")[1].length === 1) {
      return Number(updatedResult).toString();
    } else if (updatedResult.split(".")[1].length > 1) {
      return Number(updatedResult).toFixed(2).toString();
    }
  } else {
    return evaluateEquation(updatedResult); //Man, NEVER ever again am I using a recursive function
  }
}

//Tells where to separate the numbers with the operators
function getIndexes(operatorIndex, computation) {
  let righthandOperand = "";
  let endIntervalIndex = 0;

  for (let i = operatorIndex + 1; i <= computation.length; i++) {
    if (i === computation.length) {
      endIntervalIndex = computation.length;
      break;
    } else if (operatorSymbolsREGEX.test(computation[i])) {
      endIntervalIndex = i;
      break;
    } else {
      righthandOperand += computation[i];
    }
  }

  let lefthandOperand = "";
  let startIntervalIndex = 0;
  let minusOperatorREGEX = /[-]/;
  for (let i = operatorIndex - 1; i >= 0; i--) {
    if (i === 0 && minusOperatorREGEX.test(computation[i])) {
      startIntervalIndex = 0;
      lefthandOperand += "-";
      break;
    } else if (i === 0) {
      startIntervalIndex = 0;
      lefthandOperand += computation[i];

      break;
    } else if (operatorSymbolsREGEX.test(computation[i])) {
      startIntervalIndex = i + 1;
      lefthandOperand += computation[i];
    } else {
      lefthandOperand += computation[i];
    }
  }

  lefthandOperand = lefthandOperand.split("").reverse().join("");

  return {
    lefthandOperand,
    righthandOperand,
    startIntervalIndex,
    endIntervalIndex,
  };
}

//Resets the entire calculator
function reset() {
  concatenatedValues = "";
  calculatorOutputComputation.textContent = "0";
  calculatorOutputSubstringComputation.textContent = "";
}

//Removes the last digit
function removeLastDigit() {
  concatenatedValues = concatenatedValues.slice(-1);
}
