window.onload = function() {
    let questionCount = 0;
    let questions = ['lấp ló', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
    let good = [],
        goodCount = 0;
    let bad = [],
        badCount = 0;
    let temp;

    const brain = require('brain.js');
    const net = new brain.NeuralNetwork();

    const button = document.querySelector('#button');
    const steps = document.querySelectorAll('.step');
    const next = document.querySelector('.next');
    const back = document.querySelector('.back');
    const text = document.querySelector('.text');
    const reg = new webkitSpeechRecognition();

    const train = document.querySelector('.train');
    const trainCorrect = document.querySelector('.trainCorrect');
    const trainWrong = document.querySelector('.trainWrong');
    const trainStart = document.querySelector('.trainStart');

    reg.continuous = true;
    reg.interimResults = true;
    reg.lang = 'vi-VN';
    reg.onresult = function(event) {
        console.log(event);
        for (var i = event.resultIndex; i < event.results.length; i++) {
            var transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                console.log(transcript);
                console.log(questions[questionCount]);
                reg.stop();
                temp = event.results[i][0].confidence.toFixed(6);
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
        train.style.display = 'none';
    });

    trainWrong.addEventListener('click', function() {
        bad[badCount] = Number(temp);
        badCount++;
        console.log('wrong');
        train.style.display = 'none';
    });

    trainStart.addEventListener('click', function() {
        trainTheML();
    });

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
        preQuestion();
    });

    steps[questionCount].classList.add('active');
    text.innerHTML = questions[questionCount];
    train.style.display = 'none';

    function trainTheML() {
        let data = [];
        for (let i = 0; i < goodCount; i++) {
            let obj = {};
            obj.input = [good[i]];
            obj.output = [1];
            console.log(obj);
            data[i] = obj;
            console.log(obj);
        }
        for (let i = 0; i < badCount; i++) {
            let obj = {};
            obj.input = [bad[i]];
            obj.output = [0];
            console.log(obj);
            data[i + goodCount] = obj;
            console.log(obj);
        }
        let x;
        console.log(data);
        net.train(data);
        for (let i = 1; i < 100; i++) {
            x = net.run([i / 100]);
            if (x >= 0.87) {
                console.log(i);
                break;
            }
        }
    }

    function nextQuestion() {
        if (questionCount < 4) {
            steps[questionCount].classList.remove('active');
            questionCount++;
            steps[questionCount].classList.add('active');
            text.innerHTML = questions[questionCount];
        }
    }

    function preQuestion() {
        if (questionCount > 0) {
            steps[questionCount].classList.remove('active');
            questionCount--;
            steps[questionCount].classList.add('active');
            text.innerHTML = questions[questionCount];
        }
    }

    function returnToOrginalState() {
        button.classList.remove('fa-redo-alt');
        button.classList.remove('fa-spinner');
        button.classList.remove('fa-pulse');
        button.classList.add('fa-microphone');
    }
};
