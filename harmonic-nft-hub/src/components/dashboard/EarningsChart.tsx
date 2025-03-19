
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for the chart
const earningsData = [
  { month: 'Jan', earnings: 0.05 },
  { month: 'Feb', earnings: 0.12 },
  { month: 'Mar', earnings: 0.08 },
  { month: 'Apr', earnings: 0.21 },
  { month: 'May', earnings: 0.15 },
  { month: 'Jun', earnings: 0.32 },
  { month: 'Jul', earnings: 0.25 },
  { month: 'Aug', earnings: 0.45 },
];

const config = {
  earnings: {
    label: "Earnings (ETH)",
    theme: {
      light: "#10b981",
      dark: "#10b981"
    }
  }
};

const EarningsChart = () => {
  return (
    <ChartContainer className="h-80" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={earningsData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            stroke="#888888" 
            tickLine={false}
          />
          <YAxis 
            stroke="#888888"
            tickLine={false}
            tickFormatter={(value) => `${value} ETH`}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent 
                    className="border border-neon-green/30 backdrop-blur-xl" 
                    payload={payload} 
                  />
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="earnings" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorEarnings)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EarningsChart;
