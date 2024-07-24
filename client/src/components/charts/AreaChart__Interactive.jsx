"use client";

import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ANALYTICS_RB } from "@/api/Analytics";

const chartConfig = {
    date: {
        label: "Date",
    },
    deposit: {
        label: "Deposit",
        color: "hsl(var(--chart-1))",
    },
    withdrawal: {
        label: "Withdrawal",
        color: "hsl(var(--chart-2))",
    },
};

function AreaChart_Interactive({ title, subtitle }) {
    const { data: analyticsRB, isLoading: rbLoading } = useQuery({
        queryFn: () => ANALYTICS_RB(),
        queryKey: ['analyticsRB']
    })
    const [timeRange, setTimeRange] = useState("90d");

    const chartData = React.useMemo(() => {
        if (!analyticsRB || !analyticsRB.data) return [];
        return analyticsRB.data.map(item => ({
            date: item.date,
            deposit: item.deposit,
            withdrawal: item.withdrawal
        }));
    }, [analyticsRB]);

    const filteredData = React.useMemo(() => {
        if (!chartData.length) return [];

        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);

        return chartData.filter(item => {
            const date = new Date(item.date);
            return date >= startDate;
        });
    }, [chartData, timeRange]);

    return (
        <Card className='dark:bg-[#171717]'>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {subtitle}
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDeposit" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-deposit)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-deposit)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillWithdrawal" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-withdrawal)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-withdrawal)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="withdrawal"
                            type="natural"
                            fill="url(#fillWithdrawal)"
                            stroke="var(--color-withdrawal)"
                            stackId="a"
                        />
                        <Area
                            dataKey="deposit"
                            type="natural"
                            fill="url(#fillDeposit)"
                            stroke="var(--color-deposit)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default AreaChart_Interactive;
