const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const renderBuyPage = async (req, res) => {

    try {

        res.render('buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount: 50,
            currency: 'USD' // تغيير العملة إلى الدينار الأردني
        })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async (req, res) => {

    try {

        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'متبرع', // قم بتغييره إلى اسم العميل
            address: {
                line1: 'العنوان الخط الأول',
                postal_code: '000',
                city: 'عمان',
                state: 'عمان',
                country: 'الأردن', // تغيير البلد
            }
        })
            .then((customer) => {

                return stripe.charges.create({
                    amount: req.body.amount * 100, // قم بتغييره إلى المبلغ بالدينار الأردني
                    description: req.body.productName,
                    currency: 'USD', // تغيير العملة إلى الدينار الأردني
                    customer: customer.id
                });
            })
            .then((charge) => {
                res.redirect("/success")
            })
            .catch((err) => {
                res.redirect("/failure")
            });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async (req, res) => {

    try {

        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async (req, res) => {

    try {

        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}
