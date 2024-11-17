import axios from 'axios';

const smsUsername: string = process.env.SMS_USERNAME!;
const smsKey: string = process.env.SMS_API_KEY!;

export const smsSend = (phone:string, body:string) => {
    return new Promise ((resolve, reject) => {
        axios.post(
            'https://rest.clicksend.com/v3/sms/send',
            {
                messages: [
                    {
                        to: phone,
                        source: 'sdk',
                        body: body
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Basic ${btoa(`${smsUsername}:${smsKey}`)}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    })
}