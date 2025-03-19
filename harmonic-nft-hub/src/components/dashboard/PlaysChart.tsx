
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for tracking plays
const playsData = [
  { name: 'Neon Dreams', plays: 243 },
  { name: 'Digital Horizon', plays: 356 },
  { name: 'Cyber Pulse', plays: 178 },
  { name: 'Electric Soul', plays: 290 },
  { name: 'Virtual Reality', plays: 210 },
];

const config = {
  plays: {
    label: "Total Plays",
    theme: {
      light: "#8b5cf6",
      dark: "#8b5cf6"
    }
  }
};

const PlaysChart = () => {
  return (
    <ChartContainer className="h-80" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={playsData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            tickLine={false}
            tick={{ fill: '#888888', fontSize: 12 }}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          <YAxis 
            stroke="#888888"
            tickLine={false}
          />
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent 
                    className="border border-purple-500/30 backdrop-blur-xl" 
                    payload={payload}
                    label={label}
                  />
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="plays" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PlaysChart;
