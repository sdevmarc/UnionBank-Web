import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
import { useQuery } from "@tanstack/react-query";
import { ANALYTICS_HR } from "@/api/Analytics";

// const chartData = [
//     { work: "hr", recruits: 275, fill: "var(--color-hr)" },
//     { work: "it", recruits: 200, fill: "var(--color-it)" },
//     { work: "rb", recruits: 287, fill: "var(--color-rb)" }
// ];

const chartConfig = {
    recruits: {
        label: "Recruits",
    },
    hr: {
        label: "HR",
        color: "hsl(var(--chart-1))",
    },
    it: {
        label: "IT",
        color: "hsl(var(--chart-2))",
    },
    rb: {
        label: "RB",
        color: "hsl(var(--chart-3))",
    }
};

function PieChartHR() {
    const { data: analyticsHR, isLoading: hrLoading } = useQuery({
        queryFn: () => ANALYTICS_HR(),
        queryKey: ['analyticsHR']
    });

    const chartData = React.useMemo(() => {
        if (!analyticsHR || !analyticsHR.data) return [];

        return Object.entries(analyticsHR.data).map(([work, recruits]) => ({
            work,
            recruits,
            fill: `var(--color-${work.toLowerCase()})`
        }));
    }, [analyticsHR]);

    const totalRecruits = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.recruits, 0);
    }, [chartData]);

    return (
        <Card className="flex flex-col dark:bg-[#171717]">
            <CardHeader className="items-center pb-0">
                <CardTitle>Employed</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="recruits"
                            nameKey="work"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-current fill-foreground text-3xl font-bold"
                                                >
                                                    {totalRecruits.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-current fill-muted-foreground"
                                                >
                                                    Recruits
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total recruited for the last 7 days
                </div>
            </CardFooter>
        </Card>
    );
}

export default PieChartHR;
