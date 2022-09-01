import axios from "axios"





export const SendSms = async (number, message) => {

    try {
       await axios.get(`https://bulksmsbd.net/api/smsapi?api_key=tZ12LkuoWJHZUKwy3HR0&type=text&number=${number}&senderid=Random&message=${message}`);
        
    } catch (error) {
        console.log(error);
    }
}



















// BulkSMS BD work
// import Vonage from '@vonage/server-sdk';

// const vonage = new Vonage({
//   apiKey: "67a11c78",
//   apiSecret: "k8zU4EvXGqV56PpZ"
// });


// export const SendSms = () =>{

//     const from = "Vonage APIs"
//     const to = "8801626761798"
//     const text = 'This Is my First Sms from Instagram'
    
//     vonage.message.sendSms(from, to, text, (err, responseData) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if(responseData.messages[0]['status'] === "0") {
//                 console.log("Message sent successfully.");
//             } else {
//                 console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//             }
//         }
//     })
// }