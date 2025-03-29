import { Contribution } from "../types";

export default function ContributionsList({ contributions }: { contributions: Contribution[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contributions ({contributions.length})</h3>
      
      {contributions.length === 0 ? (
        <p className="text-gray-500">No contributions yet</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contributions.map((contribution) => (
            <li key={Number(contribution.timestamp)} className="py-4">
              <div className="flex justify-between">
                <span className="font-medium">
                  {contribution.contributor.toString()}
                </span>
                <span>
                  {Number(contribution.amount) / 1e8} ICP
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(Number(contribution.timestamp) / 1000000).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}