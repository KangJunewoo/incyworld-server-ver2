module.exports = score => {
    if (score >= 9) {
        return 4;
    } else if (score >= 6) {
        return 3;
    } else if (score >= 3) {
        return 2;
    } else {
        return 1;
    }
};
