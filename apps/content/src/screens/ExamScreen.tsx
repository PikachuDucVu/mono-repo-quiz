import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ExamScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-100 to-blue-100 relative">
      <Card className="w-full max-w-5xl p-8 relative -top-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <HourglassIcon className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Time remaining:</p>
              <p className="text-xl font-bold">9:59</p>
            </div>
          </div>
          <Button className="bg-green-500 text-white">Submit</Button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Question 1:</h2>
          <p className="text-lg font-semibold">123</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 border rounded-md">
            <span className="font-bold">A.</span>
            <span>123</span>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-md">
            <span className="font-bold">B.</span>
            <span>321</span>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Progress value={50} aria-label="50% complete" className="w-full" />
        </div>
        <div className="flex justify-center mt-4">
          <Button className="bg-blue-500 text-white rounded-full w-8 h-8">
            1
          </Button>
        </div>
      </Card>
    </div>
  );
}

function HourglassIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}
