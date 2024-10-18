
import React, { useEffect, useState } from 'react';
import './SalesReport.css';
const SalesReport = () => {
    const [report, setReport] = useState(null)
    useEffect(() => {
        const fetchSalesData = async () => {
            const response = await fetch('http://localhost:5000/api/sales')
            const data = await response.json()
            analyzeSalesData(data)
        };
        fetchSalesData()
    }, []);

    const analyzeSalesData = (data) => {
        const totalSales = {}
        const monthlySales = {}
        const popularItems = {}
        const revenueItems = {}
        data.forEach(record => {
            const { month, item, quantity, price } = record
            const revenue = quantity * price

            totalSales.total = (totalSales.total || 0) + revenue
            if (!monthlySales[month]) {
                monthlySales[month] = { totalRevenue: 0, itemsSold: {} }
            }
            monthlySales[month].totalRevenue += revenue
            if (!monthlySales[month].itemsSold[item]) {
                monthlySales[month].itemsSold[item] = { quantity: 0, revenue: 0 }
            }
            monthlySales[month].itemsSold[item].quantity += quantity
            monthlySales[month].itemsSold[item].revenue += revenue
            if (!popularItems[month] || popularItems[month].quantity < monthlySales[month].itemsSold[item].quantity) {
                popularItems[month] = { item, quantity: monthlySales[month].itemsSold[item].quantity }
            }
            if (!revenueItems[month] || revenueItems[month].revenue < monthlySales[month].itemsSold[item].revenue) {
                revenueItems[month] = { item, revenue: monthlySales[month].itemsSold[item].revenue }
            }
        })
        const reportData = []
        reportData.push(`Total Sales of the Store: $${totalSales.total.toFixed(2)}`)

        for (const month in monthlySales) {
            const popularItem = popularItems[month]
            const revenueItem = revenueItems[month]
            reportData.push(`\nMonth: ${month}`)
            reportData.push(`Total Revenue: $${monthlySales[month].totalRevenue.toFixed(2)}`)
            reportData.push(`Most Popular Item: ${popularItem.item} (Quantity Sold: ${popularItem.quantity})`)
            reportData.push(`Item Generating Most Revenue: ${revenueItem.item} ($${revenueItem.revenue.toFixed(2)})`)
            const quantities = []

            

            for (const item in monthlySales[month].itemsSold) {
                if (item === popularItem.item) {
                    quantities.push(monthlySales[month].itemsSold[item].quantity)


                }
            }
            const minOrders = Math.min(...quantities)
            const maxOrders = Math.max(...quantities)
            const avgOrders = quantities.reduce((a, b) => a + b, 0) / quantities.length


            reportData.push(`Min Orders for ${popularItem.item}: ${minOrders}`)
            reportData.push(`Max Orders for ${popularItem.item}: ${maxOrders}`)
            reportData.push(`Average Orders for ${popularItem.item}: ${avgOrders.toFixed(2)}`)
        }
        setReport(reportData.join('\n'))
    }



    return (
        <div className="report-container">
            <h1>Ice Cream Sales Report</h1>
            <pre>{report ? report : "Wait For a While..."}</pre>
        </div>
    )
}



export default SalesReport;