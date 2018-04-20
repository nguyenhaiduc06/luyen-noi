window.onload = function() {
    let questionCount = 0;
    let questions = ['lung linh', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
    let result = false;
    const button = document.querySelector('#button');
    const steps = document.querySelectorAll('li');
    const next = document.querySelector('.next');
    const back = document.querySelector('.back');
    const text = document.querySelector('.text');
    const modal = document.querySelector('#simpleModal');
    const reg = new webkitSpeechRecognition();
    reg.continuous = true;
    reg.interimResults = true;
    reg.lang = 'vi-VN';
    reg.onresult = function(event) {
        console.log(event);
        var interimTranscripts = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
            // chạy khi kết quả trả về chưa phải là kết quả chính xác nhất
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
                    } else {
                        result = false;
                    }
                    break;
                } else {
                    reg.stop();
                    result = false;
                }
            }
        }
    };
    reg.onend = function() {
        console.log('stopped');
        if (result == true) {
            returnToOrginalState();
            text.classList.add('true');
            steps[questionCount].classList.toggle('success');
        } else {
            returnToOrginalState();
            text.classList.add('false');
            steps[questionCount].classList.toggle('danger');
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
            questionCount++;
            returnToOrginalState();
            steps[questionCount].classList.add('active');
            text.innerHTML = questions[questionCount];
        } else {
            openModal();
        }
    }

    function preQuestion() {
        questionCount--;
        returnToOrginalState();
        steps[questionCount].classList.add('active');
        text.innerHTML = questions[questionCount];
    }

    steps[questionCount].classList.add('active');
    text.innerHTML = questions[questionCount];

    function openModal() {
        modal.style.display = 'block';
    }

    function returnToOrginalState() {
        button.classList.remove('fa-redo-alt');
        button.classList.remove('fa-spinner');
        button.classList.remove('fa-pulse');
        button.classList.add('fa-microphone');
        steps[questionCount].classList.remove('active');
        steps[questionCount].classList.remove('success');
        steps[questionCount].classList.remove('danger');
        text.classList.remove('true');
        text.classList.remove('false');
    }
};
