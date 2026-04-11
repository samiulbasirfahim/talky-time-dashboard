import { StatCard, type StatCardProps } from "./stat-card";

export type StatCardContainerProps = {
    cards: StatCardProps[];
};

export function StatCardContainer(props: StatCardContainerProps) {
    return (
        <div className="grid w-full grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-4">
            {props.cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
}
