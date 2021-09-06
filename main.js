const arrows = document.querySelectorAll(".arrow");
let dynImg = document.querySelector(".dyn-img");
const imgCont = dynImg.parentNode;
const loadingEl = document.querySelector(".mdl-spinner");
const bwd = document.querySelector(".bwd");
const fwd = document.querySelector(".fwd");
const form = document.querySelector("form");
const jsArrow = document.querySelector(".js-arrow");
let pageNumber = 0;
const max = 6;

let track = false;
let len = 0;
let dataText = ``;
const dialog = document.querySelector("dialog");

arrows.forEach(arrow => arrow.addEventListener("click", handleArrow));
addEventListener("keydown", handleArrow);

function handleArrow(e, dir) {
  if (dialog.open) return;
  len = 0;
  const FWDStatus = this.classList && this.classList.contains("fwd");
  const isFirst = pageNumber === 0;
  const isFocused =
    e.keyCode &&
    (document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA");
  const forStatus = e.keyCode && e.keyCode === 39;
  const BWDStatus = this.classList && this.classList.contains("bwd");
  const backStatus = e.keyCode && e.keyCode === 37;
  const notValid = e.keyCode && !(e.keyCode === 37 || e.keyCode === 39);

  if (isFirst) bwd.tabIndex = -1;

  if (notValid || ((backStatus || dir === false) && isFirst) || isFocused)
    return;

  if (dir === false || BWDStatus || backStatus) {
    pageNumber--;
  } else if (forStatus || FWDStatus || dir) {
    if (pageNumber === max) return;
    pageNumber++;
    bwd.tabIndex = 0;
  }

  if (pageNumber === 1) {
    bwd.classList.remove("custom-hide");
  } else if (!pageNumber) {
    bwd.classList.add("custom-hide");
  }

  const current = document.querySelector(`[data-page="${pageNumber}"]`);

  Array.from(current.parentElement.children).forEach(el => {
    el.classList.add("hide");
    el.classList.remove("animate");
  });

  current.classList.remove("hide");
  current.classList.add("animate");

  loadingEl.classList.add("is-active");
  fetchImage(current.dataset.pageSrc);

  current.parentElement.parentElement.parentElement.dataset.currentColor =
    current.dataset.bg;

  if (pageNumber === max) {
    jsArrow.classList.add("custom-hide");
    jsArrow.tabIndex = -1;
    fwd.tabIndex = -1;
    return fwd.classList.add("custom-hide");
  } else {
    fwd.tabIndex = 0;
    jsArrow.tabIndex = 0;
    fwd.classList.remove("custom-hide");
    jsArrow.classList.remove("custom-hide");
  }
}

function readResponseAsBlob(response) {
  return response.blob();
}

function showImage(responseAsBlob) {
  // Assuming the DOM has a div with id 'container'
  const imgUrl = URL.createObjectURL(responseAsBlob);
  dynImg.src = imgUrl;
}

function fetchImage(pathToResource) {
  fetch(pathToResource)
    .then(readResponseAsBlob)
    .then(showImage)
    .then(blob => {
      console.log(Date.now());
      loadingEl.classList.remove("is-active");

      return blob;
    })
    .catch(console.log);
}

jsArrow.addEventListener("click", e => {
  e.preventDefault();
  fwd.click();
});

/////////////////////////
/////////////////////////

form.addEventListener("submit", handleSub);

function handleSub(e) {
  dataText = "";
  e.preventDefault();

  function getData(element, check = true) {
    let parsedEle;

    if (check) {
      parsedEle = document.querySelectorAll(`[name=${element}]:checked`);
    } else {
      parsedEle = document.querySelectorAll(`[name=${element}]`);
    }

    if (parsedEle.length === 0) return null;

    const values = Array.from(parsedEle).map(el => el.value);

    return values;
  }

  const values = {
    crust: {
      main: getData("crust"),
      isFood: true,
      price: 2.99
    },
    cheese: {
      main: getData("cheese"),
      isFood: true,
      price: 1.29
    },
    "cheese range": {
      main: getData("cheeserange", false),
      isFood: true,
      isLog: true,
      price: 0.49
    },
    meat: {
      main: getData("meat"),
      isFood: true,
      price: 2.49
    },
    veggie: {
      main: getData("veggie"),
      isFood: true,
      price: 0.49
    },
    drink: {
      main: getData("drink"),
      isFood: true,
      price: 1.99
    },
    name: {
      main: getData("name", false)[0],
      isFood: false
    },
    message: {
      main: getData("message", false)[0],
      isFood: false
    }
  };

  for (let value in values) {
    value = values[value];
    if (value.isLog) {
      value.total = 5 / (1 + 40 * Math.pow(Math.E, -1.6 * value.main / 2));
    } else if (value.isFood && value.main) {
      value.total = value.main.length * value.price;
    } else {
      value.total = 0;
    }
  }

  values.total = Object.values(values).reduce(
    (a, b) => Math.ceil(a + b.total) - 0.01,
    0
  );

  if (
    values.message.main.match(/\<\w+\>/gi) ||
    values.name.main.match(/\<\w+\>/gi)
  )
    // stop xss. Searches for an html tag.
    return (location.href = "rickrolled.html");
  // Rickrolled

  // payment(values)
  finalSubmit(values);
}

const capitalizeFirstLetter = string =>
  string.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

window.addEventListener("wheel", e => {
  if (dialog.open) return;
  e.preventDefault();

  let forward;
  const ignore = 0;

  if (Math.abs(e.deltaY) <= ignore || track) return;

  if (e.deltaY >= 0) {
    forward = true;
    len++;
  } else {
    forward = false;
    len--;
  }
  if (Math.abs(len) >= 1) {
    handleArrow(false, forward);
    len = 0;
    track = true;
    setTimeout(() => {
      track = false;
    }, 500);
  }
});

const html = String.raw;

function finalSubmit(vals) {
  return payment(vals);

  if (vals.name.main) {
    dataText += html`
	  <h2><strong>Hey, ${vals.name.main}!</strong></h2>
	  <p>Your order is:</p>`;
  }

  for (let val in vals) {
    dataHTML(vals, val);
  }

  dataText += `<p class="total"><strong>Total: </strong>$${vals.total}</p>`;

  if (!!vals.message.main) {
    dataText += html`<p><strong>You told us to keep in mind that:</strong></p>
  <p>${vals.message.main}</p>`;
  }

  dialog.querySelector(".mdl-dialog__content").innerHTML = dataText;

  dialog.showModal();
}

dialog
  .querySelector("dialog .mdl-dialog__actions")
  .addEventListener("click", e => {
    if (e.target.classList.contains("close")) return dialog.close();

    if (e.target.classList.contains("agree")) {
      dialog.close();
      handleAgreement();
    }
  });

function handleAgreement() {
  location.href = "thanks.html";
}

function dataHTML(vals, key) {
  const val = vals[key];

  if (!val.main || !val.isFood) return;

  dataText += html`
    <div class="food-section">
     <p><strong>${capitalizeFirstLetter(key)}</strong> - $${val.price} 
     ${val.main.length > 1 || val.isLog ? "/ each" : ""}</p>
    <p>${val.main.join(", ")}</p>
    </div>
  `;
  return dataText;
}

function payment(vals) {
  const details = {
    displayItems: [],
    total: {
      label: "Total",
      amount: {
        currency: "USD",
        value: vals.total
      }
    }
  };
  for (const key in vals) {
    const val = vals[key];
    if (val.main && val.isFood) {
      const label = capitalizeFirstLetter(key);
      const amount = {
        currency: "USD",
        value: val.total
      };
      const main = {
        label,
        amount
      };
      details.displayItems.push(main);
    }
  }

  // 1. Create a `PaymentRequest` instance
  const request = new PaymentRequest(
    [
      {
        supportedMethods: ["basic-card"],
        data: {
          supportedNetworks: [
            "visa",
            "mastercard",
            "amex",
            "discover",
            "diners",
            "jcb",
            "unionpay"
          ]
        }
      }
    ],
    details
  );
  request
    .show()
    .then(() => (location.href = "thanks.html"))
    .catch(console.log);
}

form.addEventListener("change", e => {
  if (e.target.tagName !== "INPUT") return;

  function getData(element, check = true) {
    let parsedEle;

    if (check) {
      parsedEle = document.querySelectorAll(`[name=${element}]:checked`);
    } else {
      parsedEle = document.querySelectorAll(`[name=${element}]`);
    }

    if (parsedEle.length === 0) return null;

    const values = Array.from(parsedEle).map(el => el.value);

    return values;
  }

  const values = {
    crust: {
      main: getData("crust"),
      isFood: true,
      price: 2.99
    },
    cheese: {
      main: getData("cheese"),
      isFood: true,
      price: 1.29
    },
    "cheese range": {
      main: getData("cheeserange", false),
      isFood: true,
      isLog: true,
      price: 0.49
    },
    meat: {
      main: getData("meat"),
      isFood: true,
      price: 2.49
    },
    veggie: {
      main: getData("veggie"),
      isFood: true,
      price: 0.49
    },
    drink: {
      main: getData("drink"),
      isFood: true,
      price: 1.99
    },
    name: {
      main: getData("name", false)[0],
      isFood: false
    },
    message: {
      main: getData("message", false)[0],
      isFood: false
    }
  };

  for (let value in values) {
    value = values[value];
    if (value.isLog) {
      value.total = 5 / (1 + 40 * Math.pow(Math.E, -1.6 * value.main / 2));
    } else if (value.isFood && value.main) {
      value.total = value.main.length * value.price;
    } else {
      value.total = 0;
    }
  }

  values.total = Object.values(values).reduce(
    (a, b) => Math.ceil(a + b.total) - 0.01,
    0
  );

  document.querySelector(".price-total span").innerHTML = `$${values.total}`;
});
