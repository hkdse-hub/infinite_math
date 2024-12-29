const translations = {
    en: {
        title: "Infinite Math Questions",
        curStreak: "Current Streak",
        highStreak: "Highest Streak",
        topic: "Topics",
        topics: ["Simultaneous Equations", "Equation of lines", "Quadratics"],
        submit: "Submit",
        correct: "Correct",
        incorrect: "Incorrect",
        next: "Next"
    },
    hant: {
        title: "無限數學題",
        curStreak: "目前連對",
        highStreak: "最高連對",
        topic: "主題",
        topics: ["聯立方程", "直線方程", "二次方程"],
        submit: "提交",
        correct: "正确",
        incorrect: "錯誤",
        next: "下一題"
    }, 
    hans: {
        title: "无限数学题",
        curStreak: "目前连对",
        highStreak: "最高连对",
        topic: "主题",
        topics: ["联立方程", "直线方程", "二次方程"],
        submit: "提交",
        correct: "正确",
        incorrect: "错误",
        next: "下一题"
    }   
}

const applyTranslations = lang => {
    // update global variable (for dynamic stuff)
    currentLanguage = lang
    let content = translations[lang]
    
    // change static content
    $("#header").text(content.title)
    $("#topic-header").text(content.topic)
    let topics = $(".topic-link")
    console.log(topics.length)
    for (let i = 0; i < topics.length; i++) {
        topics[i].text = content.topics[i % NUM_TOPICS]
    }
    $("#submit-btn").val(content.submit)
    $("#next-btn").text(content.next)
    newQuestion(currentTopic)
    displayStreak()
}