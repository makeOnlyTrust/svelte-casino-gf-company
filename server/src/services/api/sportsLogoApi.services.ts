import axios from 'axios';

export const getLogoData = async (sportsType: string, category: string, idArray: string[]) => {
    const SERVER_URL = 'http://data2.goalserve.com:8084';
    const KEY = process.env.SPORTS_API_KEY!;

    const idList = idArray.join(',');
    const endpoint = `${SERVER_URL}/api/v1/logotips/${sportsType}/${category}/?k=${KEY}&ids=${idList}`;
    const headers = {
        'Content-Type': 'application/json'
    };

    console.log(endpoint);

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, {headers})
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}