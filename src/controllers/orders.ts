import Order, { IOrderSchema } from '../models/order';
import {Request, Response} from 'express'
const mercadopago = require ('mercadopago');
import User from '../models/user';
const orderConfirmOther = require("../templates/orderConfirmOther")
const orderConfirmOtherToMe = require("../templates/orderConfirmOtherToMe")
const {MERCADOPAGO_ACCESSTOKEN, _URL_} = require('../helpers/config');

mercadopago.configure({
    access_token: `${MERCADOPAGO_ACCESSTOKEN}`
})

export const getMyOrder = async (req: Request, res: Response) => {
    const userExist = await User.find({email: req.user?.email});
    if (!userExist) res.status(400).send({success: false});
    
    const orders = await Order.findById(req.params.id)
    res.send(orders)
}

export const getAllMyOrders =  async (req: Request, res: Response) => {
    const userExist = await User.find({email: req.user?.email});
    if (!userExist) res.status(400).send({success: false});
    
    const orders = await Order.find({userEmail: req.user?.email})
    res.send(orders)
}

export const getOrder =  async (req: Request, res: Response) => {
        const orders = await Order.findById(req.params.id)
        res.send(orders)
}

export const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find()
    res.send(orders)
}

export const mpwebhooks =  async (req: Request, res: Response) => {
    res.status(200).send('ok')
}

export const mpnotification =  async (req: Request, res: Response) => {
    if (!req.body.data.id) return res.status(400).send({success: false})

    const payment = await mercadopago.payment.findById(req.body.data.id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    const order = await Order.findOne({MPPreferenceId: preferenceId})
    const orderUpdateRes = await Order.findByIdAndUpdate(
        order?._id,
        {
            paymentMPStatus: status == 'approved' ? 'Aprobado' : status == 'in_process' ? 'Pendiente de aprobación' : status == 'rejected' ? 'Fallido' : status , 
            paymentMPStatus_detail: statusDetail,
        },
        { new: true}
    )
    if (!orderUpdateRes) return res.status(400).send({success: false, message: 'The order cannot be updated.'})
    
    return res.status(200).send({sucess: true});
  };


export const addMyOrder = async (req: Request,res: Response)=>{
    const userExist = await User.findOne({email: req.user?.email});
    if (!userExist) return res.status(400).send({success: false});
    
    let order = new Order({
        ...req.body,
        userEmail: req.user?.email, 
    })
    console.log(order)
    order = await order.save();
    console.log(order)
    if (!order) return res.status(400).send({success: false, message: 'The order cannot be created!'})
    
    const mailResponse = await orderConfirmOther(userExist.name, req.user?.email, `${req.body.paymentMPStatus}`, order._id)

    const mailResponseToMe = await orderConfirmOtherToMe(userExist.name, req.user?.email, process.env.MAIL_USER, `${req.body.paymentMPStatus}`, order._id)

    return res.status(200).send({success: true, message: mailResponse, order})
}

export const mpprefenceid =  async (req: Request, res: Response)=> {
    console.log(req.body)
    const orderFind = await Order.findOne({MPPreferenceId: req.body.MPPreferenceId})
    console.log(orderFind)
    const order = await Order.findByIdAndUpdate(
        orderFind?._id,
        {
            paymentMPStatus: req.body.paymentMPStatus,
            paymentMPStatus_detail: req.body.paymentMPStatus_detail,
        },
        { new: true}
    )

    if(!order) return res.status(400).send({success: false, messagge: 'The order cannot be update!'})

    return res.send(order);
}

export const updateOrder = async (req: Request, res: Response)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    )

    if(!order) return res.status(400).send({success: false, messagge: 'The order cannot be update!'})

    return res.send(order);
}

export const addPayment = async (req: Request,res: Response)=>{

    let preference:{items:object[];back_urls:object;auto_return:string} = {
        items:[],
        back_urls: {
            success: `${_URL_}/order/resultmp`,
            failure: `${_URL_}/order/resultmp`,
            pending: `${_URL_}/order/resultmp`,
          },
          auto_return: "approved",
      };

    req.body.cart.forEach((p:{name:string;price:string;quantity:number}) => {
        preference.items.push({
            title: p.name,
            unit_price: p.price,
            quantity: p.quantity,
        })
    })
    preference.items.push({
        title: 'Costo de envío',
        unit_price: req.body.shippingCost,
        quantity: 1,
    })

    const response = await mercadopago.preferences.create(preference)
    const preferenceId = response.body.id;
    const sandbox_init_point = response.body.sandbox_init_point
    console.log(response.body)
    console.log(preferenceId)
    res.send({preferenceId, sandbox_init_point}); 
}

export const feedback = async (req: Request, res: Response) => {
    const payment = await mercadopago.payment.findById(req.query.payment_id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    console.log(preferenceId)
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    res.status(200).send({preferenceId, status, statusDetail});
  };

export const deleteOrder =  async (req: Request, res: Response)=>{
    const orderFind = await Order.findById(req.params.id)
    if (!orderFind) return res.status(400).send({success: false})
    
    const orderDeleteRes = await Order.findByIdAndRemove(req.params.id);
    if(!orderDeleteRes) return res.status(404).json({success: false , message: "The order cannot be created!"})
    return res.status(200).json({success: true, message: 'the order is deleted!'})
    
}

export const getOrdersCount = async (req: Request, res: Response) =>{
    const orderCount = await Order.countDocuments()
    if(!orderCount) res.status(400).json({success: false})

    res.status(200).send({ orderCount: orderCount });
}
export const getRevenues = async (req: Request, res: Response) =>{
    const ordersWeek = await Order.find({
        dateOrdered: {
            $gte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
        }
    }).select("orderItems");
    let ordersTotal = 0;
    ordersWeek.map(o => ordersTotal += JSON.parse(o.orderItems).total)

    res.status(200).send({ revenues: ordersTotal});
}

export const getOrdersWeek = async (req: Request, res: Response) =>{
    const ordersWeek = await Order.find({
        dateOrdered: {
            $gte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
        }
    }).select("orderItems");
    const ordersPrevWeek = await Order.find({
        dateOrdered: {
            $gte: new Date(Date.now() - 14 * 60 * 60 * 24 * 1000), $lte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
        }
    }).select("orderItems");
    let ordersWeekTotal = 0;
    let ordersPrevWeekTotal = 0;
    ordersWeek.map(o => ordersWeekTotal += JSON.parse(o.orderItems).total)
    ordersPrevWeek.map(o => ordersPrevWeekTotal += JSON.parse(o.orderItems).total)
    const percent = ordersPrevWeekTotal === 0 && ordersWeekTotal === 0 ? 0 :  ordersPrevWeekTotal === 0 ? 100 : (ordersWeekTotal > ordersPrevWeekTotal ? ordersWeekTotal : ordersPrevWeekTotal) * 100 /  (ordersWeekTotal < ordersPrevWeekTotal ? ordersWeekTotal : ordersPrevWeekTotal) 
    res.status(200).send({ percent: `${ordersWeekTotal >= ordersPrevWeekTotal ? '' : '-'}${percent}`, lastWeek: ordersWeekTotal - ordersPrevWeekTotal});
}

export const getOrdersDay = async (req: Request, res: Response) =>{
    const ordersDay = await Order.find({
        dateOrdered: {
            $gte: new Date(new Date().toDateString())
        }
    }).select("orderItems");
    const today =new Date(new Date().toDateString())
    const ordersPrevDay = await Order.find({
        dateOrdered: {
            $gte: new Date(today.setDate(today.getDate()-1)), $lte:  new Date(new Date().toDateString())
        }
    }).select("orderItems");
    let ordersDayTotal = 0;
    let ordersPrevTotal = 0;
    ordersDay.map(o => ordersDayTotal += JSON.parse(o.orderItems).total)
    ordersPrevDay.map(o => ordersPrevTotal += JSON.parse(o.orderItems).total)
    const percent = ordersPrevTotal === 0 ? 0 : ordersDayTotal * 100 / ordersPrevTotal;
    res.status(200).send({ordersDayTotal: ordersDayTotal, percent: percent})
}
export const getOrdersMonths = async (req: Request, res: Response) =>{
    const orderTotal:{month: string, total: number}[] = [
        {month: '', total: 0},
        {month: '', total: 0},
        {month: '', total: 0},
        {month: '', total: 0},
        {month: '', total: 0},
        {month: '', total: 0}
    ];
    for (let [indice, order] of orderTotal.entries()) {
       const filter = indice < 1 ? {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lte: new Date()
       } : {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - indice, 1), $lte: new Date(new Date().getFullYear(), new Date().getMonth() - (indice-1), 1)
       }
       const ordersList = await Order.find({
           dateOrdered: filter
       }).select("orderItems");
       ordersList.map(o => order.total += JSON.parse(o.orderItems).total)
       orderTotal[indice].month = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date(new Date().getFullYear(), new Date().getMonth() - indice, 1));
   }
    const lastMonth = orderTotal[0].total - orderTotal[1].total
    const lastThreeMonths =  (orderTotal[0].total +  orderTotal[1].total + orderTotal[2].total) - (orderTotal[3].total +  orderTotal[4].total +  orderTotal[5].total)
    
    res.status(200).send({
        ordersSixMonths: [...orderTotal].reverse(), 
        lastMonth: lastMonth ,
        lastThreeMonths: lastThreeMonths
    })
}
