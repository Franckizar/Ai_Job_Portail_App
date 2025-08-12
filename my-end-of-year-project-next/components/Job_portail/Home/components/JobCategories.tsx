import { Code, Palette, BarChart, Megaphone, Heart, Cog, Building, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function JobCategories() {
  const categories = [
    {
      icon: Code,
      title: "Technology",
      jobs: "2,847",
      color: "bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)]"
    },
    {
      icon: Palette,
      title: "Design",
      jobs: "1,234",
      color: "bg-[var(--color-lamaPurpleLight)] text-[var(--color-lamaPurpleDark)]"
    },
    {
      icon: BarChart,
      title: "Finance",
      jobs: "1,891",
      color: "bg-[var(--color-lamaGreenLight)] text-[var(--color-lamaGreenDark)]"
    },
    {
      icon: Megaphone,
      title: "Marketing",
      jobs: "1,567",
      color: "bg-[var(--color-lamaOrangeLight)] text-[var(--color-lamaOrangeDark)]"
    },
    {
      icon: Heart,
      title: "Healthcare",
      jobs: "2,123",
      color: "bg-[var(--color-lamaRedLight)] text-[var(--color-lamaRedDark)]"
    },
    {
      icon: Cog,
      title: "Engineering",
      jobs: "1,789",
      color: "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
    },
    {
      icon: Building,
      title: "Real Estate",
      jobs: "892",
      color: "bg-[var(--color-lamaSkyLight)] text-[var(--color-lamaSkyDark)]"
    },
    {
      icon: Users,
      title: "Human Resources",
      jobs: "1,445",
      color: "bg-[var(--color-lamaPurpleLight)] text-[var(--color-lamaPurpleDark)]"
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-bg-primary)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Browse by Category
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Find jobs in your favorite industry
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-[var(--color-border-light)]"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{category.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{category.jobs} jobs</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}