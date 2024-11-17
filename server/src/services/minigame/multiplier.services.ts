export const getMinigameMultiplier = ({
                                          bet,
                                          gameId,
                                          category
                                      }: any) => {
    let multiplier = 0;
    switch (category) {
        case "powerball":
            if (
                // bet.OddEven !== '' ||
                // bet.UnderOver !== '' ||
                // bet.POddEven !== '' ||
                // bet.PUnderOver !== '' ||
                bet.ThreeFour !== '' ||
                bet.LeftRight !== '' ||
                // bet.BigMiddleSmall !== '' ||
                bet.luckyNumber !== ''
                // bet.section !== ''
            ) {
                multiplier = 0;
                break;
            }
            switch (bet.section) {
                case "A":
                    multiplier = 50;
                    break;
                case "B":
                    multiplier = 11;
                    break;
                case "C":
                    multiplier = 8.5;
                    break;
                case "D":
                    multiplier = 5.5;
                    break;
                case "E":
                    multiplier = 2.9;
                    break;
                case "F":
                    multiplier = 2.35;
                    break;
                default:
                    switch (bet.BigMiddleSmall) {
                        case '소':
                            multiplier = 2.85;
                            break;
                        case '중':
                            multiplier = 2.5;
                            break;
                        case '대':
                            multiplier = 2.85;
                            break;
                        default:
                            if (
                                (bet.OddEven !== '' && bet.UnderOver === '' && bet.POddEven === '' && bet.PUnderOver === '') ||
                                (bet.OddEven === '' && bet.UnderOver !== '' && bet.POddEven === '' && bet.PUnderOver === '') ||
                                (bet.OddEven === '' && bet.UnderOver === '' && bet.POddEven !== '' && bet.PUnderOver === '') ||
                                (bet.OddEven === '' && bet.UnderOver === '' && bet.POddEven === '' && bet.PUnderOver !== '')
                            ) {
                                multiplier = 1.95;
                                break;
                            }
                            if (bet.OddEven !== '' && bet.UnderOver !== '') {
                                multiplier = 3.5;
                                break;
                            }
                            if (bet.POddEven !== '' && bet.PUnderOver !== '') {
                                if (bet.POddEven === 'odd' && bet.PUnderOver === 'under') {
                                    multiplier = 3.9;
                                    break;
                                }
                                if (bet.POddEven === 'odd' && bet.PUnderOver === 'over') {
                                    multiplier = 2.95;
                                    break;
                                }
                                if (bet.POddEven === 'even' && bet.PUnderOver === 'under') {
                                    multiplier = 2.95;
                                    break;
                                }
                                if (bet.POddEven === 'even' && bet.PUnderOver === 'over') {
                                    multiplier = 3.9;
                                    break;
                                }
                            }
                            multiplier = 0;
                            break;
                    }
                    break;
            }
            break;
        case "ladder":
            if (
                // bet.OddEven !== '' ||
                // bet.UnderOver !== '' ||
                bet.POddEven !== '' ||
                bet.PUnderOver !== '' ||
                // bet.ThreeFour !== '' ||
                // bet.LeftRight !== '' ||
                bet.BigMiddleSmall !== '' ||
                bet.luckyNumber !== '' ||
                bet.section !== ''
            ) {
                multiplier = 0;
                break;
            }
            multiplier = 1.95;
            break;
        case "keno":
            if (
                // bet.OddEven !== '' ||
                // bet.UnderOver !== '' ||
                // bet.POddEven !== '' ||
                // bet.PUnderOver !== '' ||
                bet.ThreeFour !== '' ||
                bet.LeftRight !== '' ||
                bet.BigMiddleSmall !== '' ||
                // bet.luckyNumber !== '' ||
                bet.section !== ''
            ) {
                multiplier = 0;
                break;
            }
            multiplier = 1.95;
            break;
        default:
            multiplier = 0;
            break;
    }
    return multiplier;
}
