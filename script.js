$(document).ready(function() {
    $('#menu-toggle').click(function() {
      $('#navbar').toggleClass('show');
    });
   
    $("#next-btn").click(e => {
        e.preventDefault()
        newQuestion(currentTopic)
    })

    /* Initial setting */
    currentTopic = 0
    currentStreak = 0     
    highestStreak = topics[currentTopic] in localStorage ? localStorage.getItem(topics[currentTopic]) : 0
    displayStreak()

    /* starting function call */
    newQuestion(currentTopic)
    applyTranslations(currentLanguage)
});

/* Streak */

const updateStreak = (topicNo, curStreak) => {
    const topic = topics[topicNo]
    let hStreak = localStorage.getItem(topic)
    if (hStreak === null) {
        highestStreak = curStreak
    } else {
        highestStreak = (curStreak > highestStreak ? curStreak : highestStreak)
    }
    localStorage.setItem(topic, parseInt(highestStreak))
}

const displayStreak = () => {
    let content = translations[currentLanguage]
    $("#cur-streak").text(`${content.curStreak}: ${currentStreak}`)
    $("#high-streak").text(`${content.highStreak}: ${highestStreak}`)
}

/* Questions */

const displayResult = isCorrect => {
    let content = translations[currentLanguage]
    let word = isCorrect ? content.correct : content.incorrect
    $("#result-msg").text(word)
    let colour = isCorrect ? "green" : "red"
    $("#result-msg").css("color", colour)
    $("#result-box").show()
}

const newQuestion = topicNo => {
    const generateFunc = generateFuncs[topicNo]
    const displayFunc = displayFuncs[topicNo]
    const resultFunc = resultFuncs[topicNo]
    const validateFunc = validateFuncs[topicNo]
    
    $("#topic-name").text(translations[currentLanguage].topics[topicNo])
    let params = generateFunc()
    displayFunc(params)
    
    $("#result-box").hide()
    
    $("#answer-form").off("submit").submit(e => {
        e.preventDefault()
        let result = resultFunc()
        let isCorrect = validateFunc(params, result)
        if (isCorrect) {
            currentStreak++
        } else {
            currentStreak = 0
        }
        displayResult(isCorrect)
        updateStreak(topicNo, currentStreak)       
        displayStreak()
    })
}

const changeTopic = topicNo => {
    currentTopic = topicNo
    currentStreak = 0
    let topic = topics[currentTopic]
    highestStreak = topic in localStorage ? localStorage.getItem(topic) : 0
    newQuestion(topicNo)
    displayStreak()
}

/* Util functions */

const getRandomInt = (min, max, canBeZero) => {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    let res = 0
    do {
        res = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
    } while (!canBeZero && res == 0)
    return res
}

const generateEquationString = (coeffs, terms) => {
    if (coeffs.length !== terms.length + 1) {
        return null
    }

    let result = ""
    for (let i = 0; i < coeffs.length; i++) {
        let termStr = i == terms.length ? "" : terms[i]
        let coeffsStr = Math.abs(coeffs[i]) == 1 ? "" : `${Math.abs(coeffs[i])}`
        if (coeffs[i] == 0) {
            continue
        } else if (coeffs[i] > 0) {
            // positive
            let thisCoeff = i == 0 ? `${coeffsStr}` : ` + ${coeffsStr}`
            result += (thisCoeff + termStr)
        } else {
            // negative
            let thisCoeff = ` - ${coeffsStr}`
            result += (thisCoeff + termStr)
        }
    }
    return result
}

const hcf = (a, b) => {
    while (b !== 0) {
        let temp = b
        b = a % b
        a = temp;
    }
    return Math.abs(a);
}

const hcfOfArray = arr => {
    return arr.reduce((acc, num) => hcf(acc, num))
}


const simplify = arr => {
    let arrHCF = hcfOfArray(arr)
    return arr.map(num => num / arrHCF)
}

const equalArrays = (x, y) => {
    if (x.length !== y.length) {
        return false
    }
    for (let i = 0; i < x.length; i++) {
        if (x[i] !== y[i]) return false
    }
    return true
}

/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Individual functions vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

/* Simultaneous equations*/

const generateSimultaneous = () => {
    let a = getRandomInt(-9, 10, false)
    let b = getRandomInt(-9, 10, false)
    let c = getRandomInt(-9, 10, false)
    let d = null
    do {
        d = getRandomInt(-9, 10, false)
    } while (a * d == b * c)

    let x = getRandomInt(-15, 16, false)
    let y = getRandomInt(-15, 16, false)
    let e = a * x + b * y
    let f = c * x + d * y

    return {
        "a": a,
        "b": b,
        "c": c,
        "d": d,
        "x": x,
        "y": y,
        "e": e,
        "f": f
    }

}

const displaySimultaneous = params => {
    let coeffs1 = [params.a, params.b, 0]
    let coeffs2 = [params.c, params.d, 0]
    let values = ["x", "y"]
    let eq1 = generateEquationString(coeffs1, values)
    let eq2 = generateEquationString(coeffs2, values)
    $("#question").html(
        `<span>${eq1} = ${params.e}</span><span>${eq2} = ${params.f}</span>`
    )   
    $("#answer").html(
        `x = <input type='number' id='simul-x'> &nbsp&nbsp&nbspy = <input type='number' id='simul-y'>`
    )
}

const resultSimultaneous = () => {
    let x = parseInt($("#simul-x").val())
    let y = parseInt($("#simul-y").val())
    return {
        "x": x,
        "y": y
    }
}

const validateSimultaneous = (params, answer) => params.x === answer.x && params.y === answer.y


/* Equations of lines */

const generateEquationOfLine = () => {
    let a = getRandomInt(-15, 16, false)
    let b = getRandomInt(-15, 16, false)
    let x1 = getRandomInt(-4, 5)
    let y1 = getRandomInt(-4, 5)
    let c = a * x1 + b * y1
    
    let x2 = 1
    let y2 = (c - a * x2) / b

    while (!Number.isInteger(y2) || x2 === x1) {
        x2 = (x2 < 0) - x2
        y2 = (c - a * x2) / b
    }

    return {
        "a": a,
        "b": b,
        "c": c,
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
    }
}

const displayEquationOfLine = params => {
    let qLine1, qLine2, qLine3
    if (currentLanguage === "en") {
        qLine1 = "Find the equation of the line connecting"
        qLine2 = "and"
        qLine3 = "in the form ax + by = c"
    } else if (currentLanguage === "hant") {
        qLine1 = "將以下兩點連接起來的直線方程"
        qLine2 = "和"
        qLine3 = "以 ax + by = c 的形式表示"
    } else if (currentLanguage === "hans") {
        qLine1 = ""
    }
    
    let question = qLine1 + "<br>" + `(${params.x1}, ${params.y1}) ` + qLine2 +  ` (${params.x2}, ${params.y2})` + "<br>" + qLine3
    $("#question").html(question)

    let ans = 
    `
    a = <input type='number' id='equation-a'>&nbsp&nbsp
    b = <input type='number' id='equation-b'>&nbsp&nbsp
    c = <input type='number' id='equation-c'>`
    $("#answer").html(ans)
}

const resultEquationOfLine = () => {
    return {
        "a": parseInt($("#equation-a").val()),
        "b": parseInt($("#equation-b").val()),
        "c": parseInt($("#equation-c").val())
    }
}

const validateEquationOfLine = (params, answer) => {
    let paramsSimpified = simplify([params.a, params.b, params.c])
    let answerSimplified = simplify([answer.a, answer.b, answer.c])
    let negateAnswer = answerSimplified.map(x => -x)
    return equalArrays(paramsSimpified, answerSimplified) || equalArrays(paramsSimpified, negateAnswer)
}


/* Quadratics */

const generateQuadratic = () => {
    // a(x - x1)(x - x2) = 0 -> 
    // ax^2 - 
    // b = -(a * x1) -(a * x2)
    // c = x1 * x2

    let x1 = getRandomInt(-9, 10, true)
    let x2 = getRandomInt(-9, 10, true)
    let a = getRandomInt(-4, 5, false)
    let b = - a * (x1 + x2)
    let c = a * x1 * x2

    return {
        "x1": x1,
        "x2": x2,
        "a": a,
        "b": b,
        "c": c
    }
}

const displayQuadratic = params => {
    let coeffs = [params.a, params.b, params.c]
    let terms = ["x²", "x"]
    let eq = "<span>" + generateEquationString(coeffs, terms) + " = 0</span>"
    $("#question").html(eq)
    let ans = "x = <input id='quad-x1' type='number'> &nbsp&nbsp&nbspor x = <input id='quad-x2' type='number'>"
    $("#answer").html(ans)
}

const resultQuadratic = () => {
    let x1 = parseInt($("#quad-x1").val())
    let x2 = parseInt($("#quad-x2").val())
    return {
        "x1": x1,
        "x2": x2
    }
}

const validateQuadratic = (params, answer) => (answer.x1 === params.x1 && answer.x2 === params.x2) || (answer.x2 === params.x1 && answer.x1 === params.x2)

/* Sums and products of roots */

const generateSumsAndProductsOfRoots = () => {

}

const displaySumsAndProductsOfRoots = (params) => {

}

const resultSumsAndProductsOfRoots = () => {

}

const validateSumsAndProductsOfRoots = (params, result) => {

}


/* Global variables */
const NUM_TOPICS = 3
const topics = ["Simultaneous Equations", "Equations of lines", "Quadratics"]
const generateFuncs = [generateSimultaneous, generateEquationOfLine, generateQuadratic, null]
const displayFuncs  = [displaySimultaneous, displayEquationOfLine, displayQuadratic, null]
const resultFuncs   = [resultSimultaneous, resultEquationOfLine, resultQuadratic, null]
const validateFuncs = [validateSimultaneous, validateEquationOfLine, validateQuadratic, null]

let currentTopic, currentStreak, highestStreak

/* initial language */
let currentLanguage = "hant"
