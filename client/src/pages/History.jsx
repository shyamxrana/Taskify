import { useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

const History = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        // Filter only completed tasks and sort by completedAt (newest first)
        const completedTasks = data
          .filter((todo) => todo.completed)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        setHistory(completedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Task History
        </h1>
        <p className="text-muted-foreground">
          Review your accomplished tasks and productivity timeline.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Tasks Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="spinner"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No completed tasks found. Go get some work done! 💪
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your completed tasks.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Task</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{task.title}</span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.proofType === "text" ? (
                        <span className="text-sm italic text-muted-foreground">
                          "{task.proof}"
                        </span>
                      ) : task.proofType === "image" ||
                        task.proofType === "video" ? (
                        <a
                          href={`${API_BASE_URL}/${task.proof.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline underline-offset-4 text-sm font-medium"
                        >
                          View {task.proofType === "image" ? "Image" : "Video"}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Done</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(task.createdAt)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatDate(task.completedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
