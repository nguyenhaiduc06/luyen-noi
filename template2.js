window.onload = function() {
    let questionCount = 0;
    let questions = ['lung linh', 'lấp ló', 'no nê', 'lạ lẫm', 'nôn nóng'];
    const button = document.querySelector('#button');
    const steps = document.querySelectorAll('li');
    const next = document.querySelector('.next');
    const back = document.querySelector('.back');
    const text = document.querySelector('.text');
    const modal = document.querySelector('#simpleModal');

    button.addEventListener('click', function() {
        button.classList.toggle('fa-microphone');
        button.classList.toggle('fa-spinner');
        button.classList.toggle('fa-pulse');
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
