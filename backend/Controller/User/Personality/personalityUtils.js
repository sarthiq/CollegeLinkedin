/* Marks allocation
1 = Strongly Disagree
2 = Disagree
3 = Neutral
4 = Agree
5 = Strongly Agree */

exports.calculatePersonalityResults = (answers) => {
  
  // Helper function to ensure input is within the valid range
  const getValue = (index) => {
    let value = parseInt(answers[index - 1]);
    if(value<1 || value>5){
      value=0;
    }
    return value;
  };

  // 1. Extraversion (E) Formula
  const e =
    (getValue(1) +
      (6 - getValue(6)) +
      getValue(11) +
      (6 - getValue(16)) +
      getValue(21) +
      (6 - getValue(26)) +
      getValue(31) +
      (6 - getValue(36)) +
      getValue(41) +
      (6 - getValue(46))) /
    10;
  const ePercentage = (e / 5) * 100;

  // 2. Agreeableness (A) Formula
  const a =
    ((6 -
      getValue(2)) +
      getValue(7) +
      (6 - getValue(12)) +
      getValue(17) +
      (6 - getValue(22)) +
      getValue(27) +
      (6 - getValue(32)) +
      getValue(37) +
      getValue(42) +
      getValue(47)) /
    10;
  const aPercentage = (a / 5) * 100;

  // 3. Conscientiousness (C) Formula
  const c =
    (getValue(3) +
      (6 - getValue(8)) +
      getValue(13) +
      (6 - getValue(18)) +
      getValue(23) +
      (6 - getValue(28)) +
      getValue(33) +
      (6 - getValue(38)) +
      getValue(43) +
      getValue(48)) /
    10;
  const cPercentage = (c / 5) * 100;

  // 4. Neuroticism (N) Formula
  const n =
    (getValue(4) +
      (6 - getValue(9)) +
      getValue(14) +
      (6 - getValue(19)) +
      getValue(24) +
      getValue(29) +
      getValue(34) +
      getValue(39) +
      getValue(44) +
      getValue(49)) /
    10;
  const nPercentage = (n / 5) * 100;

  // 5. Openness to Experience (O) Formula
  const o =
    (getValue(5) +
      (6 - getValue(10)) +
      getValue(15) +
      (6 - getValue(20)) +
      getValue(25) +
      (6 - getValue(30)) +
      getValue(35) +
      getValue(40) +
      getValue(45) +
      getValue(50)) /
    10;
  const oPercentage = (o / 5) * 100;

  return {
    extraversion: ePercentage,
    agreeableness: aPercentage,
    conscientiousness: cPercentage,
    neuroticism: nPercentage,
    openness: oPercentage,
  };
};

//   // Example usage with an array of answers (replace with your actual answers)
//   const userAnswers = [
//     5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5,
//     4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1,
//   ];

//   const results = calculatePersonalityResults(userAnswers);
//   console.log("Personality Test Results:", results);
