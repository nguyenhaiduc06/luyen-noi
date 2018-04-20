window.onload = function() {
    let questionCount = 0;
    let questions = ['lấp ló', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
    let result = false;
    let resultInPercent = [0, 0, 0, 0, 0];
    let status = ['not done', 'not done', 'not done', 'not done', 'not done'];
    let good = [],
        goodCount = 0;
    let bad = [],
        badCount = 0;
    let temp;
    let obj = new Object();
    let tempArray = [0];
    let data = [];

    const brain = require('brain.js');
    const net = new brain.NeuralNetwork();

    const button = document.querySelector('#button');
    const steps = document.querySelectorAll('li');
    const next = document.querySelector('.next');
    const back = document.querySelector('.back');
    const text = document.querySelector('.text');
    const modal = document.querySelector('#simpleModal');
    const tds = document.querySelectorAll('.percent');
    const reg = new webkitSpeechRecognition();

    const train = document.querySelector('.train');
    const trainCorrect = document.querySelector('.trainCorrect');
    const trainWrong = document.querySelector('.trainWrong');

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
                    temp = event.results[i][0].confidence.toFixed(4);
                }
            }
        }
    };

    reg.onend = function() {
        train.style.display = 'grid';
        returnToOrginalState();
        console.log(temp);
    };

    trainCorrect.addEventListener('click', function() {
        good[goodCount] = Number(temp);
        goodCount++;
        console.log('correct');
    });

    trainWrong.addEventListener('click', function() {
        bad[badCount] = Number(temp);
        badCount++;
        console.log('wrong');
    });

    button.addEventListener('click', function() {
        button.classList.toggle('fa-microphone');
        button.classList.toggle('fa-spinner');
        button.classList.toggle('fa-pulse');
        reg.start();
    });

    next.addEventListener('click', function() {
        nextQuestion();
        trainTheML();
    });
    back.addEventListener('click', function() {
        if (questionCount > 0) {
            preQuestion();
        }
    });

    function trainTheML() {
        net.train([
            { input: [0.91], output: [1] },
            { input: [0.92], output: [1] },
            { input: [0.93], output: [1] },
            { input: [0.94], output: [1] },
            { input: [0.96], output: [1] },
            { input: [0.98], output: [1] },

            { input: [0.82], output: [0] },
            { input: [0.83], output: [0] },
            { input: [0.84], output: [0] },
            { input: [0.86], output: [0] },
            { input: [0.88], output: [0] },
            { input: [0.89], output: [0] },
        ]);

        var output = net.run([0.9]); // [0.987]
        console.log(output);

        for (let i = 0; i < goodCount; i++) {
            tempArray[0] = good[i];
            console.log(tempArray);
            obj.input = tempArray;
            obj.output = [1];
            console.log(obj);
            data[i] = obj;
        }
        for (let i = 0; i < badCount; i++) {
            tempArray[0] = bad[i];
            console.log(tempArray);
            obj.input = tempArray;
            obj.output = [0];
            console.log(obj);
            data[i + goodCount] = obj;
        }
        console.log(data);
        net.train(data);
        var x = net.run([0.96]);
        console.log(x);
    }

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
            if (status[i] == 'true') {
                tds[i].innerHTML = resultInPercent[i] + '%';
                tds[i].classList.add('true');
            } else {
                if (status[i] == 'false') {
                    tds[i].innerHTML = 'chưa đúng';
                    tds[i].classList.add('false');
                } else {
                    tds[i].innerHTML = '---chưa làm---';
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
