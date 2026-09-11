import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PendingValue } from "@/components/ui/pending-value";
import { compliance, uiLabels } from "@/config";

export function ComplianceTable() {
  return (
    <RevealGroup as="ul" interval={0.05} className="divide-y divide-border border-y border-border">
      {compliance.items.map((item) => (
        <RevealItem
          as="li"
          key={item.code}
          className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-6 gap-y-2 py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center"
        >
          <span className="font-display text-lg font-semibold tracking-tight">{item.code}</span>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-fg-mute">{item.issuer}</p>
          </div>
          <div className="col-start-2 text-sm sm:col-start-auto sm:text-right">
            <PendingValue value={item.value} fallback={uiLabels.pending} className="font-mono" />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
