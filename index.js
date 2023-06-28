const express = require('express')
const db = require('./postgres')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8081

require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/shop/add', (request, response)=>{
    let data = request.body;
    console.log(data)
    let shopName = data.shopName;
    let ownerName = data.ownerName;
    let phone = data.phone;
    let email = data.email;
    let gender = data.gender;
    let lat = parseFloat(data.lat);
    let lng = parseFloat(data.lng);//data.latLng.split(",").map(v=>parseFloat(v));

    return db.query(`
    insert into shops(shop_name, owner_name, email,phone, gender, geom)
    values('${shopName}', '${ownerName}', '${email}', '${phone}', '${gender}', st_geomfromtext('POINT(${lng} ${lat})'));
    `).then(result=>{
        console.log(result);
        return response.json({
            error: false,
            data: 'Success'
        })
    }).catch(err=>{
        console.log(err);
        return response.json({
            error: true,
            data: 'Db Error'
        })
    })
    /***
     * -- 	shop_name varchar(250),
-- 	owner_name varchar(250),
-- 	email varchar(250),
-- 	phone varchar(250),
-- 	gender varchar(250),
-- 	geom geometry('POINT', 4326)
     */
})

app.get('/shop/getAll', (request, response)=>{
    db.query('select shop_name, owner_name, phone, email, st_asgeojson(geom) as geom, gender from shops;')
    .then(result=>{
        result = result.rows
        // console.log(result);
        return response.json({
            error: false,
            data: result
        })
    }).catch(err=>{
        return response.json({
            data: 'DB error',
            error: true
        })
    })
})

app.get('/shop/getByProduct', async (request, response)=>{
    let productName = (request.query.productName);

    let query1 = `select shop_id, product_name, product_price, shops.shop_name, shops.owner_name, st_asgeojson(shops.geom) as geom from shops
    inner join
    products
    on shops.id=products.shop_id
    where products.product_name = '${productName}';`

    db.query(query1)
    .then(result1=>{
        return response.json({
            error: false,
            data: result1.rows
        })

    }).catch(err=>{
        console.log(err)
        return response.json({
            data: 'DB error',
            error: true
        })
    })
})

app.get('/shop/get', (request, response)=>{
    let data = request.query;
    
    console.log(data);
    return response.json({
        status: 'success'
    })
})


app.post('/product/add', (request, response)=>{
    let data = request.body;
    console.log(data);
    return response.json({
        status: 'success'
    })
})

app.post('/product/addMultiple', async (request, response)=>{
    let data = request.body;
    
    for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];
        let q = `insert into products (shop_id, product_name, product_price) values(${data.shopId},'${product.productName}',${product.productPrice});`
        await db.query(q);
    }

    return response.json({
        status: 'success'
    })
})

app.get('/product/getAll', (request, response)=>{
    db.query('select * from products;')
    .then(result=>{
        result = result.rows
        // console.log(result);
        return response.json({
            error: false,
            data: result
        })
    }).catch(err=>{
        return response.json({
            data: 'DB error',
            error: true
        })
    })
})

app.listen(port, () => {
    console.log(`Server started at ${port}`)
});
