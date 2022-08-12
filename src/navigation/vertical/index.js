import dashboard from '../dashboard'
import pages from '../pages'
import others from '../others'
import product from '../product'

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
        header: 'Product',
    },
    ...product
    ,
    {
        header: 'Others',
    },
    ...others
]
