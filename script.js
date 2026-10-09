const display = document.getElementById("display");

let expression = "";
let resultShown = false;

function appendValue(value) {
    if (display.value === "Error") {
        expression = "";
    }

    if (resultShown) {
        if ("0123456789.".includes(value)) {
            expression = "";
        }
        resultShown = false;
    }

    if ("+-*/%".includes(value)) {
        if (expression === "" && value !== "-") {
            return;
        }

        if (/[+\-*/%]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;
    display.value = expression;
}

function clearDisplay() {
    expression = "";
    display.value = "0";
    resultShown = false;
}

function deleteLast() {
    if (resultShown || display.value === "Error") {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);
    display.value = expression || "0";
}

function calculateResult() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        if (/[+\-*/%.]$/.test(expression)) {
            throw new Error("Incomplete expression");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        display.value = Number(result.toPrecision(12)).toString();
        expression = display.value;
        resultShown = true;
    } catch (error) {
        display.value = "Error";
        expression = "";
        resultShown = true;
    }
}

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        appendValue(key);
    } else if (["+", "-", "*", "/", "%"].includes(key)) {
        appendValue(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});
