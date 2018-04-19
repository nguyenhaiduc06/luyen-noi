window.onload = function() {
    let questionCount = 0;
    let questions = ['lung linh', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
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
                        console.log(true);
                    } else {
                        console.log(false);
                    }
                    break;
                } else {
                    reg.stop();
                    console.log(false);
                }
            }
        }
    };

    button.addEventListener('click', function() {
        button.classList.toggle('fa-microphone');
        button.classList.toggle('fa-spinner');
        button.classList.toggle('fa-pulse');
        reg.start();
    });

    next.addEventListener('click', function() {
        if (questionCount < 4) {
            nextQuestion();
        } else {
            openModal();
        }
    });
    back.addEventListener('click', function() {
        if (questionCount > 0) {
            preQuestion();
        }
    });

    function nextQuestion() {
        steps[questionCount].classList.toggle('active');
        questionCount++;
        steps[questionCount].classList.toggle('active');
        text.innerHTML = questions[questionCount];
    }

    function preQuestion() {
        steps[questionCount].classList.toggle('active');
        questionCount--;
        steps[questionCount].classList.toggle('active');
        text.innerHTML = questions[questionCount];
    }

    steps[questionCount].classList.toggle('active');
    text.innerHTML = questions[questionCount];

    function openModal() {
        modal.style.display = 'block';
    }
};
