import { Code, Palette, BarChart, Megaphone, Heart, Cog, Building, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function JobCategories() {
  const categories = [
    {
      icon: Code,
      title: "Technology",
      jobs: "2,847",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Palette,
      title: "Design",
      jobs: "1,234",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: BarChart,
      title: "Finance",
      jobs: "1,891",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Megaphone,
      title: "Marketing",
      jobs: "1,567",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: Heart,
      title: "Healthcare",
      jobs: "2,123",
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: Cog,
      title: "Engineering",
      jobs: "1,789",
      color: "bg-gray-500/10 text-gray-600"
    },
    {
      icon: Building,
      title: "Real Estate",
      jobs: "892",
      color: "bg-teal-500/10 text-teal-600"
    },
    {
      icon: Users,
      title: "Human Resources",
      jobs: "1,445",
      color: "bg-pink-500/10 text-pink-600"
    }
  ];

  return (
    <section className="
    py-16 bg-zinc-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find jobs in your favorite industry
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-medium mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.jobs} jobs</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}