import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { TextReveal } from "../components/ui/TextReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  BarChart3,
  Zap,
  Palette,
  Users,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Smartphone,
  Moon,
  Sun,
  Layout
} from "lucide-react";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("homepage-theme") || "light";
  });
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("homepage-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  if (user) {
    navigate("/");
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
       {/* Background Noise Texture (Inline SVG) */}
       <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
       <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
       <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4 bg-transparent pointer-events-none"
      >
        <div className="w-full max-w-5xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-lg rounded-full px-4 py-2 flex justify-between items-center pointer-events-auto ring-1 ring-black/5">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-tight">
              Task Master
            </h1>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          </div>

          <div className="flex gap-2 items-center pr-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-all hover:scale-110 active:scale-95 duration-200"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/5 hover:text-primary transition-all rounded-full px-4">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <div className="text-center space-y-8 mb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 shadow-sm backdrop-blur-sm flex items-center gap-2 mx-auto w-fit">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Productivity Reimagined
            </div>
          </motion.div>

          <h2 className="text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Organize Your Life,{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent block mt-2 pb-2">
               <TextReveal text="Master Your Goals" className="justify-center" />
            </span>
          </h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            An all-in-one task management platform designed to boost your productivity. 
            Track, schedule, and achieve your goals with powerful tools.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl shadow-primary/30 transition-all hover:scale-105 rounded-2xl font-semibold">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-2 hover:bg-secondary/50 backdrop-blur-sm font-semibold">
              Watch Demo
            </Button>
          </motion.div>

          {/* Hero Stats */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-border/50 mt-12"
          >
            <StatsItem value="10K+" label="Active Users" delay={0} />
            <StatsItem value="500K+" label="Tasks Completed" delay={0.1} />
            <StatsItem value="4.9★" label="User Rating" delay={0.2} />
          </motion.div>
        </div>

        {/* Hero Image Mockup */}
        <motion.div 
           initial={{ opacity: 0, y: 40, rotateX: 20 }}
           whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
           transition={{ duration: 0.8, type: "spring" }}
           viewport={{ once: true }}
           className="relative max-w-5xl mx-auto perspective-1000"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-3xl opacity-20 transform scale-95 translate-y-4"></div>
          <div className="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-2 shadow-2xl ring-1 ring-white/10 overflow-hidden">
             {/* Simple Browser Bar Mockup */}
             <div className="h-10 border-b border-border/50 flex items-center gap-2 px-4 bg-muted/30">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 h-6 bg-background/50 rounded-md w-full max-w-md border border-border/30 flex items-center px-3">
                   <div className="w-3 h-3 rounded-full bg-foreground/10 mr-2" />
                   <div className="h-1.5 w-24 bg-foreground/10 rounded-full" />
                </div>
             </div>
             {/* Content Placeholder */}
            <div className="min-h-[400px] flex items-center justify-center bg-card/30 relative overflow-hidden group">
               <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
               <div className="text-center z-10 p-8 transform transition-transform duration-500 group-hover:scale-105">
                 <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
                   <Layout className="h-12 w-12 text-white" />
                 </div>
                 <h3 className="text-3xl font-bold mb-3 tracking-tight">Clean, Powerful Dashboard</h3>
                 <p className="text-muted-foreground text-lg">Manage everything in one view</p>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
        <div className="text-center mb-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Powerful Features</h3>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Everything you need to stay organized, focused, and productive.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<CheckCircle2 className="h-7 w-7" />}
            title="Smart Task Management"
            description="Create, organize, and prioritize your tasks with ease. Drag and drop to reorder."
          />
          <FeatureCard
            icon={<Calendar className="h-7 w-7" />}
            title="Calendar Integration"
            description="Visualize your tasks on a beautiful calendar. Plan your days and weeks at a glance."
          />
          <FeatureCard
            icon={<Clock className="h-7 w-7" />}
            title="Focus Timer"
            description="Boost productivity with built-in Pomodoro timer. Track your focus sessions."
          />
          <FeatureCard
            icon={<BarChart3 className="h-7 w-7" />}
            title="Advanced Analytics"
            description="Gain insights into your productivity with detailed statistics and visual charts."
          />
          <FeatureCard
            icon={<Palette className="h-7 w-7" />}
            title="Customization"
            description="Dark mode, custom categories, and personalized workspace layout to fit your style."
          />
          <FeatureCard
            icon={<Zap className="h-7 w-7" />}
            title="Gamified Experience"
            description="Earn XP, level up, and maintain streaks to stay motivated and consistent."
          />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground text-xl">Simple steps to boost your productivity</p>
          </motion.div>
        </div>

        <motion.div 
          className="grid md:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <StepCard step={1} title="Sign Up" description="Create your free account in seconds" />
          <StepCard step={2} title="Add Tasks" description="Start adding your goals and tasks" />
          <StepCard step={3} title="Track Progress" description="Monitor your achievements in real-time" />
          <StepCard step={4} title="Achieve More" description="Build habits and reach your goals" />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="space-y-8"
          >
            <h3 className="text-4xl font-bold leading-tight">
              Why Choose <span className="text-primary">Task Master</span>?
            </h3>
            <p className="text-muted-foreground text-lg">
              Join thousands of users who have transformed their daily productivity routines.
            </p>

            <div className="space-y-6">
              <BenefitItem icon={<Target className="h-6 w-6" />} text="Goal-oriented approach to task management" />
              <BenefitItem icon={<Trophy className="h-6 w-6" />} text="Gamified achievement system to stay motivated" />
              <BenefitItem icon={<Users className="h-6 w-6" />} text="Community features and shared goals" />
              <BenefitItem icon={<Smartphone className="h-6 w-6" />} text="Responsive design - works everywhere" />
            </div>

            <Link to="/register">
              <Button size="lg" className="mt-4 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 rounded-xl h-12 px-8">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="text-sm font-bold text-primary tracking-wider uppercase">Testimonial</div>
                <p className="text-xl font-medium leading-relaxed italic text-foreground/90">
                  "Task Master completely changed how I manage my daily work. The focus timer and analytics are game-changers! I've doubled my output."
                </p>
                <div className="flex items-center gap-3 pt-2">
                   <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">SM</div>
                   <div>
                      <div className="font-semibold text-foreground">Sarah M.</div>
                      <div className="text-xs text-muted-foreground">Productivity Enthusiast</div>
                   </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-8 space-y-4">
                <div className="text-sm font-bold text-primary tracking-wider uppercase">Results</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
                     <span className="block font-bold text-xl text-primary">+45%</span>
                     <span className="text-[10px] text-muted-foreground uppercase font-bold">Productivity</span>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
                     <span className="block font-bold text-xl text-primary">89%</span>
                     <span className="text-[10px] text-muted-foreground uppercase font-bold">Goal Rate</span>
                  </div>
                   <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
                     <span className="block font-bold text-xl text-primary">2h</span>
                     <span className="text-[10px] text-muted-foreground uppercase font-bold">Saved/Day</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
           whileHover={{ scale: 1.02 }}
           transition={{ type: "spring", stiffness: 400, damping: 30 }}
           className="relative bg-gradient-to-br from-primary/90 to-purple-800 border border-white/10 rounded-[2.5rem] p-12 text-center overflow-hidden shadow-2xl"
        >
          {/* Noise overlay for texture */}
          <div className="absolute inset-0 z-0 opacity-[0.1] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to Master Your Tasks?</h3>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              Join our community of productive individuals. Start your free account today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-xl rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <p className="text-white/60 text-sm">No credit card required • Free plan available</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-xl">Task Master</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering individuals to achieve more through intuitive task management and gamified productivity.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-6">Product</h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-6">Resources</h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-6">Legal</h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <p>&copy; 2024 Task Master. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Animation Variants
const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Feature Card Component with Glassmorphism
const FeatureCard = ({ icon, title, description }) => (
  <motion.div variants={featureCardVariants}>
    <Card className="h-full bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 duration-300 group">
      <CardHeader>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-primary mb-2 shadow-sm border border-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed text-muted-foreground/80">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

// Benefit Item Component
const BenefitItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
      {icon}
    </div>
    <span className="text-lg font-medium text-foreground/80 group-hover:text-primary transition-colors duration-300">{text}</span>
  </div>
);

// Stats Item Component
const StatsItem = ({ value, label, delay }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1, transition: { delay: delay, type: "spring" } }
    }}
    className="text-center"
  >
    <div className="text-4xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">{value}</div>
    <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
  </motion.div>
);

// Step Card Component
const StepCard = ({ step, title, description }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="relative text-center group"
  >
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
      {step}
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
    {step < 4 && (
      <div className="absolute -right-4 top-8 hidden lg:block text-2xl text-muted-foreground/30">
        <ArrowRight className="w-6 h-6" />
      </div>
    )}
  </motion.div>
);

export default HomePage;
