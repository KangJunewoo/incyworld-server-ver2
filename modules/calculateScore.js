module.exports = answers => {
    // TODO : answers 내부 값 10개를 활용해 점수 리턴
    let score = 0;
    const correctAnswers = [1, 4, 2, 3, 2, 2, 3, 4, 1, 4];
    for (let i = 0; i < 10; i++) {
        if (answers[i] == correctAnswers[i]) score += 1;
    }
    return score;
};
