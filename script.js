var expression_idx = -1;
var combinations = [];
var permutation = [];
var wrong_answer_combinations = [];
var enabled_addition = false;
var enabled_subtraction = false;
var enabled_multiplication = false;
var enabled_division = false;
var enabled_level_1_problems = false;

var correct_answers = 0;
var wrong_answers = 0;

var min_value_operand = 0;
var max_value_operand = 10;

var continue_with_new_question = true;

var passed_seconds = 0;
var passed_minutes = 0;

var answer_timeout;
var timer_interval;
var answer_timeout_milliseconds = 8000;

const digit_keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-"];
var cap_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function get_random_int(min, max) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function value_operand_range_input() {
    var min_value_operand = document.getElementById("min_value_operand");
    var max_value_operand = document.getElementById("max_value_operand");

    document.getElementById("min_value_operand_label_1").innerText = min_value_operand.value;
    document.getElementById("max_value_operand_label_1").innerText = max_value_operand.value;
}

function answer_timeout_milliseconds_range_input() {
    document.getElementById("answer_timeout_milliseconds_label").innerText = 
        document.getElementById("answer_timeout_milliseconds").value + " s";
}

function update_timer() {
    passed_seconds++;

    if (passed_seconds == 60) {
        passed_minutes++;
        passed_seconds = 0;
    }

    var passed_seconds_string = "";
    if (passed_seconds < 10) {
        passed_seconds_string = "0";
    }
    passed_seconds_string += passed_seconds.toString()

    var passed_minutes_string = "";
    if (passed_minutes < 10) {
        passed_minutes_string = "0";
    }
    passed_minutes_string += passed_minutes.toString()

    document.getElementById('timer').innerText = "Timp: " +
        passed_minutes_string + ":" + passed_seconds_string;
}

function setToString(a) {
    var a_string = "{";

    for (var i=0; i<a.length; i++) {
        a_string += a[i].toString();
        if (i < (a.length-1)) {
            a_string += ", ";
        }
    }

    return a_string + "}";
}

function clean_wrong_answer() {
    document.getElementById('body').classList.remove("wrong_answer_bodybackground");
    //document.getElementById('expression_div').setAttribute("style", "background-color: white;");
    document.getElementById('correct_answer_p').remove();
    document.getElementById('continue_button').remove();
    document.getElementById('explanation_p_id').remove();
    continue_with_new_question = true;
    changeMathExpression();
    timer_interval = setInterval(update_timer, 1000);
}

function evaluateMathExpression() {
    let expression_split = document.getElementById('expression').innerHTML.split("=")
    let combination = combinations[permutation[expression_idx]];
    var correct_answer;
    if (combination[3] == "+") {
        correct_answer = combination[0] + combination[2];
    } else if (combination[3] == "&minus;") {
        correct_answer = combination[0] - combination[2];
    } else if (combination[3] == " &sdot; ") {
        correct_answer = combination[0] * combination[2];
    } else if (combination[1] == "abs") {
        correct_answer = Math.abs(combination[0]);
    } else if (combination[1] == "+()") {
        correct_answer = combination[0].toString();
        if (combination[0] > 0) {
            correct_answer = "+" + correct_answer;
        }
    } else if (combination[1] == "-()") {
        correct_answer = ((-1) * combination[0]).toString();
        if (combination[0] < 0) {
            correct_answer = "+" + correct_answer;
        }
    } else {
        correct_answer = combination[0] / combination[2]
    }

    if ((correct_answer === Number(expression_split[1])) || (correct_answer === expression_split[1])) {
            correct_answers++;
            document.getElementById('correct_answers').innerHTML = correct_answers;
    }
    else {
        clearTimeout(answer_timeout);
        clearInterval(timer_interval);
        wrong_answers++;
        wrong_answer_combinations.push(combination);

        document.getElementById('wrong_answers').innerHTML = wrong_answers;
        document.getElementById('expression').innerHTML = expression_split[0]
            + "=<strike style='color:red'><span style='color:black'>" + expression_split[1] + "</span></strike>";
        continue_with_new_question = false;

        var correct_answer_p = document.createElement("p");
        correct_answer_p.setAttribute("id", "correct_answer_p");
        correct_answer_p.setAttribute("class", "expression_p");

        var correct_answer_string = correct_answer.toString();

        if (combination[1] == "abs") {
            if (expression_split[0][1] == "+") {
                correct_answer_string = "|<span style=\"color:green\">+</span>"
                    + expression_split[0].substring(2) + "=" + correct_answer_string;

            } else if (expression_split[0][1] == "-") {
                correct_answer_string = "|<span style=\"color:blue\">-</span>"
                    + expression_split[0].substring(2) + "=" + correct_answer_string;

            } else {
                correct_answer_string = "|<span style=\"color:green\">+</span>"
                    + expression_split[0].substring(1) + "=" + correct_answer_string;
            }

        } else if (combination[1] == "+()") {
            if (expression_split[0][2] == "+") {
                correct_answer_string = "<span style=\"color:green\">+</span>(<span style=\"color:green\">+</span>"
                    + expression_split[0].substring(3) + "=<span style=\"color:green\">+</span>"
                    + correct_answer_string.substring(1);

            } else {
                correct_answer_string = "<span style=\"color:green\">+</span>(<span style=\"color:blue\">-</span>"
                    + expression_split[0].substring(3) + "=<span style=\"color:blue\">-</span>"
                    + correct_answer_string.substring(1);

            }

        } else if (combination[1] == "-()") {
            if (expression_split[0][2] == "+") {
                correct_answer_string = "<span style=\"color:blue\">-</span>(<span style=\"color:green\">+</span>"
                    + expression_split[0].substring(3) + "=<span style=\"color:blue\">-</span>"
                    + correct_answer_string.substring(1);

            } else {
                correct_answer_string = "<span style=\"color:blue\">-</span>(<span style=\"color:blue\">-</span>"
                    + expression_split[0].substring(3) + "=<span style=\"color:green\">+</span>"
                    + correct_answer_string.substring(1);

            }

        } else {
            if (correct_answer > 0) {
                correct_answer_string = "+" + correct_answer_string;
            }

            correct_answer_string = expression_split[0] + "=" + correct_answer_string;
            if (correct_answer_string[0] == "+") {
                correct_answer_string = "<span style=\"color:green\">+"
                    + "</span>" + correct_answer_string.substring(1);
            } else if (correct_answer_string[0] == "-") {
                correct_answer_string = "<span style=\"color:blue\">-</span>"
                    + correct_answer_string.substring(1);
            } else if (correct_answer_string[0] != "0") {
                correct_answer_string = "<span style=\"color:green\">+</span>" + correct_answer_string;
            }

            for (var char_idx = 26; char_idx < correct_answer_string.length; char_idx++) {
                if (correct_answer_string[char_idx] == "+") {
                    correct_answer_string = correct_answer_string.substring(0, char_idx)
                        + "<span style=\"color:green\">+</span>"
                        + correct_answer_string.substring(char_idx + 1);
                    char_idx += 26;
                } else if (correct_answer_string[char_idx] == "-") {
                    correct_answer_string = correct_answer_string.substring(0, char_idx)
                        + "<span style=\"color:blue\">-</span>"
                        + correct_answer_string.substring(char_idx + 1);
                    char_idx += 25;
                }
            }
        }

        correct_answer_p.innerHTML = correct_answer_string;

        document.getElementById('expression_div').appendChild(correct_answer_p);

        var explanation = document.createElement("p");
        explanation.setAttribute("id", "explanation_p_id");
        explanation.classList.add("explanation_p");
        explanation.innerHTML = combination[combination.length - 1];
        var principal_div = document.getElementById('principal_div');
        principal_div.insertBefore(explanation, principal_div.children[0]);


        var continue_button = document.createElement("button");
        continue_button.setAttribute("id", "continue_button");
        continue_button.setAttribute("type", "button");
        continue_button.setAttribute("class", "button continue_button");
        continue_button.setAttribute("onclick", "clean_wrong_answer()");
        continue_button.innerText = "Continuă";

        document.getElementById('expression_div').appendChild(continue_button);
        document.getElementById('body').classList.add("wrong_answer_bodybackground");
        //document.getElementById('expression_div').setAttribute("style", "background-color: rgb(250, 179, 153);");
    }
}

function finish() {
    clearTimeout(answer_timeout);
    clearInterval(timer_interval);
    document.removeEventListener("keydown", keydownEventHandler);
    document.getElementById('expression').remove();

    var results_div = document.createElement("div");
    results_div.setAttribute("id", "results_div");

    var results_title_p = document.createElement("p");
    results_title_p.setAttribute("id", "results_title_p");
    results_title_p.innerHTML = "<b>Rezultate</b>";
    results_div.appendChild(results_title_p);

    var correct_answers_p = document.getElementById('correct_answers_p');
    var wrong_answers_p = document.getElementById('wrong_answers_p');
    correct_answers_p.setAttribute("class", "result_p");
    wrong_answers_p.setAttribute("class", "result_p");

    results_div.appendChild(correct_answers_p);
    results_div.appendChild(wrong_answers_p);

    var precision_p = document.createElement("p");
    precision_p.setAttribute("id", "precision_p");
    precision_p.setAttribute("class", "result_p");
    precision_p.innerHTML = "Precizie: <b>" + ((correct_answers/(correct_answers + wrong_answers))
        * 100).toFixed(2).toString() + "%</b>";
    results_div.appendChild(precision_p);

    var timer_p = document.getElementById('timer');
    timer_p.setAttribute("id", "results_timer_p");
    timer_p.setAttribute("class", "result_p");
    timer_p.innerHTML = "Timp: <b>" + timer_p.innerText.substring(6, 11) + "</b>";
    results_div.appendChild(timer_p)

    var mean_time_per_question_p = document.createElement("p");
    mean_time_per_question_p.setAttribute("id", "mean_time_per_question_p");
    mean_time_per_question_p.setAttribute("class", "result_p");
    mean_time_per_question_p.innerHTML = "Timp mediu per întrebare: <b>" + ((60*passed_minutes
        + passed_seconds)/(correct_answers + wrong_answers)).toFixed(2).toString() + "</b> secunde";
    results_div.appendChild(mean_time_per_question_p);

    principal_div = document.getElementById('principal_div');
    principal_div.appendChild(results_div)

    var restart_button = document.createElement("button");
    restart_button.setAttribute("id", "restart_button");
    restart_button.setAttribute("class", "button");
    restart_button.setAttribute("onclick", "restart()");
    restart_button.innerHTML = "<b>Restart</b>";

    principal_div.appendChild(restart_button);
}

function changeMathExpression() {
    expression_idx++;
    if (expression_idx == combinations.length) {
        if (wrong_answer_combinations.length == 0) {
            finish();
            return;
        }
        combinations = wrong_answer_combinations;
        wrong_answer_combinations = [];
        permutation = [...Array(combinations.length).keys()];
        shuffle(permutation);
        expression_idx = 0;
    }

    var combination = combinations[permutation[expression_idx]];
    var first_operand = combination[0].toString();
    if ((combination[0] > 0) && (get_random_int(0, 1) == 1)) {
        first_operand = "+" + first_operand;
    }

    if ((combination[3] == "+") || (combination[3] == "-")) {
        document.getElementById('expression').innerHTML = first_operand +
            combination[1] + combination[2].toString() + "=?";

    } else if (combination[1] == "abs") {
        document.getElementById('expression').innerHTML = "|" + first_operand + "|=?";
    } else if (combination[1] == "+()") {
        if (combination[0] > 0) {
            first_operand = "+" + combination[0].toString();
        }
        document.getElementById('expression').innerHTML = "+(" + first_operand + ")=?";
    } else if (combination[1] == "-()") {
        if (combination[0] > 0) {
            first_operand = "+" + combination[0].toString();
        }
        document.getElementById('expression').innerHTML = "-(" + first_operand + ")=?";
    }

    clearTimeout(answer_timeout);
    answer_timeout = setTimeout(evaluateMathExpression, answer_timeout_milliseconds);
}

function keydownEventHandler(event) {
    if (continue_with_new_question) {
        let expression = document.getElementById('expression').innerHTML;

        if (event.key == "Enter" && expression.charAt(expression.length - 1) != "?") {
            evaluateMathExpression();
            if (continue_with_new_question) {
                changeMathExpression();
            }
            return;
        }

        if (event.key == "Backspace" && expression.charAt(expression.length - 1) != "?") {
            expression = expression.slice(0, expression.length - 1);
            if (expression.charAt(expression.length - 1) == "=") {
                expression = expression + "?";
            }
            document.getElementById('expression').innerHTML = expression;
            return;
        }

        if (digit_keys.includes(event.key)) {
            if (expression.charAt(expression.length - 1) == "?") {
                expression = expression.slice(0, expression.length - 1);
            }
            document.getElementById('expression').innerHTML = expression + event.key;
        }
    }
}

function init() {
    document.getElementById('correct_answers').innerText = "0";
    document.getElementById('wrong_answers').innerText = "0";
    document.addEventListener("keydown", keydownEventHandler);

    expression_idx = -1;
    combinations = [];
    wrong_answer_combinations = [];
    correct_answers = 0;
    wrong_answers = 0;
    continue_with_new_question = true;

    var same_signs_explanation = "Dacă numerele au același semn, atunci adunăm numerele și punem același semn la rezultat";
    var opposite_signs_explanation = "Dacă numerele au semne diferite, atunci din numărul mai mare scădem numărul mai mic și punem la rezultat semnul numărului mai mare";
    var absolute_value_explanation = "Modulul unui număr este același număr dar pozitiv (cu semnul +)";
    var plus_bracket_explanation = "+ nu schimbă semnul din paranteză";
    var minus_bracket_explanation = "&minus; schimbă semnul din paranteză"

    if (enabled_level_1_problems) {
        var twelve_percent = Math.max(1, Math.floor(0.125 * min_value_operand));
        var ten_percent = Math.max(1, Math.floor(0.10 * min_value_operand));
        var five_percent = Math.max(1, Math.floor(0.05 * min_value_operand));

        // +a +b 10%
        // -a -b 10%
        for (var i = 0; i < ten_percent; i++) {
            combinations.push([get_random_int(0, max_value_operand), "+",
                get_random_int(0, max_value_operand), "+", same_signs_explanation]);

            combinations.push([get_random_int((-1) * max_value_operand, 0), "",
                get_random_int((-1) * max_value_operand, 0), "+", same_signs_explanation]);
        }

        //+a-b < 0 12.5%
        for (var i = 0; i < twelve_percent; i++) {
            var first_operand = get_random_int(0, max_value_operand);
            combinations.push([first_operand, "", get_random_int((-1) * max_value_operand,
                (-1) * first_operand), "+", opposite_signs_explanation]);
        }

        //+a-b > 0 10%
        for (var i = 0; i < ten_percent; i++) {
            var first_operand = get_random_int(0, max_value_operand);
            var second_operand = get_random_int((-1) * first_operand, 0);
            var operation_string = "";
            if (second_operand == 0) {
                operation_string = "&minus;";
            }
            combinations.push([first_operand, operation_string, second_operand, "+", opposite_signs_explanation]);
        }

        //-a+b < 0 10%
        for (var i = 0; i < ten_percent; i++) {
            var first_operand = get_random_int((-1) * max_value_operand, 0);
            combinations.push([first_operand, "+", get_random_int(0, Math.abs(first_operand)), "+", opposite_signs_explanation]);
        }

        //-a+b > 0 12.5%
        for (var i = 0; i < twelve_percent; i++) {
            var first_operand = get_random_int((-1) * max_value_operand, 0);
            combinations.push([first_operand, "+", get_random_int(Math.abs(first_operand), max_value_operand), "+", opposite_signs_explanation]);
        }

        //|+a| 5%
        //|-a| 5%
        for (var i = 0; i < five_percent; i++) {
            combinations.push([get_random_int(0, max_value_operand), "abs", absolute_value_explanation]);
            combinations.push([get_random_int((-1) * max_value_operand, 0), "abs", absolute_value_explanation]);
        }

        //+(+a) 5%
        //+(-a) 5%
        for (var i = 0; i < five_percent; i++) {
            combinations.push([get_random_int(0, max_value_operand), "+()", plus_bracket_explanation]);
            combinations.push([get_random_int((-1) * max_value_operand, 0), "+()", plus_bracket_explanation]);
        }

        //-(+a) 5%
        //-(-a) 5%
        for (var i = 0; i < five_percent; i++) {
            combinations.push([get_random_int(0, max_value_operand), "-()", minus_bracket_explanation]);
            combinations.push([get_random_int((-1) * max_value_operand, 0), "-()", minus_bracket_explanation]);
        }
    }

    /*if (enabled_subtraction) {
        for (var i = 0; i <= 20; i++) {
            for (var j = min_value_operand; j <= max_value_operand && j <= i; j++) {
                if (((i-j)>0) && ((i-j)<=10)) {
                    combinations.push([i, "&minus;", j]);
                }
            }
        }
    }

    if (enabled_multiplication) {
        for (var i = min_value_operand; i <= max_value_operand; i++) {
            for (var j = 0; j <= 10; j++) {
                combinations.push([i, " &sdot; ", j]);
            }
        }
    }

    if (enabled_division) {
        var division_min_value_operand = Math.max(1, min_value_operand);
        for (var i = 0; i <= 10; i++) {
            for (var j = division_min_value_operand; j <= max_value_operand; j++) {
                combinations.push([i*j, " : ", j]);
            }
        }
    }*/

    permutation = [...Array(combinations.length).keys()];
    shuffle(permutation);

    var expression_p = document.createElement("p");
    expression_p.setAttribute("id", "expression");
    expression_p.setAttribute("class", "expression_p");
    document.getElementById('expression_div').appendChild(expression_p);

    changeMathExpression();

    var timer_element = document.createElement("p");
    timer_element.setAttribute("id", "timer");
    timer_element.innerText = "Timp: 00:00";
    document.getElementById('expression_div').appendChild(timer_element);

    passed_seconds = 0;
    passed_minutes = 0;
    timer_interval = setInterval(update_timer, 1000);
}

function restart() {
    var correct_answers_p = document.getElementById('correct_answers_p');
    var wrong_answers_p = document.getElementById('wrong_answers_p');
    correct_answers_p.setAttribute("class", "answers_p");
    wrong_answers_p.setAttribute("class", "answers_p");

    var principal_div = document.getElementById('principal_div');
    var expression_div = document.getElementById('expression_div');
    principal_div.insertBefore(correct_answers_p, expression_div);
    principal_div.insertBefore(wrong_answers_p, expression_div);

    document.getElementById("restart_button").remove();
    document.getElementById("results_div").remove();

    init();
}

function update_operations_configuration_error(error_message) {
    var operations_configuration_error = document.getElementById("operations_configuration_error");
    if (!operations_configuration_error) {
        operations_configuration_error = document.createElement("p");
        operations_configuration_error.setAttribute("class", "answers_p");
        operations_configuration_error.setAttribute("style", "color:red");
        operations_configuration_error.setAttribute("id", "operations_configuration_error");
        document.getElementById('configuration_form').insertBefore(operations_configuration_error,
            document.getElementById('addition_checkbox'));
    }
    operations_configuration_error.innerHTML = error_message;
}

function start() {
    enabled_level_1_problems = document.getElementById('level_1_problems').checked;

    if (!enabled_level_1_problems) {
        update_operations_configuration_error("Selectează un nivel de dificultate");
            return;
    }

    document.getElementById('start_button').remove();
    min_value_operand = Number(document.getElementById('min_value_operand').value);
    max_value_operand = Number(document.getElementById('max_value_operand').value);
    answer_timeout_milliseconds = Number(document.getElementById('answer_timeout_milliseconds').value) * 1000;
    document.getElementById('configuration_form').remove();

    init();
}