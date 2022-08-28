import dashboard from '../dashboard'
import pages from '../pages'
import others from '../others'
import product from '../product'
import stock from '../stock'
import discount from '../discount'
import order from '../order'
import affiliate from '../affiliate'
import customer from '../customer'

export default [
    {
        title: 'Dashboards',
        icon: 'HomeIcon',
        children: [
            ...dashboard
        ],
    },
    {
        header: 'Pages',
    },
    ...pages,
    {
        header: 'Customer',
    },
    ...customer
    ,
    {
        header: 'Discount',
    },
    ...discount
    ,
    {
        header: 'Product',
    },
    ...product
    ,
    {
        header: 'Order',
    },
    ...order
    ,
    {
        header: 'Stock',
    },
    ...stock,
    {
        header: 'Affiliate',
    },
    ...affiliate
    ,
    {
        header: 'Others',
    },
    ...others
]
