import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface SourceData {
  name: string;
  value: number;
}

interface SourceBreakdownProps {
  sourceData: Array<{ source: string; count: number }>;
}

type ChartType = 'bar' | 'area';

const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ sourceData }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<ChartType>('bar');

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: ChartType | null,
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Prepare data for chart
  const chartData: SourceData[] = sourceData.map(item => ({
    name: item.source === 'main-app' ? 'Main Application' : 
          item.source === 'admin-app' ? 'Admin Dashboard' : 
          item.source,
    value: item.count
  }));

  // Sort chart data by value (descending)
  chartData.sort((a, b) => b.value - a.value);

  // Create more detailed data for area chart (simulated time series)
  const mainAppCount = chartData.find(d => d.name === 'Main Application')?.value ?? 0;
  const adminAppCount = chartData.find(d => d.name === 'Admin Dashboard')?.value ?? 0;
  
  // Generate simulated historical data points
  const areaChartData = [
    { name: 'Day 1', 'Main Application': Math.round(mainAppCount * 0.2), 'Admin Dashboard': Math.round(adminAppCount * 0.1) },
    { name: 'Day 2', 'Main Application': Math.round(mainAppCount * 0.4), 'Admin Dashboard': Math.round(adminAppCount * 0.3) },
    { name: 'Day 3', 'Main Application': Math.round(mainAppCount * 0.5), 'Admin Dashboard': Math.round(adminAppCount * 0.5) },
    { name: 'Day 4', 'Main Application': Math.round(mainAppCount * 0.7), 'Admin Dashboard': Math.round(adminAppCount * 0.6) },
    { name: 'Day 5', 'Main Application': Math.round(mainAppCount * 0.8), 'Admin Dashboard': Math.round(adminAppCount * 0.8) },
    { name: 'Today', 'Main Application': mainAppCount, 'Admin Dashboard': adminAppCount }
  ];

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Actions by Source
        </Typography>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="bar" aria-label="bar chart">
            <BarChartIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="area" aria-label="area chart">
            <ShowChartIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ flexGrow: 1, minHeight: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                height={0}
                tick={false}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} actions`, 'Count']}
                labelFormatter={(label) => `Source: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Actions" 
                fill={theme.palette.primary.main} 
                radius={[4, 4, 0, 0]} 
                label={{
                  position: 'inside',
                  content: (props: any) => {
                    const { x, y, width, height, value, name } = props;
                    const xPos = Number(x) || 0;
                    const yPos = Number(y) || 0;
                    const w = Number(width) || 0;
                    const h = Number(height) || 0;
                    
                    // Position near the bottom (close to X axis)
                    return (
                      <g>
                        <text
                          x={xPos + w / 2}
                          y={yPos + h - 10}
                          textAnchor="start"
                          dominantBaseline="ideographic"
                          transform={`rotate(-90, ${xPos + w / 2}, ${yPos + h - 10})`}
                          fill="#000000"
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textShadow: '0px 0px 3px rgba(0,0,0,0.5)'
                          }}
                        >
                          {name}
                        </text>
                      </g>
                    );
                  }
                }}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={areaChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Main Application" 
                stackId="1" 
                stroke={theme.palette.primary.main} 
                fill={theme.palette.primary.light} 
              />
              <Area 
                type="monotone" 
                dataKey="Admin Dashboard" 
                stackId="1" 
                stroke={theme.palette.secondary.main} 
                fill={theme.palette.secondary.light} 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
        {chartType === 'bar' 
          ? 'Breakdown of user actions by application source' 
          : 'Trend of actions by application source'}
      </Typography>
    </Paper>
  );
};

export default SourceBreakdown; 