function hideComment() {
    const comment = document.getElementById('comment');
    comment.style.display = 'none'; // コメントを非表示
}

const questions = []; // 空の配列にして、CSVからデータを読み込む
let selectedQuestions = []; // ランダムに選ばれた質問を保持する

async function loadQuestions() {
    const response = await fetch('quiz.csv');
    if (!response.ok) {
        throw new Error('CSVファイルの読み込みに失敗しました。');
    }
    const data = await response.text();
    const rows = data.split('\n').slice(1); // 最初の行をスキップ

    rows.forEach(row => {
        const [question, option1, option2, option3, option4, answer] = row.split(',').map(item => item.trim());
        questions.push({
            question,
            options: [option1, option2, option3, option4],
            answer: answer // 答えもトリム
        });
    });

    console.log(questions);
    selectedQuestions = selectRandomQuestions(15);
}
window.onload = loadQuestions;



function selectRandomQuestions(num) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

let currentQuestionIndex = 0;
let selectedCharacter = null;
let scores = { 勇者: 0, 魔法使い: 0, 戦士: 0, 賢者: 0 };

function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('character-select').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        showResult();
        return;
    }

    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;

    const buttons = document.querySelectorAll('#answers button');
    buttons.forEach((button, index) => {
        button.textContent = question.options[index]; // optionsを使用
        button.onclick = () => answerQuestion(index);
    });

    document.getElementById('feedback').textContent = '';
}

function answerQuestion(selectedOption) {
    const question = selectedQuestions[currentQuestionIndex];
    const qa = question.answer.replace(/\r?\n/g, ''); // 改行を削除
    console.log(question["options"]);
    console.log(parseInt(qa, 10));
    if (question["options"][selectedOption] === qa) { // 選択肢のインデックスと比較
        scores[selectedCharacter]++;
        document.getElementById('feedback').textContent = '正解です！';
    } else {
        document.getElementById('feedback').textContent = '不正解です。';
    }
    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}

function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    const resultText = `ゲーム終了！\n${selectedCharacter}のスコア: ${scores[selectedCharacter]}`;
    document.getElementById('result').textContent = resultText;
}

function restartGame() {
    selectedCharacter = null;
    currentQuestionIndex = 0;
    scores = { 勇者: 0, 魔法使い: 0, 戦士: 0, 賢者: 0 };
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('character-select').style.display = 'block';
}

function showComment(event, message) {
    const comment = document.getElementById('comment');
    comment.textContent = message; // コメント内容を設定
    comment.style.display = 'block'; // コメントを表示
    comment.style.left = event.pageX + 'px'; // マウス位置に基づいて左位置を設定
    comment.style.top = (event.pageY + 20) + 'px'; // マウス位置に基づいて上位置を設定
}
