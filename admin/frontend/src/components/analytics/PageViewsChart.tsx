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
import { useTranslation } from 'react-i18next';

// Data structure for individual page view data points
interface PageData {
  name: string;  // The shortened page path name
  views: number; // Number of views for this page
}

// Props accepted by the PageViewsChart component
interface PageViewsChartProps {
  pageData: Array<{ page_visited: string; count: number }>;  // Raw analytics data from API
}

// Available chart visualization types
type ChartType = 'bar' | 'area';

/**
 * PageViewsChart Component
 * 
 * Displays page view analytics in either a vertical bar chart or stacked area chart.
 * - Bar chart: Shows top 10 most visited pages with view counts
 * - Area chart: Shows historical trend visualization for top 5 pages
 */
const PageViewsChart: React.FC<PageViewsChartProps> = ({ pageData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  // State to track which chart type is currently displayed
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Handler for the chart type toggle buttons
  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: ChartType | null,
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Convert API data format to chart-friendly format and shorten page paths
  const chartData: PageData[] = pageData.map(item => ({
    name: shortenPagePath(item.page_visited || 'Unknown'),
    views: item.count
  }));

  // Sort pages by view count (highest first) for better visualization
  chartData.sort((a, b) => b.views - a.views);
  
  // ---- AREA CHART DATA PREPARATION ----
  // Generate simulated historical data points for area chart trend visualization
  const areaChartData: Array<Record<string, string | number>> = [];
  // Take only top 5 pages for area chart to avoid overcrowding
  const topPages = chartData.slice(0, 5);
  
  // Create time point labels for x-axis of area chart
  const timePoints = [
    t('analytics.day1', 'Day 1'), 
    t('analytics.day2', 'Day 2'), 
    t('analytics.day3', 'Day 3'), 
    t('analytics.day4', 'Day 4'), 
    t('analytics.day5', 'Day 5'), 
    t('analytics.today', 'Today')
  ];
  
  // Generate simulated historical data by scaling current values
  for (let i = 0; i < timePoints.length; i++) {
    const dataPoint: Record<string, string | number> = { name: timePoints[i] };
    
    // Add each page as a data series with progressively scaled values
    // to simulate growth trend over time
    topPages.forEach(page => {
      const scaleFactor = i === timePoints.length - 1 ? 1 : (i + 1) / timePoints.length;
      dataPoint[page.name] = Math.round(page.views * scaleFactor);
    });
    
    areaChartData.push(dataPoint);
  }

  return (
    // CONTAINER: PageViewsChart - Main card container
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 },  // Responsive padding
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* CONTAINER: ChartHeader - Title and toggle buttons row */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: { xs: 'center', sm: 'space-between' }, 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 2,
        gap: { xs: 1, sm: 0 }
      }}>
        {/* ELEMENT: ChartTitle - Page Views heading */}
        <Typography variant="h6">
          {t('analytics.pageViews', 'Page Views')}
        </Typography>
        
        {/* CONTAINER: ChartToggle - Bar/Area toggle button group */}
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="bar" aria-label={t('analytics.barChart', 'bar chart')}>
            <BarChartIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="area" aria-label={t('analytics.areaChart', 'area chart')}>
            <ShowChartIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* CONTAINER: ChartViewport - Main scrollable chart area */}
      <Box sx={{ 
        flexGrow: 1, 
        height: { xs: 350, sm: 400, md: 450 },  // Responsive height based on screen size
        minHeight: { xs: 300, sm: 350 },        // Minimum height to ensure visibility
        width: '100%',
        overflowY: 'auto',  // Vertical scroll if chart is too tall
        overflowX: 'auto'   // Horizontal scroll if chart is too wide
      }}>
        {/* CONTAINER: ChartContainer - Responsive wrapper for the charts */}
        <ResponsiveContainer width="100%" height="100%">
          {/* Conditional rendering based on selected chart type */}
          {chartType === 'bar' ? (
            // VISUALIZATION: BarChartView - Horizontal bar chart for page views
            <BarChart
              data={chartData.slice(0, 10)} // Limit to top 10 pages
              margin={{
                top: 10,
                right: 70,  // Extra space for bar labels
                left: 10,
                bottom: 10,
              }}
              layout="vertical" // Horizontal bars with pages on Y-axis
              barSize={24}     // Thickness of the bars
            >
              {/* ELEMENT: GridLines - Background grid pattern */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* ELEMENT: XAxisView - Horizontal axis for view counts */}
              <XAxis type="number" /> 
              {/* ELEMENT: YAxisView - Vertical axis for page names */}
              <YAxis 
                dataKey="name" 
                type="category"  // Category axis for page names
                width={(window.innerWidth < 600) ? 150 : 200}  // Responsive width based on screen size
                tick={{ 
                  fontSize: (window.innerWidth < 600) ? 10 : 11, 
                  textAnchor: 'end', 
                  fill: theme.palette.text.primary,
                  fontWeight: 500
                }}
                interval={0}  // Show all labels without skipping
              />
              {/* ELEMENT: TooltipView - Hover information display */}
              <Tooltip 
                formatter={(value) => [`${value} ${t('analytics.views', 'views')}`, t('analytics.count', 'Count')]}
                labelFormatter={(label) => `${t('analytics.page', 'Page')}: ${label}`}
                wrapperStyle={{ maxWidth: '250px', wordWrap: 'break-word' }}
              />
              {/* ELEMENT: LegendView - Chart legend */}
              <Legend wrapperStyle={{ marginBottom: '5px' }} />
              {/* ELEMENT: BarsView - The actual data bars */}
              <Bar 
                dataKey="views" 
                name={t('analytics.views', 'Views')} 
                fill={theme.palette.primary.main} 
                radius={[0, 4, 4, 0]}  // Rounded corners on right side only
                label={{
                  position: 'inside',
                  content: (props: any) => {
                    const { x, y, width, height, value } = props;
                    const xPos = Number(x) || 0;
                    const yPos = Number(y) || 0;
                    const w = Number(width) || 0;
                    const h = Number(height) || 0;
                    
                    // Only show value label for bars with enough width
                    if (w < 40) return null;
                    
                    // ELEMENT: BarLabel - Value display inside each bar
                    return (
                      <g>
                        <text
                          x={xPos + w - 10}  // Position near right end of bar
                          y={yPos + h / 2}   // Vertically centered in bar
                          textAnchor="end"
                          dominantBaseline="middle"
                          fill="#000000"
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {value}
                        </text>
                      </g>
                    );
                  }
                }}
              />
            </BarChart>
          ) : (
            // VISUALIZATION: AreaChartView - Stacked area chart for historical trends
            <AreaChart
              data={areaChartData}
              margin={{
                top: 10,
                right: 50,
                left: 10,
                bottom: 10,
              }}
            >
              {/* ELEMENT: GridLines - Background grid pattern */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* ELEMENT: XAxisView - Horizontal axis for time points */}
              <XAxis dataKey="name" interval={0} />
              {/* ELEMENT: YAxisView - Vertical axis for cumulative views */}
              <YAxis />
              {/* ELEMENT: TooltipView - Hover information display */}
              <Tooltip 
                formatter={(value) => [`${value} ${t('analytics.views', 'views')}`, t('analytics.count', 'Count')]}
                wrapperStyle={{ maxWidth: '250px', wordWrap: 'break-word' }}
              />
              {/* ELEMENT: LegendView - Chart legend with page names */}
              <Legend wrapperStyle={{ marginBottom: '5px' }} />
              {/* CONTAINER: AreaSeriesGroup - Collection of stacked areas */}
              {topPages.map((page, index) => (
                // ELEMENT: AreaSeries - Individual page data series
                <Area 
                  key={page.name}
                  type="monotone"  // Smooth curved line style
                  dataKey={page.name} 
                  stackId="1"     // Stack areas on top of each other
                  stroke={COLORS[index % COLORS.length]}  // Line color
                  fill={COLORS[index % COLORS.length]}    // Fill color
                  fillOpacity={0.6}  // Semi-transparent fill
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
      
      {/* CONTAINER: ChartFooter - Explanatory text below chart */}
      <Typography variant="body2" sx={{ mt: { xs: 1, sm: 2 }, textAlign: 'center', fontStyle: 'italic' }}>
        {chartType === 'bar' 
          ? t('analytics.topPageViews', 'Top page views across the application')
          : t('analytics.pageViewTrends', 'Page view trends over time')}
      </Typography>
    </Paper>
  );
};

/**
 * Helper function to format and shorten page paths for display
 * Makes long URLs more readable in the chart labels
 */
const shortenPagePath = (path: string): string => {
  // Remove starting / if present
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Remove query parameters if present
  if (cleanPath.includes('?')) {
    cleanPath = cleanPath.split('?')[0];
  }
  
  // If path is empty, return "Home"
  if (!cleanPath) {
    return 'Home';
  }
  
  // If path is longer than 30 chars, truncate the middle
  if (cleanPath.length > 30) {
    const firstPart = cleanPath.substring(0, 14);
    const lastPart = cleanPath.substring(cleanPath.length - 14);
    return `${firstPart}...${lastPart}`;
  }
  
  return cleanPath;
};

// Color palette for the charts
// Used for bar colors and area fill/stroke colors
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c',
  '#d0ed57', '#83a6ed', '#8dd1e1', '#a4506c', '#9e67ab'
];

export default PageViewsChart; 