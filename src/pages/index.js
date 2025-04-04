"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Box,
  Fade,
  Zoom,
  Grow,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  BarChart as BarChartIcon,
  FilterList,
  ExpandMore,
  LocalShipping as Truck,
  MoreVert,
  Refresh,
  Download,
  Print,
  Share,
  RecyclingOutlined,
  Speed,
  EmojiEvents,
  Groups,
  DirectionsCar,
  LocalShipping,
  AirportShuttle,
  FireTruck,
  ElectricCar,
  EnergySavingsLeaf as EcoIcon,
  DonutLarge,
  Leaderboard,
  Search,
  DateRange,
} from "@mui/icons-material"

// CSS Styles
const styles = `
/* Base styles */
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --primary: #0f172a;
  --primary-foreground: #f8fafc;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #f8fafc;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #0f172a;
  --radius: 0.5rem;
  --chart-1: #10b981;
  --chart-2: #f59e0b;
  --chart-3: #3b82f6;
  --chart-4: #8b5cf6;
  --chart-5: #ec4899;
  --chart-6: #06b6d4;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@keyframes progressAnimation {
  0% { width: 0%; }
  100% { width: var(--progress-width); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  transition: background-color 0.3s ease;
}

/* Dashboard container */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  animation: fadeIn 0.5s ease-in-out;
  background-color: #ffffff;
}

/* App bar */
.app-bar {
  background-color: var(--card) !important;
  color: var(--card-foreground) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.app-bar:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
  z-index: 1;
}

.dashboard-title {
  font-weight: 700 !important;
  font-size: 1.8rem !important;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.dashboard-title-icon {
  color: #10b981;
  animation: float 3s infinite ease-in-out;
  font-size: 2.2rem !important;
}

.toolbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Main content */
.dashboard-main {
  flex: 1;
  padding: 1.5rem;
}

.dashboard-grid {
  display: grid;
  gap: 1.5rem;
}

/* Metrics section */
.metrics-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.metric-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
  animation-delay: calc(var(--index) * 0.1s);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.efficiency-card {
  border-left: 4px solid #10b981 !important;
  --index: 0;
}

.total-card {
  border-left: 4px solid #3b82f6 !important;
  --index: 1;
}

.average-card {
  border-left: 4px solid #f59e0b !important;
  --index: 2;
}

.drivers-card {
  border-left: 4px solid #8b5cf6 !important;
  --index: 3;
}

.card-title {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  color: #334155 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.total-card .card-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.average-card .card-icon {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.drivers-card .card-icon {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.card-description {
  color: var(--muted-foreground) !important;
  font-size: 0.75rem !important;
}

.metric-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.metric-value {
  font-weight: 700 !important;
  font-size: 1.75rem !important;
  line-height: 1.2 !important;
  margin-bottom: 0.25rem !important;
  background: linear-gradient(90deg, #0f172a, #334155);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.efficiency-card .metric-value {
  background: linear-gradient(90deg, #059669, #10b981);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.total-card .metric-value {
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.average-card .metric-value {
  background: linear-gradient(90deg, #d97706, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.drivers-card .metric-value {
  background: linear-gradient(90deg, #7c3aed, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-target {
  color: var(--muted-foreground) !important;
  font-size: 0.75rem !important;
}

.percentage-chip {
  background-color: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
  font-weight: 600 !important;
  border-radius: 20px !important;
  transition: all 0.3s ease !important;
  animation: pulse 2s infinite ease-in-out;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);
}

.percentage-chip:hover {
  background-color: rgba(16, 185, 129, 0.2) !important;
  box-shadow: 0 2px 15px rgba(16, 185, 129, 0.3);
}

.progress-bar {
  margin-top: 1rem;
  height: 8px !important;
  border-radius: 9999px;
  background-color: rgba(241, 245, 249, 0.7) !important;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress-bar .MuiLinearProgress-bar {
  background: linear-gradient(90deg, #059669, #10b981) !important;
  --progress-width: 94.2%;
  animation: progressAnimation 1.5s ease-out forwards;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.trend-indicator.positive {
  color: #10b981;
}

.trend-indicator.negative {
  color: #ef4444;
}

.trend-indicator svg {
  font-size: 0.75rem !important;
  animation: float 2s infinite ease-in-out;
}

/* Charts section */
.charts-section {
  margin-top: 1.5rem;
}

.charts-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-card {
  height: 100%;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  animation-delay: 0.4s;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
}

.chart-header {
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05));
}

.chart-header .MuiCardHeader-title {
  font-weight: 600 !important;
  font-size: 1rem !important;
  color: #334155 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-header .MuiCardHeader-subheader {
  font-size: 0.75rem !important;
}

.chart-header .MuiCardHeader-action {
  margin: 0 !important;
}

.chart-header .MuiCardHeader-action svg {
  color: #64748b !important;
  transition: color 0.3s ease !important;
}

.chart-header .MuiCardHeader-action svg:hover {
  color: #334155 !important;
}

.chart-container {
  aspect-ratio: 4/3;
  width: 100%;
  padding: 0.5rem;
  position: relative;
}

.chart-container .recharts-responsive-container {
  transition: opacity 0.5s ease;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}

.chart-loading-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(transparent, #10b981);
  animation: rotate 1s linear infinite;
}

.chart-loading-indicator::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background: white;
  border-radius: 50%;
}

/* Custom tooltip */
.custom-tooltip {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.2s ease-out;
  max-width: 250px;
  transition: all 0.2s ease;
}

.tooltip-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0;
  color: #334155;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  padding-bottom: 0.25rem;
}

.tooltip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.tooltip-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

/* Drivers section */
.drivers-section {
  margin-top: 1.5rem;
}

.drivers-card {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  animation: slideInUp 0.7s ease-out forwards;
  opacity: 0;
  animation-delay: 0.6s;
  overflow: hidden;
}

.drivers-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
}

.drivers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  background: linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05));
}

.drivers-header .MuiCardHeader-title {
  font-weight: 600 !important;
  font-size: 1.125rem !important;
  color: #334155 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  height: 2.2rem !important;
  text-transform: none !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
  padding: 0 1rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.action-button:hover {
  background-color: rgba(139, 92, 246, 0.1) !important;
  border-color: rgba(139, 92, 246, 0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.drivers-tabs {
  margin-bottom: 1rem;
}

.drivers-tabs .MuiTabs-indicator {
  background: linear-gradient(90deg, #7c3aed, #8b5cf6) !important;
  height: 3px !important;
  border-radius: 3px !important;
}

.drivers-tabs .MuiTab-root {
  text-transform: none !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  min-width: 120px !important;
}

.drivers-tabs .MuiTab-root.Mui-selected {
  color: #8b5cf6 !important;
  font-weight: 600 !important;
}

.drivers-table {
  box-shadow: none !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

.drivers-table .MuiTableHead-root {
  background-color: rgba(241, 245, 249, 0.5) !important;
}

.drivers-table .MuiTableHead-root .MuiTableCell-root {
  font-weight: 600 !important;
  color: #64748b !important;
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.drivers-table .MuiTableBody-root .MuiTableRow-root {
  transition: background-color 0.3s ease !important;
}

.drivers-table .MuiTableBody-root .MuiTableRow-root:hover {
  background-color: rgba(241, 245, 249, 0.5) !important;
}

.driver-name {
  font-weight: 500 !important;
  color: #334155 !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

.driver-avatar {
  width: 32px !important;
  height: 32px !important;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6) !important;
  color: white !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.2);
}

.status-chip {
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  border-radius: 20px !important;
  padding: 0 0.75rem !important;
  height: 24px !important;
  transition: all 0.3s ease !important;
}

.status-chip.success {
  background-color: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);
}

.status-chip.success:hover {
  background-color: rgba(16, 185, 129, 0.2) !important;
  box-shadow: 0 2px 15px rgba(16, 185, 129, 0.2);
}

.status-chip.warning {
  background-color: rgba(245, 158, 11, 0.1) !important;
  color: #f59e0b !important;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);
}

.status-chip.warning:hover {
  background-color: rgba(245, 158, 11, 0.2) !important;
  box-shadow: 0 2px 15px rgba(245, 158, 11, 0.2);
}

.status-chip.destructive {
  background-color: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.1);
}

.status-chip.destructive:hover {
  background-color: rgba(239, 68, 68, 0.2) !important;
  box-shadow: 0 2px 15px rgba(239, 68, 68, 0.2);
}

/* Vehicle section */
.vehicle-section {
  margin-top: 1.5rem;
}

.vehicle-grid {
  display: flex;
  gap: 1.5rem;
}

.vehicle-card, .trend-card, .cooperatives-ranking-card {
  flex: 1;
  height: 100%;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.8s;
  overflow: hidden;
}

.vehicle-card:hover, .trend-card:hover, .cooperatives-ranking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
}

.vehicle-header, .trend-header, .cooperatives-ranking-header {
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05));
}

.vehicle-header .MuiCardHeader-title, 
.trend-header .MuiCardHeader-title,
.cooperatives-ranking-header .MuiCardHeader-title {
  font-weight: 600 !important;
  font-size: 1rem !important;
  color: #334155 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vehicle-header .MuiCardHeader-subheader, 
.trend-header .MuiCardHeader-subheader,
.cooperatives-ranking-header .MuiCardHeader-subheader {
  font-size: 0.75rem !important;
}

.vehicle-type {
  font-weight: 500 !important;
  color: #334155 !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

.vehicle-icon {
  width: 32px !important;
  height: 32px !important;
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: white !important;
  border-radius: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.2);
}

.vehicle-icon svg {
  font-size: 1.25rem !important;
}

/* Action buttons */
.action-icon-button {
  color: #64748b !important;
  transition: all 0.3s ease !important;
}

.action-icon-button:hover {
  color: #334155 !important;
  background-color: rgba(241, 245, 249, 0.8) !important;
}

/* Animations for elements */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}

.animate-slide-up {
  animation: slideInUp 0.5s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}

.animate-float {
  animation: float 3s infinite ease-in-out;
}

/* Loading shimmer effect */
.loading-shimmer {
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* Radar chart styles */
.radar-chart-container {
  margin: 0 auto;
}

.radar-chart-container .recharts-polar-grid-angle line,
.radar-chart-container .recharts-polar-grid-concentric circle {
  stroke: rgba(226, 232, 240, 0.5);
}

.radar-chart-container .recharts-polar-angle-axis-tick text {
  font-size: 10px;
  fill: #64748b;
}

/* Legend styles */
.recharts-default-legend {
  margin-top: 10px !important;
}

.recharts-legend-item-text {
  color: #334155 !important;
  font-size: 12px !important;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Cooperatives ranking table */
.cooperatives-table {
  width: 100%;
  border-collapse: collapse;
}

.cooperatives-table th {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
}

.cooperatives-table td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

.cooperatives-table tr:last-child td {
  border-bottom: none;
}

.cooperatives-table tr:hover td {
  background-color: rgba(241, 245, 249, 0.5);
}

.cooperatives-rank {
  font-weight: 700;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  margin-right: 0.75rem;
}

.cooperatives-rank.second {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.cooperatives-rank.third {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.cooperatives-rank.fourth {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.cooperatives-rank.fifth {
  background: linear-gradient(135deg, #ec4899, #be185d);
}

.tables-container {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.table-card {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .tables-container {
    flex-direction: column;
  }
}

.search-filter {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.driver-search {
  margin-bottom: 1rem;
  width: 100%;
}

.search-input {
  border-radius: 12px !important;
  background-color: rgba(241, 245, 249, 0.7) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
}

.search-input:hover {
  background-color: rgba(241, 245, 249, 0.9) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05) !important;
}

.search-input.Mui-focused {
  background-color: white !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

.table-count-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
}

.period-menu-item {
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.period-menu-item:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

.period-menu-item.active {
  background-color: rgba(16, 185, 129, 0.1);
  font-weight: 600;
}
`

export default function WeighingDashboard() {
  const [period, setPeriod] = useState("month")
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chartsLoaded, setChartsLoaded] = useState({
    barChart: false,
    pieChart: false,
    lineChart: false,
    radarChart: false,
  })
  const [vehicleFilter, setVehicleFilter] = useState("")
  const [cooperativeFilter, setCooperativeFilter] = useState("")
  const [driverFilter, setDriverFilter] = useState("")
  const [periodMenuAnchor, setPeriodMenuAnchor] = useState(null)
  const [vehicleData, setVehicleData] = useState([
    { type: "Caminhão Compactador", count: 12, avgWeighings: 245, icon: <LocalShipping /> },
    { type: "Caminhão Basculante", count: 8, avgWeighings: 210, icon: <FireTruck /> },
    { type: "Caminhão Carroceria", count: 6, avgWeighings: 180, icon: <AirportShuttle /> },
    { type: "Veículo Utilitário", count: 4, avgWeighings: 120, icon: <ElectricCar /> },
    { type: "Caminhão Baú", count: 3, avgWeighings: 150, icon: <Truck /> },
    { type: "Caminhão Tanque", count: 2, avgWeighings: 130, icon: <LocalShipping /> },
    { type: "Caminhão Guincho", count: 2, avgWeighings: 110, icon: <Truck /> },
    { type: "Caminhão Plataforma", count: 1, avgWeighings: 95, icon: <LocalShipping /> },
    { type: "Caminhão Cegonha", count: 1, avgWeighings: 85, icon: <Truck /> },
  ])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Simulate charts loading one by one
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, barChart: true })), 1500)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, pieChart: true })), 2000)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, lineChart: true })), 2500)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, radarChart: true })), 3000)

    return () => clearTimeout(timer)
  }, [])

  // Sample data - in a real app, this would come from an API or database
  const efficiencyData = {
    target: 2601,
    current: 2450,
    percentage: 94.2,
  }

  const driversData = [
    { id: 1, name: "Carlos Silva", weighings: 342, efficiency: 98.2, avatar: "CS" },
    { id: 2, name: "João Oliveira", weighings: 315, efficiency: 95.7, avatar: "JO" },
    { id: 3, name: "Marcos Santos", weighings: 301, efficiency: 94.3, avatar: "MS" },
    { id: 4, name: "Pedro Lima", weighings: 287, efficiency: 92.1, avatar: "PL" },
    { id: 5, name: "Antonio Souza", weighings: 265, efficiency: 89.8, avatar: "AS" },
    { id: 6, name: "Ricardo Pereira", weighings: 243, efficiency: 87.5, avatar: "RP" },
    { id: 7, name: "José Ferreira", weighings: 221, efficiency: 85.2, avatar: "JF" },
    { id: 8, name: "Paulo Costa", weighings: 198, efficiency: 82.9, avatar: "PC" },
  ]

  const lowestDriversData = [
    { id: 9, name: "Miguel Alves", weighings: 156, efficiency: 76.4, avatar: "MA" },
    { id: 10, name: "Fernando Dias", weighings: 142, efficiency: 72.1, avatar: "FD" },
    { id: 11, name: "Eduardo Gomes", weighings: 128, efficiency: 68.7, avatar: "EG" },
  ]

  const cooperativesData = [
    { rank: 1, name: "Cooperativa Recicla Vida", weighings: 1250, percentage: 28.1 },
    { rank: 2, name: "Cooperativa EcoSol", weighings: 980, percentage: 22.0 },
    { rank: 3, name: "Cooperativa Reciclagem Verde", weighings: 850, percentage: 19.1 },
    { rank: 4, name: "Cooperativa Futuro Limpo", weighings: 720, percentage: 16.2 },
    { rank: 5, name: "Cooperativa Recicla Cidadão", weighings: 650, percentage: 14.6 },
    { rank: 6, name: "Cooperativa Mãos que Reciclam", weighings: 520, percentage: 11.7 },
    { rank: 7, name: "Cooperativa Reciclando o Futuro", weighings: 480, percentage: 10.8 },
    { rank: 8, name: "Cooperativa Amigos do Meio Ambiente", weighings: 420, percentage: 9.4 },
    { rank: 9, name: "Cooperativa Recicla Já", weighings: 380, percentage: 8.5 },
    { rank: 10, name: "Cooperativa Planeta Verde", weighings: 350, percentage: 7.9 },
  ]

  const monthlyData = [
    { month: "Jan", seletiva: 850, cataTreco: 350 },
    { month: "Fev", seletiva: 920, cataTreco: 380 },
    { month: "Mar", seletiva: 880, cataTreco: 400 },
    { month: "Abr", seletiva: 950, cataTreco: 420 },
    { month: "Mai", seletiva: 1020, cataTreco: 450 },
    { month: "Jun", seletiva: 980, cataTreco: 430 },
  ]

  const vehiclePerformanceData = [
    { vehicle: "Compactador", efficiency: 92, maintenance: 85, fuel: 78, availability: 95, weighings: 245 },
    { vehicle: "Basculante", efficiency: 88, maintenance: 80, fuel: 82, availability: 90, weighings: 210 },
    { vehicle: "Carroceria", efficiency: 85, maintenance: 75, fuel: 90, availability: 88, weighings: 180 },
    { vehicle: "Utilitário", efficiency: 80, maintenance: 90, fuel: 95, availability: 85, weighings: 120 },
  ]

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handlePeriodMenuOpen = (event) => {
    setPeriodMenuAnchor(event.currentTarget)
  }

  const handlePeriodMenuClose = () => {
    setPeriodMenuAnchor(null)
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
    setPeriodMenuAnchor(null)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="tooltip-item">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="tooltip-color" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name}:</span>
              </div>
              <strong>{entry.value}</strong>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const getStatusChip = (efficiency) => {
    if (efficiency > 90) {
      return <Chip label="Excelente" className="status-chip success" />
    } else if (efficiency > 80) {
      return <Chip label="Bom" className="status-chip warning" />
    } else {
      return <Chip label="Precisa Melhorar" className="status-chip destructive" />
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Filter functions
  const filteredVehicleData = vehicleData.filter((vehicle) =>
    vehicle.type.toLowerCase().includes(vehicleFilter.toLowerCase()),
  )

  const filteredCooperativesData = cooperativesData.filter((coop) =>
    coop.name.toLowerCase().includes(cooperativeFilter.toLowerCase()),
  )

  const filteredDriversData = driversData.filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  const filteredLowestDriversData = lowestDriversData.filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  const filteredAllDriversData = [...driversData, ...lowestDriversData].filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  // Get total counts for table headers
  const totalDrivers = filteredAllDriversData.length
  const totalVehicles = filteredVehicleData.length
  const totalCooperatives = filteredCooperativesData.length

  // Get current data based on selected tab
  const currentDriversData =
    tabValue === 0
      ? filteredDriversData.slice(0, 5)
      : tabValue === 1
        ? filteredLowestDriversData
        : filteredAllDriversData

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <AppBar position="sticky" className="app-bar">
          <Toolbar>
            <Typography variant="h6" className="dashboard-title">
              <EcoIcon className="dashboard-title-icon" />
              Dashboard de Pesagens
            </Typography>
          </Toolbar>
        </AppBar>

        <main className="dashboard-main">
          <div className="dashboard-grid">
            {/* Efficiency Section */}
            <section className="efficiency-section">
              <div className="metrics-grid">
                <Fade in={!loading} timeout={500}>
                  <Card className="metric-card efficiency-card">
                    <CardContent>
                      <Typography variant="subtitle2" className="card-title">
                        <div className="card-icon">
                          <Speed />
                        </div>
                        Meta de Eficiência
                      </Typography>
                      <Typography variant="caption" className="card-description">
                        Toneladas alvo vs. atual
                      </Typography>
                      <div className="metric-content">
                        <div>
                          <Typography variant="h4" className="metric-value">
                            {efficiencyData.current} ton
                          </Typography>
                          <Typography variant="caption" className="metric-target">
                            Meta: {efficiencyData.target} ton
                          </Typography>
                        </div>
                        <Chip
                          icon={<TrendingUp fontSize="small" />}
                          label={`${efficiencyData.percentage}%`}
                          className="percentage-chip"
                        />
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={efficiencyData.percentage}
                        className="progress-bar"
                      />
                    </CardContent>
                  </Card>
                </Fade>

                <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                  <Card className="metric-card total-card">
                    <CardContent>
                      <Typography variant="subtitle2" className="card-title">
                        <div className="card-icon">
                          <RecyclingOutlined />
                        </div>
                        Total de Pesagens
                      </Typography>
                      <Typography variant="caption" className="card-description">
                        Seletiva e Cata Treco
                      </Typography>
                      <Typography variant="h4" className="metric-value">
                        8,742
                      </Typography>
                      <div className="trend-indicator positive">
                        <ArrowUpward fontSize="small" />
                        <Typography variant="caption">12.5% desde o último {period}</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Fade>

                <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                  <Card className="metric-card average-card">
                    <CardContent>
                      <Typography variant="subtitle2" className="card-title">
                        <div className="card-icon">
                          <DirectionsCar />
                        </div>
                        Média por Veículo
                      </Typography>
                      <Typography variant="caption" className="card-description">
                        Pesagens por veículo
                      </Typography>
                      <Typography variant="h4" className="metric-value">
                        215
                      </Typography>
                      <div className="trend-indicator positive">
                        <ArrowUpward fontSize="small" />
                        <Typography variant="caption">8.3% desde o último {period}</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Fade>

                <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                  <Card className="metric-card drivers-card">
                    <CardContent>
                      <Typography variant="subtitle2" className="card-title">
                        <div className="card-icon">
                          <Groups />
                        </div>
                        Motoristas Ativos
                      </Typography>
                      <Typography variant="caption" className="card-description">
                        Total de motoristas
                      </Typography>
                      <Typography variant="h4" className="metric-value">
                        32
                      </Typography>
                      <div className="trend-indicator negative">
                        <ArrowDownward fontSize="small" />
                        <Typography variant="caption">2 desde o último {period}</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Fade>
              </div>
            </section>

            {/* Charts Section */}
            <section className="charts-section">
              <div className="charts-grid">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                  <Card className="chart-card">
                    <CardHeader
                      title={
                        <span>
                          <BarChartIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                          Comparativo de Pesagens
                        </span>
                      }
                      subheader="Seletiva vs. Cata Treco"
                      action={
                        <Box>
                          <IconButton size="small" className="action-icon-button">
                            <Refresh />
                          </IconButton>
                          <IconButton size="small" className="action-icon-button">
                            <Download />
                          </IconButton>
                        </Box>
                      }
                      className="chart-header"
                    />
                    <CardContent>
                      <div className="chart-container">
                        {!chartsLoaded.barChart && (
                          <div className="chart-loading">
                            <div className="chart-loading-indicator"></div>
                          </div>
                        )}
                        <Fade in={chartsLoaded.barChart} timeout={500}>
                          <div style={{ width: "100%", height: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 24 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                  dataKey="month"
                                  tickLine={false}
                                  axisLine={false}
                                  tick={{ fill: "#64748b", fontSize: 12 }}
                                />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                  dataKey="seletiva"
                                  fill="#10b981"
                                  radius={[4, 4, 0, 0]}
                                  name="Seletiva"
                                  animationDuration={1500}
                                  animationEasing="ease-out"
                                />
                                <Bar
                                  dataKey="cataTreco"
                                  fill="#f59e0b"
                                  radius={[4, 4, 0, 0]}
                                  name="Cata Treco"
                                  animationDuration={1500}
                                  animationEasing="ease-out"
                                  animationBegin={300}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </Fade>
                      </div>
                    </CardContent>
                  </Card>
                </Zoom>

                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                  <Card className="chart-card">
                    <CardHeader
                      title={
                        <span>
                          <DonutLarge style={{ verticalAlign: "middle", marginRight: "8px" }} />
                          Cooperativas com Mais Pesagens
                        </span>
                      }
                      subheader="Top 5 cooperativas por volume"
                      action={
                        <Box>
                          <IconButton size="small" className="action-icon-button">
                            <Print />
                          </IconButton>
                          <IconButton size="small" className="action-icon-button">
                            <Share />
                          </IconButton>
                        </Box>
                      }
                      className="chart-header"
                    />
                    <CardContent>
                      <div className="chart-container">
                        {!chartsLoaded.pieChart && (
                          <div className="chart-loading">
                            <div className="chart-loading-indicator"></div>
                          </div>
                        )}
                        <Fade in={chartsLoaded.pieChart} timeout={500}>
                          <div style={{ width: "100%", height: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={cooperativesData.slice(0, 5)}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="weighings"
                                  nameKey="name"
                                  label={({ name, percent }) => `${name.split(" ")[1]}: ${(percent * 100).toFixed(0)}%`}
                                  animationDuration={1500}
                                >
                                  {cooperativesData.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value, name, props) => [`${value} pesagens`, props.payload.name]}
                                />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </Fade>
                      </div>
                    </CardContent>
                  </Card>
                </Zoom>
              </div>
            </section>

            {/* Drivers Section */}
            <section className="drivers-section">
              <Grow in={!loading} timeout={800} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                <Card className="drivers-card">
                  <CardHeader
                    title={
                      <span>
                        <EmojiEvents style={{ verticalAlign: "middle", marginRight: "8px" }} />
                        Motoristas e Pesagens
                        <span className="table-count-badge">{totalDrivers}</span>
                      </span>
                    }
                    action={
                      <div className="card-actions">
                        <Button variant="outlined" size="small" startIcon={<FilterList />} className="action-button">
                          Filtrar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DateRange />}
                          endIcon={<ExpandMore />}
                          className="action-button"
                          onClick={handlePeriodMenuOpen}
                        >
                          {period === "week" ? "Semana" : period === "month" ? "Mês" : "Ano"}
                        </Button>
                        <Menu
                          anchorEl={periodMenuAnchor}
                          open={Boolean(periodMenuAnchor)}
                          onClose={handlePeriodMenuClose}
                        >
                          <MenuItem
                            onClick={() => handlePeriodChange("week")}
                            className={`period-menu-item ${period === "week" ? "active" : ""}`}
                          >
                            Semana
                          </MenuItem>
                          <MenuItem
                            onClick={() => handlePeriodChange("month")}
                            className={`period-menu-item ${period === "month" ? "active" : ""}`}
                          >
                            Mês
                          </MenuItem>
                          <MenuItem
                            onClick={() => handlePeriodChange("year")}
                            className={`period-menu-item ${period === "year" ? "active" : ""}`}
                          >
                            Ano
                          </MenuItem>
                        </Menu>
                      </div>
                    }
                    className="drivers-header"
                  />
                  <CardContent>
                    <TextField
                      size="small"
                      placeholder="Buscar motoristas..."
                      fullWidth
                      value={driverFilter}
                      onChange={(e) => setDriverFilter(e.target.value)}
                      className="driver-search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                        ),
                        className: "search-input",
                      }}
                    />

                    <Tabs value={tabValue} onChange={handleTabChange} className="drivers-tabs" variant="fullWidth">
                      <Tab label="Top Motoristas" />
                      <Tab label="Menor Desempenho" />
                      <Tab label="Todos" />
                    </Tabs>

                    <div className="tab-content">
                      <Fade in={true} timeout={500}>
                        <TableContainer component={Paper} className="drivers-table">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Motorista</TableCell>
                                <TableCell align="right">Pesagens</TableCell>
                                <TableCell align="right">Eficiência</TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {currentDriversData.map((driver) => (
                                <TableRow key={driver.id}>
                                  <TableCell className="driver-name">{driver.name}</TableCell>
                                  <TableCell align="right">{driver.weighings}</TableCell>
                                  <TableCell align="right">{driver.efficiency}%</TableCell>
                                  <TableCell align="right">{getStatusChip(driver.efficiency)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Fade>
                    </div>
                  </CardContent>
                </Card>
              </Grow>
            </section>

            {/* Vehicle and Cooperatives Section */}
            <section className="vehicle-section">
              <div className="tables-container">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                  <Card className="vehicle-card table-card">
                    <CardHeader
                      title={
                        <span>
                          <Truck style={{ verticalAlign: "middle", marginRight: "8px" }} />
                          Veículos e Média de Pesagens
                          <span className="table-count-badge">{totalVehicles}</span>
                        </span>
                      }
                      subheader="Por tipo de veículo"
                      action={
                        <Box>
                          <IconButton size="small" className="action-icon-button">
                            <Print />
                          </IconButton>
                          <IconButton size="small" className="action-icon-button">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      }
                      className="vehicle-header"
                    />
                    <CardContent>
                      <TextField
                        size="small"
                        placeholder="Filtrar veículos..."
                        fullWidth
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                        className="search-filter"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search fontSize="small" />
                            </InputAdornment>
                          ),
                          className: "search-input",
                        }}
                      />
                      <TableContainer
                        component={Paper}
                        className="drivers-table"
                        style={{ maxHeight: "500px", overflowY: "auto" }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tipo de Veículo</TableCell>
                              <TableCell align="right">Quantidade</TableCell>
                              <TableCell align="right">Média de Pesagens</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredVehicleData.map((vehicle) => (
                              <TableRow key={vehicle.type}>
                                <TableCell className="vehicle-type">
                                  <div className="vehicle-icon">{vehicle.icon}</div>
                                  {vehicle.type}
                                </TableCell>
                                <TableCell align="right">{vehicle.count}</TableCell>
                                <TableCell align="right">{vehicle.avgWeighings}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Zoom>

                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                  <Card className="cooperatives-ranking-card table-card">
                    <CardHeader
                      title={
                        <span>
                          <Leaderboard style={{ verticalAlign: "middle", marginRight: "8px" }} />
                          Ranking de Cooperativas
                          <span className="table-count-badge">{totalCooperatives}</span>
                        </span>
                      }
                      subheader="Top cooperativas por volume de pesagens"
                      action={
                        <Box>
                          <IconButton size="small" className="action-icon-button">
                            <Download />
                          </IconButton>
                          <IconButton size="small" className="action-icon-button">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      }
                      className="cooperatives-ranking-header"
                    />
                    <CardContent>
                      <TextField
                        size="small"
                        placeholder="Filtrar cooperativas..."
                        fullWidth
                        value={cooperativeFilter}
                        onChange={(e) => setCooperativeFilter(e.target.value)}
                        className="search-filter"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search fontSize="small" />
                            </InputAdornment>
                          ),
                          className: "search-input",
                        }}
                      />
                      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <table className="cooperatives-table">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Cooperativa</th>
                              <th>Pesagens</th>
                              <th>%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCooperativesData.map((coop) => (
                              <tr key={coop.rank}>
                                <td>
                                  <div
                                    className={`cooperatives-rank ${
                                      coop.rank === 2
                                        ? "second"
                                        : coop.rank === 3
                                          ? "third"
                                          : coop.rank === 4
                                            ? "fourth"
                                            : coop.rank === 5
                                              ? "fifth"
                                              : ""
                                    }`}
                                  >
                                    {coop.rank}
                                  </div>
                                </td>
                                <td>{coop.name}</td>
                                <td>{coop.weighings}</td>
                                <td>{coop.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </Zoom>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

// Render the component
if (typeof document !== "undefined") {
  import("react-dom/client").then(({ createRoot }) => {
    const container = document.getElementById("root")
    if (container) {
      const root = createRoot(container)
      root.render(
        <React.StrictMode>
          <WeighingDashboard />
        </React.StrictMode>,
      )
    }
  })
}

