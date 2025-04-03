import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for collector distribution
const collectorData = [
  { name: "Top Collectors", value: 35 },
  { name: "Regular Collectors", value: 45 },
  { name: "Occasional Buyers", value: 20 },
];

const COLORS = ["#10b981", "#8b5cf6", "#f97316"];

const config = {
  collectors: {
    label: "Collector Distribution",
    theme: {
      light: "#10b981",
      dark: "#10b981",
    },
  },
};

const CollectorDistribution = () => {
  return (
    <ChartContainer className="h-80" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={collectorData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {collectorData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CollectorDistribution;
