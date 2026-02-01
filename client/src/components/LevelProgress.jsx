import { Progress } from "../components/ui/progress";

const LevelProgress = ({ level, xp, className }) => {
  const currentLevel = level || 1;
  const currentXP = xp || 0;
  const maxXP = currentLevel * 100;
  const progress = Math.min(100, Math.max(0, (currentXP / maxXP) * 100));

  return (
    <div className={`p-4 bg-card rounded-xl border shadow-sm ${className}`}>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Current Level
          </span>
          <div className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Level {currentLevel}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-muted-foreground">
            {currentXP} / {maxXP} XP
          </span>
        </div>
      </div>
      <Progress value={progress} className="h-3" />
      <div className="mt-2 text-[10px] text-muted-foreground text-center">
        {Math.round(maxXP - currentXP)} XP to next level!
      </div>
    </div>
  );
};

export default LevelProgress;
