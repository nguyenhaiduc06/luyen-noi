window.onload = function() {
    let questionCount = 0;
    let questions = ['lung linh', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
    let result = false;
    let resultInPercent = [0, 0, 0, 0, 0];
    let status = ['not done', 'not done', 'not done', 'not done', 'not done'];
    const button = document.querySelector('#button');
    const steps = document.querySelectorAll('li');
    const next = document.querySelector('.next');
    const back = document.querySelector('.back');
    const text = document.querySelector('.text');
    const modal = document.querySelector('#simpleModal');
    const tds = document.querySelectorAll('.percent');
    const reg = new webkitSpeechRecognition();
    reg.continuous = true;
    reg.interimResults = true;
    reg.lang = 'vi-VN';
    reg.onresult = function(event) {
        console.log(event);
        var interimTranscripts = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
            var transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                console.log(transcript);
                console.log(questions[questionCount]);
                if (transcript == questions[questionCount]) {
                    reg.stop();
                    if (
                        (event.results[i][0].confidence * 100).toFixed(2) >= 96
                    ) {
                        result = true;
                        resultInPercent[questionCount] = (
                            event.results[i][0].confidence * 100
                        ).toFixed(2);
                    } else {
                        result = false;
                        resultInPercent[questionCount] = (
                            event.results[i][0].confidence * 100
                        ).toFixed(2);
                    }
                    break;
                } else {
                    reg.stop();
                    result = false;
                    resultInPercent[questionCount] = (
                        event.results[i][0].confidence * 100
                    ).toFixed(2);
                }
            }
        }
    };
    reg.onend = function() {
        console.log('stopped');
        if (result == true) {
            status[questionCount]='true';
            returnToOrginalState();
            text.classList.add('true');
            steps[questionCount].classList.add('success');
        } else {
            status[questionCount]='false';
            returnToOrginalState();
            text.classList.add('false');
            steps[questionCount].classList.add('danger');
        }
    };

    button.addEventListener('click', function() {
        button.classList.toggle('fa-microphone');
        button.classList.toggle('fa-spinner');
        button.classList.toggle('fa-pulse');
        reg.start();
    });

    next.addEventListener('click', function() {
        nextQuestion();
    });
    back.addEventListener('click', function() {
        if (questionCount > 0) {
            preQuestion();
        }
    });

    function nextQuestion() {
        if (questionCount < 4) {
            text.classList.remove('true');
            text.classList.remove('false');
            steps[questionCount].classList.remove('active');
            questionCount++;
            steps[questionCount].classList.add('active');
            text.innerHTML = questions[questionCount];
        } else {
            openModal();
        }
    }

    function preQuestion() {
        text.classList.remove('true');
        text.classList.remove('false');
        steps[questionCount].classList.remove('active');
        questionCount--;
        steps[questionCount].classList.add('active');
        text.innerHTML = questions[questionCount];
    }

    steps[questionCount].classList.add('active');
    text.innerHTML = questions[questionCount];

    function openModal() {
        for (let i = 0; i < 5; i++) {
            if(status[i]=='true'){
                tds[i].innerHTML = resultInPercent[i] + '%';
                tds[i].classList.add('true');
            }
            else{
                if(status[i]=='false'){
                    tds[i].innerHTML = "chưa đúng";
                    tds[i].classList.add('false');
                }
                else{
                    tds[i].innerHTML = "---chưa làm---";
                }
            }
            
        }
        modal.style.display = 'block';
    }

    function returnToOrginalState() {
        button.classList.remove('fa-redo-alt');
        button.classList.remove('fa-spinner');
        button.classList.remove('fa-pulse');
        button.classList.add('fa-microphone');
        steps[questionCount].classList.remove('success');
        steps[questionCount].classList.remove('danger');
        text.classList.remove('true');
        text.classList.remove('false');
    }
};
