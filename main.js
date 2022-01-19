/*
 ** do not allow to re-record functions
 ** allow variables to be re-recorder inside the functions
 ** restrict variables to be re-recorded from the outside
 */
// a value from the input field
const currentFirstElemValue = () => {
  let formFirstElement = document.calculationForm.firstElementChild;
  let firstElementValue = formFirstElement.value;
  if (document.activeElement == formFirstElement) {
    firstElementValue = Number(document.activeElement.value)
      .toFixed(2)
      .toString();
  }
  return firstElementValue;
};
const createOptionsList = () => {
  fetch("http://api.nbp.pl/api/exchangerates/tables/a/")
    .then((response) => response.json())
    .then((data) => {
      let rates = data[0].rates;
      let selectedRates = rates.filter((elem) => {
        if (
          elem.currency == "euro" ||
          elem.currency == "dolar amerykański" ||
          elem.currency == "frank szwajcarski"
        ) {
          return elem;
        }
      });
      selectedRates.map((elem) => {
        let option = document.createElement("option");
        option.setAttribute("value", elem.mid);
        option.setAttribute("label", elem.code);
        option.innerText = elem.currency;
        document.calculationForm.optionsList.appendChild(option);
      });
      return document.calculationForm.optionsList;
    })
    .catch((error) => console.log(error));
};
const convertToPLN = () => {
  let currentExchangeRate = document.calculationForm.optionsList.value;
  let firstElementValue = currentFirstElemValue();
  // x PLN = firstElementValue * currentExchangeRate
  let countValue = (firstElementValue * currentExchangeRate).toFixed(2);
  return countValue;
};
const showResult = () => {
  let p = document.querySelector("div.result p.text");
  let result = convertToPLN();
  let firstValue = currentFirstElemValue();
  if (result != "0.00") {
    p.innerText = `It is ${result} PLN`;
  } else if (firstValue == "") {
    p.innerText = "Enter the amount in the input field to calculate the result";
  } else {
    p.innerText = "The amount is 0. Check for the entered values";
  }
};
// shows the form after loading tha page and hiding the loader
const appearForm = () => {
  let form = document.querySelector("form.form");
  let spinner = document.querySelector("div.spinner-grow");
  let appendOptionsToSelect = createOptionsList();
  // makes the loader appear
  spinner.className =
    "spinner-grow d-flex justify-content-center align-items-center";
  // makes the form appear
  if (form.className == "form d-none") {
    setTimeout(() => {
      // make the loader disappear
      spinner.className = "spinner-grow d-none";
      form.className =
        "form w-100 d-flex justify-content-start align-items-center";
      appendOptionsToSelect;
      return form;
    }, 2000);
  }
  return;
};
// the form element appears after loading the page
document.addEventListener("DOMContentLoaded", function () {
  appearForm();
  // display the value in the input field
  document.calculationForm.numberField.addEventListener(
    "change",
    currentFirstElemValue
  );
  // add the click event after the DOM was loaded
  document.calculationForm.submitButton.addEventListener("click", showResult);
});
