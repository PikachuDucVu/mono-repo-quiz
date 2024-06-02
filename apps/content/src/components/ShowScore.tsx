const ShowScore = ({ score }: { score: number }) => {
  return (
    <div className="flex flex-col w-full justify-center items-center h-full">
      <div className="font-bold text-3xl">Your Score: {score ? score : 0}</div>
    </div>
  );
};

export default ShowScore;
