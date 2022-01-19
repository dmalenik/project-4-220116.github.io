/*
 ** do not allow to re-record functions
 ** allow variables to be re-recorder inside the functions
 ** restrict variables to be re-recorded from the outside
 */
const currentFirstElemValue = () => {
  let firstElement = document.calculationForm.numberField;
  let firstElementValue = firstElement.value;
  if (document.activeElement == firstElement) {
    firstElementValue = Number(document.activeElement.value)
      .toFixed(2)
      .toString();
  }
  return firstElementValue;
};
// create option element
const createOptionTag = (...currencies) => {
  currencies.map((currency) => {
    let option = document.createElement("option");
    option.setAttribute("value", currency.mid);
    option.setAttribute("label", currency.code);
    option.innerText = currency.currency;
    return document.calculationForm.optionsList.appendChild(option);
  });
};
// create template profile for the options list
const createOptionsTemplate = (data) => {
  if (!data) return;
  let { rates } = data[0];
  let USD = rates.find((elem) => {
    return elem.code == "USD";
  });
  let EUR = rates.find((elem) => {
    return elem.code == "EUR";
  });
  let CHF = rates.find((elem) => {
    return elem.code == "CHF";
  });
  createOptionTag(USD, EUR, CHF);
  return document.calculationForm.optionsList;
};
// get values from the API
const importAPIValues = () => {
  let api = "http://api.nbp.pl/api/exchangerates/tables/a/";
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      createOptionsTemplate(data);
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
  let firstValue = currentFirstElemValue();
  let result = convertToPLN();
  let p = document.querySelector("div.result p.text");
  if (result != "0.00") {
    p.innerText = `It is ${result} PLN`;
  } else if (firstValue == "") {
    p.innerText = "Enter the amount in the input field to calculate the result";
  } else {
    p.innerText = "The amount is 0. Check for the entered values";
  }
};
// show the form element after loading tha page and hiding the loader
const showForm = () => {
  let form = document.calculationForm;
  let spinner = document.querySelector("div.spinner-grow");
  if (form.className == "form d-none") {
    setTimeout(() => {
      spinner.className = "spinner-grow d-none";
      form.className =
        "form w-100 d-flex justify-content-start align-items-center";
      return form;
    }, 3000);
  }
  return;
};
// the form element appears after loading the page
document.addEventListener("DOMContentLoaded", function () {
  showForm();
  document.calculationForm.numberField.addEventListener(
    "change",
    currentFirstElemValue
  );
  importAPIValues();
  document.calculationForm.submitButton.addEventListener("click", showResult);
});
