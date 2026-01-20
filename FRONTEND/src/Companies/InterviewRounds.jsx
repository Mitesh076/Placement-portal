function InterviewRounds() {
  return (
    <div className="bg-white p-6 rounded-xl w-full shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Interview Rounds</h3>

      <ul className="space-y-3">
        {rounds.map((round, index) => (
          <li key={index} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
              {index + 1}
            </span>
            <span className="font-medium">{round}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const rounds = [
  "Online Test",
  "Technical Interview",
  "HR Interview",
  "Offer Letter",
];
export default InterviewRounds;
