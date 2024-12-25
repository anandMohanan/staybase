"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brain, TrendingUp, AlertTriangle, ThumbsUp } from 'lucide-react'
import { Bar, BarChart, Line, LineChart } from "recharts"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MetricCard } from '@/components/metric-card'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  totalSpent: number
  lastOrderDate: string
  orderCount: number
  riskScore: number
  recentOrders: {
    createdAt: string
    total: number
  }[]
}

interface QuantumAnalyticsProps {
  customers: Customer[]
}

const calculatePurchaseFrequency = (customer: Customer) => {
  if (!customer.lastOrderDate || !customer.recentOrders || customer.orderCount === 0) {
    return 0
  }

  const firstOrderDate = customer.recentOrders.length > 0
    ? new Date(customer.recentOrders[customer.recentOrders.length - 1].createdAt)
    : new Date(customer.lastOrderDate)

  const lastOrder = new Date(customer.lastOrderDate)
  const monthsDiff = (lastOrder.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

  return monthsDiff > 0 ? customer.orderCount / monthsDiff : customer.orderCount
}

const calculateCLV = (customer: Customer) => {
  if (!customer.totalSpent || !customer.orderCount) return 0
  return customer.totalSpent / Math.max(1, customer.orderCount)
}

export default function CustomerQuantumAnalysis({ customers }: QuantumAnalyticsProps) {
  const analysis = useMemo(() => {
    const segments = customers.reduce((acc, customer) => {
      const clv = calculateCLV(customer)
      const frequency = calculatePurchaseFrequency(customer)

      if (clv > 1000 && frequency > 2) acc.vipCount++
      else if (clv > 500 || frequency > 1) acc.regularCount++
      else if (customer.orderCount > 0) acc.occasionalCount++
      else acc.oneTimeCount++

      return acc
    }, { vipCount: 0, regularCount: 0, occasionalCount: 0, oneTimeCount: 0 })

    const predictedValues = customers
      .filter(customer => customer.orderCount > 0)
      .map(customer => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        currentValue: customer.totalSpent,
        predictedValue: customer.totalSpent * (1 + (calculatePurchaseFrequency(customer) * 0.1)),
        growthPotential: (calculatePurchaseFrequency(customer) * 0.1) * 100
      }))
      .filter(customer => !isNaN(customer.predictedValue) && isFinite(customer.predictedValue))
      .sort((a, b) => b.growthPotential - a.growthPotential)
      .slice(0, 5)

    const customersWithPurchases = customers.filter(c => c.orderCount > 0)
    const averageClv = customersWithPurchases.length > 0
      ? customersWithPurchases.reduce((sum, customer) => sum + calculateCLV(customer), 0) / customersWithPurchases.length
      : 0

    return {
      segments,
      predictedValues,
      averageClv
    }
  }, [customers])

  const chartData = customers
    .filter(c => c.orderCount > 0 && c.totalSpent > 0)
    .map(c => ({
      orders: c.orderCount,
      value: c.totalSpent
    }))
    .sort((a, b) => a.orders - b.orders)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customer Quantum Analysis</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard   
            title="VIP Customers"
            value={analysis.segments.vipCount}
            icon={Brain}
            tooltipContent="VIP Customers are high value customers with a high CLV and low purchase frequency"
        />
        <MetricCard
            title="Average CLV"
            value={Math.round(analysis.averageClv)}
            icon={TrendingUp}
            tooltipContent="Average CLV is the average customer lifetime value of all customers"
        />
        <MetricCard
            title="Regular Customers"
            value={analysis.segments.regularCount}
            icon={ThumbsUp}
            tooltipContent="Regular Customers are customers with a low CLV and low purchase frequency"
        />
        <MetricCard
            title="One-Time Buyers"
            value={analysis.segments.oneTimeCount}
            icon={AlertTriangle}
            tooltipContent="One-Time Buyers are customers with a low CLV and a high purchase frequency"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Growth Potential Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Predicted Value</TableHead>
                <TableHead>Growth Potential</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.predictedValues.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>${customer.currentValue.toLocaleString()}</TableCell>
                  <TableCell>${Math.round(customer.predictedValue).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-green-600">
                      +{Math.round(customer.growthPotential)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Customer Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Customer Value",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <LineChart data={chartData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}


