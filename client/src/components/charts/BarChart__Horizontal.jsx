import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
    { day: "Monday", data: 186 },
    { day: "Tuesday", data: 305 },
    { day: "Wednesday", data: 237 },
    { day: "Thursday", data: 73 },
    { day: "Friday", data: 209 },
    { day: "Saturday", data: 214 },
    { day: "Sunday", data: 214 },
];

const chartConfig = {
    data: {
        label: "Data",
        color: "hsl(var(--chart-1))",
    },
};

function BarChart_Horizontal() {
    return (
        <Card className='dark:bg-[#171717]'>
            <CardHeader>
                <CardTitle>Daily failed login attempts</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                    >
                        <XAxis type="number" dataKey="data" hide />
                        <YAxis
                            dataKey="day"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="data" fill="var(--color-data)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className=" text-muted-foreground">
                    Showing total login attempts for the last 7 days
                </div>
            </CardFooter>
        </Card>
    );
}

export default BarChart_Horizontal;
