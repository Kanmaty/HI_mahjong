let counter = 1;
let scores = [
    {
        name: "player1",
        score: 0,
        calcScore: 0
    },
    {
        name: "player2",
        score: 0,
        calcScore: 0
    },
    {
        name: "player3",
        score: 0,
        calcScore: 0
    }
]
let uma1, uma2;

window.onload = function () {
    const popup = document.getElementById("init");
    popup.showModal();
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);
};

function updatePlayerText(playerNumber) {
    const playerValue = document.getElementById(`player${playerNumber}`).value;
    if (playerValue !== "") {
        const elems = document.getElementsByClassName(`p${playerNumber}`);
        scores[playerNumber - 1].name = playerValue;
        for (let i = 0; i < elems.length; i++) {
            elems[i].firstChild.textContent = playerValue;
        }
    }
}

function closePopup() {
    const popup = document.getElementById("init");
    popup.close();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
    }
    for (let i = 1; i <= 3; i++) {
        updatePlayerText(i);
    }
    const selectElement = document.querySelector('select');
    const type = selectElement.options[selectElement.selectedIndex].value;
    [uma1, uma2] = type.split("-").map(Number).map(num => num * 1000);
}

function calculate() {
    const charge = parseFloat(document.getElementById('charge').value);
    if (!charge) {
        alert("場代を入力してください");
        return;
    }
    let sortedScores = scores.slice().sort((a, b) => b.calcScore - a.calcScore);
    let [firstMaxIndex, secondMaxIndex, thirdMaxIndex] = sortedScores.map(score => scores.indexOf(score));
    const num12 = scores[firstMaxIndex].calcScore - scores[secondMaxIndex].calcScore;
    const num13 = scores[firstMaxIndex].calcScore - scores[thirdMaxIndex].calcScore;
    const sum = num12 + num13;
    document.getElementById('result2').value = Math.round(charge * (num12 / sum));
    document.getElementById('result3').value = Math.round(charge * (num13 / sum));
    document.getElementById("resultName2").textContent = scores[secondMaxIndex].name;
    document.getElementById("resultName3").textContent = scores[thirdMaxIndex].name;
}

function addTable() {
    if (!document.getElementById("score1").value || !document.getElementById("score2").value || !document.getElementById("score3").value) {
        alert("スコアを全員分入力してください");
        return;
    }
    const table = document.getElementById('table');
    const lastRow = table.rows[table.rows.length - 1];
    const tr = document.createElement('tr');
    let score = [0, 0, 0];
    for (let i = 1; i < 4; i++) {
        score[i - 1] = parseInt(document.getElementById(`score${i}`).value);
        scores[i - 1].score += score[i - 1];
    }
    let calcScore = [0, 0, 0];
    let temp = [...score];
    const firstMaxIndex = temp.indexOf(Math.max(...temp));
    temp[firstMaxIndex] = -1000000;
    const secondMaxIndex = temp.indexOf(Math.max(...temp));
    temp[secondMaxIndex] = -1000000;
    const thirdMaxIndex = temp.indexOf(Math.max(...temp));
    calcScore[thirdMaxIndex] = Math.round((score[thirdMaxIndex] - uma2) / 1000) - 40;
    calcScore[secondMaxIndex] = Math.round((score[secondMaxIndex] - uma1) / 1000) - 40;
    calcScore[firstMaxIndex] = - calcScore[thirdMaxIndex] - calcScore[secondMaxIndex];
    scores[firstMaxIndex].calcScore += calcScore[firstMaxIndex];
    scores[secondMaxIndex].calcScore += calcScore[secondMaxIndex];
    scores[thirdMaxIndex].calcScore += calcScore[thirdMaxIndex];
    for (let i = 0; i < 4; i++) {
        const td = document.createElement('td');
        if (document.getElementById(`score${i}`)) {
            td.innerHTML = `<div>${score[i - 1]}</div><div>(${calcScore[i - 1]})</div>`;
        } else {
            td.innerHTML = `${counter}半荘目 <button onclick="deleteRow(this)">削除</button>`;
            counter++;
        }
        tr.appendChild(td);
    }
    lastRow.parentNode.insertBefore(tr, lastRow);
    updateScore();
}

function deleteRow(button) {
    const tr = button.parentNode.parentNode;
    for (let i = 1; i < 4; i++) {
        scores[i - 1].score += -parseInt(tr.children[i].textContent);
        scores[i - 1].calcScore += -parseInt(tr.children[i].textContent.split("(")[1].split(")")[0]);
    }
    updateScore();
    tr.parentNode.removeChild(tr);
}

function updateScore() {
    const table = document.getElementById('table');
    const sumRow = table.rows[table.rows.length - 1];
    for (let i = 1; i < 4; i++) {
        sumRow.children[i].children[0].textContent = scores[i - 1].score;
        sumRow.children[i].children[1].textContent = `(${scores[i - 1].calcScore})`;
    }
}

document.getElementById('link').addEventListener('click', function(event) {
    event.preventDefault();
    const userConfirmed = confirm('4麻用のページに遷移しますか？');
    if (userConfirmed) {
        window.location.href = this.href;
    }
});