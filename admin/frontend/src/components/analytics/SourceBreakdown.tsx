import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Tooltip, 
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend
} from 'recharts';

interface SourceData {
  name: string;
  value: number;
}

interface SourceBreakdownProps {
  sourceData: Array<{ source: string; count: number }>;
}

const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ sourceData }) => {
  const theme = useTheme();

  // Prepare data for chart
  const chartData: SourceData[] = sourceData.map(item => ({
    name: item.source === 'main-app' ? 'Main Application' : 'Admin Dashboard',
    value: item.count
  }));

  // Colors for the chart
  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

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
      <Typography variant="h6" gutterBottom>
        Actions by Source
      </Typography>
      
      <Box sx={{ flexGrow: 1, minHeight: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
        Breakdown of user actions by application source
      </Typography>
    </Paper>
  );
};

export default SourceBreakdown; 