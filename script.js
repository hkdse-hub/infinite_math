$("#next-btn").click(e => {
    e.preventDefault()
    newQuestion(currentTopic)
})

const updateStreak = (topicNo, curStreak) => {
    const topic = topics[topicNo]
    let hStreak = localStorage.getItem(topic)
    if (hStreak === null) {
        highestStreak = currentStreak
    } else {
        highestStreak = (curStreak > highestStreak ? curStreak : highestStreak)
    }
    localStorage.setItem(topic, highestStreak)
}

const displayResult = isCorrect => {
    let word = isCorrect ? "Correct" : "Incorrect"
    $("#result-msg").text(word)
    let colour = isCorrect ? "green" : "red"
    $("#result-msg").css("color", colour)
    $("#result-box").show()
}


const displayStreak = () => {
    $("#cur-streak").text(`Current streak: ${currentStreak}`)
    $("#high-streak").text(`Highest streak: ${highestStreak}`)
}


const newQuestion = topicNo => {
    const generateFunc = generateFuncs[topicNo]
    const displayFunc = displayFuncs[topicNo]
    const resultFunc = resultFuncs[topicNo]
    const validateFunc = validateFuncs[topicNo]
    
    $("#topic-name").text(topics[topicNo])
    let params = generateFunc()
    displayFunc(params)

    $("#result-box").hide()
    displayStreak()

    $("#answer-form").submit(e => {
        e.preventDefault()
        let result = resultFunc()
        isCorrect = validateFunc(params, result)
        if (isCorrect) {
            currentStreak++
        } else {
            currentStreak = 0
        }
        displayResult(isCorrect)
        updateStreak(topicNo, currentStreak)       
    })
}

/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Individual functions vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

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
        `x = <input type='number' placeholder='Enter value of x' id='simul-x'> &nbsp&nbsp&nbsp.y = <input type='number' placeholder='Enter value of y' id='simul-y'>`
    )
}

const resultSimultaneous = () => {
    let x = $("#simul-x").val()
    let y = $("#simul-y").val()
    return {
        "x": x,
        "y": y
    }
}

const validateSimultaneous = (params, answer) => params.x == answer.x && params.y == answer.y


/* Equations of lines */

const generateEquationOfLine = () => {

}

const displayEquationOfLine = params => {
    
}

const resultEquationOfLine = () => {

}

const validateEquationOfLine = (params, answer) => {

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
    let eq = generateEquationString(coeffs, terms) + " = 0"
    $("#question").html(eq)
    let ans = "x = <input id='quad-x1' type='number' placeholder='Enter value of x'> &nbsp&nbsp&nbspor x = <input id='quad-x2' type='number' placeholder='Enter value of x'>"
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

const validateQuadratic = (params, answer) => (answer.x1 == params.x1 && answer.x2 == params.x2) || (answer.x2 == params.x1 && answer.x1 == params.x2)

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
const topics = ["Simultaneous Equations", "Equations of lines", "Quadratics", "Sums and products of roots"]
const generateFuncs = [generateSimultaneous, null, generateQuadratic, null]
const displayFuncs  = [displaySimultaneous, null, displayQuadratic, null]
const resultFuncs   = [resultSimultaneous, null, resultQuadratic, null]
const validateFuncs = [validateSimultaneous, null, validateQuadratic, null]

let currentTopic = 2
let currentStreak = 0
let highestStreak = 0


newQuestion(currentTopic)

