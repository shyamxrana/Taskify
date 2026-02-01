import { useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart2,
  CheckCircle,
  Clock,
  Trash2,
  PieChart as PieIcon,
  Timer,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const Stats = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    created: 0,
    completed: 0,
    pending: 0,
    deleted: user?.deletedTasksCount || 0,
    focusMinutes: user?.focusMinutes || 0,
  });

  const [graphData, setGraphData] = useState({
    activity: [],
    category: [],
    priority: [],
  });

  // Professional Palette
  const COLORS = {
    purple: "#8b5cf6", // Violet 500
    pink: "#ec4899", // Pink 500
    blue: "#3b82f6", // Blue 500
    green: "#10b981", // Emerald 500
    amber: "#f59e0b", // Amber 500
    red: "#ef4444", // Red 500
    slate: "#64748b", // Slate 500
  };

  const CATEGORY_COLORS = [
    COLORS.purple,
    COLORS.pink,
    COLORS.blue,
    COLORS.green,
    COLORS.amber,
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].name}:{" "}
            <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const todos = await res.json();

        // Basic Stats
        const created = todos.length;
        const completed = todos.filter((t) => t.completed).length;
        const pending = created - completed;

        setStats({
          created,
          completed,
          pending,
          deleted: user?.deletedTasksCount || 0,
          focusMinutes: user?.focusMinutes || 0,
        });

        // --- Data Processing for Graphs ---

        // 1. Activity (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
          const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

          const count = todos.filter((t) => {
            if (!t.completedAt) return false;
            return t.completedAt.startsWith(dateStr);
          }).length;

          last7Days.push({ name: dayName, tasks: count });
        }

        // 2. Category Distribution
        const categories = {};
        todos.forEach((t) => {
          const cat = t.category || "General";
          categories[cat] = (categories[cat] || 0) + 1;
        });
        const categoryData = Object.keys(categories).map((key) => ({
          name: key,
          value: categories[key],
        }));

        // 3. Priority Breakdown
        const priorities = { High: 0, Medium: 0, Low: 0 };
        todos.forEach((t) => {
          if (priorities[t.priority] !== undefined) {
            priorities[t.priority]++;
          }
        });
        const priorityData = Object.keys(priorities).map((key) => ({
          name: key,
          value: priorities[key],
        }));

        setGraphData({
          activity: last7Days,
          category: categoryData,
          priority: priorityData,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">
        Analytics Dashboard
      </h1>

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {[
          {
            title: "Total Tasks",
            icon: Layers,
            value: stats.created,
            color: "text-foreground",
            sub: "Lifetime created",
          },
          {
            title: "Completed",
            icon: CheckCircle,
            value: stats.completed,
            color: "text-green-500",
            sub: "Tasks finished",
          },
          {
            title: "Pending",
            icon: Clock,
            value: stats.pending,
            color: "text-amber-500",
            sub: "In progress",
          },
          {
            title: "Focus Time",
            icon: Timer,
            value: `${stats.focusMinutes}m`,
            color: "text-blue-500",
            sub: "Total focused",
          },
          {
            title: "Deleted",
            icon: Trash2,
            value: stats.deleted,
            color: "text-red-500",
            sub: "Tasks removed",
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="shadow-sm border-border/50 hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
        {/* Productivity Pulse (Area Chart) */}
        <Card className="col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-500" />
              Productivity Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={graphData.activity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.purple}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.purple}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#374151"
                    opacity={0.15}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: COLORS.purple,
                      strokeWidth: 1,
                      strokeDasharray: "5 5",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke={COLORS.purple}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown (Donut Chart) */}
        <Card className="col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-pink-500" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graphData.category}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {graphData.category.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-sm font-medium text-muted-foreground ml-1">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Priority Breakdown (Bar Chart) */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-amber-500" />
              Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData.priority} barSize={60}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#374151"
                    opacity={0.15}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {graphData.priority.map((entry, index) => {
                      let color = COLORS.amber; // Medium
                      if (entry.name === "High") color = COLORS.red;
                      if (entry.name === "Low") color = COLORS.green;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
