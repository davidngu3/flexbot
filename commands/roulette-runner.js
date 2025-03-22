const runTheSimulation = (
    startingBet,
    ratio,
    numberOfDays,
    budget
  ) => {
    let i = 0;
    let totalEarnings = 0;
    let highestPoint = -Infinity;
    let lowestPoint = Infinity;
    let numOfBets = 0;
    let highestNumOfBets = -Infinity;
    const updateMaxMin = () => {
      highestPoint = Math.max(totalEarnings, highestPoint);
      lowestPoint = Math.min(totalEarnings, lowestPoint);
    };
  
    const runOneDay = () => {
      const rr = new RouletteRunner(budget);
      let numOfBetsInDay = 0;
      let bet = startingBet;
      while (true) {
        try {
          numOfBetsInDay += 1;
          numOfBets += 1;
          highestNumOfBets = Math.max(highestNumOfBets, numOfBetsInDay);
  
          const [didWin, moneyInThatDay] = rr.gamble(bet);
  
          if (didWin) {
            //   console.log(i, rr.currentMoney);
            totalEarnings += moneyInThatDay - budget;
            updateMaxMin();
            break;
          }
          bet = bet * ratio;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          // console.log(i, rr.currentMoney);
          totalEarnings += rr.currentMoney - budget;
          updateMaxMin();
  
          break;
        }
      }
    };
  
    while (i < numberOfDays) {
      runOneDay();
      i++;
    }
    return {
      inputParameters: {
        startingBet,
        ratio,
        numberOfDays,
        budget: budget.toLocaleString(),
      },
      stats: {
        totalEarnings,
        highestPoint,
        lowestPoint,
        avgNumOfBets: numOfBets / numberOfDays,
        highestNumOfBets,
      },
    };
  };
  
  class RouletteRunner {
    constructor(budget) {
      this.oddsOfWinning = 18 / 37;
      this.currentMoney = budget;
    }
  
    gamble(bet) {
      if (bet > this.currentMoney) {
        throw new Error("Out of money");
      }
      let localCurrentMoney = this.currentMoney - bet;
      if (Math.random() < this.oddsOfWinning) {
        //   console.log("Win!");
        localCurrentMoney += bet * 2; // Assuming multiplicativeFactor is 2 for roulette
        this.currentMoney = localCurrentMoney;
        return [true, this.currentMoney];
      }
      // console.log("Lose!");
  
      this.currentMoney = localCurrentMoney;
      return [false, this.currentMoney];
    }
  }

  module.exports = {
    runTheSimulation
  };
  