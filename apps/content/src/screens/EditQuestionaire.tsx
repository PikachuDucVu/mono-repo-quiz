import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
export function EditQuestionaire() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-3 shadow-sm sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="text-lg font-semibold">
            Edit Quiz
          </Link>
          <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Question 3 of 10
          </div>
        </div>
        <Progress value={30} className="h-2 w-full max-w-md" />
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold">
              What is the capital of France?
            </h2>
            <div className="mt-4 grid gap-3">
              <RadioGroup>
                <RadioGroupItem value="paris">Paris</RadioGroupItem>
                <RadioGroupItem value="london">London</RadioGroupItem>
                <RadioGroupItem value="berlin">Berlin</RadioGroupItem>
                <RadioGroupItem value="madrid">Madrid</RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Next</Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 z-10 bg-background px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto max-w-xl">
          <Button className="w-full">Submit Quiz</Button>
        </div>
      </footer>
    </div>
  );
}
