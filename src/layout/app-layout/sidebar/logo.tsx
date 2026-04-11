type Props = {
    title: string;
    subtitle: string;
    logo: string;
};

export function Logo(props: Props) {
    return (
        <div className="flex items-center w-full border-b justify-start px-4 gap-4 border-border py-6">
            <img src={props.logo} alt="Logo" className="w-8 h-8 rounded-xl" />
            <div>
                <h1 className="text-base">{props.title}</h1>
                <p className="text-sm text-text-muted">{props.subtitle}</p>
            </div>
        </div>
    );
}
