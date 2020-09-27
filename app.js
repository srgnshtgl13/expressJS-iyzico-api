const express = require("express");
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const port = 3000;
app.use(cors());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// create application/json parser
app.use(bodyParser.json());

const Iyzipay = require('iyzipay');

/* const iyzipay = new Iyzipay({
    apiKey: 'apiKey',
    secretKey: 'secretKey',
    uri: 'https://sandbox-api.iyzipay.com'
}); */

app.post('/order', (req, res) => {

    const iyzipay = new Iyzipay({
        apiKey: req.body.iyziPayApiKey,
        secretKey: req.body.iyziPayApiSecret,
        uri: 'https://sandbox-api.iyzipay.com'
    });
    const {
        price, userID, name, surname, email, identityNumber,
        contactName, gsmNumber, city, country, address, zipCode,
        cardHolderName, cardNumber, expireMonth, expireYear, cvc, registerCard,
        basketItems
    } = req.body;
    /* [
        {
            id: '13171544',
            name: '09.SINIF FİZİK KONU ANLATIMLI FASİKÜL (6 ADET)',
            category1: '9.SINIF KA',
            category2: '',
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: '70'
        },
    ]; */
    const newBasketItems = [];
    basketItems.forEach(element => {
        let item = {
            id: element.ProductId,
            name: element.Name,
            category1: element.Category,
            category2: "",
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: element.Price
        };
        for(let i=1; i<=element.Amount; i++) {
            newBasketItems.push(item);
        }
        
    });
    
    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price,
        paidPrice: price,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName, // sample Mock test cards(Akbank - Mater Card Debit) => 5890040000000016
            cardNumber,
            expireMonth,
            expireYear,
            cvc,
            registerCard
        },
        buyer: {
            id: userID,
            name,
            surname,
            gsmNumber,
            email,
            identityNumber,
            lastLoginDate: '2020-10-05 12:43:35',
            registrationDate: '2020-04-21 15:12:09',
            registrationAddress: address,
            ip: '85.34.78.112',
            city,
            country,
            zipCode
        },
        shippingAddress: {
            contactName,
            city,
            country,
            address,
            zipCode
        },
        billingAddress: {
            contactName,
            city,
            country,
            address,
            zipCode
        },
        basketItems: newBasketItems,
    };
    
    iyzipay.payment.create(request, function (err, result) {
        // console.log(result);
        if(result.status === 'failure') {
            res.status(404).json(result);
        } else {
            res.status(200).json(result);
        }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
