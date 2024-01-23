const Product = require('../models/Product');
const paymentM = require('../models/Payment');
const billM = require('../models/Bill');

module.exports = {
    render: async (req, res, next) => {
        try {
            const product = await Product.allProduct();
            // console.log("render", req.session);
            const cart = req.session.cart;
            res.render('home', { layout: 'main', items: product, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    renderAdmin: async (req, res, next) => {
        try {
            res.render('admin/dashboard');
        }
        catch (error) {
            next(error);
        }
    },
    renderLogin: async (req, res, next) => {
        try {
            if (req.user) {
                let account = req.user;
                if (!req.user) account = req.session.user;
                res.render('profile', { layout: 'main', account: account });
            }
            else {
                res.render('login', { layout: '' });
            }
        }
        catch (error) {
            next(error);
        }
    },
    products: async (req, res, next) => {
        try {
            const cart = req.session.cart;
            // console.log(req.session);
            // console.log("renderPro", req.session);
            const product = await Product.allProduct();
            res.render('products', { products: product, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    search: async (req, res, next) => {
        try {
            console.log('search')
            var data = await Product.search(req.body.name)
            const cart = req.session.cart;
            console.log(cart)
            res.render('products', { products: data, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    az: async (req, res, next) => {
        try {
            console.log('sort')
            var data = await Product.sort("az")
            const cart = req.session.cart;
            console.log(data)
            res.render('products', { products: data, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    acs: async (req, res, next) => {
        try {
            console.log('sort')
            var data = await Product.sort("increase")
            console.log(data)
            const cart = req.session.cart;
            res.render('products', { products: data, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    za: async (req, res, next) => {
        try {
            console.log('sort')
            var data = await Product.sort("za")
            console.log(data)
            const cart = req.session.cart;

            res.render('products', { products: data, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    des: async (req, res, next) => {
        try {
            console.log('sort')
            var data = await Product.sort("decrease")
            console.log(data)
            const cart = req.session.cart;

            res.render('products', { products: data, cart: cart });
        }
        catch (error) {
            next(error);
        }
    },
    addToCart: async (req, res, next) => {
        try {
            let found = false;
            if (!req.session.cart) {
                req.session.cart = [];
            }
            for (let i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].name.trim('') === req.body.name.trim('')) {
                    req.session.cart[i].count = req.body.count;
                    found = true;
                    break;
                }
            }
            if (!found) {
                req.session.cart.push({ id: req.body.id, name: req.body.name, price: parseInt(req.body.price), count: parseInt(req.body.count), image: req.body.image });
            }
            res.json({});
        }
        catch (error) {
            next(error);
        }
    },
    plus: async (req, res, next) => {
        try {
            if (!req.session.cart) {
                req.session.cart = [];
            }
            for (let i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].name.trim('') == req.body.name.trim('')) {
                    req.session.cart[i].count++;
                    break;
                }
            }
            res.json({});
        }
        catch (error) {
            next(error);
        }
    },
    minus: async (req, res, next) => {
        try {
            if (!req.session.cart) {
                req.session.cart = [];
            }
            for (let i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].name.trim('') == req.body.name.trim('')) {
                    if (req.session.cart[i].count == 1) {
                        req.session.cart.splice(i, 1);
                    }
                    else {
                        req.session.cart[i].count--;
                    }
                    break;
                }
            }
            res.json({});
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            if (!req.session.cart) {
                req.session.cart = [];
            }
            for (let i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].name.trim('') == req.body.name.trim('')) {
                    req.session.cart.splice(i, 1);
                    break;
                }
            }
            res.json({});
        }
        catch (error) {
            next(error);
        }
    },
    renderAddProduct: async (req, res, next) => {
        try {
            res.render('./admin/product/viewProduct')
         }
        catch (error) {
            next(error);
        }
    },
    addProduct: async (req, res, next) => {
        try {
            console.log(req.body);
            await Product.addProduct(req.body.inputID,req.body.inputName,req.body.tinyDes, req.body.fullDes,req.body.price,req.body.size,req.body.items,req.body.count,req.body.producer,req.body.imageUrl );
            res.render('./admin/product/viewProduct');

        } catch (error) {
            console.log(error)
        }
    },
    renderChart: async (req, res, next) => {
        try {
            const total=await Product.chart();
            console.log('a',total);
            let tien=new Array(12).fill(0);
            for(let i=0;i<12;i++)
            {
                if(total[i]){
                    if(total[i].thang)
                    tien[total[i].thang-1]=total[i].thanhtien;
                }
               
            }
            const data = {
                x: JSON.stringify([1, 2, 3, 4,5,6,7,8,9,10,11,12]),
                y: JSON.stringify(tien)
            };
        
            res.render('./admin/product/chart', data);

        } catch (error) {
            console.log(error)
        }
    },
    renderSuccess: async (req, res, next) => {
        try {
            const allTranstions = await paymentM.selectAllPayments();
            let maxxMaGD = 0;
            allTranstions.forEach((element) => {
                if (maxxMaGD < element.maGiaoDich) {
                    maxxMaGD = element.maGiaoDich;
                }
            });
            const latestPayment = await paymentM.selectPayment(maxxMaGD);
            console.log(latestPayment);
            const un = latestPayment.id;
            const total = latestPayment.money;
            const date = latestPayment.Time;

            const obj = {
                username: un,
                date: date,
                total: total,
                status: 0
            }

            await billM.insertBill(obj);

            const allBills = await billM.selectAllBills();
            let maxxMaHD = 0;
            allBills.forEach(element => {
                if (element.MaHoaDon > maxxMaHD) {
                    maxxMaHD = element.MaHoaDon;
                }
            });

            for (let i = 0; i < req.session.cart.length; i++) {
                const item = req.session.cart[i];
                const obj = {
                    id: item.id,
                    count: item.count
                }
                await billM.addTTHoaDon(maxxMaHD, obj);
            }

            req.session.cart = [];
            res.render('successNoti', { layout: 'transferNoti' });
        }
        catch (error) {
            next(error);
        }
    },
    renderFail: async (req, res, next) => {
        try {
            const allTranstions = await paymentM.selectAllPayments();
            let maxxMaGD = 0;
            allTranstions.forEach((element) => {
                if (maxxMaGD < element.maGiaoDich) {
                    maxxMaGD = element.maGiaoDich;
                }
            });
            const latestPayment = await paymentM.selectPayment(maxxMaGD);
            console.log(latestPayment);
            const un = latestPayment.id;
            const total = latestPayment.money;
            const date = latestPayment.Time;

            const obj = {
                username: un,
                date: date,
                total: total,
                status: 1 // Fail
            }

            await billM.insertBill(obj);

            // const allBills = await billM.selectAllBills();
            // let maxxMaHD = 0;
            // allBills.forEach(element => {
            //     if (element.MaHoaDon > maxxMaHD) {
            //         maxxMaHD = element.MaHoaDon;
            //     }
            // });

            // for (let i = 0; i < req.session.cart.length; i++) {
            //     const item = req.session.cart[i];
            //     const obj = {
            //         id: item.id,
            //         count: item.count
            //     }
            //     await billM.addTTHoaDon(maxxMaHD, obj);
            // }

            req.session.cart = [];
            res.render('failNoti', { layout: 'transferNoti' });
        }
        catch (error) {
            next(error);
        }
    },
}